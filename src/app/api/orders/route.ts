import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { publicOrderSchema } from '@/lib/validation/order-schema';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { ProductType } from '@/types/database';

const SERVER_PRICES_CENTS: Record<string, number> = {
  digital: 5990,
  cartao: 9990,
  interativo: 19990,
  talking_card: 9990,
  interactive_gift: 19990,
};

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_REQUESTS = 5;

function generateOrderCode(): string {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';

  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `FN-${yyyy}${mm}${dd}-${randomPart}`;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function hashClientIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT;
  if (!salt) {
    throw new Error('RATE_LIMIT_SALT não configurado');
  }

  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

async function enforceRateLimit(req: NextRequest) {
  const adminClient = createSupabaseAdminClient();
  const ipHash = hashClientIp(getClientIp(req));
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { count, error: countError } = await adminClient
    .from('order_request_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart);

  if (countError) {
    throw countError;
  }

  if ((count || 0) >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  const { error: insertError } = await adminClient
    .from('order_request_limits')
    .insert({ ip_hash: ipHash });

  if (insertError) {
    throw insertError;
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    if (!(await enforceRateLimit(req))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_MINUTES * 60) },
        }
      );
    }

    const body = await req.json();
    const parseResult = publicOrderSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => e.message).join(', ');
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: false, error: 'Requisição inválida' }, { status: 400 });
    }

    let productType: ProductType = 'digital';
    if (data.format === 'cartao') productType = 'talking_card';
    if (data.format === 'interativo') productType = 'interactive_gift';

    const priceCents = SERVER_PRICES_CENTS[data.format] || 5990;
    const freightCents = 0;
    const totalCents = priceCents + freightCents;
    const code = generateOrderCode();
    const adminClient = createSupabaseAdminClient();

    const contents: string[] = [];
    if (data.contentTypes.photos) contents.push('photos');
    if (data.contentTypes.messages) contents.push('messages');
    if (data.contentTypes.audios) contents.push('audios');
    if (data.contentTypes.video) contents.push('video');
    if (data.contentTypes.music) contents.push('music');
    if (data.contentTypes.contributors) contents.push('contributors');

    const { data: newOrder, error: insertError } = await adminClient
      .from('orders')
      .insert({
        code,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_whatsapp: data.customerPhone,
        customer_city: data.customerCity,
        customer_state: data.customerState,
        customer_zipcode: data.customerCep || null,
        customer_street: data.customerStreet || null,
        customer_number: data.customerNumber || null,
        customer_complement: data.customerComplement || null,
        customer_neighborhood: data.customerNeighborhood || null,
        recipient_name: data.recipientName,
        recipient_relationship: data.recipientRelationship,
        occasion_type: data.occasion,
        occasion_date: data.recipientDate || null,
        requested_title: data.giftTitle,
        main_phrase: data.openingMessage || null,
        collection_type: data.occasion,
        product_type: productType,
        visual_style: data.style,
        requested_contents: contents,
        price_cents: priceCents,
        freight_cents: freightCents,
        total_cents: totalCents,
        status: 'new',
        payment_status: 'pending',
        customer_notes: data.notes || null,
        consent_at: new Date().toISOString(),
        privacy_policy_version: '1.0',
        source: 'website',
      })
      .select('*')
      .single();

    if (insertError || !newOrder) {
      console.error('Erro ao inserir pedido no Supabase:', insertError);
      return NextResponse.json(
        { success: false, error: 'Erro ao registrar pedido no servidor. Tente novamente.' },
        { status: 500 }
      );
    }

    await adminClient.from('order_status_history').insert({
      order_id: newOrder.id,
      previous_status: null,
      new_status: 'new',
      note: 'Pedido registrado via formulário público do site.',
    });

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        code: newOrder.code,
        priceCents: newOrder.price_cents,
        totalCents: newOrder.total_cents,
        formattedTotal: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(newOrder.total_cents / 100),
      },
    });
  } catch (err) {
    console.error('Erro interno na rota /api/orders:', err);
    return NextResponse.json(
      { success: false, error: 'Erro inesperado ao processar o pedido.' },
      { status: 500 }
    );
  }
}
