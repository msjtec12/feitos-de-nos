import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { GuestsManagementClient } from '@/components/admin/invitations/GuestsManagementClient';
import { MATHEUS_INVITATION_DEMO, MATHEUS_DEMO_GUESTS } from '@/data/matheus-invitation-demo';
import { EventGuestRow, EventRow } from '@/types/invitation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Convidados & RSVP | Feito de Nós Admin',
};

interface ConvidadosPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminConvidadosPage({ params }: ConvidadosPageProps) {
  const { profile } = await getAdminSessionAndProfile();

  if (!profile) {
    redirect('/admin/login');
  }

  const { id } = await params;

  // Support for demo event
  if (id === MATHEUS_INVITATION_DEMO.id || id === MATHEUS_INVITATION_DEMO.slug) {
    return (
      <GuestsManagementClient
        event={MATHEUS_INVITATION_DEMO}
        initialGuests={MATHEUS_DEMO_GUESTS}
      />
    );
  }

  const adminClient = createSupabaseAdminClient();

  const { data: event, error: eventError } = await adminClient
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (eventError || !event) {
    notFound();
  }

  const { data: guests } = await adminClient
    .from('event_guests')
    .select('*')
    .eq('event_id', event.id)
    .order('name', { ascending: true });

  return (
    <GuestsManagementClient
      event={event as EventRow}
      initialGuests={(guests || []) as EventGuestRow[]}
    />
  );
}
