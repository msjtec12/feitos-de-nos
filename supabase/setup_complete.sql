-- ==============================================================================
-- FEITO DE NÓS — SCRIPT COMPLETO DE CONFIGURAÇÃO DO BANCO SUPABASE
-- Execute este script completo no SQL Editor do Supabase para criar todas as
-- tabelas, funções, permissões RLS, bucket de Storage e o seu usuário Administrador.
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
DROP POLICY IF EXISTS "Admin pode ler perfis administrativos" ON public.admin_profiles;
CREATE POLICY "Admin pode ler perfis administrativos"
  ON public.admin_profiles
  FOR SELECT
  USING (public.is_admin() OR auth.uid() = id);

DROP POLICY IF EXISTS "Apenas owners podem gerenciar perfis administrativos" ON public.admin_profiles;
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

CREATE INDEX IF NOT EXISTS idx_orders_code ON public.orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem visualizar pedidos" ON public.orders;
CREATE POLICY "Admins podem visualizar pedidos"
  ON public.orders
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins podem atualizar pedidos" ON public.orders;
CREATE POLICY "Admins podem atualizar pedidos"
  ON public.orders
  FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins podem inserir pedidos" ON public.orders;
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

DROP POLICY IF EXISTS "Admins podem ler histórico de status" ON public.order_status_history;
CREATE POLICY "Admins podem ler histórico de status"
  ON public.order_status_history
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins podem criar histórico de status" ON public.order_status_history;
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

DROP POLICY IF EXISTS "Público pode ler páginas publicadas pelo token" ON public.gift_pages;
CREATE POLICY "Público pode ler páginas publicadas pelo token"
  ON public.gift_pages
  FOR SELECT
  USING (
    status = 'published' AND
    archived_at IS NULL AND
    (reveal_at IS NULL OR reveal_at <= now())
  );

DROP POLICY IF EXISTS "Admins têm controle total sobre páginas" ON public.gift_pages;
CREATE POLICY "Admins têm controle total sobre páginas"
  ON public.gift_pages
  FOR ALL
  USING (public.is_admin());

-- 5. TABELA: media_assets (Controle de arquivos do bucket privado)
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_page_id UUID NOT NULL REFERENCES public.gift_pages(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  section_key TEXT NOT NULL,
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

DROP POLICY IF EXISTS "Admins podem gerenciar media_assets" ON public.media_assets;
CREATE POLICY "Admins podem gerenciar media_assets"
  ON public.media_assets
  FOR ALL
  USING (public.is_admin());

-- 6. TABELA: activity_logs (Auditoria de ações administrativas)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem consultar activity_logs" ON public.activity_logs;
CREATE POLICY "Admins podem consultar activity_logs"
  ON public.activity_logs
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins podem registrar activity_logs" ON public.activity_logs;
CREATE POLICY "Admins podem registrar activity_logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (public.is_admin());

-- 7. BUCKET DE STORAGE PRIVADO 'gift-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-media',
  'gift-media',
  false,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/mp4',
    'audio/webm',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/mp4',
    'audio/webm',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/webm'
  ];

-- Políticas RLS no Storage
DROP POLICY IF EXISTS "Apenas admins podem ler arquivos de gift-media" ON storage.objects;
CREATE POLICY "Apenas admins podem ler arquivos de gift-media"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'gift-media' AND
    public.is_admin()
  );

DROP POLICY IF EXISTS "Apenas admins podem fazer upload em gift-media" ON storage.objects;
CREATE POLICY "Apenas admins podem fazer upload em gift-media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gift-media' AND
    public.is_admin()
  );

-- 8. CADASTRO DO SEU USUÁRIO COMO ADMINISTRADOR PROPRIETÁRIO (OWNER)
INSERT INTO public.admin_profiles (id, name, role, active)
VALUES (
  'a32837f8-d706-4da6-9485-efe1340c317d',
  'Massami Shihara',
  'owner',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'owner',
  active = true;

-- 9. DADOS DE EXEMPLO (PEDIDO E PÁGINA DO MATHEUS AKIRA)
INSERT INTO public.orders (
  id,
  code,
  customer_name,
  customer_email,
  customer_whatsapp,
  customer_city,
  customer_state,
  customer_zipcode,
  customer_street,
  customer_number,
  customer_neighborhood,
  recipient_name,
  recipient_relationship,
  occasion_type,
  occasion_date,
  requested_title,
  main_phrase,
  collection_type,
  product_type,
  visual_style,
  requested_contents,
  price_cents,
  freight_cents,
  total_cents,
  status,
  payment_status,
  customer_notes,
  consent_at,
  privacy_policy_version,
  source
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'FN-20260909-MTH1',
  'Ana Clara Silva',
  'anaclara@exemplo.com.br',
  '(11) 98765-4321',
  'São Paulo',
  'SP',
  '08473-005',
  'Travessa Alfredo Eduardo Noronha',
  '120',
  'Jardim Wilma Flor',
  'Matheus Akira',
  'Filho',
  'primeiro-ano',
  '12/03/2026',
  'O Primeiro Ano do Matheus',
  'O ano em que o mundo ganhou você e a nossa vida se transformou em amor.',
  'primeiro-ano',
  'interactive_gift',
  'infantil-suave',
  ARRAY['photos', 'messages', 'audios', 'contributors'],
  19990,
  0,
  19990,
  'in_production',
  'paid',
  'Gostaria que a entrega fosse antes do aniversário de 1 ano.',
  now(),
  '1.0',
  'website'
) ON CONFLICT (code) DO NOTHING;

INSERT INTO public.gift_pages (
  id,
  order_id,
  title,
  recipient_name,
  template_type,
  status,
  public_token,
  content,
  theme,
  published_at
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'O Primeiro Ano do Matheus',
  'Matheus Akira',
  'primeiro-ano',
  'published',
  'c0000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'slug', 'matheus-akira',
    'openingText', jsonb_build_object(
      'headline', 'O Primeiro Ano do Matheus',
      'description', 'Um presente interativo com as primeiras memórias, fotos e vozes de quem mais te ama.',
      'buttonLabel', 'Abrir Presente'
    ),
    'recipient', jsonb_build_object(
      'name', 'Matheus Akira',
      'subtitle', 'Meu Primeiro Ano',
      'tagline', '12 meses de puro amor e descobertas',
      'introQuote', 'O ano em que o mundo ganhou você e a nossa vida se transformou em amor.',
      'featuredImage', jsonb_build_object(
        'id', 'hero-matheus',
        'url', '/demo/images/hero-matheus.jpg',
        'altText', 'Foto de capa de Matheus Akira',
        'aspectRatio', 'square',
        'placeholderColor', '#D9A4A0',
        'isAvailable', false
      )
    ),
    'closing', jsonb_build_object(
      'headline', 'Para Sempre Guardado',
      'message', 'Que você cresça sabendo o quanto é amado por cada um de nós.',
      'signature', 'Com todo amor, seus Pais e Família'
    )
  ),
  jsonb_build_object(
    'styleId', 'infantil-suave',
    'primaryColor', '#C96E5A',
    'accentColor', '#D9A4A0'
  ),
  now()
) ON CONFLICT (id) DO NOTHING;
