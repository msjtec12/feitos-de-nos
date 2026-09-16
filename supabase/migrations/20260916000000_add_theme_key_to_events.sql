-- ==============================================================================
-- FEITO DE NÓS — MIGRAÇÃO: ADICIONAR THEME_KEY E SEED DO EVENTO OFICIAL
-- Migração Versionada: 20260916000000_add_theme_key_to_events.sql
-- ==============================================================================

-- 1. ADICIONA COLUNA CANÔNICA theme_key À TABELA events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'theme_key'
  ) THEN
    ALTER TABLE public.events ADD COLUMN theme_key TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_events_theme_key ON public.events(theme_key);

-- 2. SEED / UPSERT DO EVENTO OFICIAL MATHEUS AKIRA
-- Garante que o evento de teste exista como um registro real no banco de dados,
-- com UUID canônico e slug correspondente, sem depender de objetos mock em memória.
INSERT INTO public.events (
  id,
  title,
  slug,
  theme_key,
  event_type,
  plan,
  host_names,
  honoree_name,
  headline,
  opening_message,
  event_date,
  timezone,
  venue_name,
  address,
  maps_url,
  dress_code,
  gift_information,
  cover_url,
  theme_config,
  rsvp_deadline,
  status,
  published_at,
  expires_at,
  created_at,
  updated_at
) VALUES (
  'e0000000-0000-4000-8000-000000000001',
  'O Primeiro Aninho do Matheus Akira',
  'matheus-akira-1-ano',
  'infantil-monstrinhos-elementais',
  'aniversario-infantil',
  'completo',
  'Camila & Lucas',
  'Matheus Akira',
  'Nosso raio de sol completa seu primeiro ano de vida e doçura!',
  'Parece que foi ontem que ouvimos o seu primeiro choro e vimos o mundo ganhar um novo colorido. O Matheus chegou para multiplicar sorrisos e nos ensinar a verdadeira dimensão do amor. É uma alegria imensa poder celebrar esse primeiro capítulo com vocês, que fazem parte do nosso coração!',
  '2026-10-24T16:00:00-03:00',
  'America/Sao_Paulo',
  'Espaço Villa Encantada',
  'Alameda das Hortênsias, 420 - Jardim América, São Paulo - SP',
  'https://maps.google.com/?q=Alameda+das+Hortênsias+420+São+Paulo',
  'Esporte fino ou casual arrumadinho (sugerimos tons claros ou pastéis)',
  'A sua presença e o seu carinho são os nossos maiores presentes! Caso queira mimar o Matheus Akira, sugerimos roupinhas tamanho 18M ou contribuição para o seu cofrinho via chave Pix: pix@feitodenos.com.br (Banco Inter).',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
  '{
    "theme_key": "infantil-monstrinhos-elementais",
    "themeId": "infantil-monstrinhos-elementais",
    "slug": "infantil-monstrinhos-elementais",
    "name": "Monstrinhos Elementais",
    "heroBadge": "⚡ Fogo, Água, Terra & Energia",
    "primaryColor": "#B45309",
    "secondaryColor": "#FEF08A",
    "accentColor": "#DC2626",
    "backgroundColor": "#FEFCE8",
    "surfaceColor": "#FFFFFF",
    "textColor": "#1C1917",
    "mutedColor": "#78716C",
    "headingFont": "Plus Jakarta Sans, sans-serif",
    "bodyFont": "Plus Jakarta Sans, sans-serif",
    "photoStyle": "rounded",
    "buttonStyle": "pill",
    "openingStyle": "envelope",
    "particlePreset": "elemental",
    "animationIntensity": "festive",
    "confirmationEffect": "elemental-energy"
  }'::jsonb,
  '2026-10-15T23:59:59-03:00',
  'published',
  now(),
  now() + interval '1 year',
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  theme_key = COALESCE(public.events.theme_key, EXCLUDED.theme_key),
  theme_config = COALESCE(public.events.theme_config, EXCLUDED.theme_config),
  updated_at = now();

-- 3. MÍDIAS DA GALERIA DO EVENTO MATHEUS AKIRA
INSERT INTO public.event_media (id, event_id, media_type, url, caption, sort_order)
VALUES
  ('e1000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000001', 'image', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80', 'Nosso primeiro mês de vida e muitas descobertas', 1),
  ('e1000000-0000-4000-8000-000000000002', 'e0000000-0000-4000-8000-000000000001', 'image', 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80', 'Primeiro banho de sol com o papai e a mamãe', 2),
  ('e1000000-0000-4000-8000-000000000003', 'e0000000-0000-4000-8000-000000000001', 'image', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80', 'Sorriso contagiante que ilumina toda a casa', 3)
ON CONFLICT (id) DO NOTHING;
