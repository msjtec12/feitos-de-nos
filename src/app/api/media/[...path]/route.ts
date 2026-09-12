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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jrltijehfgehqjzopgkc.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      '';

    // 1. Tenta download de alta performance via REST do Supabase Storage
    try {
      const restRes = await fetch(`${supabaseUrl}/storage/v1/object/gift-media/${storagePath}`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      if (restRes.ok) {
        const mimeType = restRes.headers.get('content-type') || 'image/jpeg';
        const buffer = await restRes.arrayBuffer();

        return new NextResponse(Buffer.from(buffer), {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch {
      // Fallback para SDK
    }

    const adminClient = createSupabaseAdminClient();

    // 2. Fallback: download via SDK do Storage
    const { data, error } = await adminClient.storage
      .from('gift-media')
      .download(storagePath);

    if (data && !error) {
      const mimeType = data.type || 'image/jpeg';
      const arrayBuffer = await data.arrayBuffer();

      return new NextResponse(Buffer.from(arrayBuffer), {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fallback: URL assinada
    try {
      const { data: signedData } = await adminClient.storage
        .from('gift-media')
        .createSignedUrl(storagePath, 3600);

      if (signedData?.signedUrl) {
        const res = await fetch(signedData.signedUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const mimeType = res.headers.get('content-type') || 'image/jpeg';
          return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    } catch {
      //
    }

    // 3. Fallback: URL pública
    try {
      const { data: pubData } = adminClient.storage
        .from('gift-media')
        .getPublicUrl(storagePath);

      if (pubData?.publicUrl) {
        const res = await fetch(pubData.publicUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const mimeType = res.headers.get('content-type') || 'image/jpeg';
          return new NextResponse(Buffer.from(buffer), {
            status: 200,
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    } catch {
      //
    }

    return new NextResponse('Media not found', { status: 404 });
  } catch (err: any) {
    console.error('Erro ao servir media:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
