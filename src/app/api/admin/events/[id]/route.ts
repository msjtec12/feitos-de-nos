import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import {
  MATHEUS_INVITATION_DEMO,
  MATHEUS_DEMO_SLUG,
  MATHEUS_OFFICIAL_UUID,
  MATHEUS_DEMO_LEGACY_ID,
} from '@/data/matheus-invitation-demo';
import { getInvitationTheme, mergeInvitationThemeConfig } from '@/data/invitation-themes';
import { EventRow } from '@/types/invitation';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    const adminClient = createSupabaseAdminClient();

    const isUUID = UUID_REGEX.test(id);
    const isMatheusDemo =
      id === MATHEUS_OFFICIAL_UUID ||
      id === MATHEUS_DEMO_SLUG ||
      id === MATHEUS_DEMO_LEGACY_ID;

    let event: EventRow | null = null;

    if (isUUID) {
      const { data } = await adminClient
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      event = data as EventRow | null;
    } else {
      const { data } = await adminClient
        .from('events')
        .select('*')
        .eq('slug', id === MATHEUS_DEMO_LEGACY_ID ? MATHEUS_DEMO_SLUG : id)
        .maybeSingle();
      event = data as EventRow | null;
    }

    if (!event && isMatheusDemo) {
      return NextResponse.json({ event: MATHEUS_INVITATION_DEMO });
    }

    if (!event) {
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
    const body = await req.json();
    const adminClient = createSupabaseAdminClient();

    const isUUID = UUID_REGEX.test(id);
    const isMatheusDemo =
      id === MATHEUS_OFFICIAL_UUID ||
      id === MATHEUS_DEMO_SLUG ||
      id === MATHEUS_DEMO_LEGACY_ID ||
      body.slug === MATHEUS_DEMO_SLUG;

    // Resolver tema canônico com preset completo
    const canonicalThemeKey =
      body.theme_key ||
      body.theme_config?.theme_key ||
      body.theme_config?.themeId ||
      body.theme_config?.slug ||
      'infantil-monstrinhos-elementais';
    const themePreset = getInvitationTheme(canonicalThemeKey);

    const fullThemeConfig = mergeInvitationThemeConfig(themePreset, body.theme_config);

    const updateData: Record<string, any> = {
      title: body.title,
      slug: body.slug,
      theme_key: themePreset.id,
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
      theme_config: fullThemeConfig,
      rsvp_deadline: body.rsvp_deadline || null,
      status: body.status || 'published',
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    // Helper para tentar update ou upsert
    const runUpdate = async (dataToSave: Record<string, any>) => {
      if (isUUID) {
        return await adminClient
          .from('events')
          .update(dataToSave)
          .eq('id', id)
          .select('*')
          .maybeSingle();
      }

      // Se id não for UUID, tenta atualizar por slug
      const targetSlug = isMatheusDemo ? MATHEUS_DEMO_SLUG : id;
      const res = await adminClient
        .from('events')
        .update(dataToSave)
        .eq('slug', targetSlug)
        .select('*')
        .maybeSingle();

      if (res.data) return res;

      // Se não encontrou por slug e for o demo oficial, realiza UPSERT com UUID oficial
      if (isMatheusDemo) {
        return await adminClient
          .from('events')
          .upsert(
            {
              id: MATHEUS_OFFICIAL_UUID,
              ...dataToSave,
            },
            { onConflict: 'slug' }
          )
          .select('*')
          .single();
      }

      return res;
    };

    // 1ª tentativa: com theme_key top-level
    let result = await runUpdate(updateData);

    // Se o banco falhar por coluna theme_key inexistente na tabela, tenta novamente sem a coluna no nível raiz
    if (
      result.error &&
      (result.error.message?.includes('theme_key') ||
        result.error.details?.includes('theme_key'))
    ) {
      console.warn('Coluna theme_key ainda não existe no Postgres. Salvando theme_key dentro de theme_config...');
      const fallbackData = { ...updateData };
      delete fallbackData.theme_key;
      result = await runUpdate(fallbackData);
    }

    const updatedEvent = result.data;
    const updateError = result.error;

    if (updateError) {
      console.error('Error updating event:', updateError);
      let friendlyError = updateError.message;
      if (
        updateError.code === 'PGRST205' ||
        updateError.message?.includes('public.events') ||
        updateError.message?.includes('does not exist')
      ) {
        friendlyError =
          'A tabela "events" ainda não foi criada no Supabase. Execute o script SQL de migração no painel do Supabase para ativar a criação e edição de convites.';
      } else if (
        updateError.code === '23505' ||
        updateError.message?.includes('duplicate key') ||
        updateError.message?.includes('events_slug_key')
      ) {
        friendlyError = `O link/slug "${body.slug}" já está em uso por outro evento. Por favor, modifique o slug da URL.`;
      }
      return NextResponse.json({ error: friendlyError, details: updateError.message }, { status: 400 });
    }

    // Invalidação de cache no Next.js
    try {
      revalidatePath(`/convite/${body.slug}`);
      if (updatedEvent?.slug && updatedEvent.slug !== body.slug) {
        revalidatePath(`/convite/${updatedEvent.slug}`);
      }
      revalidatePath('/admin/convites');
      revalidatePath(`/admin/convites/${id}/editar`);
      if (updatedEvent?.id) {
        revalidatePath(`/admin/convites/${updatedEvent.id}/editar`);
      }
    } catch (e) {
      console.warn('Erro ao revalidar cache:', e);
    }

    return NextResponse.json({ event: updatedEvent || { ...updateData, id } });
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

    const isUUID = UUID_REGEX.test(id);
    let query = adminClient.from('events').update({ archived_at: new Date().toISOString() });

    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    try {
      revalidatePath('/admin/convites');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
