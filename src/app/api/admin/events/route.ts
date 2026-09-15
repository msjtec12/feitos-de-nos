import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { MATHEUS_INVITATION_DEMO } from '@/data/matheus-invitation-demo';
import { getThemeById } from '@/data/invitation-themes';
import { getPlanConfig } from '@/data/invitation-plans';

export async function GET(req: NextRequest) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const adminClient = createSupabaseAdminClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    const search = searchParams.get('search')?.trim().toLowerCase();

    let query = adminClient
      .from('events')
      .select('*')
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (plan && plan !== 'all') {
      query = query.eq('plan', plan);
    }

    const { data: dbEvents, error } = await query;
    if (error) {
      console.error('Error fetching admin events:', error);
      return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
    }

    let events = dbEvents || [];

    // Filter by search term if provided
    if (search) {
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          e.slug.toLowerCase().includes(search) ||
          e.host_names.toLowerCase().includes(search) ||
          (e.honoree_name && e.honoree_name.toLowerCase().includes(search))
      );
    }

    // Always ensure the Matheus Akira demo event is visible in the admin list for testing
    const hasDemo = events.some((e) => e.slug === MATHEUS_INVITATION_DEMO.slug);
    if (!hasDemo && (!status || status === 'all' || status === 'published')) {
      events = [MATHEUS_INVITATION_DEMO, ...events];
    }

    return NextResponse.json({ events });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      event_type,
      plan = 'interativo',
      host_names,
      honoree_name,
      event_date,
      venue_name,
      address,
      theme_id = 'infantil-delicado',
      opening_message,
      dress_code,
      gift_information,
      status = 'draft',
    } = body;

    if (!title || !slug || !host_names || !event_date) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes (título, slug, anfitriões, data).' },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();
    const themeDef = getThemeById(theme_id);
    const planConfig = getPlanConfig(plan);

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + planConfig.retentionDays);

    const { data: newEvent, error } = await adminClient
      .from('events')
      .insert({
        title,
        slug: slug.trim().toLowerCase(),
        event_type,
        plan,
        host_names,
        honoree_name: honoree_name || null,
        event_date,
        timezone: 'America/Sao_Paulo',
        venue_name: venue_name || null,
        address: address || null,
        theme_config: themeDef.config,
        opening_message: opening_message || null,
        dress_code: dress_code || null,
        gift_information: gift_information || null,
        status,
        expires_at: expirationDate.toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error inserting event:', error);
      let friendlyError = error.message;
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('public.events') ||
        error.message?.includes('does not exist')
      ) {
        friendlyError =
          'A tabela "events" ainda não foi criada no Supabase. Execute o script SQL de migração no painel do Supabase para ativar a criação e edição de convites.';
      } else if (
        error.code === '23505' ||
        error.message?.includes('duplicate key') ||
        error.message?.includes('events_slug_key')
      ) {
        friendlyError = `O link/slug "${slug}" já está em uso por outro evento. Por favor, modifique o slug da URL.`;
      }
      return NextResponse.json({ error: friendlyError, details: error.message }, { status: 400 });
    }

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
