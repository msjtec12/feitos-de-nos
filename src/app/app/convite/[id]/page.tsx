import { notFound } from 'next/navigation';
import { getHostEventByParam } from '@/lib/invitations/host-queries';
import { InvitationEditorClientView } from '@/components/admin/invitations/InvitationEditorClientView';

export const dynamic = 'force-dynamic';

interface HostAppEditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function HostAppEditorPage({ params }: HostAppEditorPageProps) {
  const { id } = await params;
  const { event } = await getHostEventByParam(id);

  if (!event) {
    notFound();
  }

  return (
    <InvitationEditorClientView
      event={event}
      apiBasePath="/api/app/events"
      portalMode="app"
      backHref={`/app/convite/${id}`}
      guestsHref={`/app/convite/${id}/convidados`}
      checkInHref={`/app/convite/${id}/check-in`}
    />
  );
}
