'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, MapPin, CheckCircle, ArrowRight, Smartphone, Eye } from 'lucide-react';

export function InvitationHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-[#FFF8F0]">
      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#C96E5A]/15 via-[#D9A4A0]/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#713C48]/5 blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C96E5A]/15 text-[#C96E5A] text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convites Digitais Interativos</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#713C48] leading-[1.15] tracking-tight">
              Momentos especiais começam com um{' '}
              <span className="italic font-normal text-[#C96E5A]">convite inesquecível.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#302B2D]/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Muito além de um PDF no WhatsApp. Encante seus convidados com contagem regressiva, confirmação de presença (RSVP), localização com Waze/Maps, lista de presentes/Pix e fotos afetivas.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/pedido/convite"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-base hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
              >
                <span>Criar Meu Convite</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </Link>

              <Link
                href="/convite/matheus-akira-1-ano"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/25 font-semibold text-base hover:bg-[#713C48]/5 hover:border-[#713C48] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48]"
              >
                <Eye className="w-4 h-4 text-[#C96E5A]" />
                <span>Ver Exemplo Real</span>
              </Link>
            </div>

            {/* Quick highlights */}
            <div className="pt-6 border-t border-[#713C48]/10 grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-semibold text-[#713C48] uppercase tracking-wider">RSVP Integrado</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Confirmação em 1 toque</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#713C48] uppercase tracking-wider">Waze & Maps</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Rota sem se perder</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#713C48] uppercase tracking-wider">Zero Download</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Abre direto no navegador</p>
              </div>
            </div>
          </div>

          {/* Smartphone Simulator Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] aspect-[9/18.5] bg-gradient-to-b from-[#2B2325] to-[#1A1416] p-3.5 rounded-[44px] shadow-2xl border-4 border-[#3D3236]">
              {/* Camera Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20" />

              {/* Inner Screen */}
              <div className="w-full h-full bg-[#F8FAFC] rounded-[34px] overflow-hidden flex flex-col justify-between relative shadow-inner p-4 text-[#1E293B]">
                {/* Header preview */}
                <div className="pt-6 text-center space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#2563EB] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full">
                    1 Aninho
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#1E293B] leading-tight">
                    Matheus Akira
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    24 de Outubro às 16h00
                  </p>
                </div>

                {/* Photo Preview Card */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md my-2">
                  <Image
                    src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
                    alt="Foto do Aniversariante"
                    fill
                    className="object-cover"
                    sizes="280px"
                    priority
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-center font-medium text-[#1E293B]">
                    Villa Encantada • São Paulo
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="space-y-2 pb-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white shadow-xs border border-slate-100 text-xs">
                    <span className="flex items-center gap-1.5 text-[#1E293B] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      Adicionar à Agenda
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">Salvar</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white shadow-xs border border-slate-100 text-xs">
                    <span className="flex items-center gap-1.5 text-[#1E293B] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                      Como Chegar (Maps)
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">Abrir</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#2563EB] text-white text-center text-xs font-semibold shadow-sm">
                    Confirmar Presença (RSVP)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
