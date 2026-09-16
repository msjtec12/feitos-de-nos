'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { Calendar, Clock, MapPin, Copy, Check, Navigation, Download } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';

interface EventLocationCardProps {
  title?: string;
  eventDate?: string;
  venueName?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
  dressCode?: string | null;
  openingMessage?: string | null;
  themeConfig?: EventThemeConfig;
}

export function EventLocationCard(props: EventLocationCardProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const title = contextValues?.event.title || props.title || 'Evento';
  const eventDate = contextValues?.event.event_date || props.eventDate || new Date().toISOString();
  const venueName = contextValues?.event.venue_name ?? props.venueName;
  const address = contextValues?.event.address ?? props.address;
  const mapsUrl = contextValues?.event.maps_url ?? props.mapsUrl;
  const dressCode = contextValues?.event.dress_code ?? props.dressCode;
  const openingMessage = contextValues?.event.opening_message ?? props.openingMessage;

  const [copied, setCopied] = useState(false);

  const dateObj = new Date(eventDate);
  const formattedDayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const isHero = activeTheme.assetFolder === 'heroes';
  const isBlocos = activeTheme.assetFolder === 'blocks';
  const isMinimal = activeTheme.assetFolder === 'minimal';
  const isPop = activeTheme.assetFolder === 'pop';

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resolvedMapsUrl =
    mapsUrl ||
    (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '#');

  const downloadIcsFile = () => {
    const startIso = dateObj.toISOString().replace(/-|:|.ddd/g, '');
    const endDateObj = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
    const endIso = endDateObj.toISOString().replace(/-|:|.ddd/g, '');

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Feito de Nos//Convites//PT-BR',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${openingMessage || title}`,
      `LOCATION:${address || venueName || ''}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estilização do card com base no material do tema
  let cardClass = 'bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-black/5 space-y-4';
  if (isDino) {
    cardClass = 'bg-[#FAF5E6] rounded-[28px] p-5 sm:p-6 shadow-md border-2 border-[#D4C29D] space-y-4';
  } else if (isHero) {
    cardClass = 'bg-white rounded-2xl p-5 sm:p-6 border-3 border-slate-900 shadow-[5px_5px_0px_#1E3A8A] space-y-4';
  } else if (isBlocos) {
    cardClass = 'bg-[#F0FDF4] rounded-none p-5 sm:p-6 border-3 border-emerald-950 shadow-[5px_5px_0px_#15803D] space-y-4 font-mono';
  } else if (isMinimal) {
    cardClass = 'bg-white rounded-none p-5 sm:p-6 border border-zinc-300 space-y-4';
  } else if (isPop) {
    cardClass = 'bg-purple-950/80 rounded-2xl p-5 sm:p-6 border-2 border-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.3)] space-y-4 text-white';
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-4 space-y-4">
      {/* Cards de Data e Local */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Data e Horário */}
        <div className={cardClass}>
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isDino
                  ? 'bg-[#E07A28] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800'
              }`}
              style={{
                backgroundColor: isDino ? '#E07A28' : `${accentColor}18`,
                color: isDino ? '#FFFFFF' : accentColor,
              }}
            >
              <Calendar className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <span
                className="text-[10px] uppercase font-black tracking-wider block"
                style={{ color: isDino ? '#15803D' : primaryColor }}
              >
                {isDino ? 'Data da expedição' : 'Quando'}
              </span>
              <p className="text-sm font-bold leading-tight">
                {formattedDate}
              </p>
              <p className="text-xs text-slate-600 capitalize">
                {formattedDayOfWeek} às {formattedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Local e Endereço */}
        <div className={cardClass}>
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isDino
                  ? 'bg-[#E07A28] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800'
              }`}
              style={{
                backgroundColor: isDino ? '#E07A28' : `${accentColor}18`,
                color: isDino ? '#FFFFFF' : accentColor,
              }}
            >
              <MapPin className="w-5 h-5" />
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <span
                className="text-[10px] uppercase font-black tracking-wider block"
                style={{ color: isDino ? '#15803D' : primaryColor }}
              >
                {isDino ? 'Local da aventura' : 'Onde'}
              </span>
              <p className="text-sm font-bold truncate leading-tight">
                {venueName || 'Endereço da comemoração'}
              </p>
              {address && (
                <p className="text-xs text-slate-600 line-clamp-2">
                  {address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trajetória de Mapa / Banner de Rota Temático */}
      {isDino ? (
        <a
          href={resolvedMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full max-w-md mx-auto aspect-[380/90] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Image
            src="/invitations/themes/dinosaurs/map-trail-divider.svg"
            alt="Ver localização no mapa"
            fill
            className="object-contain drop-shadow-sm"
          />
          {/* Texto interativo dentro do banner de pergaminho */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-6">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#15803D] uppercase tracking-wide">
              <span>Ver localização no mapa &gt;</span>
            </span>
          </div>
        </a>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <a
            href={resolvedMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Abrir no Google Maps</span>
          </a>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Salvar no Calendário</span>
          </button>
        </div>
      )}

      {/* Traje Recomendado se houver */}
      {dressCode && (
        <div className="text-center pt-1">
          <span className="text-[11px] text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-black/5 shadow-2xs inline-block">
            Traje sugerido: <strong className="text-slate-800">{dressCode}</strong>
          </span>
        </div>
      )}
    </section>
  );
}
