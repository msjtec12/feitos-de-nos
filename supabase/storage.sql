-- ============================================================================
-- FEITO DE NÓS — CONFIGURAÇÃO DO SUPABASE STORAGE (BUCKET: gift-media)
-- ============================================================================

-- 1. CRIAR BUCKET PÚBLICO DE MÍDIAS FAMILIARES (FOTOS E ÁUDIOS)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gift-media',
    'gift-media',
    true,
    52428800, -- Limite de 50MB por arquivo (ideal para áudios e fotos de alta resolução)
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/heic',
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/m4a',
        'audio/ogg',
        'audio/webm'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800;

-- 2. POLÍTICA DE LEITURA PÚBLICA PARA MÍDIAS DO PRESENTE
CREATE POLICY "Permitir visualização pública de mídias de presentes"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gift-media');

-- 3. POLÍTICA DE UPLOAD AUTENTICADO / SERVICE ROLE
CREATE POLICY "Permitir upload no bucket gift-media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'gift-media');

-- 4. POLÍTICA DE EXCLUSÃO E ATUALIZAÇÃO
CREATE POLICY "Permitir exclusão e atualização de mídias no bucket gift-media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'gift-media');

CREATE POLICY "Permitir remoção de mídias no bucket gift-media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'gift-media');
