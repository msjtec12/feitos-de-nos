import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { NewEventClientForm } from '@/components/admin/invitations/NewEventClientForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novo Convite | Feito de Nós Admin',
};

export default async function NovoConvitePage() {
  const { profile } = await getAdminSessionAndProfile();

  if (!profile) {
    redirect('/admin/login');
  }

  return <NewEventClientForm />;
}
