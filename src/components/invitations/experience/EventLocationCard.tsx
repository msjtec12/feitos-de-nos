'use client';

import React, { useState } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import {
  Calendar,
  Clock,
  MapPin,
  Navigation,
  CalendarPlus,
  Shirt,
  Quote,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface EventLocationCardProps {
  title: string;
  eventDate: string;
  venueName?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
  dressCode?: string | null;
  openingMessage?: string | null;
  themeConfig: EventThemeConfig;
}

export function EventLocationCard({
  title,
  eventDate,
  venueName,
  address,
  mapsUrl,
  dressCode,
  openingMessage,
  themeConfig,
}: EventLocationCardProps) {
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

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const slug = (themeConfig.themeId || themeConfig.slug || '').toLowerCase();

  const isHero = slug.includes('heroi') || slug.includes('super');
  const isBlocos = slug.includes('bloco') || slug.includes('pixel');
  const isPop = slug.includes('pop') || slug.includes('musica');
  const isReino = slug.includes('reino') || slug.includes('princesa');
  const isMonstrinho = slug.includes('monstrinho') || slug.includes('pokemon');

  // Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const startIso = dateObj.toISOString().replace(/-|:|.ddd/g, '');
    const endDateObj = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000);
    const endIso = endDateObj.toISOString().replace(/-|:|.ddd/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startIso}/${endIso}`,
      details: openingMessage || `Celebração de ${title}`,
      location: address || venueName || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Download iCal (.ics) file
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

  // Copy address to clipboard
  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resolvedMapsUrl =
    mapsUrl ||
    (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '#');

  const wazeUrl = address
    ? `https://waze.com/ul?q=${encodeURIComponent(address)}`
    : resolvedMapsUrl;

  // Themed main card styling
  let containerCardClass = 'bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-black/10 space-y-6 relative overflow-hidden';
  if (isHero) {
    containerCardClass = 'bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[6px_6px_0px_#1E3A8A] space-y-6 relative overflow-hidden';
  } else if (isBlocos) {
    containerCardClass = 'bg-white rounded-none p-6 sm:p-8 border-2 border-emerald-950 shadow-[6px_6px_0px_#15803D] space-y-6 relative overflow-hidden';
  } else if (isPop) {
    containerCardClass = 'bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.25)] space-y-6 relative overflow-hidden';
  } else if (isReino) {
    containerCardClass = 'bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6 relative overflow-hidden';
  } else if (isMonstrinho) {
    containerCardClass = 'bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-400 shadow-xl space-y-6 relative overflow-hidden';
  }

  // Inner item background
  let innerBlockClass = 'flex items-start gap-4 p-4 rounded-2xl bg-[#FFF8F0]/90 border border-black/5 shadow-2xs';
  if (isHero) {
    innerBlockClass = 'flex items-start gap-4 p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 shadow-2xs';
  } else if (isBlocos) {
    innerBlockClass = 'flex items-start gap-4 p-4 rounded-none bg-emerald-50/90 border-2 border-emerald-700 shadow-2xs';
  } else if (isPop) {
    innerBlockClass = 'flex items-start gap-4 p-4 rounded-2xl bg-pink-50/80 border border-pink-200 shadow-2xs';
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Affective Host Letter */}
      {openingMessage && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-black/5 relative overflow-hidden">
          <Quote
            className="w-10 h-10 absolute top-4 right-4 opacity-10"
            style={{ color: primaryColor }}
          />
          <span
            className="text-[11px] uppercase tracking-widest font-black block mb-2"
            style={{ color: accentColor }}
          >
            Mensagem dos Anfitriões
          </span>
          <p className="text-sm sm:text-base text-[#302B2D]/90 leading-relaxed italic font-serif">
            “{openingMessage}”
          </p>
        </div>
      )}

      {/* When and Where Main Card */}
      <div className={containerCardClass}>
        <div className="text-center space-y-1">
          <span
            className="text-[11px] uppercase tracking-widest font-black px-3 py-1 rounded-full inline-block"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            📍 Como Chegar & Horário
          </span>
          <h3
            className={'text-2xl sm:text-3xl font-black ' + (isHero ? 'font-sans uppercase text-blue-950' : 'font-serif')}
            style={{ color: primaryColor }}
          >
            Data & Localização
          </h3>
        </div>

        {/* Date & Time */}
        <div className={innerBlockClass}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
          >
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#302B2D]/60 capitalize block">
              {formattedDayOfWeek}
            </span>
            <p className="text-lg sm:text-xl font-black text-[#1E293B] capitalize">
              {formattedDate}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-[#302B2D]/80 flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-red-500" />
              <span>Início às <strong>{formattedTime}</strong></span>
            </p>
          </div>
        </div>

        {/* Venue & Address */}
        <div className={innerBlockClass}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}
          >
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            {venueName && (
              <p className="text-base sm:text-lg font-black text-[#1E293B]">
                {venueName}
              </p>
            )}
            <p className="text-xs sm:text-sm text-[#302B2D]/80 mt-0.5 leading-relaxed font-medium">
              {address || 'Endereço a ser confirmado pelos anfitriões'}
            </p>

            {address && (
              <button
                type="button"
                onClick={handleCopyAddress}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] bg-white px-3 py-1.5 rounded-xl border border-black/10 transition-all hover:bg-slate-50 shadow-2xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Endereço Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Endereço Completo</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Route Action Buttons: Google Maps & Waze */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={resolvedMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: primaryColor }}
          >
            <Navigation className="w-4 h-4" />
            <span>Abrir no Google Maps</span>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#33CCFF] hover:bg-[#28b5e6] text-slate-900 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4 text-slate-900" />
            <span>Navegar pelo Waze</span>
          </a>
        </div>

        {/* Calendar Add Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-black/10">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all hover:bg-black/5 text-[#302B2D]"
            style={{ borderColor: `${primaryColor}40` }}
          >
            <CalendarPlus className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all hover:bg-black/5 text-[#302B2D]"
            style={{ borderColor: `${primaryColor}40` }}
          >
            <Download className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span>Apple / Outlook (.ics)</span>
          </button>
        </div>

        {/* Dress code */}
        {dressCode && (
          <div className="pt-3 border-t border-black/10 flex items-center justify-center gap-2 text-xs font-medium text-[#302B2D]/85">
            <Shirt className="w-4 h-4 text-red-500" />
            <span>
              <strong>Traje sugerido:</strong> {dressCode}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
