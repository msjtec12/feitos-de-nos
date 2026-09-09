import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGiftPageById } from '@/lib/supabase/admin-queries';
import { mapContentToGiftExperience } from '@/lib/supabase/gift-queries';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { PresenteClientView } from '@/app/presente/[slug]/PresenteClientView';

interface PreviewPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { giftPage } = await getGiftPageById(params.id);
  if (!giftPage) return { title: 'Prévia não encontrada' };
  return {
    title: `Prévia: ${giftPage.title} | Feito de Nós`,
  };
}

export default async function GiftPagePreviewPage({ params }: PreviewPageProps) {
  const { giftPage, order } = await getGiftPageById(params.id);

  if (!giftPage) {
    notFound();
  }

  const giftExperience = mapContentToGiftExperience(
    giftPage.content as GiftContentData,
    giftPage.theme as GiftThemeData
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0] relative">
      {/* Floating Admin Banner */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#713C48] text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-4 text-xs font-medium border border-white/20 backdrop-blur-md">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Modo de Prévia Administrativa
        </span>
        <span className="text-white/40">|</span>
        <span className="text-white/80">{giftPage.title}</span>
        <span className="text-white/40">|</span>
        <Link
          href={`/admin/paginas/${giftPage.id}/editar`}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
        >
          ← Voltar para o Editor
        </Link>
      </div>

      {/* Render full gift experience */}
      <PresenteClientView gift={giftExperience} />
    </div>
  );
}
