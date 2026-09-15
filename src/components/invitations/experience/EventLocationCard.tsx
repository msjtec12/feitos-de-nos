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
    setTimeout(() => setCopied(false), 2000);
  };

  const resolvedMapsUrl =
    mapsUrl ||
    (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '#');

  const wazeUrl = address
    ? `https://waze.com/ul?q=${encodeURIComponent(address)}`
    : resolvedMapsUrl;

  return (
    <section className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Affective Host Letter */}
      {openingMessage && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 relative overflow-hidden">
          <Quote
            className="w-10 h-10 absolute top-4 right-4 opacity-10"
            style={{ color: primaryColor }}
          />
          <span
            className="text-[11px] uppercase tracking-widest font-extrabold block mb-3"
            style={{ color: accentColor }}
          >
            Mensagem dos Anfitriões
          </span>
          <p className="text-sm sm:text-base text-[#302B2D]/85 leading-relaxed italic font-serif">
            “{openingMessage}”
          </p>
        </div>
      )}

      {/* When and Where Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
        <h3
          className="font-serif text-xl sm:text-2xl font-bold text-center"
          style={{ color: primaryColor }}
        >
          Data & Localização
        </h3>

        {/* Date & Time */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF8F0]/70 border border-black/5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#302B2D]/60 capitalize">
              {formattedDayOfWeek}
            </span>
            <p className="font-serif text-lg font-bold text-[#1E293B] capitalize">
              {formattedDate}
            </p>
            <p className="text-xs text-[#302B2D]/75 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#C96E5A]" />
              <span>Às {formattedTime}</span>
            </p>
          </div>
        </div>

        {/* Venue & Address */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF8F0]/70 border border-black/5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            {venueName && (
              <p className="font-serif text-base font-bold text-[#1E293B]">
                {venueName}
              </p>
            )}
            <p className="text-xs sm:text-sm text-[#302B2D]/75 mt-0.5 leading-relaxed">
              {address || 'Endereço a confirmar pelos anfitriões'}
            </p>

            {address && (
              <button
                type="button"
                onClick={handleCopyAddress}
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#713C48] hover:text-[#C96E5A] bg-white px-2.5 py-1 rounded-lg border border-black/5 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Endereço copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar endereço</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Route Options: Google Maps & Waze */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={resolvedMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: primaryColor }}
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps</span>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-[#33CCFF] hover:bg-[#29b6e6] text-slate-900 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4" />
            <span>Abrir no Waze</span>
          </a>
        </div>

        {/* Calendar Add Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-black/5">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:bg-black/5 text-[#302B2D]"
            style={{ borderColor: `${primaryColor}30` }}
          >
            <CalendarPlus className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span>Google Calendar</span>
          </a>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:bg-black/5 text-[#302B2D]"
            style={{ borderColor: `${primaryColor}30` }}
          >
            <Download className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span>Apple / Outlook (.ics)</span>
          </button>
        </div>

        {/* Dress code */}
        {dressCode && (
          <div className="pt-3 border-t border-black/5 flex items-center justify-center gap-2 text-xs text-[#302B2D]/80">
            <Shirt className="w-4 h-4 text-[#C96E5A]" />
            <span>
              <strong>Traje sugerido:</strong> {dressCode}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
