import { NextRequest, NextResponse } from 'next/server';
import { createGiftPageFromOrder, getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;
    const result = await createGiftPageFromOrder(id, user?.id);

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
