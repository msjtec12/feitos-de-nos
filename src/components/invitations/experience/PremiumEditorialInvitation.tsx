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

        <header className="absolute inset-x-[13%] top-[2.4%] flex h-[9.5%] flex-col items-center justify-center text-center leading-none" style={{ color: visual.plaqueText }}>
          <span className="mb-[2%] font-black uppercase tracking-[.16em] [font-size:clamp(.36rem,1.3vw,.7rem)]">{theme.name}</span>
          <h1 className="line-clamp-2 max-w-full font-black leading-[.92] tracking-[-.035em] [font-size:clamp(.95rem,4.6vw,2.6rem)]" style={{ fontFamily: themeConfig.headingFont || theme.config.headingFont }}>
            {displayName}
          </h1>
        </header>

        <div className="absolute overflow-hidden border-[clamp(3px,.65vw,7px)] border-white/80 shadow-[0_14px_35px_rgba(35,25,18,.24)]" style={{ left: visual.photo.left, top: visual.photo.top, width: visual.photo.width, height: visual.photo.height, borderRadius: visual.photo.radius }}>
          <Image src={coverUrl} alt={displayName} fill sizes="(max-width: 760px) 60vw, 450px" className="object-cover" />
        </div>

        <div className="absolute inset-x-[13%] flex min-h-[5.4%] items-center justify-center text-center font-extrabold leading-tight [font-size:clamp(.48rem,1.85vw,1rem)]" style={{ top: visual.headlineTop, color: visual.primary }}>
          <p className="line-clamp-2">{event.headline || theme.tagline}</p>
        </div>

        <div className="absolute inset-x-[13%] grid grid-cols-4 gap-[2%] text-center" style={{ top: visual.countdownTop }}>
          {values.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <strong className="font-black leading-none [font-size:clamp(1.05rem,4.9vw,2.7rem)]" style={{ color: visual.primary }}>{String(item.value).padStart(2, '0')}</strong>
              <span className="mt-[8%] font-black tracking-[.035em] [font-size:clamp(.32rem,1.25vw,.65rem)]" style={{ color: visual.plaqueText }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-[7%] grid h-[8.2%] grid-cols-2 gap-[5%]" style={{ top: visual.infoTop }}>
          <div className="flex min-w-0 items-center gap-[5%] px-[4%]">
            <CalendarDays className="h-[36%] w-auto shrink-0" style={{ color: visual.accent }} strokeWidth={2.3} />
            <div className="min-w-0 text-left leading-tight" style={{ color: visual.plaqueText }}>
              <span className="block font-black [font-size:clamp(.38rem,1.35vw,.72rem)]">Data do evento</span>
              <strong className="mt-[3%] block [font-size:clamp(.43rem,1.55vw,.83rem)]">{formattedDate}</strong>
              <span className="block opacity-80 [font-size:clamp(.34rem,1.1vw,.6rem)]">às {formattedTime}</span>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-[5%] px-[4%]">
            <MapPin className="h-[36%] w-auto shrink-0" style={{ color: visual.accent }} strokeWidth={2.3} />
            <div className="min-w-0 text-left leading-tight" style={{ color: visual.plaqueText }}>
              <span className="block font-black [font-size:clamp(.38rem,1.35vw,.72rem)]">Local da celebração</span>
              <strong className="mt-[3%] block truncate [font-size:clamp(.43rem,1.55vw,.83rem)]">{event.venue_name || 'Local da comemoração'}</strong>
              <span className="line-clamp-2 opacity-80 [font-size:clamp(.31rem,1vw,.56rem)]">{event.address}</span>
            </div>
          </div>
        </div>

        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-x-[16%] flex h-[4.8%] items-center justify-center font-black transition-transform duration-300 hover:scale-[1.012] [font-size:clamp(.46rem,1.75vw,.95rem)]" style={{ top: visual.routeTop, color: visual.primary }}>
          Ver localização no mapa ›
        </a>

        <button type="button" onClick={openRsvp} className="absolute inset-x-[20%] flex h-[5.5%] items-center justify-center font-black drop-shadow-[0_2px_3px_rgba(0,0,0,.45)] transition-transform duration-300 hover:scale-[1.012] active:scale-[.99] [font-size:clamp(.68rem,2.7vw,1.45rem)]" style={{ top: visual.buttonTop, color: visual.buttonText, fontFamily: themeConfig.headingFont || theme.config.headingFont }}>
          Confirmar presença ›
        </button>
      </section>

      <div className="editorial-rsvp-form mx-auto max-w-2xl px-4">
        <RsvpExperience hideCollapsedCta expansionSignal={rsvpSignal} />
      </div>
    </>
  );
}
