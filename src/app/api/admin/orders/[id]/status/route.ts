import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { OrderStatus } from '@/types/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, note } = body as { status: OrderStatus; note?: string };

    if (!status) {
      return NextResponse.json({ error: 'Status é obrigatório' }, { status: 400 });
    }

    const result = await updateOrderStatus(id, status, user?.id, note);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro interno ao atualizar status' },
      { status: 500 }
    );
  }
}
