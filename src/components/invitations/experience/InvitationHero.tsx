'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme, getThemeDefaultHeroImage } from '@/data/invitation-themes';
import { getThemeHeadingStyle, getThemePhotoFrameClass } from '@/lib/invitations/theme-ui';
import { ThemeHeroBadge, ThemeMotif } from './ThemeScenery';

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
    <section className="invitation-hero relative z-10 overflow-visible px-4 pb-8 pt-5 text-center sm:pt-8">
      <div className="relative mx-auto max-w-xl space-y-5">
        <div className="flex justify-center">
          <ThemeHeroBadge />
        </div>

        <div className="relative mx-auto max-w-lg space-y-2">
          <div className="absolute -left-4 -top-3 hidden -rotate-12 opacity-25 sm:block" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-14 w-14" />
          </div>
          <div className="absolute -right-3 -top-2 rotate-12 opacity-25" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-12 w-12" />
          </div>
          <h1
            className="invitation-display-title text-4xl font-black leading-[.95] tracking-tight sm:text-6xl"
            style={getThemeHeadingStyle(activeTheme)}
          >
            {honoreeName || title}
          </h1>
          <p className="mx-auto max-w-md text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            {headline || 'Você foi convidado com muito carinho para celebrar esse grande momento!'}
          </p>
        </div>

        <div className="relative mx-auto max-w-[340px] pt-2 sm:max-w-[390px]">
          <div className="absolute -left-7 bottom-5 z-20 rotate-[-10deg] opacity-90" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-20 w-20 sm:h-24 sm:w-24" />
          </div>
          <div className="absolute -right-5 top-0 z-20 rotate-12 opacity-80" style={{ color: accentColor }} aria-hidden="true">
            <ThemeMotif className="h-14 w-14 sm:h-16 sm:w-16" />
          </div>

          <div className={getThemePhotoFrameClass(activeTheme)}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[inherit]">
              <Image
                src={imageSrc}
                alt={honoreeName || title}
                fill
                priority
                sizes="(max-width: 640px) 340px, 390px"
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
