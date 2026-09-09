import { NextRequest, NextResponse } from 'next/server';
import { updateOrderPayment, getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { PaymentStatus } from '@/types/database';

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
    const { payment_status, freight_cents, internal_notes } = body as {
      payment_status: PaymentStatus;
      freight_cents?: number;
      internal_notes?: string;
    };

    if (!payment_status) {
      return NextResponse.json({ error: 'Status de pagamento é obrigatório' }, { status: 400 });
    }

    const result = await updateOrderPayment(
      id,
      payment_status,
      freight_cents,
      internal_notes,
      user?.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro interno ao atualizar pagamento' },
      { status: 500 }
    );
  }
}
