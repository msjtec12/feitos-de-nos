import { createSupabaseAdminClient } from './server';
import {
  EventDetailWithMedia,
  EventGuestRow,
  EventRow,
  EventMediaRow,
  EventGuestbookMessageRow,
} from '@/types/invitation';
import {
  MATHEUS_DEMO_SLUG,
  MATHEUS_INVITATION_DEMO,
  MATHEUS_DEMO_GUESTS,
} from '@/data/matheus-invitation-demo';
import { getInvitationTheme, mergeInvitationThemeConfig } from '@/data/invitation-themes';

export async function getPublicEventBySlug(
  slug: string
): Promise<EventDetailWithMedia | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  try {
    const adminClient = createSupabaseAdminClient();

    const { data: eventData, error: eventError } = await adminClient
      .from('events')
      .select('*')
      .eq('slug', normalizedSlug)
      .is('archived_at', null)
      .maybeSingle();

    if (!eventError && eventData) {
      const event = eventData as EventRow;

      // Limpar mídias antigas órfãs que foram deletadas pelo usuário
      try {
        await adminClient
          .from('event_media')
          .delete()
          .eq('event_id', event.id)
          .or('caption.ilike.ChatGPT Image%,caption.ilike.display balcao%');
      } catch (cleanupErr) {
        console.warn('Erro ao limpar mídias antigas órfãs:', cleanupErr);
      }

      // Buscar mídias do evento
      const { data: mediaData } = await adminClient
        .from('event_media')
        .select('*')
        .eq('event_id', event.id)
        .order('sort_order', { ascending: true });

      // Buscar estatísticas de convidados
      const { data: guestsData } = await adminClient
        .from('event_guests')
        .select('attendance_status, companions_count')
        .eq('event_id', event.id);

      const guests = (guestsData || []) as {
        attendance_status: 'pending' | 'confirmed' | 'declined';
        companions_count: number;
      }[];

      const stats = {
        totalGuests: guests.length,
        confirmedGuests: guests.filter((g) => g.attendance_status === 'confirmed').length,
        declinedGuests: guests.filter((g) => g.attendance_status === 'declined').length,
        pendingGuests: guests.filter((g) => g.attendance_status === 'pending').length,
        confirmedCompanions: guests
          .filter((g) => g.attendance_status === 'confirmed')
          .reduce((sum, g) => sum + (g.companions_count || 0), 0),
      };

      // Resolver tema canônico com fallback de presets completos
      const rawThemeKey =
        event.theme_key ||
        event.theme_config?.theme_key ||
        event.theme_config?.themeId ||
        event.theme_config?.slug ||
        'infantil-monstrinhos-elementais';
      const themePreset = getInvitationTheme(rawThemeKey);
      const normalizedThemeConfig = mergeInvitationThemeConfig(themePreset, event.theme_config);

      return {
        ...event,
        theme_key: themePreset.id,
        theme_config: normalizedThemeConfig,
        media: (mediaData || []) as EventMediaRow[],
        stats,
      };
    }

    // Fallback gracioso para demonstração se ainda não houver registro no banco
    if (normalizedSlug === MATHEUS_DEMO_SLUG) {
      return MATHEUS_INVITATION_DEMO;
    }

    return null;
  } catch (err) {
    console.error('[getPublicEventBySlug] Error fetching event:', err);
    if (normalizedSlug === MATHEUS_DEMO_SLUG) {
      return MATHEUS_INVITATION_DEMO;
    }
    return null;
  }
}

export async function getEventGuestByToken(
  slug: string,
  token: string
): Promise<{ event: EventDetailWithMedia; guest: EventGuestRow } | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  const normalizedToken = token.trim();

  const event = await getPublicEventBySlug(normalizedSlug);
  if (!event) return null;

  try {
    const adminClient = createSupabaseAdminClient();
    const { data: guestData, error } = await adminClient
      .from('event_guests')
      .select('*')
      .eq('event_id', event.id)
      .eq('token', normalizedToken)
      .maybeSingle();

    if (error || !guestData) {
      if (normalizedSlug === MATHEUS_DEMO_SLUG) {
        const demoGuest = MATHEUS_DEMO_GUESTS.find(
          (g) => g.token.toLowerCase() === normalizedToken.toLowerCase()
        );
        if (demoGuest) {
          return { event, guest: { ...demoGuest, event_id: event.id } };
        }
      }
      return null;
    }

    return {
      event,
      guest: guestData as EventGuestRow,
    };
  } catch (err) {
    console.error('[getEventGuestByToken] Error fetching guest:', err);
    if (normalizedSlug === MATHEUS_DEMO_SLUG) {
      const demoGuest = MATHEUS_DEMO_GUESTS.find(
        (g) => g.token.toLowerCase() === normalizedToken.toLowerCase()
      );
      if (demoGuest) {
        return { event, guest: { ...demoGuest, event_id: event.id } };
      }
    }
    return null;
  }
}

export async function getApprovedGuestbookMessages(
  eventId: string
): Promise<EventGuestbookMessageRow[]> {
  try {
    const adminClient = createSupabaseAdminClient();
    const { data, error } = await adminClient
      .from('event_guestbook_messages')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as EventGuestbookMessageRow[];
  } catch (err) {
    console.error('[getApprovedGuestbookMessages] Error fetching messages:', err);
    return [];
  }
}
