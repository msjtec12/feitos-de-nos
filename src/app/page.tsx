import type { Metadata } from 'next';
import { HomeNavbar } from '@/components/home/HomeNavbar';
import { HomeHero } from '@/components/home/HomeHero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { GiftOptionsSection } from '@/components/home/GiftOptionsSection';
import { DifferentiatorsSection } from '@/components/home/DifferentiatorsSection';
import { HomeDemoSection } from '@/components/home/HomeDemoSection';
import { FAQSection } from '@/components/home/FAQSection';
import { HomeFooter } from '@/components/home/HomeFooter';

export const metadata: Metadata = {
  title: 'Feito de Nós | Histórias que viram presente',
  description:
    'Presentes afetivos interativos criados com fotos, mensagens e vozes reais de quem você ama. Para tocar, ouvir e guardar para sempre.',
  keywords: [
    'presente afetivo',
    'presente interativo',
    'álbum de fotos e áudio',
    'meu primeiro ano',
    'presente com qr code',
    'feito de nós',
    'cartão que fala',
  ],
  openGraph: {
    title: 'Feito de Nós | Histórias que viram presente',
    description:
      'Presentes afetivos interativos criados com fotos, mensagens e vozes reais de quem você ama.',
    url: 'https://feitos-de-nos.vercel.app',
    siteName: 'Feito de Nós',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#302B2D] font-sans selection:bg-[#D9A4A0]/40 selection:text-[#713C48] flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        <HomeHero />
        <HowItWorks />
        <CollectionsSection />
        <GiftOptionsSection />
        <DifferentiatorsSection />
        <HomeDemoSection />
        <FAQSection />
      </main>
      <HomeFooter />
    </div>
  );
}
