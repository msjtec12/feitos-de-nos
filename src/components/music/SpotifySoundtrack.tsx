'use client';

import React from 'react';
import { ExternalLink, Music2 } from 'lucide-react';
import { GiftSoundtrack } from '@/types/gift';
import { parseSpotifyUrl } from '@/lib/spotify';

interface SpotifySoundtrackProps {
  soundtrack: GiftSoundtrack;
}

export function SpotifySoundtrack({ soundtrack }: SpotifySoundtrackProps) {
  const parsed = parseSpotifyUrl(soundtrack.url);

  if (!soundtrack.enabled || !parsed) return null;

  const isCompact = parsed.type === 'track' || parsed.type === 'episode';
  const height = isCompact ? 152 : 352;

  return (
    <section className="px-4 sm:px-6 max-w-xl mx-auto w-full mb-10" aria-label="Trilha sonora do presente">
      <div className="rounded-3xl border border-brand-rose/30 bg-white/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-wine text-white flex items-center justify-center shrink-0">
            <Music2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-terracotta font-semibold">
              Trilha sonora
            </span>
            <h2 className="font-serif text-xl text-brand-wine font-bold leading-tight mt-0.5">
              {soundtrack.title?.trim() || 'Nossa música'}
            </h2>
            {soundtrack.message?.trim() && (
              <p className="text-sm text-brand-graphite/75 leading-relaxed mt-1.5">
                {soundtrack.message}
              </p>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-black/5">
          <iframe
            title={soundtrack.title?.trim() || 'Música especial no Spotify'}
            src={parsed.embedUrl}
            width="100%"
            height={height}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="block w-full border-0"
          />
        </div>

        <a
          href={parsed.canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-wine hover:text-brand-terracotta transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Abrir no Spotify</span>
        </a>
      </div>
    </section>
  );
}
