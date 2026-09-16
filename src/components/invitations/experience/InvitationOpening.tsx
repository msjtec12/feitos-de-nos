'use client';

import React, { useState, useEffect } from 'react';
import { EventThemeConfig, OpeningStyle } from '@/types/invitation';
import { Heart, Gift, Sparkles, Music, ChevronRight, BookOpen } from 'lucide-react';
import { ThemeDecorationBadge, HeroShield, ElementalFire } from './ThemeDecorations';

interface InvitationOpeningProps {
  title: string;
  honoreeName?: string | null;
  hostNames: string;
  guestName?: string | null;
  themeConfig: EventThemeConfig;
  hasMusic?: boolean;
  slug?: string;
  onOpen: (withAudioGesture: boolean) => void;
}

export function InvitationOpening({
  title,
  honoreeName,
  hostNames,
  guestName,
  themeConfig,
  hasMusic = false,
  slug,
  onOpen,
}: InvitationOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if this invitation was already opened in this session
  useEffect(() => {
    if (!slug) return;
    try {
      const opened = sessionStorage.getItem('invitation_opened_' + slug);
      if (opened === 'true') {
        setIsDismissed(true);
        onOpen(false);
      }
    } catch {
      // Ignore
    }
  }, [slug, onOpen]);

  if (isDismissed) return null;

  const openingStyle: OpeningStyle = themeConfig.openingStyle || 'envelope';
  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const themeSlug = (themeConfig.themeId || themeConfig.slug || '').toLowerCase();

  const isHero = themeSlug.includes('heroi') || themeSlug.includes('super');
  const isBlocos = themeSlug.includes('bloco') || themeSlug.includes('pixel');
  const isPop = themeSlug.includes('pop') || themeSlug.includes('musica');
  const isReino = themeSlug.includes('reino') || themeSlug.includes('princesa');
  const isMonstrinho = themeSlug.includes('monstrinho') || themeSlug.includes('pokemon');

  const handleOpen = (withAudioGesture = true) => {
    if (isOpening) return;
    setIsOpening(true);

    if (slug) {
      try {
        sessionStorage.setItem('invitation_opened_' + slug, 'true');
      } catch {
        // Ignore
      }
    }

    setTimeout(() => {
      setIsDismissed(true);
      onOpen(withAudioGesture);
    }, 700);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpen(false);
  };

  // Card container styling based on theme (otimizado para caber 100% no viewport sem rolagem)
  let cardClass = 'relative bg-[#FFF8F0] rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-white/60 text-center flex flex-col items-center justify-between min-h-[380px] max-h-[85vh] overflow-hidden';
  if (isHero) {
    cardClass = 'relative bg-amber-50 rounded-3xl p-5 sm:p-7 border-4 border-slate-900 shadow-[8px_8px_0px_#DC2626] text-center flex flex-col items-center justify-between min-h-[380px] max-h-[85vh] overflow-hidden';
  } else if (isBlocos) {
    cardClass = 'relative bg-emerald-50 rounded-none p-5 sm:p-7 border-4 border-emerald-950 shadow-[8px_8px_0px_#15803D] text-center flex flex-col items-center justify-between min-h-[380px] max-h-[85vh] overflow-hidden font-mono';
  } else if (isPop) {
    cardClass = 'relative bg-purple-950 rounded-3xl p-5 sm:p-7 border-2 border-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.6)] text-center flex flex-col items-center justify-between min-h-[380px] max-h-[85vh] overflow-hidden text-white';
  }

  return (
    <div
      className={
        'absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#1E1B1D]/90 via-[#0F0D0E]/95 to-[#0F0D0E] backdrop-blur-md transition-all duration-700 ' +
        (isOpening ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100')
      }
    >
      {/* Skip button in top corner */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/80 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all active:scale-95 shadow-xs"
      >
        <span>Pular animação</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      <div className="relative w-full max-w-sm">
        {/* Ambient Glow behind the card */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl animate-party-pulse pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Main interactive envelope / card */}
        <div className={cardClass}>
          {/* Subtle themed top stripe */}
          <div
            className="absolute top-0 inset-x-0 h-3 opacity-90"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, ${primaryColor}, transparent)`,
            }}
          />

          {/* Theme Decoration Icon Badge */}
          <div className="pt-2">
            <ThemeDecorationBadge
              themeId={themeConfig.themeId}
              themeSlug={themeConfig.slug}
              primaryColor={primaryColor}
              accentColor={accentColor}
              className="w-16 h-16 mx-auto drop-shadow-md"
            />
          </div>

          {/* Guest Personalization or Badge */}
          <div className="space-y-1.5 pt-1">
            {guestName ? (
              <div className="inline-block px-3.5 py-1 rounded-full bg-rose-100 border border-rose-300 shadow-2xs">
                <span className="text-xs font-black text-[#713C48]">
                  Olá, {guestName}!
                </span>
              </div>
            ) : (
              <span
                className="text-[11px] uppercase tracking-widest font-black px-3.5 py-1 rounded-full shadow-2xs"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                {isHero ? '⚡ MISSÃO ESPECIAL ⚡' : isReino ? '👑 CONVITE REAL 👑' : 'CONVITE EXCLUSIVO'}
              </span>
            )}
            <p className={'text-xs font-semibold pt-0.5 ' + (isPop ? 'text-purple-200' : 'text-[#302B2D]/70')}>
              De {hostNames}
            </p>
          </div>

          {/* Title & Honoree */}
          <div className="py-4 space-y-2">
            <h2
              className={
                'text-2xl sm:text-3xl font-black leading-tight tracking-tight ' +
                (isHero ? 'font-sans uppercase text-blue-950' : isPop ? 'font-sans text-pink-400' : 'font-serif')
              }
              style={{ color: isPop ? '#F472B6' : primaryColor }}
            >
              {honoreeName || title}
            </h2>
            <p className={'text-xs sm:text-sm italic max-w-xs mx-auto leading-relaxed font-medium ' + (isPop ? 'text-purple-100/80' : 'text-[#302B2D]/80')}>
              Você é nosso convidado de honra para celebrar este momento inesquecível!
            </p>
          </div>

          {/* Opening Button: Wax Seal or Gift Box or Hero Shield */}
          <div className="pb-2 flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={() => handleOpen(true)}
              className="group relative w-22 h-22 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-115 active:scale-95 focus:outline-none ring-4 ring-white/70 hover:ring-white"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
              }}
              aria-label="Toque para abrir o convite"
            >
              <div className="absolute inset-1.5 rounded-full border-2 border-white/50 flex items-center justify-center pointer-events-none">
                {isHero ? (
                  <HeroShield className="w-10 h-10 drop-shadow-md transition-transform group-hover:scale-110" />
                ) : openingStyle === 'gift-box' ? (
                  <Gift className="w-9 h-9 text-white transition-transform group-hover:rotate-12" />
                ) : openingStyle === 'card' ? (
                  <BookOpen className="w-9 h-9 text-white transition-transform group-hover:scale-110" />
                ) : (
                  <Heart className="w-9 h-9 text-white fill-current transition-transform group-hover:scale-110" />
                )}
              </div>
            </button>

            <span className={'text-xs font-black tracking-wide animate-pulse ' + (isPop ? 'text-pink-300' : 'text-[#302B2D]/80')}>
              {isHero
                ? 'Toque no escudo para abrir a missão'
                : openingStyle === 'gift-box'
                ? 'Toque no laço para abrir o presente'
                : openingStyle === 'card'
                ? 'Toque no cartão para abrir'
                : 'Toque no lacre de cera para abrir'}
            </span>

            {hasMusic && (
              <span className={'inline-flex items-center gap-1.5 text-[11px] font-semibold ' + (isPop ? 'text-purple-300' : 'text-[#302B2D]/65')}>
                <Music className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                <span>Inclui trilha sonora especial</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
