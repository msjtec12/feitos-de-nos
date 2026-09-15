'use client';

import React, { useState, useEffect } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { Sparkles, Calendar, Clock, PartyPopper } from 'lucide-react';

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

  if (time.isToday) {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-100/90 via-rose-100/90 to-amber-100/90 border-2 border-amber-300 shadow-lg text-center space-y-2 animate-bounce max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 text-amber-900 font-extrabold text-sm uppercase tracking-wider">
          <PartyPopper className="w-5 h-5 text-amber-600" />
          <span>Hoje é o grande dia!</span>
          <PartyPopper className="w-5 h-5 text-amber-600" />
        </div>
        <p className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: primaryColor }}>
          A celebração está acontecendo hoje!
        </p>
        <p className="text-xs text-[#302B2D]/80">
          Estamos muito felizes em celebrar com você!
        </p>
      </div>
    );
  }

  if (time.isPast) {
    return (
      <div className="p-5 rounded-2xl bg-white/80 border border-black/5 shadow-xs text-center max-w-md mx-auto">
        <span className="font-serif text-lg font-bold" style={{ color: primaryColor }}>
          Este momento inesquecível já foi celebrado!
        </span>
        <p className="text-xs text-[#302B2D]/70 mt-1">
          Obrigado a todos que compartilharam deste dia com a gente.
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

  return (
    <div className="space-y-3 max-w-md mx-auto pt-2">
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#302B2D]/60">
        <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span>Contagem Regressiva</span>
        <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-black/5 text-center overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Top ambient glow */}
            <div
              className="absolute top-0 inset-x-0 h-1 opacity-70"
              style={{ backgroundColor: i % 2 === 0 ? primaryColor : accentColor }}
            />
            <span
              className="block font-serif text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: primaryColor }}
            >
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#302B2D]/60">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
