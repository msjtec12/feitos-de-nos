'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Droplets, Flame, Leaf, Zap } from 'lucide-react';
import { EventThemeConfig } from '@/types/invitation';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme, getThemeDefaultHeroImage } from '@/data/invitation-themes';
import { getThemeHeadingStyle, getThemePhotoFrameClass } from '@/lib/invitations/theme-ui';
import { ThemeHeroBadge, ThemeMotif } from './ThemeScenery';

function ElementalCompanions() {
  const companions = [
    { Icon: Flame, color: '#DC2626', className: '-left-3 bottom-16 -rotate-12' },
    { Icon: Droplets, color: '#0284C7', className: '-right-3 top-16 rotate-12' },
    { Icon: Leaf, color: '#15803D', className: 'left-8 -bottom-3 rotate-6' },
    { Icon: Zap, color: '#CA8A04', className: 'right-8 -bottom-3 -rotate-6' },
  ];

  return (
    <>
      {companions.map(({ Icon, color, className }, index) => (
        <div
          key={index}
          className={`absolute z-30 flex h-12 w-12 items-center justify-center rounded-[42%] border-2 border-white bg-white shadow-[0_10px_24px_rgba(28,25,23,.22)] sm:h-14 sm:w-14 ${className}`}
          style={{ color, boxShadow: `0 10px 24px ${color}35` }}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          <span className="absolute left-3 top-2 h-1.5 w-1.5 rounded-full bg-white/90" />
        </div>
      ))}
    </>
  );
}

interface InvitationHeroProps {
  title?: string;
  honoreeName?: string | null;
  hostNames?: string;
  headline?: string | null;
  coverUrl?: string | null;
  eventDate?: string;
  themeConfig?: EventThemeConfig;
  isEditor?: boolean;
}

export function InvitationHero(props: InvitationHeroProps) {
  const contextValues = useOptionalInvitationTheme();
  const activeTheme = contextValues?.theme || getInvitationTheme(
    props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug
  );
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const title = contextValues?.event.title || props.title || 'Convite Especial';
  const honoreeName = contextValues?.event.honoree_name ?? props.honoreeName;
  const headline = contextValues?.event.headline ?? props.headline;
  const coverUrl = contextValues?.event.cover_url ?? props.coverUrl;
  const isEditor = contextValues?.isSimulator ?? props.isEditor ?? false;
  const defaultArtwork = activeTheme.defaultHeroImage || getThemeDefaultHeroImage(activeTheme.id);
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const isElemental = activeTheme.assetFolder === 'elemental';

  const [imageSrc, setImageSrc] = useState(() => coverUrl?.trim() || defaultArtwork);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    setImageSrc(coverUrl?.trim() || defaultArtwork);
    setUsingFallback(false);
  }, [coverUrl, defaultArtwork]);

  const handleImageError = () => {
    if (imageSrc !== defaultArtwork) {
      setImageSrc(defaultArtwork);
      setUsingFallback(true);
    }
  };

  return (
    <section className="invitation-hero relative z-10 overflow-visible px-4 pb-7 pt-7 text-center sm:px-8 sm:pb-10 sm:pt-10">
      <div className="relative mx-auto max-w-2xl space-y-5 sm:space-y-6">
        <div className="flex justify-center">
          <ThemeHeroBadge />
        </div>

        <div className="relative mx-auto max-w-xl space-y-2">
          <div className="absolute -left-4 -top-3 hidden -rotate-12 opacity-25 sm:block" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-14 w-14" />
          </div>
          <div className="absolute -right-3 -top-2 rotate-12 opacity-25" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-12 w-12" />
          </div>
          <h1
            className="invitation-display-title text-5xl font-black leading-[.92] tracking-tight sm:text-7xl"
            style={getThemeHeadingStyle(activeTheme)}
          >
            {honoreeName || title}
          </h1>
          <p className="mx-auto max-w-md text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            {headline || activeTheme.tagline || 'Você foi convidado com muito carinho para celebrar esse grande momento!'}
          </p>
        </div>

        <div className="relative mx-auto max-w-[560px] px-1 pt-2 sm:px-8">
          <div className="absolute -left-3 bottom-5 z-20 rotate-[-10deg] opacity-90 sm:left-0" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-20 w-20 sm:h-24 sm:w-24" />
          </div>
          <div className="absolute -right-2 top-0 z-20 rotate-12 opacity-80 sm:right-2" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-14 w-14 sm:h-16 sm:w-16" />
          </div>

          {isElemental && <ElementalCompanions />}

          {isDino && (
            <div className="pointer-events-none absolute -bottom-12 -left-16 -right-16 z-20 h-52 sm:-bottom-16 sm:h-64" aria-hidden="true">
              <Image
                src="/invitations/themes/dinosaurs/baby-dinos.svg"
                alt=""
                fill
                className="object-contain object-bottom drop-shadow-[0_12px_14px_rgba(30,50,20,.22)]"
              />
            </div>
          )}

          <div className={`relative z-10 ${getThemePhotoFrameClass(activeTheme)}`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[inherit]">
              <Image
                src={imageSrc}
                alt={honoreeName || title}
                fill
                priority
                sizes="(max-width: 640px) calc(100vw - 48px), 560px"
                className="object-cover transition-transform duration-700 hover:scale-[1.025]"
                onError={handleImageError}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
            </div>
          </div>

          {usingFallback && isEditor && (
            <div className="absolute inset-x-6 bottom-6 z-30 rounded-full bg-white/95 px-3 py-2 text-[10px] font-bold text-slate-700 shadow-lg backdrop-blur">
              A foto não pôde ser carregada. Adicione uma nova imagem de capa.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
