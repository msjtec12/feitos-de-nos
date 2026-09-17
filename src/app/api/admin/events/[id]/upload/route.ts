import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/heic-sequence': 'heic',
  'image/heif-sequence': 'heif',
  'image/bmp': 'bmp',
  'image/x-ms-bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/svg+xml': 'svg',
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

    const rawMime = (file.type || '').toLowerCase();
    let extension = ALLOWED_MIME_TYPES[rawMime];
    if (!extension && file.name) {
      const match = file.name.match(/\.([a-zA-Z0-9]+)$/);
      if (match) {
        const ext = match[1].toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'bmp', 'tiff', 'svg'].includes(ext)) {
          extension = ext === 'jpeg' ? 'jpg' : ext;
        }
      }
    }
    if (!extension) {
      extension = 'jpg';
    }

    const mimeType = rawMime || (extension === 'jpg' ? 'image/jpeg' : `image/${extension}`);

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'A imagem deve ter no máximo 15MB.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const adminClient = createSupabaseAdminClient();
    const filename = `${crypto.randomUUID()}.${extension}`;
    const storagePath = `events/${id}/${filename}`;

    let finalUrl = '';

    try {
      // Ensure bucket exists or create it
      try {
        await adminClient.storage.createBucket('gift-media', { public: true });
      } catch {
        // Bucket may already exist or cannot be created via storage API
      }

      // Try uploading to Supabase Storage bucket 'gift-media'
      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from('gift-media')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        // Use the authenticated proxy route so public/private bucket configuration doesn't break image delivery
        finalUrl = `/api/media/${storagePath}`;
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
    let insertedMediaId: string | null = null;
    if (id && id !== 'temp' && !id.startsWith('demo-')) {
      try {
        const { data: insertedData, error: dbErr } = await adminClient
          .from('event_media')
          .insert({
            event_id: id,
            media_type: 'image',
            url: finalUrl,
            caption: caption || file.name,
            sort_order: 99,
          })
          .select('id')
          .single();

        if (!dbErr && insertedData) {
          insertedMediaId = insertedData.id;
        } else if (dbErr) {
          console.warn('Could not insert event_media record immediately:', dbErr);
        }
      } catch (dbErr) {
        console.warn('Could not insert event_media record immediately:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      mediaId: insertedMediaId,
      originalName: file.name,
      sizeBytes: file.size,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro no processamento do upload';
    console.error('Error in event upload route:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
