import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';

async function canAccessMedia(storagePath: string) {
  const { profile } = await getAdminSessionAndProfile();
  if (profile) return true;

  const adminClient = createSupabaseAdminClient();

  const { data: asset } = await adminClient
    .from('media_assets')
    .select('gift_page_id, archived_at')
    .eq('storage_path', storagePath)
    .is('archived_at', null)
    .maybeSingle();

  if (!asset?.gift_page_id) return false;

  const { data: giftPage } = await adminClient
    .from('gift_pages')
    .select('status, reveal_at, archived_at')
    .eq('id', asset.gift_page_id)
    .maybeSingle();

  if (!giftPage || giftPage.archived_at || giftPage.status !== 'published') {
    return false;
  }

  if (giftPage.reveal_at && new Date(giftPage.reveal_at).getTime() > Date.now()) {
    return false;
  }

  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    if (!params.path || params.path.length === 0) {
      return new NextResponse('Media path required', { status: 400 });
    }

    const storagePath = params.path.map(decodeURIComponent).join('/');

    if (!(await canAccessMedia(storagePath))) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient.storage
      .from('gift-media')
      .download(storagePath);

    if (!data || error) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const mimeType = data.type || 'application/octet-stream';
    const arrayBuffer = await data.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'private, max-age=3600, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      },
    });
  } catch (err) {
    console.error('Erro ao servir media:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
