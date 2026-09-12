import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_AUDIO_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

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

const EXTENSIONS_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/webm': 'webm',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/x-m4a': 'm4a',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export async function POST(req: NextRequest) {
  try {
    const { profile, user } = await getAdminSessionAndProfile();
    if (!profile || !user) {
      return NextResponse.json({ success: false, error: 'Acesso não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const giftPageId = (formData.get('giftPageId') as string) || '';
    const sectionKey = ((formData.get('sectionKey') as string) || 'general')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 50);

    if (!file || !giftPageId) {
      return NextResponse.json(
        { success: false, error: 'Arquivo e página de presente são obrigatórios' },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'application/octet-stream';
    const mediaType = ALLOWED_MIME_TYPES[mimeType];

    if (!mediaType) {
      return NextResponse.json(
        { success: false, error: `Tipo de arquivo não permitido (${mimeType})` },
        { status: 400 }
      );
    }

    if (mediaType === 'image' && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, error: 'Imagem excede o limite de 10MB' }, { status: 400 });
    }
    if (mediaType === 'audio' && file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json({ success: false, error: 'Áudio excede o limite de 20MB' }, { status: 400 });
    }
    if (mediaType === 'video' && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ success: false, error: 'Vídeo excede o limite de 50MB' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();

    const { data: giftPage } = await adminClient
      .from('gift_pages')
      .select('id')
      .eq('id', giftPageId)
      .is('archived_at', null)
      .maybeSingle();

    if (!giftPage) {
      return NextResponse.json({ success: false, error: 'Página de presente inválida' }, { status: 404 });
    }

    const extension = EXTENSIONS_BY_MIME[mimeType];
    const filename = `${crypto.randomUUID()}.${extension}`;
    const storagePath = `gift-pages/${giftPageId}/${sectionKey}/${filename}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from('gift-media')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Erro de upload no Supabase Storage:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Não foi possível armazenar a mídia. Tente novamente.' },
        { status: 503 }
      );
    }

    const { data: assetRecord, error: assetError } = await adminClient
      .from('media_assets')
      .insert({
        gift_page_id: giftPageId,
        media_type: mediaType,
        section_key: sectionKey,
        storage_path: storagePath,
        original_name: file.name.slice(0, 255),
        mime_type: mimeType,
        size_bytes: file.size,
        created_by: user.id,
      })
      .select('id')
      .single();

    if (assetError || !assetRecord) {
      await adminClient.storage.from('gift-media').remove([storagePath]);
      console.error('Erro ao registrar media_asset:', assetError);
      return NextResponse.json(
        { success: false, error: 'Não foi possível registrar a mídia.' },
        { status: 500 }
      );
    }

    const mediaUrl = `/api/media/${storagePath}`;

    return NextResponse.json({
      success: true,
      assetId: assetRecord.id,
      storagePath,
      signedUrl: mediaUrl,
      url: mediaUrl,
      originalName: file.name,
      mimeType,
      mediaType,
      sizeBytes: file.size,
    });
  } catch (err) {
    console.error('Erro no upload de mídia:', err);
    return NextResponse.json({ success: false, error: 'Erro interno ao processar upload' }, { status: 500 });
  }
}
