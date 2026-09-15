import type { Metadata } from 'next';
import { HomeNavbar } from '@/components/home/HomeNavbar';
import { HomeFooter } from '@/components/home/HomeFooter';
import { InvitationHero } from '@/components/invitations/landing/InvitationHero';
import { InvitationWhatIs } from '@/components/invitations/landing/InvitationWhatIs';
import { InvitationFeatures } from '@/components/invitations/landing/InvitationFeatures';
import { InvitationEventTypes } from '@/components/invitations/landing/InvitationEventTypes';
import { InvitationPricingSection } from '@/components/invitations/landing/InvitationPricingSection';
import { InvitationHowItWorks } from '@/components/invitations/landing/InvitationHowItWorks';
import { InvitationFAQ } from '@/components/invitations/landing/InvitationFAQ';

export const metadata: Metadata = {
  title: 'Convites Feito de Nós | Convites Digitais Interativos & Elegantes',
  description:
    'Momentos especiais começam com um convite inesquecível. Convites digitais interativos com confirmação de presença (RSVP), Waze/Google Maps, lista de presentes/Pix e contagem regressiva.',
  keywords: [
    'convite digital',
    'convite interativo',
    'convite infantil',
    'convite de casamento',
    'rsvp online',
    'confirmacao de presenca',
    'convite com mapa',
    'feito de nós',
  ],
  openGraph: {
    title: 'Convites Feito de Nós | Convites Digitais Interativos & Elegantes',
    description:
      'Momentos especiais começam com um convite inesquecível. Convites com RSVP, rotas no Waze/Maps, lista de presentes e fotos afetivas.',
    url: 'https://feitos-de-nos.vercel.app/convites',
    siteName: 'Feito de Nós',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ConvitesLandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#302B2D] font-sans selection:bg-[#D9A4A0]/40 selection:text-[#713C48] flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        <InvitationHero />
        <InvitationWhatIs />
        <InvitationFeatures />
        <InvitationEventTypes />
        <InvitationPricingSection />
        <InvitationHowItWorks />
        <InvitationFAQ />
      </main>
      <HomeFooter />
    </div>
  );
}
