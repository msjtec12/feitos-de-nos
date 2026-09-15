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

export async function getPublicEventBySlug(
  slug: string
): Promise<EventDetailWithMedia | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  // Se for o slug de demonstração oficial
  if (normalizedSlug === MATHEUS_DEMO_SLUG) {
    return MATHEUS_INVITATION_DEMO;
  }

  try {
    const adminClient = createSupabaseAdminClient();

    const { data: eventData, error: eventError } = await adminClient
      .from('events')
      .select('*')
      .eq('slug', normalizedSlug)
      .is('archived_at', null)
      .maybeSingle();

    if (eventError || !eventData) {
      return null;
    }

    const event = eventData as EventRow;

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

    return {
      ...event,
      media: (mediaData || []) as EventMediaRow[],
      stats,
    };
  } catch (err) {
    console.error('[getPublicEventBySlug] Error fetching event:', err);
    return null;
  }
}

export async function getEventGuestByToken(
  slug: string,
  token: string
): Promise<{ event: EventDetailWithMedia; guest: EventGuestRow } | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  const normalizedToken = token.trim();

  // Suporte a demonstração
  if (normalizedSlug === MATHEUS_DEMO_SLUG) {
    const demoGuest = MATHEUS_DEMO_GUESTS.find(
      (g) => g.token.toLowerCase() === normalizedToken.toLowerCase()
    );
    if (demoGuest) {
      return { event: MATHEUS_INVITATION_DEMO, guest: demoGuest };
    }
  }

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

    if (error || !guestData) return null;

    return {
      event,
      guest: guestData as EventGuestRow,
    };
  } catch (err) {
    console.error('[getEventGuestByToken] Error fetching guest:', err);
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
