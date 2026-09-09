import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { HomeFooter } from '@/components/home/HomeFooter';
import { ArrowLeft, FileCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos do Pedido | Feito de Nós',
  description: 'Conheça os termos de serviço, prazos de confecção, aprovação de prévia e condições de entrega.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermosPage() {
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
            <span>Voltar ao site</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <div className="space-y-3 text-center sm:text-left border-b border-[#713C48]/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#713C48]/10 text-[#713C48] text-xs font-semibold uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Transparência & Cuidado</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Termos do Pedido e Condições de Uso
          </h1>
          <p className="text-sm text-[#302B2D]/70">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-[#302B2D]/85 leading-relaxed shadow-sm">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              1. Visão Geral do Serviço
            </h2>
            <p>
              A <strong>Feito de Nós</strong> confecciona presentes afetivos personalizados, combinando tecnologia interativa (páginas web com QR Code, fotos, mensagens e áudios de voz) com suporte artesanal e itens físicos (Cartão que Fala e Presente Interativo).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              2. Fluxo de Confecção e Envio de Materiais
            </h2>
            <p>
              Após a montagem do pedido pelo configurador no site, o cliente é direcionado ao WhatsApp oficial da marca. O início da contagem dos prazos de produção ocorre a partir do momento em que <strong>todos os conteúdos (fotos, textos e áudios)</strong> são devidamente enviados e validados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              3. Prazos de Produção e Entrega
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>História Digital (R$ 59,90):</strong> Entrega da prévia e liberação do link/QR Code final em até 48 horas úteis após o recebimento completo dos materiais.</li>
              <li><strong>Cartão que Fala (R$ 99,90) e Presente Interativo (R$ 199,90):</strong> Confecção e postagem em 2 a 4 dias úteis após a aprovação da prévia digital, acrescido do prazo de frete para o CEP informado.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              4. Aprovação e Alterações
            </h2>
            <p>
              Garantimos ao cliente o direito de receber uma <strong>prévia completa</strong> do presente para validação de fotos, legendas e gravações de áudio. Ajustes de grafia, ordem de fotos ou substituição de áudios são realizados sem custo antes da liberação final ou impressão gráfica.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              5. Responsabilidade sobre os Conteúdos Enviados
            </h2>
            <p>
              O cliente declara que possui autorização e direitos sobre todas as fotos, mensagens e áudios fornecidos para a confecção do presente, respondendo por quaisquer direitos de imagem de terceiros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              6. Durabilidade e Hospedagem
            </h2>
            <p>
              A página digital interativa é mantida em servidores de alta disponibilidade e tem acesso vitalício garantido para que a família e os presenteados possam revisitar a memória a qualquer momento no futuro.
            </p>
          </section>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
