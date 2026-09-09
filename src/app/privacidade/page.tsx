import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { HomeFooter } from '@/components/home/HomeFooter';
import { ArrowLeft, ShieldCheck, Lock, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Feito de Nós',
  description: 'Conheça nosso compromisso com a proteção, privacidade e segurança das suas memórias e dados.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadePage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Segurança & Respeito</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Política de Privacidade
          </h1>
          <p className="text-sm text-[#302B2D]/70">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-[#302B2D]/85 leading-relaxed shadow-sm">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              1. Nosso Compromisso com Suas Memórias
            </h2>
            <p>
              Na <strong>Feito de Nós</strong>, entendemos que fotos, gravações de voz e mensagens de amor são alguns dos bens mais preciosos e íntimos que existem. Tratamos cada história com o mais absoluto respeito, sigilo e segurança.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              2. Quais Dados Coletamos
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Dados de contato e entrega:</strong> nome, número de WhatsApp, e-mail, cidade/estado e endereço/CEP para envio de itens físicos.</li>
              <li><strong>Conteúdos do presente:</strong> fotos, áudios e mensagens de texto que você nos encaminha voluntariamente pelo WhatsApp para a confecção da página interativa.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              3. Finalidade e Uso dos Dados
            </h2>
            <p>
              Os dados coletados são utilizados <strong>exclusivamente</strong> para:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Criar e hospedar a página interativa do seu presente;</li>
              <li>Produzir e despachar os itens físicos adquiridos (Cartão que Fala ou Presente Interativo);</li>
              <li>Atendimento e alinhamento de prévia pelo WhatsApp oficial.</li>
            </ul>
            <p>
              Nenhum dado, imagem ou áudio é compartilhado com terceiros, vendido ou utilizado para fins publicitários sem sua autorização prévia e expressa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              4. Acesso ao Presente e Confidencialidade
            </h2>
            <p>
              As páginas interativas de presente são protegidas e acessíveis através de links exclusivos (URL com slug seguro) e QR Code. Elas são configuradas para não serem indexadas em mecanismos de busca públicos por padrão, preservando a intimidade da família ou do casal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              5. Seus Direitos e Exclusão de Mídias
            </h2>
            <p>
              Você pode, a qualquer momento, solicitar a atualização, alteração ou a exclusão definitiva do link e dos arquivos armazenados entrando em contato com nossa equipe pelo WhatsApp ou e-mail de suporte.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#713C48]/10 pt-6">
            <h2 className="font-serif text-xl sm:text-2xl text-[#713C48]">
              6. Fale Conosco
            </h2>
            <p>
              Em caso de dúvidas sobre nossa Política de Privacidade, entre em contato através do nosso WhatsApp oficial ou pelo nosso canal de atendimento ao cliente.
            </p>
          </section>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
