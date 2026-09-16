'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { PartyPopper } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { getInvitationThemeCopy } from '@/lib/invitations/theme-copy';

interface InteractiveCountdownProps {
  eventDate?: string;
  themeConfig?: EventThemeConfig;
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

export function InteractiveCountdown(props: InteractiveCountdownProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const eventDate = contextValues?.event.event_date || props.eventDate || new Date().toISOString();
  const countdownStyle = activeTheme.countdownStyle;
  const themeCopy = getInvitationThemeCopy(activeTheme);

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

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;

  if (time.isToday) {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 border-2 border-amber-400 shadow-xl text-center space-y-2 max-w-md mx-auto animate-party-pulse">
        <div className="inline-flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wider">
          <PartyPopper className="w-5 h-5 text-amber-700 animate-bounce" />
          <span>Chegou o Grande Dia!</span>
          <PartyPopper className="w-5 h-5 text-amber-700 animate-bounce" />
        </div>
        <p className="font-serif text-2xl sm:text-3xl font-black" style={{ color: primaryColor }}>
          A celebração está acontecendo hoje! 🎉
        </p>
        <p className="text-xs font-semibold text-slate-800">
          Esperamos por você para vivermos juntos essa alegria!
        </p>
      </div>
    );
  }

  if (time.isPast) {
    return (
      <div className="p-5 rounded-2xl bg-white/95 border border-black/10 shadow-sm text-center max-w-md mx-auto">
        <span className="font-serif text-lg font-bold" style={{ color: primaryColor }}>
          Este momento inesquecível já foi celebrado!
        </span>
        <p className="text-xs text-slate-600 mt-1">
          Agradecemos de coração a todos que compartilharam deste dia especial com a gente.
        </p>
      </div>
    );
  }

  const units = [
    { label: 'DIAS', value: time.days },
    { label: 'HORAS', value: time.hours },
    { label: 'MINUTOS', value: time.minutes },
    { label: 'SEGUNDOS', value: time.seconds },
  ];

  const isDino = countdownStyle === 'dino-eggs';
  const isMinimal = countdownStyle === 'editorial-type';

  return (
    <div className="space-y-3 max-w-md mx-auto pt-2 pb-4">
      {/* Título da contagem com decoração temática */}
      <div className="flex items-center justify-center gap-2">
        {isDino ? (
          <div className="inline-flex items-center gap-2 text-[#15803D] font-black uppercase text-xs tracking-wider">
            <span>🌿</span>
            <span className="bg-[#FEFCE8] px-3 py-1 rounded-full border border-[#15803D]/20 shadow-2xs">
              {themeCopy.countdown}
            </span>
            <span>🌿</span>
          </div>
        ) : isMinimal ? (
          <div className="text-[10px] tracking-[3px] uppercase font-bold text-slate-600">
            Tempo Restante
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-2xs border border-black/5 bg-white/90"
              style={{ color: primaryColor }}
            >
              {themeCopy.countdown}
            </span>
          </div>
        )}
      </div>

      {/* Grid com os 4 itens estilizados de acordo com o tema */}
      <div className="grid grid-cols-2 gap-3 px-5 sm:grid-cols-4 sm:gap-3 sm:px-0">
        {units.map((u, i) => {
          const isSeconds = i === 3;
          const formattedVal = String(u.value).padStart(2, '0');

          // 1. DINOSSAUROS & SAFARI: 4 ovos manchados em ninho de gravetos
          if (isDino) {
            return (
              <div key={i} className="relative flex flex-col items-center justify-center">
                {/* SVG do ovo e ninho como fundo estrutural */}
                <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                  <Image
                    src="/invitations/themes/dinosaurs/dino-egg-countdown.svg"
                    alt={`Ovo ${u.label}`}
                    fill
                    className="object-contain drop-shadow-md"
                  />
                  {/* Número e label centralizados dentro do ovo */}
                  <div className="absolute inset-0 pt-3 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl sm:text-2xl font-black text-[#14532D] leading-none font-sans">
                      {formattedVal}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black text-[#15803D] tracking-tight uppercase mt-0.5 font-sans">
                      {u.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // 2. DEMAIS TEMAS COM ASSET VETORIAL DEDICADO
          const shapeSvg = activeTheme.assets.countdownShapeSvg;

          return (
            <div key={i} className="relative flex flex-col items-center justify-center transition-transform hover:scale-105">
              <div className="relative w-full aspect-[4/5] flex items-center justify-center">
                <Image
                  src={shapeSvg}
                  alt={`Contagem ${u.label}`}
                  fill
                  className="object-contain drop-shadow-sm"
                />
                <div className="absolute inset-0 pt-2 flex flex-col items-center justify-center pointer-events-none">
                  <span
                    className={`text-xl sm:text-2xl font-black leading-none ${
                      isMinimal ? 'font-mono text-black font-light' : 'font-sans'
                    }`}
                    style={{
                      color: isSeconds && !isMinimal ? accentColor : primaryColor,
                    }}
                  >
                    {formattedVal}
                  </span>
                  <span
                    className="text-[9px] sm:text-[10px] font-bold tracking-tight uppercase mt-0.5 opacity-80"
                    style={{ color: primaryColor }}
                  >
                    {u.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
