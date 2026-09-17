'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, MapPin } from 'lucide-react';
import { useInvitationTheme } from './InvitationExperience';
import { RsvpExperience } from './RsvpExperience';
import { getPremiumThemeVisual } from '@/lib/invitations/premium-theme-visuals';

interface RemainingTime { days: number; hours: number; minutes: number; seconds: number }

function remainingUntil(date: string): RemainingTime {
  const difference = Math.max(0, new Date(date).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export function PremiumEditorialInvitation() {
  const { event, theme, themeConfig } = useInvitationTheme();
  const visual = getPremiumThemeVisual(theme.assetFolder);
  const [time, setTime] = useState(() => remainingUntil(event.event_date));
  const [rsvpSignal, setRsvpSignal] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(remainingUntil(event.event_date)), 1000);
    return () => window.clearInterval(interval);
  }, [event.event_date]);

  const date = useMemo(() => new Date(event.event_date), [event.event_date]);
  if (!visual) return null;

  const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const mapsUrl = event.maps_url || (event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : '#');
  const coverUrl = event.cover_url || theme.defaultHeroImage;
  const values = [
    { label: 'DIAS', value: time.days },
    { label: 'HORAS', value: time.hours },
    { label: 'MINUTOS', value: time.minutes },
    { label: 'SEGUNDOS', value: time.seconds },
  ];
  const displayName = event.honoree_name || event.title;

  const openRsvp = () => {
    setRsvpSignal((current) => current + 1);
    window.setTimeout(() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  return (
    <>
      <section className="editorial-premium-poster relative mx-auto aspect-[9/16] w-full max-w-[760px] overflow-hidden" aria-label={`Convite ${theme.name}`}>
        <Image src={visual.background} alt={`Cenário ilustrado do tema ${theme.name}`} fill priority sizes="(max-width: 760px) 100vw, 760px" className="object-cover" />

        {/* 1. Placa Superior / Selo de Abertura */}
        <div
          className="absolute flex items-center justify-center text-center leading-none"
          style={{
            top: visual.topBadge.top,
            height: visual.topBadge.height,
            left: visual.topBadge.insetX || '18%',
            right: visual.topBadge.insetX || '18%',
          }}
        >
          <span
            className="font-black uppercase tracking-[.16em] [font-size:clamp(.42rem,1.5vw,.82rem)]"
            style={{ color: visual.plaqueText }}
          >
            {visual.openingLabel || theme.heroBadge || theme.name}
          </span>
        </div>

        {/* 2. Área do Homenageado: Título e Subtítulo */}
        <header
          className="absolute flex flex-col items-center justify-center text-center"
          style={{
            top: visual.headline.top,
            height: visual.headline.height,
            left: visual.headline.insetX || '11%',
            right: visual.headline.insetX || '11%',
          }}
        >
          <h1
            className="line-clamp-1 max-w-full font-black leading-[.95] tracking-[-.035em] drop-shadow-[0_2px_4px_rgba(255,255,255,0.75)]"
            style={{
              color: visual.primary,
              fontFamily: themeConfig.headingFont || theme.config.headingFont,
              fontSize: visual.headline.sizeClamp || 'clamp(1.3rem,5.8vw,3.1rem)',
            }}
          >
            {displayName}
          </h1>
          <p
            className="mx-auto mt-[1.2%] line-clamp-2 max-w-[92%] font-extrabold leading-tight [font-size:clamp(.46rem,1.65vw,.92rem)]"
            style={{ color: visual.plaqueText }}
          >
            {event.headline || theme.tagline}
          </p>
        </header>

        {/* 3. Moldura Central de Foto / Pergaminho */}
        <div
          className="absolute overflow-hidden border-[clamp(3px,.65vw,7px)] border-white/85 shadow-[0_14px_35px_rgba(35,25,18,.25)]"
          style={{
            left: visual.photo.left,
            top: visual.photo.top,
            width: visual.photo.width,
            height: visual.photo.height,
            borderRadius: visual.photo.radius,
          }}
        >
          <Image
            src={coverUrl}
            alt={displayName}
            fill
            unoptimized={coverUrl.startsWith('data:') || coverUrl.startsWith('/api/')}
            sizes="(max-width: 760px) 60vw, 450px"
            className="object-cover"
          />
        </div>

        {/* 4. Faixa e Título da Contagem Regressiva */}
        <div
          className="absolute flex items-center justify-center text-center font-black uppercase tracking-[.14em] [font-size:clamp(.46rem,1.7vw,.88rem)]"
          style={{
            top: visual.countdownTitle.top,
            height: visual.countdownTitle.height,
            left: visual.countdownTitle.insetX || '14%',
            right: visual.countdownTitle.insetX || '14%',
            color: visual.primary,
          }}
        >
          <span>Contagem regressiva</span>
        </div>

        {/* 5. Os 4 Pods / Círculos da Contagem Regressiva */}
        <div
          className="absolute grid grid-cols-4 text-center"
          style={{
            top: visual.countdownPods.top,
            height: visual.countdownPods.height,
            left: visual.countdownPods.insetX || '11%',
            right: visual.countdownPods.insetX || '11%',
            gap: visual.countdownPods.gap || '2.5%',
          }}
        >
          {values.map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center min-w-0">
              <strong
                className="font-black leading-none drop-shadow-sm [font-size:clamp(1.15rem,5.2vw,2.75rem)]"
                style={{ color: visual.primary }}
              >
                {String(item.value).padStart(2, '0')}
              </strong>
              <span
                className="mt-[6%] font-black tracking-[.06em] [font-size:clamp(.34rem,1.35vw,.68rem)]"
                style={{ color: visual.plaqueText }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 6. Placas Ilustradas: Data e Local */}
        <div
          className="absolute grid grid-cols-2"
          style={{
            top: visual.infoPlaques.top,
            height: visual.infoPlaques.height,
            left: visual.infoPlaques.insetX || '11.5%',
            right: visual.infoPlaques.insetX || '11.5%',
            gap: visual.infoPlaques.gap || '4%',
          }}
        >
          <div className="flex min-w-0 items-center gap-[6%] px-[6%] py-[2%]">
            <CalendarDays className="h-[40%] w-auto shrink-0" style={{ color: visual.accent }} strokeWidth={2.4} />
            <div className="min-w-0 text-left leading-tight" style={{ color: visual.plaqueText }}>
              <span className="block font-black [font-size:clamp(.38rem,1.35vw,.72rem)]">Data do evento</span>
              <strong className="mt-[2%] block [font-size:clamp(.44rem,1.55vw,.84rem)]">{formattedDate}</strong>
              <span className="block opacity-85 [font-size:clamp(.34rem,1.15vw,.62rem)]">às {formattedTime}</span>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-[6%] px-[6%] py-[2%]">
            <MapPin className="h-[40%] w-auto shrink-0" style={{ color: visual.accent }} strokeWidth={2.4} />
            <div className="min-w-0 text-left leading-tight" style={{ color: visual.plaqueText }}>
              <span className="block font-black [font-size:clamp(.38rem,1.35vw,.72rem)]">Local da celebração</span>
              <strong className="mt-[2%] block truncate [font-size:clamp(.44rem,1.55vw,.84rem)]">{event.venue_name || 'Local da comemoração'}</strong>
              <span className="line-clamp-2 opacity-85 [font-size:clamp(.32rem,1.05vw,.58rem)]">{event.address}</span>
            </div>
          </div>
        </div>

        {/* 7. Banner de Trilha / Mapa */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute flex items-center justify-center font-black transition-transform duration-300 hover:scale-[1.015] active:scale-[.99] [font-size:clamp(.48rem,1.8vw,.95rem)]"
          style={{
            top: visual.mapBanner.top,
            height: visual.mapBanner.height,
            left: visual.mapBanner.insetX || '16%',
            right: visual.mapBanner.insetX || '16%',
            color: visual.primary,
          }}
        >
          Ver localização no mapa ›
        </a>

        {/* 8. Botão Confirmar Presença */}
        <button
          type="button"
          onClick={openRsvp}
          className="absolute flex items-center justify-center font-black drop-shadow-[0_2px_4px_rgba(0,0,0,.55)] transition-transform duration-300 hover:scale-[1.015] active:scale-[.985] [font-size:clamp(.72rem,2.85vw,1.55rem)]"
          style={{
            top: visual.rsvpButton.top,
            height: visual.rsvpButton.height,
            left: visual.rsvpButton.insetX || '19%',
            right: visual.rsvpButton.insetX || '19%',
            color: visual.buttonText,
            fontFamily: themeConfig.headingFont || theme.config.headingFont,
          }}
        >
          Confirmar presença ›
        </button>
      </section>

      <div className="editorial-rsvp-form mx-auto max-w-2xl px-4">
        <RsvpExperience hideCollapsedCta expansionSignal={rsvpSignal} />
      </div>
    </>
  );
}
