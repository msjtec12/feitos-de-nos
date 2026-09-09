import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGiftBySlug } from "@/lib/supabase/queries";
import { QRCodeCard } from "@/components/qr/QRCodeCard";

interface CartaoPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CartaoPageProps): Promise<Metadata> {
  const { slug } = params;
  const gift = await getGiftBySlug(slug);

  return {
    title: `Cartão de Presente & QR Code — ${gift?.recipient.name || "Feito de Nós"}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CartaoPage({ params }: CartaoPageProps) {
  const { slug } = params;
  const gift = await getGiftBySlug(slug);

  if (!gift) {
    notFound();
  }

  return (
    <QRCodeCard
      slug={slug}
      recipientName={gift.recipient.name}
      tagline={gift.recipient.subtitle}
    />
  );
}
