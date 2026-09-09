import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicGiftByToken, mapContentToGiftExperience } from '@/lib/supabase/gift-queries';
import DynamicGiftView from './DynamicGiftView';

interface PublicGiftPageProps {
  params: {
    publicToken: string;
  };
}

export async function generateMetadata({ params }: PublicGiftPageProps): Promise<Metadata> {
  const giftResult = await getPublicGiftByToken(params.publicToken);

  if (!giftResult || !giftResult.isPublished) {
    return {
      title: 'Presente Feito de Nós',
      description: 'Histórias que viram presente.',
    };
  }

  return {
    title: `${giftResult.title} | Feito de Nós`,
    description: `Um presente interativo criado especialmente para ${giftResult.recipientName}.`,
    openGraph: {
      title: `${giftResult.title} | Feito de Nós`,
      description: `Um presente interativo criado especialmente para ${giftResult.recipientName}.`,
      type: 'website',
    },
  };
}

export default async function PublicTokenGiftPage({ params }: PublicGiftPageProps) {
  const giftResult = await getPublicGiftByToken(params.publicToken);

  if (!giftResult || !giftResult.isPublished || !giftResult.content) {
    notFound();
  }

  const giftExperience = mapContentToGiftExperience(
    giftResult.content,
    giftResult.theme
  );

  return (
    <DynamicGiftView
      giftExperience={giftExperience}
      revealAt={giftResult.revealAt}
      recipientName={giftResult.recipientName}
    />
  );
}
