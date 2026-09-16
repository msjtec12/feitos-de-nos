'use client';

import React, { useState } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { Heart, Sparkles, MailOpen } from 'lucide-react';

interface InvitationEnvelopeOpeningProps {
  title: string;
  honoreeName?: string | null;
  hostNames: string;
  themeConfig: EventThemeConfig;
  onOpen: () => void;
}

export function InvitationEnvelopeOpening({
  title,
  honoreeName,
  hostNames,
  themeConfig,
  onOpen,
}: InvitationEnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#2B2325]/90 via-[#1A1416]/95 to-[#1A1416] backdrop-blur-md transition-all duration-700 ${
        isOpening ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative w-full max-w-sm">
        {/* Ambient Glow */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl animate-pulse pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Envelope Body */}
        <div className="relative bg-[#FFF8F0] rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-white/40 text-center flex flex-col items-center justify-between min-h-[420px] overflow-hidden">
          {/* Subtle decorative background lines */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#C96E5A]/40 to-transparent" />
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#713C48]/5 pointer-events-none" />

          {/* Top Label */}
          <div className="space-y-1 pt-2">
            <span
              className="text-[11px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              Convite Exclusivo
            </span>
            <p className="text-xs text-[#302B2D]/60 pt-1">
              De {hostNames}
            </p>
          </div>

          {/* Middle: Title & Honoree */}
          <div className="py-6 space-y-3">
            <h2
              className="font-serif text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: primaryColor }}
            >
              {honoreeName || title}
            </h2>
            <p className="text-xs sm:text-sm text-[#302B2D]/75 italic max-w-xs mx-auto">
              Você é nosso convidado de honra para celebrar este momento único.
            </p>
          </div>

          {/* Bottom: Wax Seal Button */}
          <div className="pb-2 flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={handleOpen}
              className="group relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${primaryColor})`,
              }}
              aria-label="Abrir convite"
            >
              <div className="absolute inset-1 rounded-full border border-white/40 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-current transition-transform group-hover:scale-110" />
              </div>
            </button>

            <span className="text-xs font-semibold tracking-wide text-[#302B2D]/70 animate-pulse">
              Toque no lacre para abrir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
