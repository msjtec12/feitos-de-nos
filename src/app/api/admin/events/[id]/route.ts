import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { MATHEUS_INVITATION_DEMO } from '@/data/matheus-invitation-demo';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Check if demo event requested
    if (id === MATHEUS_INVITATION_DEMO.id || id === MATHEUS_INVITATION_DEMO.slug) {
      return NextResponse.json({ event: MATHEUS_INVITATION_DEMO });
    }

    const adminClient = createSupabaseAdminClient();

    const { data: event, error } = await adminClient
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    // Media
    const { data: media } = await adminClient
      .from('event_media')
      .select('*')
      .eq('event_id', event.id)
      .order('sort_order', { ascending: true });

    // Guests
    const { data: guests } = await adminClient
      .from('event_guests')
      .select('*')
      .eq('event_id', event.id)
      .order('name', { ascending: true });

    return NextResponse.json({
      event: {
        ...event,
        media: media || [],
        guests: guests || [],
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    if (id === MATHEUS_INVITATION_DEMO.id) {
      return NextResponse.json({
        success: true,
        message: 'Evento demo atualizado em memória com sucesso.',
      });
    }

    const body = await req.json();
    const adminClient = createSupabaseAdminClient();

    const updateData = {
      title: body.title,
      slug: body.slug,
      event_type: body.event_type,
      plan: body.plan,
      host_names: body.host_names,
      honoree_name: body.honoree_name || null,
      headline: body.headline || null,
      opening_message: body.opening_message || null,
      event_date: body.event_date,
      venue_name: body.venue_name || null,
      address: body.address || null,
      maps_url: body.maps_url || null,
      dress_code: body.dress_code || null,
      gift_information: body.gift_information || null,
      cover_url: body.cover_url || null,
      theme_config: body.theme_config,
      rsvp_deadline: body.rsvp_deadline || null,
      status: body.status,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedEvent, error } = await adminClient
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating event:', error);
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
        friendlyError = `O link/slug "${body.slug}" já está em uso por outro evento. Por favor, modifique o slug da URL.`;
      }
      return NextResponse.json({ error: friendlyError, details: error.message }, { status: 400 });
    }

    return NextResponse.json({ event: updatedEvent });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const adminClient = createSupabaseAdminClient();

    const { error } = await adminClient
      .from('events')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
