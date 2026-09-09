import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_MIME_TYPES: Record<string, 'image' | 'audio' | 'video'> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'audio/mpeg': 'audio',
  'audio/mp4': 'audio',
  'audio/webm': 'audio',
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
  'audio/x-m4a': 'audio',
  'video/mp4': 'video',
  'video/webm': 'video',
};

export async function POST(req: NextRequest) {
  try {
    // 1. Verificação de autenticação de administrador
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Acesso não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const giftPageId = (formData.get('giftPageId') as string) || 'temp';
    const sectionKey = (formData.get('sectionKey') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    const mediaType = ALLOWED_MIME_TYPES[mimeType];

    if (!mediaType) {
      return NextResponse.json(
        { success: false, error: `Tipo de arquivo não permitido (${mimeType}). Envie JPG, PNG, WEBP ou MP3/M4A.` },
        { status: 400 }
      );
    }

    // Validação de tamanho por tipo
    if (mediaType === 'image' && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, error: 'Imagem excede o limite de 10MB' }, { status: 400 });
    }
    if (mediaType === 'audio' && file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json({ success: false, error: 'Áudio excede o limite de 20MB' }, { status: 400 });
    }
    if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ success: false, error: 'Vídeo excede o limite de 50MB' }, { status: 400 });
    }

    // 2. Determina extensão e caminho único no Storage
    const ext = file.name.split('.').pop() || 'bin';
    const filename = `${crypto.randomUUID()}.${ext.toLowerCase()}`;
    const storagePath = `gift-pages/${giftPageId}/${sectionKey}/${filename}`;

    const adminClient = createSupabaseAdminClient();
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 3. Upload para o bucket privado 'gift-media'
    const { error: uploadError } = await adminClient.storage
      .from('gift-media')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Erro no upload para o Supabase Storage:', uploadError);
      return NextResponse.json({ success: false, error: 'Erro ao salvar arquivo no Storage' }, { status: 500 });
    }

    // 4. Registra na tabela media_assets
    let assetId = crypto.randomUUID();
    if (giftPageId !== 'temp') {
      const { data: assetRecord } = await adminClient
        .from('media_assets')
        .insert({
          id: assetId,
          gift_page_id: giftPageId,
          media_type: mediaType,
          section_key: sectionKey,
          storage_path: storagePath,
          original_name: file.name,
          mime_type: mimeType,
          size_bytes: file.size,
          created_by: profile.id,
        })
        .select('id')
        .single();

      if (assetRecord) assetId = assetRecord.id;
    }

    // 5. Gera signed URL para prévia imediata (válida por 2 horas)
    const { data: signedData } = await adminClient.storage
      .from('gift-media')
      .createSignedUrl(storagePath, 7200);

    return NextResponse.json({
      success: true,
      assetId,
      storagePath,
      signedUrl: signedData?.signedUrl || '',
      originalName: file.name,
      mimeType,
      mediaType,
      sizeBytes: file.size,
    });
  } catch (err: any) {
    console.error('Erro no upload de mídia:', err);
    return NextResponse.json({ success: false, error: 'Erro interno ao processar upload' }, { status: 500 });
  }
}
