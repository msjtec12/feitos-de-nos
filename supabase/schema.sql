-- ============================================================================
-- FEITO DE NÓS — SCHEMA DE BANCO DE DADOS (SUPABASE POSTGRESQL)
-- ============================================================================

-- Extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PRESENTES (GIFTS)
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_subtitle VARCHAR(255) NOT NULL DEFAULT 'Meu primeiro ano',
    recipient_tagline VARCHAR(255) NOT NULL DEFAULT '365 dias de amor',
    intro_quote TEXT NOT NULL,
    hero_image_url TEXT,
    hero_image_alt TEXT DEFAULT 'Foto de destaque do primeiro ano',
    primary_audio_url TEXT,
    primary_audio_title VARCHAR(255) DEFAULT 'Mensagem dos pais',
    primary_audio_recorded_by VARCHAR(255) DEFAULT 'Papai e Mamãe',
    primary_audio_duration_seconds INTEGER DEFAULT 0,
    opening_headline VARCHAR(255) NOT NULL DEFAULT 'Uma história foi feita para você.',
    opening_description TEXT NOT NULL DEFAULT 'Ela reúne momentos, vozes e pessoas que fizeram parte do seu primeiro ano.',
    opening_button_label VARCHAR(100) NOT NULL DEFAULT 'Abrir meu presente',
    closing_headline VARCHAR(255) NOT NULL DEFAULT 'Esta é apenas a primeira parte da sua história.',
    closing_message TEXT NOT NULL DEFAULT 'Que você cresça cercado pelas vozes, lembranças e pessoas que fizeram do seu primeiro ano um tempo inesquecível.',
    closing_signature VARCHAR(255) NOT NULL DEFAULT 'Com todo o nosso amor.',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DA LINHA DO TEMPO (TIMELINE MOMENTS - 12 MESES)
CREATE TABLE IF NOT EXISTS public.timeline_moments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
    month_number INTEGER NOT NULL CHECK (month_number >= 1 AND month_number <= 12),
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    caption TEXT NOT NULL,
    image_url TEXT,
    image_alt TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE VOZES / CONTRIBUIDORES (CONTRIBUTOR MESSAGES)
CREATE TABLE IF NOT EXISTS public.contributor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    relation VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    written_message TEXT NOT NULL,
    audio_url TEXT,
    audio_title VARCHAR(255),
    audio_duration_seconds INTEGER DEFAULT 0,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DA GALERIA DE MEMÓRIAS (GALLERY ITEMS)
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    aspect_ratio VARCHAR(50) DEFAULT 'square',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ÍNDICES PARA ALTA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_gifts_slug ON public.gifts(slug);
CREATE INDEX IF NOT EXISTS idx_timeline_gift_id ON public.timeline_moments(gift_id);
CREATE INDEX IF NOT EXISTS idx_contributors_gift_id ON public.contributor_messages(gift_id);
CREATE INDEX IF NOT EXISTS idx_gallery_gift_id ON public.gallery_items(gift_id);

-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública anônima para presentes ativos
CREATE POLICY "Permitir leitura de presentes ativos"
    ON public.gifts FOR SELECT
    USING (is_active = true);

CREATE POLICY "Permitir leitura de momentos da linha do tempo"
    ON public.timeline_moments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.gifts 
        WHERE public.gifts.id = public.timeline_moments.gift_id AND public.gifts.is_active = true
    ));

CREATE POLICY "Permitir leitura de mensagens de contribuidores"
    ON public.contributor_messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.gifts 
        WHERE public.gifts.id = public.contributor_messages.gift_id AND public.gifts.is_active = true
    ));

CREATE POLICY "Permitir leitura de itens da galeria"
    ON public.gallery_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.gifts 
        WHERE public.gifts.id = public.gallery_items.gift_id AND public.gifts.is_active = true
    ));
