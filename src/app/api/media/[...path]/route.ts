import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    if (!params.path || params.path.length === 0) {
      return new NextResponse('Media path required', { status: 400 });
    }

    const storagePath = params.path.map(decodeURIComponent).join('/');
    const adminClient = createSupabaseAdminClient();

    const { data, error } = await adminClient.storage
      .from('gift-media')
      .download(storagePath);

    if (error || !data) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const mimeType = data.type || 'image/jpeg';
    const arrayBuffer = await data.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error('Erro ao servir media:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
