'use client';

import React, { useState, useEffect } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { Sparkles, PartyPopper } from 'lucide-react';

interface InteractiveCountdownProps {
  eventDate: string;
  themeConfig: EventThemeConfig;
  honoreeName?: string | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const targetTime = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  const targetDay = new Date(targetDateStr).toDateString();
  const currentDay = new Date().toDateString();
  const isToday = targetDay === currentDay;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday, isPast: !isToday };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isToday, isPast: false };
}

export function InteractiveCountdown({
  eventDate,
  themeConfig,
  honoreeName,
}: InteractiveCountdownProps) {
  const [time, setTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
    isPast: false,
  });

  useEffect(() => {
    setTime(calculateTimeRemaining(eventDate));
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(eventDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const slug = (themeConfig.themeId || themeConfig.slug || '').toLowerCase();

  const isHero = slug.includes('heroi') || slug.includes('super');
  const isPop = slug.includes('pop') || slug.includes('musica');
  const isBlocos = slug.includes('bloco') || slug.includes('pixel');
  const isReino = slug.includes('reino') || slug.includes('princesa');
  const isMonstrinho = slug.includes('monstrinho') || slug.includes('pokemon');

  if (time.isToday) {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 border-2 border-amber-400 shadow-xl text-center space-y-2 max-w-md mx-auto animate-party-pulse">
        <div className="inline-flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wider">
          <PartyPopper className="w-5 h-5 text-amber-700 animate-bounce" />
          <span>Chegou o Grande Dia!</span>
          <PartyPopper className="w-5 h-5 text-amber-700 animate-bounce" />
        </div>
        <p className="font-serif text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
          A festa está acontecendo hoje! 🎉
        </p>
        <p className="text-xs font-semibold text-[#302B2D]/80">
          Esperamos por você para celebrar com muita alegria!
        </p>
      </div>
    );
  }

  if (time.isPast) {
    return (
      <div className="p-5 rounded-2xl bg-white/90 border border-black/10 shadow-sm text-center max-w-md mx-auto">
        <span className="font-serif text-lg font-bold" style={{ color: primaryColor }}>
          Este momento inesquecível já foi celebrado!
        </span>
        <p className="text-xs text-[#302B2D]/70 mt-1">
          Agradecemos de coração a todos que compartilharam deste dia com a gente.
        </p>
      </div>
    );
  }

  const units = [
    { label: 'Dias', value: time.days },
    { label: 'Horas', value: time.hours },
    { label: 'Minutos', value: time.minutes },
    { label: 'Segundos', value: time.seconds },
  ];

  // Card theme styling
  let cardBoxClass = 'bg-white rounded-2xl p-3 sm:p-4 shadow-md border border-black/10 text-center relative overflow-hidden transition-transform duration-300 hover:scale-105';
  if (isHero) {
    cardBoxClass = 'bg-amber-50 rounded-2xl p-3 sm:p-4 border-2 border-slate-900 shadow-[4px_4px_0px_#DC2626] text-center relative overflow-hidden';
  } else if (isBlocos) {
    cardBoxClass = 'bg-emerald-50 rounded-none p-3 sm:p-4 border-2 border-emerald-950 shadow-[4px_4px_0px_#15803D] text-center relative overflow-hidden font-mono';
  } else if (isPop) {
    cardBoxClass = 'bg-purple-950/80 rounded-2xl p-3 sm:p-4 border-2 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)] text-center relative overflow-hidden text-white';
  } else if (isReino) {
    cardBoxClass = 'bg-pink-50/90 rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-md text-center relative overflow-hidden';
  } else if (isMonstrinho) {
    cardBoxClass = 'bg-amber-50/90 rounded-2xl p-3 sm:p-4 border-2 border-orange-400 shadow-md text-center relative overflow-hidden';
  }

  return (
    <div className="space-y-3 max-w-md mx-auto pt-2">
      {/* Title */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs font-black uppercase tracking-widest text-[#302B2D]/70 bg-white/80 px-3 py-1 rounded-full shadow-2xs border border-black/5">
          ⏳ Contagem Regressiva para a Festa
        </span>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
        {units.map((u, i) => {
          const isSeconds = i === 3;
          return (
            <div key={i} className={cardBoxClass + (isSeconds ? ' ring-2 ring-red-400/40' : '')}>
              {/* Top ambient color stripe */}
              <div
                className="absolute top-0 inset-x-0 h-1.5"
                style={{ backgroundColor: isSeconds ? accentColor : primaryColor }}
              />

              {/* Number */}
              <span
                className={
                  'block text-2xl sm:text-4xl font-black tracking-tight leading-none pt-1 ' +
                  (isHero ? 'font-sans text-red-600 drop-shadow-xs' : isPop ? 'text-pink-400' : 'font-serif')
                }
                style={{ color: isPop ? '#F472B6' : isSeconds ? accentColor : primaryColor }}
              >
                {String(u.value).padStart(2, '0')}
              </span>

              {/* Label */}
              <span
                className={
                  'text-[10px] sm:text-xs font-black uppercase tracking-wider block mt-1.5 ' +
                  (isPop ? 'text-purple-200' : 'text-[#302B2D]/70')
                }
              >
                {u.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
