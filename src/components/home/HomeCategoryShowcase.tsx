'use client';

import React from 'react';
import Link from 'next/link';
import { Gift, Mail, ArrowRight, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export function HomeCategoryShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFF8F0] via-[#FAF3EC] to-[#FFF8F0] border-y border-[#713C48]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#713C48]/10 text-[#713C48] text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Nossas Duas Linhas Exclusivas</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] leading-tight mb-4">
            Celebre cada detalhe da sua história
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Seja para emocionar alguém querido com um presente inesquecível ou reunir quem você ama com um convite interativo moderno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Presentes Feito de Nós */}
          <div className="relative group bg-[#FFF8F0] rounded-3xl p-8 sm:p-10 border-2 border-[#713C48]/15 hover:border-[#713C48]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#713C48]/10 flex items-center justify-center text-[#713C48] mb-2 group-hover:scale-110 transition-transform">
                <Gift className="w-7 h-7 text-[#713C48]" />
              </div>

              <div className="inline-block">
                <span className="text-xs uppercase tracking-wider font-bold text-[#C96E5A] bg-[#C96E5A]/10 px-3 py-1 rounded-full">
                  Linha de Presentes
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
                Presentes Feito de Nós
              </h3>

              <p className="text-[#302B2D]/80 text-sm sm:text-base leading-relaxed">
                Histórias reais transformadas em uma experiência sensorial. Reúna fotos memoráveis, mensagens afetuosas e <strong className="text-[#713C48]">vozes reais</strong> em cartões físicos ou páginas virtuais tocantes.
              </p>

              <ul className="space-y-2.5 pt-2 text-sm text-[#302B2D]/85">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#713C48] shrink-0" />
                  <span>Gravações de voz e depoimentos sonoros</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#713C48] shrink-0" />
                  <span>Opções digitais e cartões físicos com QR Code</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#713C48] shrink-0" />
                  <span>Acesso instantâneo sem necessidade de aplicativo</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-[#713C48]/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/pedido"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-sm"
              >
                <Heart className="w-4 h-4 text-[#D9A4A0] fill-current" />
                <span>Pedir Presente</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                href="/presente/matheus-akira"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3.5 rounded-full text-xs font-semibold text-[#713C48] hover:bg-[#713C48]/5 transition-colors"
              >
                Ver Exemplo Real
              </Link>
            </div>
          </div>

          {/* Card 2: Convites Feito de Nós */}
          <div className="relative group bg-[#FFF8F0] rounded-3xl p-8 sm:p-10 border-2 border-[#C96E5A]/30 hover:border-[#C96E5A] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-6 right-6">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#FFF8F0] bg-[#C96E5A] px-3 py-1 rounded-full shadow-sm">
                Novidade
              </span>
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#C96E5A]/15 flex items-center justify-center text-[#C96E5A] mb-2 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-[#C96E5A]" />
              </div>

              <div className="inline-block">
                <span className="text-xs uppercase tracking-wider font-bold text-[#713C48] bg-[#713C48]/10 px-3 py-1 rounded-full">
                  Linha de Convites
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
                Convites Feito de Nós
              </h3>

              <p className="text-[#302B2D]/80 text-sm sm:text-base leading-relaxed">
                Momentos especiais começam com um convite inesquecível. Experiências digitais interativas completas com contagem regressiva, confirmação de presença (RSVP), mapa e lista de presentes.
              </p>

              <ul className="space-y-2.5 pt-2 text-sm text-[#302B2D]/85">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C96E5A] shrink-0" />
                  <span>Confirmação de presença (RSVP) com controle de convidados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C96E5A] shrink-0" />
                  <span>Localização com Waze/Google Maps e adicionar à agenda</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C96E5A] shrink-0" />
                  <span>Lista de presentes/Pix e galeria de fotos integrada</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-[#713C48]/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/convites"
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C96E5A] text-[#FFF8F0] font-semibold text-sm hover:bg-[#b05845] transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explorar Convites</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
              <Link
                href="/convite/matheus-akira-1-ano"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3.5 rounded-full text-xs font-semibold text-[#713C48] hover:bg-[#713C48]/5 transition-colors"
              >
                Ver Exemplo Real
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
