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

        <div className="absolute inset-x-[24%] top-[2.8%] flex h-[5.6%] items-center justify-center text-center">
          <span className="font-black uppercase tracking-[.08em] text-[#4a2d14] [font-size:clamp(.55rem,2.25vw,1.35rem)]">
            Expedição de 1 ano
          </span>
        </div>

        <header className="absolute inset-x-[12%] top-[9.4%] text-center">
          <h1 className="font-serif font-black leading-[.88] tracking-[-.04em] [font-size:clamp(2rem,8.5vw,5rem)]">
            <span className="text-[#166534]">{(event.honoree_name || event.title).split(' ')[0]}</span>{' '}
            <span className="text-[#c2410c]">{(event.honoree_name || event.title).split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="mx-auto mt-[1.4%] max-w-[85%] font-semibold leading-tight text-[#5b351f] [font-size:clamp(.6rem,2.35vw,1.3rem)]">
            {event.headline || 'Nosso pequeno explorador está completando seu primeiro ano de aventuras!'}
          </p>
        </header>

        <div className="absolute left-[21.5%] top-[22.1%] h-[25.2%] w-[57%] overflow-hidden rounded-[12%] border-[clamp(3px,.7vw,7px)] border-[#fff3cf] shadow-[0_12px_30px_rgba(68,48,23,.2)]">
          <Image
            src={coverUrl}
            alt={event.honoree_name || event.title}
            fill
            sizes="(max-width: 760px) 58vw, 430px"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-x-[14%] top-[51.9%] text-center font-black uppercase tracking-[.13em] text-[#166534] [font-size:clamp(.55rem,2vw,1.1rem)]">
          Contagem regressiva
        </div>
        <div className="absolute inset-x-[13%] top-[56.5%] grid grid-cols-4 gap-[2%] text-center">
          {values.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <strong className="font-black leading-none text-[#14532d] [font-size:clamp(1.15rem,5.2vw,2.75rem)]">
                {String(item.value).padStart(2, '0')}
              </strong>
              <span className="mt-[8%] font-black tracking-[.04em] text-[#4a2d14] [font-size:clamp(.36rem,1.45vw,.72rem)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-[7%] top-[68.4%] grid h-[8.2%] grid-cols-2 gap-[5%]">
          <div className="flex min-w-0 items-center gap-[5%] px-[4%]">
            <CalendarDays className="h-[38%] w-auto shrink-0 text-[#c2410c]" strokeWidth={2.3} />
            <div className="min-w-0 text-left leading-tight">
              <span className="block font-black text-[#166534] [font-size:clamp(.42rem,1.5vw,.78rem)]">Data da expedição</span>
              <strong className="mt-[3%] block text-[#5b351f] [font-size:clamp(.48rem,1.75vw,.92rem)]">{formattedDate}</strong>
              <span className="block text-[#6b4b37] [font-size:clamp(.38rem,1.25vw,.68rem)]">às {formattedTime}</span>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-[5%] px-[4%]">
            <MapPin className="h-[38%] w-auto shrink-0 text-[#c2410c]" strokeWidth={2.3} />
            <div className="min-w-0 text-left leading-tight">
              <span className="block font-black text-[#166534] [font-size:clamp(.42rem,1.5vw,.78rem)]">Local da aventura</span>
              <strong className="mt-[3%] block truncate text-[#5b351f] [font-size:clamp(.48rem,1.75vw,.92rem)]">{event.venue_name || 'Local da comemoração'}</strong>
              <span className="line-clamp-2 text-[#6b4b37] [font-size:clamp(.34rem,1.1vw,.62rem)]">{event.address}</span>
            </div>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-[16%] top-[80.2%] flex h-[4.8%] items-center justify-center font-black text-[#166534] transition-transform duration-300 hover:scale-[1.015] [font-size:clamp(.52rem,2vw,1.05rem)]"
        >
          Ver localização no mapa ›
        </a>

        <button
          type="button"
          onClick={openRsvp}
          className="absolute inset-x-[20%] top-[87.4%] flex h-[5.4%] items-center justify-center font-serif font-black text-white drop-shadow-[0_2px_3px_rgba(68,31,8,.7)] transition-transform duration-300 hover:scale-[1.015] active:scale-[.99] [font-size:clamp(.8rem,3.4vw,1.75rem)]"
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