import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { publicInvitationOrderSchema } from '@/lib/validation/invitation-order-schema';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { INVITATION_PRICES_CENTS, getPlanConfig } from '@/data/invitation-plans';
import { getThemeById } from '@/data/invitation-themes';
import { ProductType } from '@/types/database';

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_REQUESTS = 5;

function generateInvitationCode(): string {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';

  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `CV-${yyyy}${mm}${dd}-${randomPart}`;
}

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function hashClientIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || 'feitodenos_default_salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

async function enforceRateLimit(req: NextRequest): Promise<boolean> {
  try {
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
      console.warn('Rate limit count check skipped due to error:', countError.message);
      return true;
    }

    if ((count || 0) >= RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    await adminClient.from('order_request_limits').insert({ ip_hash: ipHash });
    return true;
  } catch (err) {
    console.warn('Rate limit execution skipped:', err);
    return true;
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAllowed = await enforceRateLimit(req);
    if (!isAllowed) {
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
    const parseResult = publicInvitationOrderSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => e.message).join(', ');
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: false, error: 'Requisição inválida' }, { status: 400 });
    }

    const planConfig = getPlanConfig(data.plan);
    const themeDef = getThemeById(data.themeId);
    const priceCents = INVITATION_PRICES_CENTS[data.plan] || 9990;
    const code = generateInvitationCode();

    const productType: ProductType =
      data.plan === 'essencial'
        ? 'convite_essencial'
        : data.plan === 'completo'
        ? 'convite_completo'
        : 'convite_interativo';

    // Generate unique slug for the event
    const baseSlug = slugify(data.honoreeName || data.title) || 'meu-evento';
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const eventSlug = `${baseSlug}-${randomSuffix}`;

    // Retention expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + planConfig.retentionDays);

    const adminClient = createSupabaseAdminClient();

    const photoSummaryParts = [
      data.coverPhotoUrl ? `Foto de Capa: ${data.coverPhotoUrl}` : null,
      data.photoUrls && data.photoUrls.length > 0
        ? `Fotos Anexadas (${data.photoUrls.length}): ${data.photoUrls.join(' | ')}`
        : null,
      data.photoLinks ? `Links Nuvem/Drive: ${data.photoLinks}` : null,
    ].filter(Boolean);

    const notesSummary = [
      data.notes ? `Observações: ${data.notes}` : null,
      data.venueName ? `Local: ${data.venueName}` : null,
      `Endereço: ${data.address}`,
      data.eventTime ? `Horário: ${data.eventTime}` : null,
      data.dressCode ? `Traje: ${data.dressCode}` : null,
      data.giftInformation ? `Presentes/Pix: ${data.giftInformation}` : null,
      photoSummaryParts.length > 0 ? `\n--- MÍDIAS & FOTOS ---\n${photoSummaryParts.join('\n')}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const { data: newOrder, error: orderError } = await adminClient
      .from('orders')
      .insert({
        code,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_whatsapp: data.customerPhone,
        customer_city: data.customerCity,
        customer_state: data.customerState,
        recipient_name: data.honoreeName || data.title,
        recipient_relationship: `Anfitriões: ${data.hostNames}`,
        occasion_type: data.eventType,
        occasion_date: data.eventDate,
        requested_title: data.title,
        main_phrase: data.openingMessage || null,
        collection_type: data.eventType,
        product_type: productType,
        order_type: 'invitation',
        visual_style: data.themeId,
        requested_contents: ['convite', data.plan],
        price_cents: priceCents,
        freight_cents: 0,
        total_cents: priceCents,
        status: 'new',
        payment_status: 'pending',
        customer_notes: notesSummary,
        consent_at: new Date().toISOString(),
        privacy_policy_version: '1.0',
        source: 'landing_convites',
      })
      .select('id, code')
      .single();

    if (orderError || !newOrder) {
      console.error('Error inserting invitation order:', orderError);
      return NextResponse.json(
        { success: false, error: 'Erro ao registrar o pedido. Tente novamente.' },
        { status: 500 }
      );
    }

    // 2. Insert initial event record
    const eventDateTime = `${data.eventDate}T${data.eventTime ? data.eventTime.padStart(5, '0') : '16:00'}:00-03:00`;
    const coverUrl = data.coverPhotoUrl || (data.photoUrls && data.photoUrls.length > 0 ? data.photoUrls[0] : null);

    const { data: newEvent, error: eventError } = await adminClient
      .from('events')
      .insert({
        order_id: newOrder.id,
        title: data.title,
        slug: eventSlug,
        event_type: data.eventType,
        plan: data.plan,
        host_names: data.hostNames,
        honoree_name: data.honoreeName || null,
        opening_message: data.openingMessage || null,
        event_date: eventDateTime,
        timezone: 'America/Sao_Paulo',
        venue_name: data.venueName || null,
        address: data.address,
        dress_code: data.dressCode || null,
        gift_information: data.giftInformation || null,
        cover_url: coverUrl,
        theme_config: themeDef.config,
        status: 'awaiting_content',
        expires_at: expirationDate.toISOString(),
      })
      .select('id, slug')
      .single();

    if (!eventError && newEvent) {
      // Link event_id in order
      await adminClient
        .from('orders')
        .update({ event_id: newEvent.id })
        .eq('id', newOrder.id);

      // Insert media if provided
      if (data.photoUrls && data.photoUrls.length > 0) {
        const mediaInserts = data.photoUrls.map((url, idx) => ({
          event_id: newEvent.id,
          media_type: 'image' as const,
          url,
          caption: idx === 0 && data.coverPhotoUrl ? 'Foto de Capa' : `Foto ${idx + 1}`,
          sort_order: idx,
        }));
        const { error: mediaError } = await adminClient
          .from('event_media')
          .insert(mediaInserts);

        if (mediaError) {
          console.warn('Could not insert initial event_media rows:', mediaError.message);
        }
      }
    } else if (eventError) {
      console.warn('Preliminary event row creation deferred:', eventError.message);
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderCode: newOrder.code,
      eventSlug: newEvent?.slug || eventSlug,
      plan: data.plan,
      totalCents: priceCents,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    console.error('Unexpected error in invitation order handler:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
