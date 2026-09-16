'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Droplets,
  Flame,
  Leaf,
  PartyPopper,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { EventThemeConfig } from '@/types/invitation';
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

interface CountdownUnit {
  label: string;
  value: number;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const targetTime = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = targetTime - now;
  const isToday = new Date(targetDateStr).toDateString() === new Date().toDateString();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday, isPast: !isToday };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isToday,
    isPast: false,
  };
}

const tokenClasses: Record<string, string> = {
  heroes: 'rounded-lg border-[3px] border-slate-950 bg-white shadow-[4px_4px_0_#1e3a8a]',
  enchanted: 'rounded-full border-2 border-amber-300 bg-gradient-to-br from-white via-pink-50 to-fuchsia-100 shadow-[0_8px_18px_rgba(190,24,93,.18)] ring-2 ring-white',
  pop: 'rounded-xl border-2 border-pink-400 bg-gradient-to-b from-purple-950 to-fuchsia-950 text-white shadow-[0_0_18px_rgba(236,72,153,.34)]',
  blocks: 'rounded-none border-[3px] border-emerald-950 bg-emerald-50 shadow-[4px_4px_0_#15803d]',
  baby: 'rounded-[28px] border-2 border-sky-200 bg-white shadow-[0_8px_20px_rgba(59,130,246,.15)]',
  romantic: 'rounded-full border border-rose-300 bg-gradient-to-br from-white to-rose-50 shadow-[0_8px_20px_rgba(159,18,57,.14)] ring-2 ring-rose-100',
  elegant: 'rounded-sm border border-amber-500/70 bg-[#fffdf5] shadow-[0_8px_22px_rgba(28,25,23,.14)] ring-1 ring-amber-200',
  sacred: 'rounded-t-[34px] rounded-b-xl border border-emerald-300 bg-white/95 shadow-[0_8px_20px_rgba(6,95,70,.12)]',
  botanical: 'rounded-[38%] border-2 border-emerald-700/55 bg-[#fffdf5] shadow-[0_8px_20px_rgba(6,78,59,.14)] ring-2 ring-purple-200/70',
  minimal: 'rounded-none border border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,.08)]',
  celebration: 'rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-violet-800 via-fuchsia-700 to-orange-500 text-white shadow-[0_0_18px_rgba(217,70,239,.3)]',
};

const sectionClasses: Record<string, string> = {
  elemental: 'border-2 border-amber-300/70 bg-gradient-to-br from-[#fffdf1] via-white to-orange-50 shadow-[0_18px_45px_rgba(180,83,9,.13)]',
  dinosaurs: 'border-2 border-[#c9a86a]/70 bg-[#fff8df] shadow-[0_18px_45px_rgba(69,43,20,.14)]',
  heroes: 'border-[3px] border-slate-950 bg-blue-50 shadow-[7px_7px_0_#1e3a8a]',
  pop: 'border-2 border-pink-400 bg-[#21133d] shadow-[0_0_28px_rgba(236,72,153,.25)]',
  blocks: 'border-[3px] border-emerald-950 bg-emerald-50 shadow-[6px_6px_0_#15803d]',
  minimal: 'border border-black bg-white shadow-none',
  celebration: 'border-2 border-amber-300 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 shadow-[0_0_30px_rgba(147,51,234,.24)]',
};

const elementalUnits = [
  { Icon: Flame, color: '#DC2626', pale: '#FEF2F2', name: 'Fogo' },
  { Icon: Droplets, color: '#0284C7', pale: '#F0F9FF', name: 'Água' },
  { Icon: Leaf, color: '#15803D', pale: '#F0FDF4', name: 'Natureza' },
  { Icon: Zap, color: '#CA8A04', pale: '#FEFCE8', name: 'Energia' },
];

function ElementalToken({ unit, index }: { unit: CountdownUnit; index: number }) {
  const element = elementalUnits[index];
  const Icon = element.Icon;
  return (
    <div
      className="relative flex min-h-[112px] flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 bg-white px-1.5 py-3 shadow-[0_10px_22px_rgba(28,25,23,.10)] sm:min-h-[132px]"
      style={{ borderColor: `${element.color}88`, background: `linear-gradient(155deg, #fff 15%, ${element.pale} 100%)` }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: element.color }} />
      <div
        className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full"
        style={{ color: element.color, backgroundColor: element.pale }}
        title={element.name}
      >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <span className="text-[25px] font-black leading-none sm:text-[30px]" style={{ color: element.color }}>
        {String(unit.value).padStart(2, '0')}
      </span>
      <span className="mt-1.5 text-[8px] font-black uppercase tracking-[.08em] text-stone-700 sm:text-[9px]">
        {unit.label}
      </span>
    </div>
  );
}

function DinosaurToken({ unit }: { unit: CountdownUnit }) {
  return (
    <div className="relative flex min-h-[124px] items-center justify-center sm:min-h-[150px]">
      <Image src="/invitations/themes/dinosaurs/dino-egg-countdown.svg" alt="" fill className="object-contain drop-shadow-md" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-1 pt-1">
        <span className="text-[26px] font-black leading-none text-[#14532D] sm:text-[32px]">
          {String(unit.value).padStart(2, '0')}
        </span>
        <span className="mt-1.5 text-[8px] font-black uppercase tracking-[.04em] text-[#4a2d14] sm:text-[9px]">
          {unit.label}
        </span>
      </div>
    </div>
  );
}

function StandardToken({
  unit,
  folder,
  index,
  primaryColor,
  accentColor,
}: {
  unit: CountdownUnit;
  folder: string;
  index: number;
  primaryColor: string;
  accentColor: string;
}) {
  const isDark = folder === 'pop' || folder === 'celebration';
  const Icon = folder === 'heroes' ? Shield : Sparkles;
  return (
    <div className={`relative flex min-h-[104px] flex-col items-center justify-center overflow-hidden px-1.5 py-3 sm:min-h-[122px] ${tokenClasses[folder] || 'rounded-2xl border bg-white shadow-lg'}`}>
      <Icon
        className={`mb-1 h-4 w-4 ${isDark ? 'text-amber-200' : ''}`}
        style={isDark ? undefined : { color: index === 3 ? accentColor : primaryColor }}
        strokeWidth={2.2}
      />
      <span
        className={`text-[24px] font-black leading-none sm:text-[29px] ${isDark ? 'text-white' : ''}`}
        style={isDark ? undefined : { color: index === 3 ? accentColor : primaryColor }}
      >
        {String(unit.value).padStart(2, '0')}
      </span>
      <span className={`mt-1.5 text-[8px] font-extrabold uppercase tracking-[.04em] sm:text-[9px] ${isDark ? 'text-white/85' : 'text-slate-700'}`}>
        {unit.label}
      </span>
    </div>
  );
}

export function InteractiveCountdown(props: InteractiveCountdownProps) {
  const contextValues = useOptionalInvitationTheme();
  const activeTheme = contextValues?.theme || getInvitationTheme(
    props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug,
  );
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const eventDate = contextValues?.event.event_date || props.eventDate || new Date().toISOString();
  const themeCopy = getInvitationThemeCopy(activeTheme);
  const folder = activeTheme.assetFolder;

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
    const interval = setInterval(() => setTime(calculateTimeRemaining(eventDate)), 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;

  if (time.isToday) {
    return (
      <div className="mx-auto max-w-md space-y-2 rounded-3xl border-2 border-amber-400 bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 p-6 text-center shadow-xl animate-party-pulse">
        <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-amber-950">
          <PartyPopper className="h-5 w-5 animate-bounce text-amber-700" />
          <span>Chegou o Grande Dia!</span>
          <PartyPopper className="h-5 w-5 animate-bounce text-amber-700" />
        </div>
        <p className="font-serif text-2xl font-black sm:text-3xl" style={{ color: primaryColor }}>
          A celebração está acontecendo hoje!
        </p>
        <p className="text-xs font-semibold text-slate-800">
          Esperamos por você para vivermos juntos essa alegria!
        </p>
      </div>
    );
  }

  if (time.isPast) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-black/10 bg-white/95 p-5 text-center shadow-sm">
        <span className="font-serif text-lg font-bold" style={{ color: primaryColor }}>
          Este momento inesquecível já foi celebrado!
        </span>
        <p className="mt-1 text-xs text-slate-600">
          Agradecemos de coração a todos que compartilharam deste dia especial com a gente.
        </p>
      </div>
    );
  }

  const units: CountdownUnit[] = [
    { label: 'DIAS', value: time.days },
    { label: 'HORAS', value: time.hours },
    { label: 'MINUTOS', value: time.minutes },
    { label: 'SEGUNDOS', value: time.seconds },
  ];
  const darkSection = folder === 'pop' || folder === 'celebration';

  return (
    <section
      className={`relative mx-auto max-w-xl overflow-hidden rounded-[30px] px-3 py-5 sm:px-6 sm:py-7 ${sectionClasses[folder] || 'border border-black/10 bg-white/70 shadow-[0_16px_42px_rgba(15,23,42,.08)]'}`}
      aria-label="Contagem regressiva para o evento"
    >
      <div
        className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: accentColor }}
      />
      <div className="relative mb-4 flex items-center justify-center gap-2.5 sm:mb-5">
        <span className="h-px w-7 sm:w-12" style={{ backgroundColor: darkSection ? '#FDE68A' : `${primaryColor}66` }} />
        {folder === 'dinosaurs' ? (
          <Leaf className="h-4 w-4 text-[#15803D]" />
        ) : folder === 'elemental' ? (
          <Zap className="h-4 w-4 text-amber-600" />
        ) : (
          <Sparkles className={`h-4 w-4 ${darkSection ? 'text-amber-200' : ''}`} style={darkSection ? undefined : { color: accentColor }} />
        )}
        <h2
          className={`text-center text-[11px] font-black uppercase tracking-[.13em] sm:text-xs ${darkSection ? 'text-white' : ''}`}
          style={darkSection ? undefined : { color: primaryColor }}
        >
          {themeCopy.countdown}
        </h2>
        {folder === 'dinosaurs' ? (
          <Leaf className="h-4 w-4 -scale-x-100 text-[#15803D]" />
        ) : folder === 'elemental' ? (
          <Zap className="h-4 w-4 text-amber-600" />
        ) : (
          <Sparkles className={`h-4 w-4 ${darkSection ? 'text-amber-200' : ''}`} style={darkSection ? undefined : { color: accentColor }} />
        )}
        <span className="h-px w-7 sm:w-12" style={{ backgroundColor: darkSection ? '#FDE68A' : `${primaryColor}66` }} />
      </div>

      <div className="relative grid grid-cols-4 gap-1.5 sm:gap-3">
        {units.map((unit, index) => {
          if (folder === 'elemental') return <ElementalToken key={unit.label} unit={unit} index={index} />;
          if (folder === 'dinosaurs') return <DinosaurToken key={unit.label} unit={unit} />;
          return (
            <StandardToken
              key={unit.label}
              unit={unit}
              folder={folder}
              index={index}
              primaryColor={primaryColor}
              accentColor={accentColor}
            />
          );
        })}
      </div>
    </section>
  );
}
