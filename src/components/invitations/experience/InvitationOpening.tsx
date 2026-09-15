'use client';

import React, { useState, useEffect } from 'react';
import { EventThemeConfig, OpeningStyle } from '@/types/invitation';
import { Heart, Gift, Sparkles, Music, ChevronRight, X } from 'lucide-react';
import { ThemeDecorationBadge } from './ThemeDecorations';

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
      // Ignore session storage errors
    }
  }, [slug, onOpen]);

  if (isDismissed) return null;

  const openingStyle: OpeningStyle = themeConfig.openingStyle || 'envelope';
  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

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

  return (
    <div
      className={
        'fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#221B1D]/90 via-[#140F11]/95 to-[#140F11] backdrop-blur-md transition-all duration-700 ' +
        (isOpening ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100')
      }
    >
      {/* Skip button in top corner */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-6 right-6 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
      >
        <span>Pular animação</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      <div className="relative w-full max-w-sm">
        {/* Glow behind the card */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl animate-pulse pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Main interactive envelope / card */}
        <div className="relative bg-[#FFF8F0] rounded-3xl p-7 sm:p-9 shadow-2xl border-2 border-white/50 text-center flex flex-col items-center justify-between min-h-[440px] overflow-hidden">
          {/* Subtle themed top stripe */}
          <div
            className="absolute top-0 inset-x-0 h-2.5 opacity-90"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, ${primaryColor}, transparent)`,
            }}
          />

          {/* Theme Decoration Icon Badge */}
          <div className="pt-2">
            <ThemeDecorationBadge
              themeSlug={themeConfig.slug}
              primaryColor={primaryColor}
              accentColor={accentColor}
              className="w-14 h-14 mx-auto drop-shadow-sm"
            />
          </div>

          {/* Guest Personalization or Badge */}
          <div className="space-y-1 pt-1">
            {guestName ? (
              <div className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold text-[#713C48]">
                  Olá, {guestName}!
                </span>
              </div>
            ) : (
              <span
                className="text-[11px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${accentColor}18`,
                  color: accentColor,
                }}
              >
                Convite Exclusivo
              </span>
            )}
            <p className="text-xs text-[#302B2D]/60 pt-0.5">
              Por {hostNames}
            </p>
          </div>

          {/* Title & Honoree */}
          <div className="py-4 space-y-2">
            <h2
              className="font-serif text-2xl sm:text-3xl font-extrabold leading-tight"
              style={{ color: primaryColor }}
            >
              {honoreeName || title}
            </h2>
            <p className="text-xs sm:text-sm text-[#302B2D]/75 italic max-w-xs mx-auto leading-relaxed">
              Você é nosso convidado de honra para celebrar este momento único.
            </p>
          </div>

          {/* Opening Button: Wax Seal or Gift Box */}
          <div className="pb-2 flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={() => handleOpen(true)}
              className="group relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none ring-4 ring-white/60 hover:ring-white"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
              }}
              aria-label="Abrir convite interativo"
            >
              <div className="absolute inset-1 rounded-full border border-white/40 flex items-center justify-center pointer-events-none">
                {openingStyle === 'gift-box' ? (
                  <Gift className="w-8 h-8 text-white transition-transform group-hover:rotate-12" />
                ) : (
                  <Heart className="w-8 h-8 text-white fill-current transition-transform group-hover:scale-110" />
                )}
              </div>
            </button>

            <span className="text-xs font-bold tracking-wide text-[#302B2D]/70 animate-pulse">
              {openingStyle === 'gift-box' ? 'Toque no laço para abrir o presente' : 'Toque no lacre para abrir'}
            </span>

            {hasMusic && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#302B2D]/55">
                <Music className="w-3 h-3 text-[#C96E5A]" />
                <span>Inclui trilha sonora especial</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
