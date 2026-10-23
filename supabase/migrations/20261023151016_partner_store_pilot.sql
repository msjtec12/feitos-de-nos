-- Isolated partner pilot. Only the server's service role can access these tables/RPCs.
create table public.partner_profiles (
  id uuid primary key references auth.users(id),
  store_name text not null check (char_length(store_name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,79}$'),
  phone text not null check (phone ~ '^55[0-9]{10,11}$'),
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  balance_cents integer not null default 0,
  reserved_cents integer not null default 0,
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  check (balance_cents >= 0 and reserved_cents >= 0 and reserved_cents <= balance_cents)
);
create table public.partner_orders (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partner_profiles(id),
  product text not null check (product in ('gift','invitation')),
  customer_label text not null check (char_length(customer_label) between 2 and 100),
  price_cents integer not null check (price_cents > 0),
  status text not null default 'draft' check (status in ('draft','published','cancelled')),
  content jsonb not null default '{}'::jsonb check (octet_length(content::text) < 20000),
  revision integer not null default 0,
  edit_version integer not null default 1,
  public_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  expires_at timestamptz
);
create index partner_orders_partner_created on public.partner_orders(partner_id,created_at desc);
create table public.partner_wallet_entries (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partner_profiles(id),
  order_id uuid references public.partner_orders(id),
  kind text not null check (kind in ('credit','reserve','capture','release')),
  amount_cents integer not null check (amount_cents > 0),
  reference text not null unique,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index partner_wallet_partner_created on public.partner_wallet_entries(partner_id,created_at desc);
create index partner_wallet_order on public.partner_wallet_entries(order_id);
alter table public.partner_profiles enable row level security;
alter table public.partner_orders enable row level security;
alter table public.partner_wallet_entries enable row level security;
revoke all on public.partner_profiles, public.partner_orders, public.partner_wallet_entries from public, anon, authenticated;
grant all on public.partner_profiles, public.partner_orders, public.partner_wallet_entries to service_role;

create function public.partner_create_order(p_partner_id uuid,p_id uuid,p_product text,p_customer text)
returns public.partner_orders language plpgsql security invoker set search_path = '' as $$
declare p public.partner_profiles; o public.partner_orders; price integer;
begin
  select * into p from public.partner_profiles where id=p_partner_id for update;
  if not found or p.status <> 'active' then raise exception 'PARTNER_INACTIVE'; end if;
  select * into o from public.partner_orders where id=p_id;
  if found then
    if o.partner_id <> p_partner_id or o.product <> p_product or o.customer_label <> p_customer then raise exception 'ORDER_CONFLICT'; end if;
    return o;
  end if;
  price := case p_product when 'gift' then 990 when 'invitation' then 2990 else null end;
  if price is null then raise exception 'INVALID_PRODUCT'; end if;
  if p.balance_cents-p.reserved_cents < price then raise exception 'INSUFFICIENT_BALANCE'; end if;
  insert into public.partner_orders(id,partner_id,product,customer_label,price_cents)
    values(p_id,p_partner_id,p_product,p_customer,price) returning * into o;
  update public.partner_profiles set reserved_cents=reserved_cents+price where id=p_partner_id;
  insert into public.partner_wallet_entries(partner_id,order_id,kind,amount_cents,reference)
    values(p_partner_id,p_id,'reserve',price,'reserve:'||p_id);
  return o;
end $$;

create function public.partner_order_action(p_partner_id uuid,p_id uuid,p_action text,p_content jsonb default null,p_revision integer default null,p_edit_version integer default null)
returns public.partner_orders language plpgsql security invoker set search_path = '' as $$
declare p public.partner_profiles; o public.partner_orders; expiry timestamptz;
begin
  -- Every financial mutation locks the wallet first, then the order.
  select * into p from public.partner_profiles where id=p_partner_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  select * into o from public.partner_orders where id=p_id and partner_id=p_partner_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if p_edit_version is not null and o.edit_version <> p_edit_version then raise exception 'LINK_REVOKED'; end if;
  if p_action='cancel' then
    if o.status='cancelled' then return o; end if;
    if o.status <> 'draft' then raise exception 'ALREADY_PUBLISHED'; end if;
    update public.partner_profiles set reserved_cents=reserved_cents-o.price_cents where id=p_partner_id;
    insert into public.partner_wallet_entries(partner_id,order_id,kind,amount_cents,reference)
      values(p_partner_id,p_id,'release',o.price_cents,'release:'||p_id);
    update public.partner_orders set status='cancelled',edit_version=edit_version+1 where id=p_id returning * into o;
    return o;
  end if;
  if p.status <> 'active' then raise exception 'PARTNER_INACTIVE'; end if;
  if o.status='cancelled' or (o.expires_at is not null and o.expires_at <= now()) then raise exception 'ORDER_CLOSED'; end if;
  if p_action='rotate' then
    update public.partner_orders set edit_version=edit_version+1 where id=p_id returning * into o;
  elsif p_action='save' then
    if o.revision is distinct from p_revision then raise exception 'REVISION_CONFLICT'; end if;
    update public.partner_orders set content=p_content,revision=revision+1 where id=p_id returning * into o;
  elsif p_action='publish' then
    if o.status='published' then return o; end if;
    if o.revision is distinct from p_revision then raise exception 'REVISION_CONFLICT'; end if;
    if coalesce(length(trim(o.content->>'title')),0)<2 or coalesce(length(trim(o.content->>'message')),0)<2 then raise exception 'INCOMPLETE_CONTENT'; end if;
    if o.product='invitation' then
      expiry := (o.content->>'eventAt')::timestamptz + interval '30 days';
      if expiry is null or expiry <= now()+interval '30 days' or expiry > now()+interval '760 days' then raise exception 'INVALID_EVENT_DATE'; end if;
    else expiry := now()+interval '12 months'; end if;
    update public.partner_profiles set balance_cents=balance_cents-o.price_cents,reserved_cents=reserved_cents-o.price_cents where id=p_partner_id;
    insert into public.partner_wallet_entries(partner_id,order_id,kind,amount_cents,reference)
      values(p_partner_id,p_id,'capture',o.price_cents,'capture:'||p_id);
    update public.partner_orders set status='published',published_at=now(),expires_at=expiry where id=p_id returning * into o;
  else raise exception 'INVALID_ACTION'; end if;
  return o;
end $$;

create function public.partner_credit(p_partner_id uuid,p_amount integer,p_reference text,p_admin_id uuid)
returns public.partner_profiles language plpgsql security invoker set search_path = '' as $$
declare p public.partner_profiles; entry public.partner_wallet_entries;
begin
  if not exists(select 1 from public.admin_profiles where id=p_admin_id and active=true and role='owner') then raise exception 'FORBIDDEN'; end if;
  if p_amount < 100 or p_amount > 100000 or length(trim(p_reference)) not between 6 and 120 then raise exception 'INVALID_CREDIT'; end if;
  select * into p from public.partner_profiles where id=p_partner_id for update;
  if not found or p.status <> 'active' then raise exception 'PARTNER_INACTIVE'; end if;
  select * into entry from public.partner_wallet_entries where reference='credit:'||trim(p_reference);
  if found then
    if entry.partner_id<>p_partner_id or entry.amount_cents<>p_amount then raise exception 'REFERENCE_CONFLICT'; end if;
    return p;
  end if;
  insert into public.partner_wallet_entries(partner_id,kind,amount_cents,reference,created_by)
    values(p_partner_id,'credit',p_amount,'credit:'||trim(p_reference),p_admin_id);
  update public.partner_profiles set balance_cents=balance_cents+p_amount where id=p_partner_id returning * into p;
  return p;
end $$;
revoke all on function public.partner_create_order(uuid,uuid,text,text) from public,anon,authenticated;
revoke all on function public.partner_order_action(uuid,uuid,text,jsonb,integer,integer) from public,anon,authenticated;
revoke all on function public.partner_credit(uuid,integer,text,uuid) from public,anon,authenticated;
grant execute on function public.partner_create_order(uuid,uuid,text,text) to service_role;
grant execute on function public.partner_order_action(uuid,uuid,text,jsonb,integer,integer) to service_role;
grant execute on function public.partner_credit(uuid,integer,text,uuid) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('partner-media','partner-media',false,3145728,array['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4','audio/ogg','audio/wav'])
on conflict(id) do nothing;
