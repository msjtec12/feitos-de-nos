import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { MATHEUS_INVITATION_DEMO, MATHEUS_DEMO_GUESTS } from '@/data/matheus-invitation-demo';
import { INVITATION_AUTHORIAL_THEMES } from '@/data/invitation-themes';
import { ThemesComparisonClient } from '@/components/admin/invitations/ThemesComparisonClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Comparador dos 13 Temas Autorais | Feito de Nós Admin',
  description:
    'Visualização comparativa de todos os 13 temas autorais de convite digital aplicados sobre o mesmo evento de demonstração.',
};

export default async function CompararTemasPage() {
  const { profile } = await getAdminSessionAndProfile();

  if (!profile) {
    redirect('/admin/login');
  }

  return (
    <ThemesComparisonClient
      baseEvent={MATHEUS_INVITATION_DEMO}
      demoGuests={MATHEUS_DEMO_GUESTS}
      themes={INVITATION_AUTHORIAL_THEMES}
    />
  );
}
