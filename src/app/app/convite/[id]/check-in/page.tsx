import { notFound } from 'next/navigation';
import { getHostEventByParam } from '@/lib/invitations/host-queries';
import { CheckInScannerClient } from '@/components/admin/invitations/CheckInScannerClient';

export const dynamic = 'force-dynamic';

interface HostAppCheckInPageProps {
  params: Promise<{ id: string }>;
}

export default async function HostAppCheckInPage({ params }: HostAppCheckInPageProps) {
  const { id } = await params;
  const { event, guests } = await getHostEventByParam(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <CheckInScannerClient
        event={event}
        initialGuests={guests}
        apiBasePath="/api/app/events"
        backHref={`/app/convite/${id}/convidados`}
      />
    </div>
  );
}
