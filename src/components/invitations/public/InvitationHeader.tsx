'use client';

import React from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { Sparkles } from 'lucide-react';

interface InvitationHeaderProps {
  title: string;
  honoreeName?: string | null;
  hostNames: string;
  headline?: string | null;
  coverUrl?: string | null;
  eventDate: string;
  themeConfig: EventThemeConfig;
}

export function InvitationHeader({
  title,
  honoreeName,
  hostNames,
  headline,
  coverUrl,
  themeConfig,
}: InvitationHeaderProps) {
  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const photoStyle = themeConfig.photoStyle || 'rounded';

  // Photo frame styling based on theme
  let frameClasses = 'rounded-3xl shadow-xl';
  let innerExtra = null;

  if (photoStyle === 'polaroid') {
    frameClasses = 'bg-white p-3.5 pb-12 rounded-2xl shadow-2xl rotate-1 hover:rotate-0 transition-transform';
  } else if (photoStyle === 'arch') {
    frameClasses = 'rounded-t-[140px] rounded-b-3xl shadow-xl overflow-hidden';
  } else if (photoStyle === 'classic') {
    frameClasses = 'rounded-xl border-4 border-white shadow-xl';
  } else if (photoStyle === 'pixel') {
    frameClasses = 'rounded-none border-4 border-slate-900 shadow-[6px_6px_0px_#000]';
  } else if (photoStyle === 'gold-border') {
    frameClasses = 'rounded-3xl border-4 border-amber-400/80 p-1 shadow-2xl ring-2 ring-amber-300/40';
  } else if (photoStyle === 'floral-wreath') {
    frameClasses = 'rounded-full border-4 border-rose-200 shadow-xl p-1.5';
  }

  return (
    <section className="text-center pt-4 pb-6 px-4 space-y-5">
      {/* Top Hosts badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/80 shadow-xs border border-black/5">
        <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span>Convite especial por {hostNames}</span>
      </div>

      {/* Main Titles */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h1
          className="font-serif text-3xl sm:text-5xl font-black leading-tight tracking-tight"
          style={{ color: primaryColor }}
        >
          {honoreeName || title}
        </h1>
        {headline && (
          <p className="text-sm sm:text-base text-[#302B2D]/80 leading-relaxed font-normal max-w-md mx-auto">
            {headline}
          </p>
        )}
      </div>

      {/* Cover / Main Photo */}
      {coverUrl && (
        <div className="max-w-xs sm:max-w-sm mx-auto pt-2">
          <div className={'relative aspect-[4/5] overflow-hidden ' + frameClasses}>
            <Image
              src={coverUrl}
              alt={honoreeName || title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 320px, 400px"
              priority
            />
            {photoStyle === 'polaroid' && (
              <div className="absolute bottom-3 inset-x-0 text-center font-serif text-xs italic text-slate-700">
                {honoreeName || title}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
