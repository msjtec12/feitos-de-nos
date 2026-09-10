'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiftExperience } from '@/types/gift';
import { PresenteClientView } from '@/app/presente/[slug]/PresenteClientView';

interface PreviewClientEmbedProps {
  initialGift: GiftExperience;
  isEmbed: boolean;
  title: string;
  pageId: string;
}

export function PreviewClientEmbed({
  initialGift,
  isEmbed,
  title,
  pageId,
}: PreviewClientEmbedProps) {
  const [gift, setGift] = useState<GiftExperience>(initialGift);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_EXPERIENCE' && event.data.gift) {
        setGift(event.data.gift);
      }
    };

    window.addEventListener('message', handleMessage);

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div
      style={{ backgroundColor: gift.theme?.backgroundColor || '#FFF8F0' }}
      className="min-h-screen relative"
    >
      {!isEmbed && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#713C48] text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-4 text-xs font-medium border border-white/20 backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Modo de Prévia Administrativa
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/80 max-w-[200px] truncate">{title}</span>
          <span className="text-white/40">|</span>
          <Link
            href={`/admin/paginas/${pageId}/editar`}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
          >
            ← Voltar para o Editor
          </Link>
        </div>
      )}

      <PresenteClientView gift={gift} initialOpen={isEmbed} />
    </div>
  );
}
