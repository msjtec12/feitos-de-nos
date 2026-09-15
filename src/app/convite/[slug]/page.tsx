import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getPublicEventBySlug,
  getApprovedGuestbookMessages,
} from '@/lib/supabase/invitation-queries';
import { InvitationPublicClientView } from '@/components/invitations/public/InvitationPublicClientView';

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) {
    return {
      title: 'Convite Não Encontrado | Feito de Nós',
      robots: { index: false, follow: false },
    };
  }

  const title = `${event.honoree_name ? `${event.honoree_name} | ` : ''}${event.title} • Convite Feito de Nós`;
  const description =
    event.headline ||
    event.opening_message ||
    `Você é nosso convidado de honra para comemorar ${event.title}. Confira horário, local e confirme sua presença!`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://feitos-de-nos.vercel.app';
  const ogUrl = `${siteUrl}/convite/${event.slug}`;
  const ogImages = event.cover_url ? [{ url: event.cover_url, width: 1200, height: 630, alt: event.title }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: ogUrl,
      siteName: 'Feito de Nós - Convites Interativos',
      images: ogImages,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: event.cover_url ? [event.cover_url] : [],
    },
  };
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const guestbookMessages = await getApprovedGuestbookMessages(event.id);

  return (
    <InvitationPublicClientView
      event={event}
      guestbookMessages={guestbookMessages}
      initialEnvelopeOpened={false}
    />
  );
}
