import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedGiftBySlug } from '@/lib/supabase/public-slug';
import { matheusAkiraGiftData } from '@/data/matheus-demo';
import { PresenteClientView } from './PresenteClientView';

interface PresentePageProps {
  params: {
    slug: string;
  };
}

async function loadPublicGift(slug: string) {
  const publishedGift = await getPublishedGiftBySlug(slug);
  if (publishedGift) return publishedGift;

  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  if (cleanSlug === 'matheus-akira' || cleanSlug === 'demo') {
    return matheusAkiraGiftData;
  }

  return null;
}

export async function generateMetadata({ params }: PresentePageProps): Promise<Metadata> {
  const gift = await loadPublicGift(params.slug);

  if (!gift) {
    return {
      title: 'Presente Afetivo | Feito de Nós',
      robots: { index: false, follow: false, noarchive: true },
    };
  }

  return {
    title: `${gift.recipient.name} — ${gift.recipient.subtitle} | Feito de Nós`,
    description: `${gift.recipient.introQuote}`,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nocache: true,
    },
  };
}

/**
 * Compatibilidade da rota antiga /presente/[slug].
 * Em produção, usa somente gift_pages publicadas e já reveladas.
 */
export default async function PresentePage({ params }: PresentePageProps) {
  const giftData = await loadPublicGift(params.slug);

  if (!giftData) {
    notFound();
  }

  return <PresenteClientView gift={giftData} />;
}
