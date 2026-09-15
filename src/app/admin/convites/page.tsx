import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { EventsListClient } from '@/components/admin/invitations/EventsListClient';
import { MATHEUS_INVITATION_DEMO } from '@/data/matheus-invitation-demo';
import { EventRow } from '@/types/invitation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Eventos & Convites | Feito de Nós Admin',
};

export default async function AdminConvitesPage() {
  const { profile } = await getAdminSessionAndProfile();

  if (!profile) {
    redirect('/admin/login');
  }

  const adminClient = createSupabaseAdminClient();

  const { data: dbEvents } = await adminClient
    .from('events')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  let events = (dbEvents || []) as EventRow[];

  // Always ensure demo event is in the list
  if (!events.some((e) => e.slug === MATHEUS_INVITATION_DEMO.slug)) {
    events = [MATHEUS_INVITATION_DEMO, ...events];
  }

  return <EventsListClient initialEvents={events} />;
}
