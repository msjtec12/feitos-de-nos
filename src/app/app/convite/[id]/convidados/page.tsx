import { notFound } from 'next/navigation';
import { getHostEventByParam } from '@/lib/invitations/host-queries';
import { GuestsManagementClient } from '@/components/admin/invitations/GuestsManagementClient';

export const dynamic = 'force-dynamic';

interface HostAppConvidadosPageProps {
  params: Promise<{ id: string }>;
}

export default async function HostAppConvidadosPage({ params }: HostAppConvidadosPageProps) {
  const { id } = await params;
  const { event, guests } = await getHostEventByParam(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <GuestsManagementClient
        event={event}
        initialGuests={guests}
        apiBasePath="/api/app/events"
        backHref={`/app/convite/${id}`}
        checkInHref={`/app/convite/${id}/check-in`}
      />
    </div>
  );
}
