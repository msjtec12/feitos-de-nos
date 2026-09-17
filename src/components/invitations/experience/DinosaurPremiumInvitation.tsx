'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, MapPin } from 'lucide-react';
import { useInvitationTheme } from './InvitationExperience';
import { RsvpExperience } from './RsvpExperience';

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function remainingUntil(date: string): RemainingTime {
  const difference = Math.max(0, new Date(date).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export function DinosaurPremiumInvitation() {
  const { event, theme } = useInvitationTheme();
  const [time, setTime] = useState(() => remainingUntil(event.event_date));
  const [rsvpSignal, setRsvpSignal] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(remainingUntil(event.event_date)), 1000);
    return () => window.clearInterval(interval);
  }, [event.event_date]);

  const date = useMemo(() => new Date(event.event_date), [event.event_date]);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
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

  const openRsvp = () => {
    setRsvpSignal((current) => current + 1);
    window.setTimeout(() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  return (
    <>
      <section className="dino-premium-poster relative mx-auto aspect-[9/16] w-full max-w-[760px] overflow-hidden" aria-label="Convite safari de dinossauros">
        <Image
          src="/invitations/themes/dinosaurs/safari-premium-background.webp"
          alt="Cenário ilustrado de uma expedição de dinossauros"
          fill
          priority
          sizes="(max-width: 760px) 100vw, 760px"
          className="object-cover"
        />

        <div className="absolute inset-x-[20%] top-[2.5%] flex h-[5.6%] items-center justify-center text-center">
          <span className="font-black uppercase tracking-[.08em] text-[#4a2d14] [font-size:clamp(.5rem,2vw,1.15rem)]">
            Expedição de 1 ano
          </span>
        </div>

        <header className="absolute inset-x-[11%] top-[8.8%] flex h-[12.2%] flex-col items-center justify-center text-center">
          <h1 className="line-clamp-1 font-serif font-black leading-[.88] tracking-[-.04em] [font-size:clamp(1.6rem,7vw,3.8rem)]">
            <span className="text-[#166534]">{(event.honoree_name || event.title).split(' ')[0]}</span>{' '}
            <span className="text-[#c2410c]">{(event.honoree_name || event.title).split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="mx-auto mt-[1.2%] max-w-[88%] font-extrabold leading-tight text-[#5b351f] [font-size:clamp(.48rem,1.75vw,.95rem)]">
            {event.headline || 'Nosso pequeno explorador está completando seu primeiro ano de aventuras!'}
          </p>
        </header>

        <div className="absolute left-[21.5%] top-[21.8%] h-[25.4%] w-[57%] overflow-hidden rounded-[12%] border-[clamp(3px,.7vw,7px)] border-[#fff3cf] shadow-[0_12px_30px_rgba(68,48,23,.2)]">
          <Image
            src={coverUrl}
            alt={event.honoree_name || event.title}
            fill
            unoptimized={coverUrl.startsWith('data:') || coverUrl.startsWith('/api/')}
            sizes="(max-width: 760px) 58vw, 430px"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-x-[14%] top-[50.8%] flex h-[3.2%] items-center justify-center text-center font-black uppercase tracking-[.14em] text-[#166534] [font-size:clamp(.46rem,1.7vw,.88rem)]">
          <span>Contagem regressiva</span>
        </div>

        <div className="absolute inset-x-[11%] top-[54.6%] grid h-[9.8%] grid-cols-4 gap-[2.5%] text-center">
          {values.map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center min-w-0">
              <strong className="font-black leading-none text-[#14532d] drop-shadow-xs [font-size:clamp(1.15rem,5.2vw,2.75rem)]">
                {String(item.value).padStart(2, '0')}
              </strong>
              <span className="mt-[6%] font-black tracking-[.06em] text-[#4a2d14] [font-size:clamp(.34rem,1.35vw,.68rem)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-[11.5%] top-[67.2%] grid h-[8.4%] grid-cols-2 gap-[4%]">
          <div className="flex min-w-0 items-center gap-[6%] px-[6%] py-[2%]">
            <CalendarDays className="h-[40%] w-auto shrink-0 text-[#c2410c]" strokeWidth={2.4} />
            <div className="min-w-0 text-left leading-tight">
              <span className="block font-black text-[#166534] [font-size:clamp(.38rem,1.35vw,.72rem)]">Data da expedição</span>
              <strong className="mt-[2%] block text-[#5b351f] [font-size:clamp(.44rem,1.55vw,.84rem)]">{formattedDate}</strong>
              <span className="block text-[#6b4b37] opacity-85 [font-size:clamp(.34rem,1.15vw,.62rem)]">às {formattedTime}</span>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-[6%] px-[6%] py-[2%]">
            <MapPin className="h-[40%] w-auto shrink-0 text-[#c2410c]" strokeWidth={2.4} />
            <div className="min-w-0 text-left leading-tight">
              <span className="block font-black text-[#166534] [font-size:clamp(.38rem,1.35vw,.72rem)]">Local da aventura</span>
              <strong className="mt-[2%] block truncate text-[#5b351f] [font-size:clamp(.44rem,1.55vw,.84rem)]">{event.venue_name || 'Local da comemoração'}</strong>
              <span className="line-clamp-2 text-[#6b4b37] opacity-85 [font-size:clamp(.32rem,1.05vw,.58rem)]">{event.address}</span>
            </div>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-[16%] top-[77.0%] flex h-[4.4%] items-center justify-center font-black text-[#166534] transition-transform duration-300 hover:scale-[1.015] active:scale-[.99] [font-size:clamp(.48rem,1.8vw,.95rem)]"
        >
          Ver localização no mapa ›
        </a>

        <button
          type="button"
          onClick={openRsvp}
          className="absolute inset-x-[19%] top-[84.4%] flex h-[6.4%] items-center justify-center font-serif font-black text-white drop-shadow-[0_2px_4px_rgba(68,31,8,.75)] transition-transform duration-300 hover:scale-[1.015] active:scale-[.985] [font-size:clamp(.76rem,3vw,1.65rem)]"
        >
          Confirmar presença ›
        </button>
      </section>

      <div className="dino-rsvp-form mx-auto max-w-2xl px-4">
        <RsvpExperience hideCollapsedCta expansionSignal={rsvpSignal} />
      </div>
    </>
  );
}