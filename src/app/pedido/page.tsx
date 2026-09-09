import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { OrderConfigurator } from '@/components/order/OrderConfigurator';
import { HomeFooter } from '@/components/home/HomeFooter';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Configurar Presente | Feito de Nós',
  description: 'Monte seu presente afetivo interativo em 7 passos simples e personalizados.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PedidoPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#302B2D] font-sans selection:bg-[#D9A4A0]/40 selection:text-[#713C48] flex flex-col">
      {/* Header */}
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
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#713C48] hover:text-[#5a2e39] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o site</span>
          </Link>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 py-4 sm:py-8">
        <Suspense
          fallback={
            <div className="py-24 text-center text-[#713C48]">
              <div className="w-8 h-8 mx-auto border-3 border-[#713C48] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium">Carregando formulário...</p>
            </div>
          }
        >
          <OrderConfigurator />
        </Suspense>
      </main>

      <HomeFooter />
    </div>
  );
}
