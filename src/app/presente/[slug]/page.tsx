import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGiftBySlug } from "@/lib/supabase/queries";
import { PresenteClientView } from "./PresenteClientView";

interface PresentePageProps {
  params: {
    slug: string;
  };
}

/**
 * Geração de metadados dinâmicos e privados a partir do Supabase.
 */
export async function generateMetadata({
  params,
}: PresentePageProps): Promise<Metadata> {
  const { slug } = params;
  const gift = await getGiftBySlug(slug);

  if (!gift) {
    return {
      title: "Presente Afetivo | Feito de Nós",
      robots: {
        index: false,
        follow: false,
      },
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
 * Server Component principal da rota /presente/[slug] integrado com Supabase.
 */
export default async function PresentePage({ params }: PresentePageProps) {
  const { slug } = params;
  const giftData = await getGiftBySlug(slug);

  if (!giftData) {
    notFound();
  }

  return <PresenteClientView gift={giftData} />;
}
