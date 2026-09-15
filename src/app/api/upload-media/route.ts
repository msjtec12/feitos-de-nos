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

export async function POST(req: NextRequest) {
  try {
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
    const storagePath = `uploads/${filename}`;

    let finalUrl = '';

    try {
      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from('gift-media')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = adminClient.storage
          .from('gift-media')
          .getPublicUrl(storagePath);

        finalUrl = publicUrlData?.publicUrl || `/api/media/${storagePath}`;
      } else {
        throw new Error(uploadError?.message || 'Storage upload error');
      }
    } catch (storageErr) {
      console.warn('Fallback to base64 Data URL for uploaded media:', storageErr);
      const base64Data = fileBuffer.toString('base64');
      finalUrl = `data:${mimeType};base64,${base64Data}`;
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      originalName: file.name,
      caption: caption || file.name,
      sizeBytes: file.size,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro no processamento do upload';
    console.error('Error in general upload route:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
