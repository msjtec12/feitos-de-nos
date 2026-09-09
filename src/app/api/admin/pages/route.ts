import { NextRequest, NextResponse } from 'next/server';
import { createManualGiftPage, getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';

export async function POST(request: NextRequest) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { title, recipient_name, template_type, order_id } = body;

    if (!title || !recipient_name) {
      return NextResponse.json(
        { error: 'Título e nome do presenteado são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await createManualGiftPage(
      {
        title,
        recipient_name,
        template_type: template_type || 'primeiro-ano',
        order_id: order_id || null,
      },
      user?.id
    );

    if (!result.success || !result.giftPage) {
      return NextResponse.json({ error: result.error || 'Erro ao criar página' }, { status: 400 });
    }

    return NextResponse.json({ success: true, giftPage: result.giftPage });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro interno ao criar página de presente' },
      { status: 500 }
    );
  }
}
