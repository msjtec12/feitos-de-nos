import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile, logActivity } from '@/lib/supabase/admin-queries';
import { ORDER_PRICES_CENTS } from '@/lib/validation/order-schema';
import { ProductType } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_whatsapp,
      customer_city,
      customer_state,
      customer_zipcode,
      customer_street,
      customer_number,
      customer_complement,
      customer_neighborhood,
      recipient_name,
      recipient_relationship,
      occasion_type,
      occasion_date,
      requested_title,
      main_phrase,
      collection_type,
      product_type,
      visual_style,
      requested_contents,
      freight_cents,
      status,
      payment_status,
      internal_notes,
      customer_notes,
    } = body;

    if (!customer_name || !customer_whatsapp || !recipient_name || !requested_title) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes (nome do cliente, whatsapp, presenteado, título)' },
        { status: 400 }
      );
    }

    const prodType = (product_type || 'digital') as ProductType;
    const priceCents = ORDER_PRICES_CENTS[prodType] || 5990;
    const freight = freight_cents || 0;
    const totalCents = priceCents + freight;

    // Gerar código do pedido
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `FN-${dateStr}-${randomSuffix}`;

    const adminClient = createSupabaseAdminClient();
    const { data: newOrder, error: insertError } = await adminClient
      .from('orders')
      .insert({
        code: orderCode,
        customer_name,
        customer_email: customer_email || `${orderCode.toLowerCase()}@feitodenos.com.br`,
        customer_whatsapp,
        customer_city: customer_city || 'Não informada',
        customer_state: customer_state || 'SP',
        customer_zipcode: customer_zipcode || null,
        customer_street: customer_street || null,
        customer_number: customer_number || null,
        customer_complement: customer_complement || null,
        customer_neighborhood: customer_neighborhood || null,
        recipient_name,
        recipient_relationship: recipient_relationship || 'Outro',
        occasion_type: occasion_type || 'presente',
        occasion_date: occasion_date || null,
        requested_title,
        main_phrase: main_phrase || null,
        collection_type: collection_type || 'primeiro-ano',
        product_type: prodType,
        visual_style: visual_style || 'afetuoso',
        requested_contents: requested_contents || ['fotos', 'mensagens'],
        price_cents: priceCents,
        freight_cents: freight,
        total_cents: totalCents,
        status: status || 'new',
        payment_status: payment_status || 'pending',
        internal_notes: internal_notes || 'Criado manualmente pelo painel administrativo',
        customer_notes: customer_notes || null,
        consent_at: new Date().toISOString(),
        privacy_policy_version: 'v1.0-manual',
        source: 'admin_manual',
      })
      .select('*')
      .single();

    if (insertError || !newOrder) {
      return NextResponse.json(
        { error: insertError?.message || 'Erro ao criar pedido manual' },
        { status: 400 }
      );
    }

    // Registrar histórico
    await adminClient.from('order_status_history').insert({
      order_id: newOrder.id,
      previous_status: null,
      new_status: newOrder.status,
      admin_id: user?.id || null,
      note: 'Pedido criado manualmente pelo administrador',
    });

    await logActivity(user?.id || null, 'order_created_manually', 'order', newOrder.id, {
      code: orderCode,
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro interno ao criar pedido' },
      { status: 500 }
    );
  }
}
