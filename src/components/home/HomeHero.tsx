'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Play, QrCode, ArrowRight, ShieldCheck, Volume2 } from 'lucide-react';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#D9A4A0]/15 via-[#C96E5A]/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#713C48]/5 blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#713C48]/10 text-[#713C48] text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C96E5A]" />
              <span>Presentes Afetivos & Interativos</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#713C48] leading-[1.12] tracking-tight">
              Histórias que viram presente.
            </h1>

            <p className="text-lg sm:text-xl text-[#302B2D]/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Reúna fotos inesquecíveis, mensagens escritas e <strong className="font-semibold text-[#713C48]">vozes reais</strong> de quem você ama em uma experiência viva, tocante e eterna.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/pedido"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-base hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
              >
                <Heart className="w-5 h-5 text-[#D9A4A0] fill-current" />
                <span>Criar meu presente</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </Link>

              <Link
                href="/presente/matheus-akira"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/25 font-semibold text-base hover:bg-[#713C48]/5 hover:border-[#713C48] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48]"
              >
                <Sparkles className="w-4 h-4 text-[#C96E5A]" />
                <span>Ver exemplo ao vivo</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#713C48]/10 grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-semibold text-[#713C48] uppercase tracking-wider">Acesso Fácil</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Sem baixar app</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#713C48] uppercase tracking-wider">Áudios Reais</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Vozes que emocionam</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#713C48] uppercase tracking-wider">Hospedagem</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">6 meses + Download</p>
              </div>
            </div>
          </div>

          {/* Interactive Card Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative Background Aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#713C48]/15 via-[#C96E5A]/15 to-[#D9A4A0]/20 rounded-3xl transform rotate-2 scale-105 filter blur-xl -z-10" />

              {/* Card Container */}
              <div className="bg-[#FFF8F0] border-2 border-[#713C48]/15 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 text-[#302B2D]">
                {/* Header with Stamp */}
                <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest font-semibold text-[#C96E5A]">
                      Coleção Meu Primeiro Ano
                    </span>
                    <h3 className="font-serif text-2xl text-[#713C48]">Matheus Akira</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#713C48]/10 border border-[#713C48]/20 flex items-center justify-center text-[#713C48]">
                    <QrCode className="w-6 h-6" />
                  </div>
                </div>

                {/* Photo Mockup Frame */}
                <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#D9A4A0]/30 to-[#713C48]/15 border border-[#713C48]/15 overflow-hidden flex items-center justify-center p-4">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF8F0] shadow-sm flex items-center justify-center text-[#713C48]">
                      <Heart className="w-6 h-6 text-[#C96E5A] fill-current" />
                    </div>
                    <p className="font-serif text-lg text-[#713C48]">&ldquo;O ano em que o mundo ganhou você.&rdquo;</p>
                    <p className="text-xs text-[#302B2D]/70">12 meses de memórias, fotos e sorrisos</p>
                  </div>
                </div>

                {/* Simulated Audio Message Pill */}
                <div className="bg-white/80 border border-[#713C48]/15 rounded-2xl p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#713C48]">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#C96E5A]" />
                      Mensagem em Áudio dos Pais
                    </span>
                    <span className="text-[#302B2D]/60 font-mono text-[11px]">01:42</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#713C48] text-[#FFF8F0] flex items-center justify-center flex-shrink-0">
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                    </div>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="h-2 w-1.5 bg-[#C96E5A] rounded-full animate-pulse" />
                      <div className="h-4 w-1.5 bg-[#713C48] rounded-full" />
                      <div className="h-6 w-1.5 bg-[#713C48] rounded-full" />
                      <div className="h-3 w-1.5 bg-[#D9A4A0] rounded-full" />
                      <div className="h-5 w-1.5 bg-[#713C48] rounded-full" />
                      <div className="h-2 w-1.5 bg-[#C96E5A] rounded-full" />
                      <div className="h-6 w-1.5 bg-[#713C48] rounded-full" />
                      <div className="h-4 w-1.5 bg-[#D9A4A0] rounded-full" />
                      <div className="h-2 w-1.5 bg-[#302B2D]/30 rounded-full" />
                      <div className="h-4 w-1.5 bg-[#302B2D]/30 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Footer preview CTA */}
                <Link
                  href="/presente/matheus-akira"
                  className="w-full block py-2.5 text-center text-xs font-semibold text-[#713C48] hover:text-[#5a2e39] bg-[#713C48]/5 rounded-xl transition-colors"
                >
                  Toque para experimentar este presente completo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
