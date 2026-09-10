import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGiftPageById } from '@/lib/supabase/admin-queries';
import { mapContentToGiftExperience } from '@/lib/supabase/gift-queries';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { PreviewClientEmbed } from './PreviewClientEmbed';

interface PreviewPageProps {
  params: { id: string };
  searchParams?: { embed?: string };
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { giftPage } = await getGiftPageById(params.id);
  if (!giftPage) return { title: 'Prévia não encontrada' };
  return {
    title: `Prévia: ${giftPage.title} | Feito de Nós`,
  };
}

export default async function GiftPagePreviewPage({ params, searchParams }: PreviewPageProps) {
  const { giftPage } = await getGiftPageById(params.id);

  if (!giftPage) {
    notFound();
  }

  const giftExperience = mapContentToGiftExperience(
    giftPage.content as GiftContentData,
    giftPage.theme as GiftThemeData
  );

  const isEmbed = searchParams?.embed === '1' || searchParams?.embed === 'true';

  return (
    <PreviewClientEmbed
      initialGift={giftExperience}
      isEmbed={isEmbed}
      title={giftPage.title}
      pageId={giftPage.id}
    />
  );
}
