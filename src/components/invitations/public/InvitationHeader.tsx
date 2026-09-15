'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { Sparkles, Heart } from 'lucide-react';

interface InvitationHeaderProps {
  title: string;
  honoreeName?: string | null;
  hostNames: string;
  headline?: string | null;
  coverUrl?: string | null;
  eventDate: string;
  themeConfig: EventThemeConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const targetTime = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isPast: false };
}

export function InvitationHeader({
  title,
  honoreeName,
  hostNames,
  headline,
  coverUrl,
  eventDate,
  themeConfig,
}: InvitationHeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(eventDate));
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(eventDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const photoStyle = themeConfig.photoStyle || 'rounded';

  // Photo frame styling based on theme
  let frameClasses = 'rounded-3xl shadow-xl';
  if (photoStyle === 'polaroid') {
    frameClasses = 'bg-white p-3.5 pb-10 rounded-2xl shadow-2xl rotate-1';
  } else if (photoStyle === 'arch') {
    frameClasses = 'rounded-t-[140px] rounded-b-3xl shadow-xl overflow-hidden';
  } else if (photoStyle === 'classic') {
    frameClasses = 'rounded-xl border-4 border-white shadow-xl';
  }

  return (
    <section className="text-center pt-8 pb-12 px-4 space-y-6">
      {/* Top Hosts badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/70 shadow-xs border border-black/5">
        <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span>Convite por {hostNames}</span>
      </div>

      {/* Main Titles */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h1
          className="font-serif text-3xl sm:text-5xl font-bold leading-tight"
          style={{ color: primaryColor }}
        >
          {honoreeName || title}
        </h1>
        {headline && (
          <p className="text-sm sm:text-base text-[#302B2D]/80 leading-relaxed font-normal">
            {headline}
          </p>
        )}
      </div>

      {/* Cover / Main Photo */}
      {coverUrl && (
        <div className="max-w-xs sm:max-w-sm mx-auto pt-2">
          <div className={`relative aspect-[4/5] overflow-hidden ${frameClasses}`}>
            <Image
              src={coverUrl}
              alt={honoreeName || title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 320px, 400px"
              priority
            />
          </div>
        </div>
      )}

      {/* Countdown Timer */}
      <div className="pt-4 max-w-md mx-auto">
        {timeRemaining.isPast ? (
          <div className="p-4 rounded-2xl bg-white/80 border border-[#713C48]/10 shadow-xs">
            <span className="font-serif text-lg font-bold" style={{ color: primaryColor }}>
              O grande dia chegou!
            </span>
            <p className="text-xs text-[#302B2D]/70 mt-0.5">
              Celebrando este momento inesquecível.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[#302B2D]/60">
              Contagem Regressiva
            </span>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-black/5">
                <span
                  className="block font-serif text-2xl sm:text-3xl font-extrabold"
                  style={{ color: primaryColor }}
                >
                  {timeRemaining.days}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#302B2D]/60">
                  Dias
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-black/5">
                <span
                  className="block font-serif text-2xl sm:text-3xl font-extrabold"
                  style={{ color: primaryColor }}
                >
                  {timeRemaining.hours}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#302B2D]/60">
                  Horas
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-black/5">
                <span
                  className="block font-serif text-2xl sm:text-3xl font-extrabold"
                  style={{ color: primaryColor }}
                >
                  {timeRemaining.minutes}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#302B2D]/60">
                  Min
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-black/5">
                <span
                  className="block font-serif text-2xl sm:text-3xl font-extrabold"
                  style={{ color: accentColor }}
                >
                  {timeRemaining.seconds}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#302B2D]/60">
                  Seg
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
