'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, Play, Heart, Image as ImageIcon } from 'lucide-react';

export function HomeDemoSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FFF8F0] via-[#D9A4A0]/10 to-[#FFF8F0] border-t border-[#713C48]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#713C48] text-[#FFF8F0] rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C96E5A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D9A4A0]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8F0]/15 text-[#FFF8F0] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A4A0]" />
                <span>Demonstração Interativa Real</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">
                Veja como quem você ama vai viver essa surpresa.
              </h2>

              <p className="text-base sm:text-lg text-[#FFF8F0]/85 font-normal leading-relaxed">
                Navegue pelo presente real criado para o <strong>Matheus Akira</strong>. Veja a abertura carinhosa, a linha do tempo mês a mês, a galeria de fotos e escute a mensagem em áudio dos pais.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/presente/matheus-akira"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FFF8F0] text-[#713C48] font-semibold text-base hover:bg-[#FFF8F0]/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-5 h-5 text-[#C96E5A]" />
                  <span>Abrir Demonstração Ao Vivo</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </Link>

                <Link
                  href="/presente/matheus-akira/cartao"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-transparent text-[#FFF8F0] border border-[#FFF8F0]/30 hover:bg-[#FFF8F0]/10 font-medium text-sm transition-colors"
                >
                  <span>Ver Versão Cartão Físico</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-[#FFF8F0]/10 backdrop-blur-md border border-[#FFF8F0]/20 rounded-2xl p-6 w-full max-w-sm space-y-4 text-[#FFF8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8F0]/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#D9A4A0] fill-current" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#D9A4A0] font-semibold">Exemplo Real</p>
                    <p className="font-serif text-lg">Meu Primeiro Ano</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#FFF8F0]/80">
                  <div className="flex items-center gap-2 py-1 border-b border-[#FFF8F0]/10">
                    <ImageIcon className="w-4 h-4 text-[#D9A4A0]" />
                    <span>Linha do tempo de 12 meses</span>
                  </div>
                  <div className="flex items-center gap-2 py-1 border-b border-[#FFF8F0]/10">
                    <Play className="w-4 h-4 text-[#D9A4A0]" />
                    <span>Player de áudio com waveform</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <Sparkles className="w-4 h-4 text-[#D9A4A0]" />
                    <span>Galeria modal em alta resolução</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/pedido?colecao=primeiro-ano"
                    className="block text-center w-full py-2.5 rounded-xl bg-[#C96E5A] hover:bg-[#b85f4c] text-[#FFF8F0] font-semibold text-xs transition-colors"
                  >
                    Quero um presente igual a esse →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
