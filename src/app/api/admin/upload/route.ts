import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server';

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
    const { profile, user } = await getAdminSessionAndProfile();
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

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let finalUrl = '';
    let isStorageUploaded = false;

    // 3. Upload para Supabase Storage e retorno de URL de rota interna /api/media/...
    const adminClient = createSupabaseAdminClient();
    let storageSucceeded = false;

    try {
      const { error: uploadError } = await adminClient.storage
        .from('gift-media')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError) {
        storageSucceeded = true;
      } else if (
        uploadError.message?.toLowerCase().includes('bucket') ||
        uploadError.message?.toLowerCase().includes('not found')
      ) {
        // Cria bucket caso ainda não exista no Supabase
        await adminClient.storage.createBucket('gift-media', { public: true });
        const { error: retryError } = await adminClient.storage
          .from('gift-media')
          .upload(storagePath, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });
        if (!retryError) storageSucceeded = true;
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload aviso:', storageErr);
    }

    if (storageSucceeded) {
      finalUrl = `/api/media/${storagePath}`;
      isStorageUploaded = true;
    } else {
      // Fallback resiliente apenas se o Storage estiver completamente indisponível
      finalUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }

    // 5. Registra na tabela media_assets com tolerância a falhas
    let assetId = crypto.randomUUID();
    try {
      const supabaseServer = createSupabaseServerClient();
      const { data: assetRecord } = await supabaseServer
        .from('media_assets')
        .insert({
          id: assetId,
          gift_page_id: giftPageId !== 'temp' ? giftPageId : null,
          media_type: mediaType,
          section_key: sectionKey,
          storage_path: isStorageUploaded ? storagePath : 'inline-data',
          original_name: file.name,
          mime_type: mimeType,
          size_bytes: file.size,
          created_by: user?.id || profile.id,
        })
        .select('id')
        .maybeSingle();

      if (assetRecord) assetId = assetRecord.id;
    } catch (dbErr) {
      // Registro secundário de auditoria - não bloqueia o fluxo principal
    }

    return NextResponse.json({
      success: true,
      assetId,
      storagePath: isStorageUploaded ? storagePath : 'inline-data',
      signedUrl: finalUrl,
      url: finalUrl,
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
