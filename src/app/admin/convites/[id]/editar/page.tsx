import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { InvitationEditorClientView } from '@/components/admin/invitations/InvitationEditorClientView';
import {
  MATHEUS_INVITATION_DEMO,
  MATHEUS_DEMO_SLUG,
  MATHEUS_OFFICIAL_UUID,
  MATHEUS_DEMO_LEGACY_ID,
} from '@/data/matheus-invitation-demo';
import { getInvitationTheme, mergeInvitationThemeConfig } from '@/data/invitation-themes';
import { EventDetailWithMedia, EventRow, EventMediaRow } from '@/types/invitation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editar Convite | Feito de Nós Admin',
};

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditarConvitePage({ params }: EditorPageProps) {
  const { profile } = await getAdminSessionAndProfile();

  if (!profile) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const adminClient = createSupabaseAdminClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const isMatheusDemo =
    id === MATHEUS_OFFICIAL_UUID ||
    id === MATHEUS_DEMO_SLUG ||
    id === MATHEUS_DEMO_LEGACY_ID;

  let dbEvent: EventRow | null = null;

  if (isUUID) {
    const { data } = await adminClient
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    dbEvent = data as EventRow | null;
  } else {
    // Busca por slug
    const { data } = await adminClient
      .from('events')
      .select('*')
      .eq('slug', id === MATHEUS_DEMO_LEGACY_ID ? MATHEUS_DEMO_SLUG : id)
      .maybeSingle();
    dbEvent = data as EventRow | null;
  }

  // Se não foi encontrado no banco e for o evento de demonstração oficial, tenta criar ou carrega fallback
  if (!dbEvent && isMatheusDemo) {
    try {
      const { data: seededEvent, error: seedError } = await adminClient
        .from('events')
        .upsert(
          {
            id: MATHEUS_OFFICIAL_UUID,
            title: MATHEUS_INVITATION_DEMO.title,
            slug: MATHEUS_DEMO_SLUG,
            theme_key: MATHEUS_INVITATION_DEMO.theme_key,
            event_type: MATHEUS_INVITATION_DEMO.event_type,
            plan: MATHEUS_INVITATION_DEMO.plan,
            host_names: MATHEUS_INVITATION_DEMO.host_names,
            honoree_name: MATHEUS_INVITATION_DEMO.honoree_name,
            headline: MATHEUS_INVITATION_DEMO.headline,
            opening_message: MATHEUS_INVITATION_DEMO.opening_message,
            event_date: MATHEUS_INVITATION_DEMO.event_date,
            timezone: MATHEUS_INVITATION_DEMO.timezone,
            venue_name: MATHEUS_INVITATION_DEMO.venue_name,
            address: MATHEUS_INVITATION_DEMO.address,
            maps_url: MATHEUS_INVITATION_DEMO.maps_url,
            dress_code: MATHEUS_INVITATION_DEMO.dress_code,
            gift_information: MATHEUS_INVITATION_DEMO.gift_information,
            cover_url: MATHEUS_INVITATION_DEMO.cover_url,
            theme_config: MATHEUS_INVITATION_DEMO.theme_config,
            rsvp_deadline: MATHEUS_INVITATION_DEMO.rsvp_deadline,
            status: MATHEUS_INVITATION_DEMO.status,
            published_at: MATHEUS_INVITATION_DEMO.published_at,
          },
          { onConflict: 'slug' }
        )
        .select('*')
        .single();

      if (!seedError && seededEvent) {
        dbEvent = seededEvent as EventRow;
      }
    } catch (e) {
      console.warn('Não foi possível semear evento demo no Supabase:', e);
    }

    if (!dbEvent) {
      return <InvitationEditorClientView event={MATHEUS_INVITATION_DEMO} />;
    }
  }

  if (!dbEvent) {
    notFound();
  }

  // Buscar mídias vinculadas
  const { data: media } = await adminClient
    .from('event_media')
    .select('*')
    .eq('event_id', dbEvent.id)
    .order('sort_order', { ascending: true });

  const rawThemeKey =
    dbEvent.theme_key ||
    dbEvent.theme_config?.theme_key ||
    dbEvent.theme_config?.themeId ||
    dbEvent.theme_config?.slug ||
    'infantil-monstrinhos-elementais';
  const themePreset = getInvitationTheme(rawThemeKey);
  const normalizedThemeConfig = mergeInvitationThemeConfig(themePreset, dbEvent.theme_config);

  const eventWithMedia: EventDetailWithMedia = {
    ...dbEvent,
    theme_key: themePreset.id,
    theme_config: normalizedThemeConfig,
    media: (media || []) as EventMediaRow[],
  };

  return <InvitationEditorClientView event={eventWithMedia} />;
}
