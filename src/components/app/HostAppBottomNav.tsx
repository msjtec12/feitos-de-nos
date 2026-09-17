'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EventRow } from '@/types/invitation';
import { Edit, Users, QrCode, ExternalLink } from 'lucide-react';

interface HostAppBottomNavProps {
  event: EventRow;
}

export function HostAppBottomNav({ event }: HostAppBottomNavProps) {
  const pathname = usePathname();

  const baseAppUrl = `/app/convite/${event.slug || event.id}`;
  const isEditorActive = pathname === baseAppUrl || pathname === `${baseAppUrl}/`;
  const isGuestsActive = pathname.includes('/convidados');
  const isCheckInActive = pathname.includes('/check-in');

  // If the user is on the editor page, the editor has its own save bar.
  // When in editor mode, we keep this bottom nav subtle or integrate seamlessly.
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#713C48]/15 pb-[env(safe-area-inset-bottom)] shadow-xl">
      <div className="grid grid-cols-4 h-14">
        {/* Tab 1: Editor */}
        <Link
          href={baseAppUrl}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isEditorActive
              ? 'text-[#713C48] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isEditorActive ? 'bg-[#713C48]/10 text-[#713C48]' : ''
            }`}
          >
            <Edit className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-none">Editor</span>
        </Link>

        {/* Tab 2: Convidados */}
        <Link
          href={`${baseAppUrl}/convidados`}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isGuestsActive
              ? 'text-[#713C48] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isGuestsActive ? 'bg-[#713C48]/10 text-[#713C48]' : ''
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-none">Convidados</span>
        </Link>

        {/* Tab 3: Check-in Portaria */}
        <Link
          href={`${baseAppUrl}/check-in`}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isCheckInActive
              ? 'text-[#713C48] font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isCheckInActive ? 'bg-[#713C48]/10 text-[#713C48]' : ''
            }`}
          >
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-none">Portaria</span>
        </Link>

        {/* Tab 4: Abrir Convite */}
        <Link
          href={`/convite/${event.slug}`}
          target="_blank"
          className="flex flex-col items-center justify-center gap-1 text-[#C96E5A] hover:text-[#713C48] font-medium transition-colors"
        >
          <div className="p-1 rounded-xl bg-[#C96E5A]/10 text-[#C96E5A]">
            <ExternalLink className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-none font-bold">Ver Convite</span>
        </Link>
      </div>
    </nav>
  );
}
