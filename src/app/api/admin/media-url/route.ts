import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ success: false, error: 'Parâmetro path obrigatório' }, { status: 400 });
    }

    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Acesso não autorizado' }, { status: 401 });
    }

    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient.storage
      .from('gift-media')
      .createSignedUrl(path, 7200);

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Erro ao gerar URL assinada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, signedUrl: data.signedUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
