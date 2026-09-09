-- ==============================================================================
-- FEITO DE NÓS — SCHEMA DE BACKEND, ADMINISTRAÇÃO E PEDIDOS
-- Migração Versionada: 20260909150000_schema_admin_and_orders.sql
-- ==============================================================================

-- 1. TABELA: admin_profiles (Perfis de administradores autorizados)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Função auxiliar segura para checar privilégio administrativo
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND active = true
  );
$$;

-- Políticas RLS para admin_profiles
CREATE POLICY "Admin pode ler perfis administrativos"
  ON public.admin_profiles
  FOR SELECT
  USING (public.is_admin() OR auth.uid() = id);

CREATE POLICY "Apenas owners podem gerenciar perfis administrativos"
  ON public.admin_profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE id = auth.uid() AND role = 'owner' AND active = true
    )
  );

-- 2. TABELA: orders (Pedidos do site e manuais)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_zipcode TEXT,
  customer_street TEXT,
  customer_number TEXT,
  customer_complement TEXT,
  customer_neighborhood TEXT,
  recipient_name TEXT NOT NULL,
  recipient_relationship TEXT NOT NULL,
  occasion_type TEXT NOT NULL DEFAULT 'primeiro-ano',
  occasion_date TEXT,
  requested_title TEXT NOT NULL,
  main_phrase TEXT,
  collection_type TEXT NOT NULL DEFAULT 'primeiro-ano',
  product_type TEXT NOT NULL CHECK (product_type IN ('digital', 'talking_card', 'interactive_gift')),
  visual_style TEXT NOT NULL DEFAULT 'afetuoso',
  requested_contents TEXT[] NOT NULL DEFAULT '{}',
  price_cents INTEGER NOT NULL,
  freight_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new',
    'contact_started',
    'awaiting_content',
    'content_received',
    'creating',
    'awaiting_approval',
    'approved',
    'in_production',
    'shipped',
    'completed',
    'cancelled'
  )),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
    'pending',
    'deposit_paid',
    'paid',
    'refunded'
  )),
  customer_notes TEXT,
  internal_notes TEXT,
  consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  privacy_policy_version TEXT NOT NULL DEFAULT '1.0',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

-- Índices essenciais para consultas de pedidos
CREATE INDEX IF NOT EXISTS idx_orders_code ON public.orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Habilitar RLS em orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de orders: somente administradores autenticados podem consultar/modificar diretamente
CREATE POLICY "Admins podem visualizar pedidos"
  ON public.orders
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins podem atualizar pedidos"
  ON public.orders
  FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins podem inserir pedidos"
  ON public.orders
  FOR INSERT
  WITH CHECK (public.is_admin());

-- 3. TABELA: order_status_history (Histórico de transições de status)
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ler histórico de status"
  ON public.order_status_history
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins podem criar histórico de status"
  ON public.order_status_history
  FOR INSERT
  WITH CHECK (public.is_admin());

-- 4. TABELA: gift_pages (Páginas afetivas vinculadas a encomendas)
CREATE TABLE IF NOT EXISTS public.gift_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'primeiro-ano',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'awaiting_approval',
    'published',
    'unpublished',
    'archived'
  )),
  public_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  reveal_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gift_pages_token ON public.gift_pages(public_token);
CREATE INDEX IF NOT EXISTS idx_gift_pages_status ON public.gift_pages(status);
CREATE INDEX IF NOT EXISTS idx_gift_pages_order_id ON public.gift_pages(order_id);

ALTER TABLE public.gift_pages ENABLE ROW LEVEL SECURITY;

-- Políticas de gift_pages:
-- Leitura pública somente para páginas publicadas pelo token exato
CREATE POLICY "Público pode ler páginas publicadas pelo token"
  ON public.gift_pages
  FOR SELECT
  USING (
    status = 'published' AND
    archived_at IS NULL AND
    (reveal_at IS NULL OR reveal_at <= now())
  );

-- Admins têm acesso irrestrito
CREATE POLICY "Admins têm controle total sobre páginas"
  ON public.gift_pages
  FOR ALL
  USING (public.is_admin());

-- 5. TABELA: media_assets (Controle de arquivos do bucket privado)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_page_id UUID NOT NULL REFERENCES public.gift_pages(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  section_key TEXT NOT NULL, -- 'cover', 'timeline', 'gallery', 'audio', 'contributors'
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration_seconds NUMERIC(8,2),
  alt_text TEXT,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_media_assets_gift_page ON public.media_assets(gift_page_id);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar media_assets"
  ON public.media_assets
  FOR ALL
  USING (public.is_admin());

-- 6. TABELA: activity_logs (Auditoria de ações administrativas)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'order_status_change', 'page_published', 'token_regenerated', etc.
  entity_type TEXT NOT NULL, -- 'order', 'gift_page', 'media_asset'
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem consultar activity_logs"
  ON public.activity_logs
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins podem registrar activity_logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (public.is_admin());
