'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { Calendar, Clock, MapPin, Copy, Check, Navigation, Download } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { getThemeButtonClass, getThemeCardClass } from '@/lib/invitations/theme-ui';
import { getInvitationThemeCopy } from '@/lib/invitations/theme-copy';

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
  const cardClass = `invitation-themed-card ${getThemeCardClass(activeTheme, 'p-3.5 sm:p-6')} space-y-3`;
  const buttonClass = getThemeButtonClass(activeTheme);
  const themeCopy = getInvitationThemeCopy(activeTheme);

  return (
    <section className="mx-auto max-w-2xl space-y-4 px-4 py-4 sm:px-8">
      {/* Cards de Data e Local */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {/* Card 1: Data e Horário */}
        <div className={cardClass}>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${
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
                {themeCopy.date}
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
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${
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
                {themeCopy.location}
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
              <span>{themeCopy.map} &gt;</span>
            </span>
          </div>
        </a>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col items-stretch justify-center gap-2 pt-1 sm:flex-row">
          <a
            href={resolvedMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 items-center justify-center gap-2 px-5 py-3 text-xs font-bold transition-transform hover:scale-[1.02] active:scale-[.98] ${buttonClass}`}
          >
            <Navigation className="w-3.5 h-3.5" />
              <span>{themeCopy.map}</span>
          </a>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-white active:scale-95"
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
