-- ==============================================================================
-- FEITO DE NÓS — CONFIGURAÇÃO DO BUCKET PRIVADO DE STORAGE
-- Migração Versionada: 20260909151000_storage_setup.sql
-- ==============================================================================

-- 1. Criação do bucket privado 'gift-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-media',
  'gift-media',
  false, -- Bucket estritamente privado; acesso público apenas via signed URLs
  52428800, -- Limite máximo de 50MB por arquivo (para suportar vídeos curtos e áudios)
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

-- 2. Políticas de segurança RLS no storage.objects para o bucket 'gift-media'
CREATE POLICY "Apenas admins podem ler arquivos de gift-media"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'gift-media' AND
    public.is_admin()
  );

CREATE POLICY "Apenas admins podem fazer upload em gift-media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gift-media' AND
    public.is_admin()
  );

CREATE POLICY "Apenas admins podem atualizar arquivos em gift-media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'gift-media' AND
    public.is_admin()
  );

CREATE POLICY "Apenas admins podem deletar arquivos em gift-media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'gift-media' AND
    public.is_admin()
  );
