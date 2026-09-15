'use client';

import React from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
import {
  ThematicHeaderBanner,
  HeroActionBurst,
  HeroShield,
  ElementalFire,
  ElementalWater,
  FairyCastle,
  NeonMusicNotes,
  PixelGrassBlock,
  FriendlyDino,
  DreamyMoon,
} from '../experience/ThemeDecorations';
import { getThemeDefaultHeroImage } from '@/data/invitation-themes';

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
  const themeSlug = (themeConfig.themeId || themeConfig.slug || '').toLowerCase();

  // Resolve cover photo: custom uploaded photo OR high-resolution professional theme artwork
  const heroImage = coverUrl || getThemeDefaultHeroImage(themeSlug);
  const isDefaultArtwork = !coverUrl;

  // Frame styling based on photoStyle
  let frameClasses = 'rounded-3xl shadow-2xl';
  if (photoStyle === 'polaroid') {
    frameClasses = 'bg-white p-3.5 pb-12 rounded-2xl shadow-2xl rotate-1 hover:rotate-0 transition-transform';
  } else if (photoStyle === 'arch') {
    frameClasses = 'rounded-t-[140px] rounded-b-3xl shadow-2xl overflow-hidden border-2 border-white/60';
  } else if (photoStyle === 'classic') {
    frameClasses = 'rounded-2xl border-4 border-white shadow-2xl';
  } else if (photoStyle === 'pixel') {
    frameClasses = 'rounded-none border-4 border-slate-900 shadow-[8px_8px_0px_#052E16]';
  } else if (photoStyle === 'gold-border') {
    frameClasses = 'rounded-3xl border-4 border-amber-400 p-1.5 shadow-2xl ring-2 ring-amber-300/50';
  } else if (photoStyle === 'floral-wreath') {
    frameClasses = 'rounded-full border-4 border-rose-300 p-2 shadow-2xl aspect-square';
  }

  // Is comic hero theme?
  const isHeroTheme = themeSlug.includes('heroi') || themeSlug.includes('super');
  const isElementalTheme = themeSlug.includes('monstrinho') || themeSlug.includes('pokemon');
  const isReinoTheme = themeSlug.includes('reino') || themeSlug.includes('princesa');
  const isPopTheme = themeSlug.includes('pop') || themeSlug.includes('musica');
  const isBlocosTheme = themeSlug.includes('bloco') || themeSlug.includes('pixel');

  return (
    <section className="text-center pt-2 pb-6 px-4 space-y-5 relative">
      {/* 1. Thematic Top Badge Banner */}
      <div className="flex justify-center">
        <ThematicHeaderBanner
          themeId={themeConfig.themeId}
          themeSlug={themeConfig.slug}
          primaryColor={primaryColor}
          accentColor={accentColor}
          badgeText={
            isHeroTheme
              ? '⚡ CONVITE DE SUPER-HERÓI ⚡'
              : isElementalTheme
              ? '✨ CONVITE DOS ELEMENTOS ✨'
              : isReinoTheme
              ? '👑 CONVITE REAL DOS CONTOS 👑'
              : isPopTheme
              ? '🎵 SHOW & FESTA POP VIP 🎵'
              : isBlocosTheme
              ? '🧱 MISSÃO MUNDO DOS BLOCOS 🧱'
              : `Convite especial por ${hostNames}`
          }
        />
      </div>

      {/* 2. Main Title (Honoree) with Dynamic Themed Typography */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h1
          className={
            'text-3xl sm:text-5xl font-black leading-tight tracking-tight ' +
            (isHeroTheme
              ? 'uppercase font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] text-blue-950'
              : isPopTheme
              ? 'font-sans text-pink-600 drop-shadow-[0_0_12px_rgba(236,72,153,0.3)]'
              : 'font-serif')
          }
          style={{ color: primaryColor }}
        >
          {honoreeName || title}
        </h1>

        {headline ? (
          <p className="text-sm sm:text-base text-[#302B2D]/85 leading-relaxed font-medium max-w-md mx-auto">
            {headline}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-[#302B2D]/75 italic max-w-md mx-auto">
            Você foi convidado com muito carinho para celebrar esse grande momento!
          </p>
        )}
      </div>

      {/* 3. Hero Photo / Themed Artwork with Corner Stickers */}
      <div className="max-w-xs sm:max-w-sm mx-auto pt-1 relative">
        {/* Themed corner stickers */}
        {isHeroTheme && (
          <>
            <div className="absolute -top-4 -right-4 z-20 animate-comic-action">
              <HeroActionBurst className="w-16 h-16 drop-shadow-xl" text="POW!" />
            </div>
            <div className="absolute -bottom-3 -left-3 z-20">
              <HeroShield className="w-12 h-12 drop-shadow-lg" />
            </div>
          </>
        )}

        {isElementalTheme && (
          <>
            <div className="absolute -top-3 -right-3 z-20 animate-bounce">
              <ElementalFire className="w-14 h-14 drop-shadow-xl" />
            </div>
            <div className="absolute -bottom-3 -left-3 z-20">
              <ElementalWater className="w-12 h-12 drop-shadow-lg" />
            </div>
          </>
        )}

        {isReinoTheme && (
          <div className="absolute -top-4 -right-3 z-20 animate-pulse">
            <FairyCastle className="w-14 h-14 drop-shadow-xl" />
          </div>
        )}

        {isPopTheme && (
          <div className="absolute -top-3 -right-3 z-20 animate-pulse">
            <NeonMusicNotes className="w-14 h-14 drop-shadow-xl" />
          </div>
        )}

        {isBlocosTheme && (
          <div className="absolute -top-3 -right-3 z-20">
            <PixelGrassBlock className="w-14 h-14 drop-shadow-xl" />
          </div>
        )}

        {/* The Photo Container */}
        <div className={'relative aspect-[4/5] overflow-hidden bg-slate-100 ' + frameClasses}>
          <Image
            src={heroImage}
            alt={honoreeName || title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 320px, 400px"
            priority
          />

          {/* Polaroid Name Label */}
          {photoStyle === 'polaroid' && (
            <div className="absolute bottom-3 inset-x-0 text-center font-serif text-xs italic font-bold text-slate-800">
              {honoreeName || title}
            </div>
          )}

          {/* If using default artwork, add subtle thematic banner tag */}
          {isDefaultArtwork && (
            <div className="absolute bottom-3 inset-x-3 bg-white/90 backdrop-blur-md rounded-xl p-2 text-center text-[11px] font-bold shadow-md border border-white/50" style={{ color: primaryColor }}>
              ✦ Celebração Inesquecível ✦
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
