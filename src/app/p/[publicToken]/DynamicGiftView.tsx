'use client';

import React, { useState, useEffect } from 'react';
import { GiftExperience } from '@/types/gift';
import { PresenteClientView } from '@/app/presente/[slug]/PresenteClientView';
import { getThemeCssVariables } from '@/lib/theme-utils';
import { Sparkles, Heart, Clock } from 'lucide-react';

interface DynamicGiftViewProps {
  giftExperience: GiftExperience;
  revealAt: string | null;
  recipientName: string;
}

export default function DynamicGiftView({
  giftExperience,
  revealAt,
  recipientName,
}: DynamicGiftViewProps) {
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    if (!revealAt) return true;
    return new Date(revealAt).getTime() <= Date.now();
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!revealAt || isRevealed) return;

    const calculateTime = () => {
      const difference = new Date(revealAt).getTime() - Date.now();
      if (difference <= 0) {
        setIsRevealed(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [revealAt, isRevealed]);

  if (!isRevealed && revealAt) {
    const formattedDate = new Date(revealAt).toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    return (
      <div
        style={getThemeCssVariables(giftExperience.theme)}
        className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center transition-colors duration-500"
      >
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-brand-wine/10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mx-auto w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center border-2 border-brand-terracotta/30">
            <Sparkles className="w-10 h-10 text-brand-terracotta animate-pulse" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-brand-terracotta font-bold">
              Surpresa em Preparação
            </span>
            <h1 className="font-serif text-3xl font-bold text-brand-wine">
              Um presente para {recipientName}
            </h1>
            <p className="text-sm text-brand-graphite/80 leading-relaxed">
              Esta experiência foi preparada com muito amor e carinho e será revelada em:
            </p>
            <p className="text-xs font-semibold text-brand-wine bg-brand-cream py-2 px-4 rounded-xl border border-brand-wine/10 inline-block">
              {formattedDate}
            </p>
          </div>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="bg-brand-cream p-3 rounded-2xl border border-brand-wine/10">
              <span className="text-2xl font-serif font-bold text-brand-wine block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-brand-graphite/60 font-semibold">Dias</span>
            </div>
            <div className="bg-brand-cream p-3 rounded-2xl border border-brand-wine/10">
              <span className="text-2xl font-serif font-bold text-brand-wine block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-brand-graphite/60 font-semibold">Horas</span>
            </div>
            <div className="bg-brand-cream p-3 rounded-2xl border border-brand-wine/10">
              <span className="text-2xl font-serif font-bold text-brand-wine block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-brand-graphite/60 font-semibold">Min</span>
            </div>
            <div className="bg-brand-cream p-3 rounded-2xl border border-brand-wine/10">
              <span className="text-2xl font-serif font-bold text-brand-terracotta block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase text-brand-graphite/60 font-semibold">Seg</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-400">
            <Heart className="w-3.5 h-3.5 text-brand-terracotta fill-brand-terracotta" />
            <span>Feito de Nós — Histórias que viram presente.</span>
          </div>
        </div>
      </div>
    );
  }

  return <PresenteClientView gift={giftExperience} />;
}
