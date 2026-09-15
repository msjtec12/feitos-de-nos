import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { HomeFooter } from '@/components/home/HomeFooter';
import { InvitationSuccessClientView } from './InvitationSuccessClientView';

export const metadata: Metadata = {
  title: 'Pedido de Convite Recebido com Sucesso! | Feito de Nós',
  description: 'Seu pedido de convite foi registrado. Veja os próximos passos para aprovação e publicação.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PedidoConviteSucessoPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#302B2D] font-sans selection:bg-[#D9A4A0]/40 selection:text-[#713C48] flex flex-col">
      <header className="border-b border-[#713C48]/10 bg-[#FFF8F0]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded-xl p-1"
            aria-label="Voltar para a página inicial"
          >
            <BrandLogo size="md" />
          </Link>
          <Link
            href="/convites"
            className="text-xs sm:text-sm font-semibold text-[#713C48] hover:text-[#5a2e39] transition-colors"
          >
            Página de Convites
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 sm:px-6 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="py-24 text-center text-[#713C48]">
              <div className="w-8 h-8 mx-auto border-3 border-[#713C48] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium">Carregando confirmação...</p>
            </div>
          }
        >
          <InvitationSuccessClientView />
        </Suspense>
      </main>

      <HomeFooter />
    </div>
  );
}
