-- ==============================================================================
-- FEITO DE NÓS — SCRIPT DE SEED E PRIMEIRO ADMINISTRADOR
-- ==============================================================================

-- INSTRUÇÃO PARA CRIAR O PRIMEIRO ADMINISTRADOR NO SUPABASE:
-- 1. No painel do Supabase, acesse "Authentication" > "Users" > "Add User" (ou via SignUp).
-- 2. Crie o usuário com o e-mail do proprietário (ex: admin@feitodenos.com.br) e defina uma senha forte.
-- 3. Copie o ID (UUID) do usuário gerado e execute o comando abaixo substituindo 'SEU_USER_UUID_AQUI':

/*
INSERT INTO public.admin_profiles (id, name, role, active)
VALUES (
  'SEU_USER_UUID_AQUI',
  'Administrador Feito de Nós',
  'owner',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'owner',
  active = true;
*/

-- ==============================================================================
-- DADOS DE TESTE (FICTÍCIOS) PARA DESENVOLVIMENTO LOCAL
-- ==============================================================================

-- Pedido Fictício 1: Matheus Akira
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
  'FN-260909-MTH1',
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

-- Página Fictícia 1 vinculada ao pedido do Matheus Akira
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
