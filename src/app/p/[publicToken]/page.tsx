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
      robots: { index: false, follow: false },
    };
  }

  return {
    title: giftResult.isRevealed
      ? `${giftResult.title} | Feito de Nós`
      : 'Uma surpresa está esperando por você | Feito de Nós',
    description: giftResult.isRevealed
      ? `Um presente interativo criado especialmente para ${giftResult.recipientName}.`
      : 'Uma experiência especial será revelada em breve.',
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    openGraph: {
      title: giftResult.isRevealed
        ? `${giftResult.title} | Feito de Nós`
        : 'Uma surpresa está esperando por você | Feito de Nós',
      description: giftResult.isRevealed
        ? `Um presente interativo criado especialmente para ${giftResult.recipientName}.`
        : 'Uma experiência especial será revelada em breve.',
      type: 'website',
    },
  };
}

export default async function PublicTokenGiftPage({ params }: PublicGiftPageProps) {
  const giftResult = await getPublicGiftByToken(params.publicToken);

  if (!giftResult || !giftResult.isPublished) {
    notFound();
  }

  // Antes da data de revelação, nenhum conteúdo sensível é serializado para o navegador.
  if (!giftResult.isRevealed) {
    return (
      <DynamicGiftView
        revealAt={giftResult.revealAt}
        recipientName={giftResult.recipientName}
      />
    );
  }

  if (!giftResult.content) {
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
