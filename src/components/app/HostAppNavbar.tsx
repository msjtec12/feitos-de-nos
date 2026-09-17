'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { EventRow } from '@/types/invitation';
import { HostShareModal } from './HostShareModal';
import {
  Sparkles,
  Edit,
  Users,
  QrCode,
  ExternalLink,
  Share2,
  ChevronRight,
} from 'lucide-react';

interface HostAppNavbarProps {
  event: EventRow;
}

export function HostAppNavbar({ event }: HostAppNavbarProps) {
  const pathname = usePathname();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const baseAppUrl = `/app/convite/${event.slug || event.id}`;
  const isEditorActive = pathname === baseAppUrl || pathname === `${baseAppUrl}/`;
  const isGuestsActive = pathname.includes('/convidados');
  const isCheckInActive = pathname.includes('/check-in');

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-[#713C48]/15 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand & Event Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href={baseAppUrl}
              className="flex items-center gap-2 shrink-0 group focus:outline-none"
              title="Ir para o Início do App"
            >
              <BrandLogo size="sm" showSlogan={false} />
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C96E5A]">
                  App do Anfitrião
                </span>
              </div>
            </Link>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-serif font-bold text-sm sm:text-base text-[#713C48] truncate max-w-[140px] sm:max-w-xs">
                  {event.title}
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#713C48]/10 text-[#713C48] shrink-0">
                  {event.status === 'published' ? 'Ao Vivo' : event.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate hidden sm:block">
                /convite/{event.slug}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            <Link
              href={baseAppUrl}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                isEditorActive
                  ? 'bg-white text-[#713C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editar Convite</span>
            </Link>

            <Link
              href={`${baseAppUrl}/convidados`}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                isGuestsActive
                  ? 'bg-white text-[#713C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Convidados & RSVP</span>
            </Link>

            <Link
              href={`${baseAppUrl}/check-in`}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                isCheckInActive
                  ? 'bg-white text-[#713C48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Portaria (Check-in)</span>
            </Link>
          </nav>

          {/* Action Buttons: Share & View Live */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 text-xs font-bold transition-all border border-[#25D366]/30 shadow-2xs"
              title="Compartilhar convite pelo WhatsApp ou copiar link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>

            <Link
              href={`/convite/${event.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#713C48] text-white hover:bg-[#5a2e39] text-xs font-bold transition-all shadow-xs"
              title="Abrir página pública do convite"
            >
              <span>Ver Convite</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      <HostShareModal
        event={event}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
}
