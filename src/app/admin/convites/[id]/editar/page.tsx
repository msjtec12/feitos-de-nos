import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { InvitationEditorClientView } from '@/components/admin/invitations/InvitationEditorClientView';
import { MATHEUS_INVITATION_DEMO } from '@/data/matheus-invitation-demo';
import { EventDetailWithMedia } from '@/types/invitation';

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

  // Support for demo event
  if (id === MATHEUS_INVITATION_DEMO.id || id === MATHEUS_INVITATION_DEMO.slug) {
    return <InvitationEditorClientView event={MATHEUS_INVITATION_DEMO} />;
  }

  const adminClient = createSupabaseAdminClient();

  const { data: event, error } = await adminClient
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  // Media
  const { data: media } = await adminClient
    .from('event_media')
    .select('*')
    .eq('event_id', event.id)
    .order('sort_order', { ascending: true });

  const eventWithMedia: EventDetailWithMedia = {
    ...event,
    media: media || [],
  };

  return <InvitationEditorClientView event={eventWithMedia} />;
}
