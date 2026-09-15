'use client';

import React, { useState } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { Sparkles, Eye, Lock } from 'lucide-react';

interface SurpriseMessageProps {
  message?: string | null;
  themeConfig: EventThemeConfig;
}

export function SurpriseMessage({ message, themeConfig }: SurpriseMessageProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!message) return null;

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  return (
    <section className="max-w-xl mx-auto px-4 py-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 p-6 sm:p-8 border border-amber-200/60 shadow-xs text-center">
        {!isRevealed ? (
          <div className="space-y-4">
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
            >
              <Lock className="w-5 h-5 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold" style={{ color: primaryColor }}>
                Mensagem Secreta dos Anfitriões
              </h4>
              <p className="text-xs text-[#302B2D]/70 max-w-sm mx-auto">
                Há um recado especial esperando por você. Toque no botão abaixo para revelar!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRevealed(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Revelar Surpresa ✨</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-in zoom-in-95 duration-300">
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>

            <span className="text-[11px] uppercase tracking-widest font-extrabold block text-amber-800">
              Surpresa Revelada!
            </span>

            <p className="font-serif text-base sm:text-lg italic text-[#302B2D] leading-relaxed max-w-md mx-auto">
              “{message}”
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
