import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caption = (formData.get('caption') as string) || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'image/jpeg';
    const extension = ALLOWED_MIME_TYPES[mimeType] || 'jpg';

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'A imagem deve ter no máximo 10MB.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const adminClient = createSupabaseAdminClient();
    const filename = `${crypto.randomUUID()}.${extension}`;
    const storagePath = `events/${id}/${filename}`;

    let finalUrl = '';

    try {
      // Try uploading to Supabase Storage bucket 'gift-media'
      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from('gift-media')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        // Try getting public URL
        const { data: publicUrlData } = adminClient.storage
          .from('gift-media')
          .getPublicUrl(storagePath);

        finalUrl = publicUrlData?.publicUrl || `/api/media/${storagePath}`;
      } else {
        throw new Error(uploadError?.message || 'Storage upload error');
      }
    } catch (storageErr) {
      console.warn('Fallback to base64 Data URL for uploaded media:', storageErr);
      // Resilient fallback: base64 Data URL
      const base64Data = fileBuffer.toString('base64');
      finalUrl = `data:${mimeType};base64,${base64Data}`;
    }

    // Also register in event_media if id is valid and not 'temp'
    if (id && id !== 'temp' && !id.startsWith('demo-')) {
      try {
        await adminClient.from('event_media').insert({
          event_id: id,
          media_type: 'image',
          url: finalUrl,
          caption: caption || file.name,
          sort_order: 99,
        });
      } catch (dbErr) {
        console.warn('Could not insert event_media record immediately:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      originalName: file.name,
      sizeBytes: file.size,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro no processamento do upload';
    console.error('Error in event upload route:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
