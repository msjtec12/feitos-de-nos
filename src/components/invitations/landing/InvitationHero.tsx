'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, MapPin, CheckCircle, ArrowRight, Eye, Music, Heart } from 'lucide-react';
import { ThemeDecorationBadge } from '../experience/ThemeDecorations';

const PREVIEW_THEMES = [
  {
    id: 'infantil-monstrinhos-elementais',
    tabName: '🔥 Monstrinhos Elementais',
    badge: '1 Aninho • Elementos',
    title: 'Matheus Akira',
    date: '24 de Outubro às 16h00',
    venue: 'Villa Encantada • São Paulo',
    primaryColor: '#F97316',
    accentColor: '#0284C7',
    bgColor: '#FFFBEB',
    photoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'infantil-herois-originais',
    tabName: '⚡ Heróis Originais',
    badge: '5 Anos • Missão Secreta',
    title: 'Lucas & Heróis',
    date: '14 de Novembro às 17h30',
    venue: 'Arena dos Campeões • SP',
    primaryColor: '#DC2626',
    accentColor: '#FACC15',
    bgColor: '#FEF2F2',
    photoUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'infantil-reino-encantado',
    tabName: '👑 Reino Encantado',
    badge: '3 Anos • Baile Real',
    title: 'Princesa Sofia',
    date: '05 de Dezembro às 15h00',
    venue: 'Castelo das Rosas • SP',
    primaryColor: '#BE185D',
    accentColor: '#D97706',
    bgColor: '#FDF4FF',
    photoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'infantil-aventura-blocos',
    tabName: '🧱 Aventura em Blocos',
    badge: '7 Anos • Pixel World',
    title: 'Pedro em Blocos',
    date: '20 de Janeiro às 16h30',
    venue: 'Arena Craft • Campinas',
    primaryColor: '#15803D',
    accentColor: '#854D0E',
    bgColor: '#F0FDF4',
    photoUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80',
  },
];

export function InvitationHero() {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const activeTheme = PREVIEW_THEMES[selectedThemeIndex];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-[#FFF8F0]">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#C96E5A]/15 via-[#D9A4A0]/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#713C48]/5 blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C96E5A]/15 text-[#C96E5A] text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convites Digitais Interativos Feito de Nós</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#713C48] leading-[1.15] tracking-tight">
              Momentos especiais começam com um{' '}
              <span className="italic font-normal text-[#C96E5A]">convite inesquecível.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#302B2D]/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Muito além de um PDF no WhatsApp. Encante seus convidados com abertura animada de lacre ou caixa, trilha sonora, contagem regressiva, confirmação de presença (RSVP), rota via Waze/Google Maps e lista de presentes/Pix.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/pedido/convite"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-base hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Criar Meu Convite</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </Link>

              <Link
                href="/convite/matheus-akira-1-ano"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/25 font-semibold text-base hover:bg-[#713C48]/5 hover:border-[#713C48] transition-all"
              >
                <Eye className="w-4 h-4 text-[#C96E5A]" />
                <span>Ver Exemplo Real</span>
              </Link>
            </div>

            {/* Quick Highlights */}
            <div className="pt-6 border-t border-[#713C48]/10 grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-[#713C48] uppercase tracking-wider">Abertura Interativa</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Lacre de cera & Presente</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#713C48] uppercase tracking-wider">RSVP Integrado</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Confirmação em 1 toque</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#713C48] uppercase tracking-wider">Waze & Agenda</p>
                <p className="text-xs text-[#302B2D]/70 mt-0.5">Chegue sem errar</p>
              </div>
            </div>
          </div>

          {/* Interactive Smartphone Mockup with Theme Switcher */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Theme switcher pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 border border-black/5 shadow-xs mb-4 max-w-full overflow-x-auto scrollbar-none">
              {PREVIEW_THEMES.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedThemeIndex(idx)}
                  className={
                    'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ' +
                    (selectedThemeIndex === idx
                      ? 'bg-[#713C48] text-white shadow-xs'
                      : 'text-[#302B2D]/70 hover:text-[#713C48]')
                  }
                >
                  {t.tabName}
                </button>
              ))}
            </div>

            {/* Smartphone Mockup Frame */}
            <div className="relative w-full max-w-[320px] aspect-[9/18.5] bg-gradient-to-b from-[#2B2325] to-[#1A1416] p-3.5 rounded-[44px] shadow-2xl border-4 border-[#3D3236]">
              {/* Camera Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800 ml-auto mr-2.5" />
              </div>

              {/* Inner Screen */}
              <div
                className="w-full h-full rounded-[34px] overflow-hidden flex flex-col justify-between relative shadow-inner p-4 text-[#1E293B] transition-colors duration-500"
                style={{ backgroundColor: activeTheme.bgColor }}
              >
                {/* Header Preview */}
                <div className="pt-6 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1">
                    <ThemeDecorationBadge
                      themeSlug={activeTheme.id}
                      primaryColor={activeTheme.primaryColor}
                      accentColor={activeTheme.accentColor}
                      className="w-7 h-7"
                    />
                    <span
                      className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: activeTheme.primaryColor + '20',
                        color: activeTheme.primaryColor,
                      }}
                    >
                      {activeTheme.badge}
                    </span>
                  </div>

                  <h3
                    className="font-serif text-lg font-black leading-tight"
                    style={{ color: activeTheme.primaryColor }}
                  >
                    {activeTheme.title}
                  </h3>
                  <p className="text-[11px] text-[#302B2D]/70 font-medium">
                    {activeTheme.date}
                  </p>
                </div>

                {/* Photo Card */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md my-2">
                  <Image
                    src={activeTheme.photoUrl}
                    alt={activeTheme.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="280px"
                    priority
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-center font-semibold text-[#1E293B]">
                    {activeTheme.venue}
                  </div>
                </div>

                {/* Simulated Interactive Action Buttons */}
                <div className="space-y-1.5 pb-1">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90 shadow-2xs border border-black/5 text-xs">
                    <span className="flex items-center gap-1.5 text-[#1E293B] font-semibold text-[11px]">
                      <Calendar className="w-3.5 h-3.5" style={{ color: activeTheme.primaryColor }} />
                      Adicionar à Agenda
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: activeTheme.primaryColor }}
                    >
                      Salvar
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90 shadow-2xs border border-black/5 text-xs">
                    <span className="flex items-center gap-1.5 text-[#1E293B] font-semibold text-[11px]">
                      <MapPin className="w-3.5 h-3.5" style={{ color: activeTheme.primaryColor }} />
                      Como Chegar (Maps & Waze)
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: activeTheme.primaryColor }}
                    >
                      Abrir
                    </span>
                  </div>

                  <div
                    className="p-2.5 rounded-xl text-white text-center text-xs font-bold shadow-sm transition-colors duration-300"
                    style={{ backgroundColor: activeTheme.primaryColor }}
                  >
                    Confirmar Presença (RSVP)
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#302B2D]/60 mt-3 font-medium">
              ✨ Toque nos botões acima para testar os temas autorais ao vivo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
