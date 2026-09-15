-- ==============================================================================
-- FEITO DE NÓS — SCHEMA: CONVITES E EVENTOS INTERATIVOS
-- Migração Versionada: 20260915100000_invitations_and_events.sql
-- ==============================================================================

-- 1. EXTENSÃO COMPATÍVEL DA TABELA orders (Não quebra pedidos existentes de presentes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_type'
  ) THEN
    ALTER TABLE public.orders 
      ADD COLUMN order_type TEXT NOT NULL DEFAULT 'gift' CHECK (order_type IN ('gift', 'invitation'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'event_id'
  ) THEN
    ALTER TABLE public.orders 
      ADD COLUMN event_id UUID;
  END IF;
END $$;

-- Atualização segura do check constraint de product_type em orders
DO $$
BEGIN
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_product_type_check;
  ALTER TABLE public.orders ADD CONSTRAINT orders_product_type_check CHECK (
    product_type IN (
      'digital', 'talking_card', 'interactive_gift',
      'gift', 'invitation',
      'convite_essencial', 'convite_interativo', 'convite_completo'
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- 2. TABELA: events (Convites e Eventos Interativos)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'aniversario-infantil',
  plan TEXT NOT NULL DEFAULT 'interativo' CHECK (plan IN ('essencial', 'interativo', 'completo')),
  host_names TEXT NOT NULL,
  honoree_name TEXT,
  headline TEXT,
  opening_message TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  venue_name TEXT,
  address TEXT,
  maps_url TEXT,
  dress_code TEXT,
  gift_information TEXT,
  cover_url TEXT,
  theme_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  rsvp_deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'awaiting_content',
    'in_production',
    'awaiting_approval',
    'published',
    'completed',
    'expired',
    'unpublished',
    'archived'
  )),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_order_id ON public.events(order_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para events
CREATE POLICY "Público pode visualizar eventos publicados"
  ON public.events
  FOR SELECT
  USING (
    status = 'published' AND
    archived_at IS NULL AND
    (expires_at IS NULL OR expires_at >= now())
  );

CREATE POLICY "Admins têm controle total sobre events"
  ON public.events
  FOR ALL
  USING (public.is_admin());

-- 3. TABELA: event_media (Fotos e áudios vinculados à galeria do evento)
CREATE TABLE IF NOT EXISTS public.event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_media_event_id ON public.event_media(event_id);
CREATE INDEX IF NOT EXISTS idx_event_media_sort ON public.event_media(event_id, sort_order);

ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público pode visualizar mídias de eventos publicados"
  ON public.event_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE public.events.id = public.event_media.event_id
        AND public.events.status = 'published'
        AND public.events.archived_at IS NULL
    )
  );

CREATE POLICY "Admins têm controle total sobre event_media"
  ON public.event_media
  FOR ALL
  USING (public.is_admin());

-- 4. TABELA: event_guests (Convidados, tokens individuais secretos, RSVP e Check-in)
CREATE TABLE IF NOT EXISTS public.event_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  phone TEXT,
  max_companions INTEGER NOT NULL DEFAULT 0,
  attendance_status TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'confirmed', 'declined')),
  companions_count INTEGER NOT NULL DEFAULT 0,
  dietary_restrictions TEXT,
  note TEXT,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_guests_event_id ON public.event_guests(event_id);
CREATE INDEX IF NOT EXISTS idx_event_guests_token ON public.event_guests(token);
CREATE INDEX IF NOT EXISTS idx_event_guests_attendance ON public.event_guests(event_id, attendance_status);

ALTER TABLE public.event_guests ENABLE ROW LEVEL SECURITY;

-- Admins têm acesso total a convidados
CREATE POLICY "Admins têm controle total sobre event_guests"
  ON public.event_guests
  FOR ALL
  USING (public.is_admin());

-- 5. TABELA: event_guestbook_messages (Livro de recados dos convidados)
CREATE TABLE IF NOT EXISTS public.event_guestbook_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_guestbook_event_id ON public.event_guestbook_messages(event_id);

ALTER TABLE public.event_guestbook_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público pode ler recados aprovados de eventos publicados"
  ON public.event_guestbook_messages
  FOR SELECT
  USING (
    moderation_status = 'approved' AND
    EXISTS (
      SELECT 1 FROM public.events
      WHERE public.events.id = public.event_guestbook_messages.event_id
        AND public.events.status = 'published'
        AND public.events.archived_at IS NULL
    )
  );

CREATE POLICY "Admins têm controle total sobre recados"
  ON public.event_guestbook_messages
  FOR ALL
  USING (public.is_admin());

-- 6. TABELA: event_templates (Modelos e presets autorais de temas)
CREATE TABLE IF NOT EXISTS public.event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  preview_url TEXT,
  theme_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.event_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público pode consultar templates ativos"
  ON public.event_templates
  FOR SELECT
  USING (active = true);

CREATE POLICY "Admins têm controle total sobre templates"
  ON public.event_templates
  FOR ALL
  USING (public.is_admin());
