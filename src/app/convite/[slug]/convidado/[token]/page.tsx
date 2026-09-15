import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getEventGuestByToken,
  getApprovedGuestbookMessages,
} from '@/lib/supabase/invitation-queries';
import { InvitationPublicClientView } from '@/components/invitations/public/InvitationPublicClientView';

interface GuestInvitationPageProps {
  params: Promise<{ slug: string; token: string }>;
}

export async function generateMetadata({
  params,
}: GuestInvitationPageProps): Promise<Metadata> {
  const { slug, token } = await params;
  const result = await getEventGuestByToken(slug, token);

  if (!result) {
    return {
      title: 'Convite Não Encontrado | Feito de Nós',
      robots: { index: false, follow: false },
    };
  }

  const { event, guest } = result;
  const title = `Convite Especial para ${guest.name} • ${event.title}`;
  const description = `Olá, ${guest.name}! Você recebeu um convite de honra para celebrar ${event.title}.`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      siteName: 'Feito de Nós - Convites Interativos',
      images: event.cover_url ? [{ url: event.cover_url }] : [],
    },
  };
}

export default async function GuestInvitationPage({
  params,
}: GuestInvitationPageProps) {
  const { slug, token } = await params;
  const result = await getEventGuestByToken(slug, token);

  if (!result) {
    notFound();
  }

  const { event, guest } = result;
  const guestbookMessages = await getApprovedGuestbookMessages(event.id);

  return (
    <InvitationPublicClientView
      event={event}
      guest={guest}
      guestbookMessages={guestbookMessages}
      initialEnvelopeOpened={false}
    />
  );
}
