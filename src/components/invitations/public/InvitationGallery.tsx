'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EventMediaRow, EventThemeConfig } from '@/types/invitation';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useOptionalInvitationTheme } from '../experience/InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { getThemeGalleryFrameClass } from '@/lib/invitations/theme-ui';
import { getInvitationThemeCopy } from '@/lib/invitations/theme-copy';

interface InvitationGalleryProps {
  media?: EventMediaRow[];
  themeConfig?: EventThemeConfig;
}

export function InvitationGallery(props: InvitationGalleryProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const media = contextValues?.event.media || props.media || [];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const themeCopy = getInvitationThemeCopy(activeTheme);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % media.length);
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + media.length) % media.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) showPrev();
    else if (deltaX < -50) showNext();
    setTouchStartX(null);
  };

  // Moldura do card de foto conforme o tema
  const itemFrameClass = `group relative aspect-[4/5] overflow-hidden cursor-pointer bg-slate-100 transition-all hover:scale-[1.02] ${getThemeGalleryFrameClass(activeTheme)}`;

  return (
    <section className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="text-center space-y-1">
        <span
          className="text-[11px] uppercase tracking-widest font-extrabold block"
          style={{ color: isDino ? '#15803D' : accentColor }}
        >
          {themeCopy.galleryKicker}
        </span>
        <h3
          className="text-2xl sm:text-3xl font-bold font-serif"
          style={{ color: primaryColor }}
        >
          {themeCopy.galleryTitle}
        </h3>
        <p className="text-xs text-slate-500">
          Toque nas fotos para ver em tela cheia
        </p>
      </div>

      {/* Grid de fotos com molduras temáticas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {media.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => openLightbox(idx)}
            className={itemFrameClass}
          >
            <div className="relative w-full h-full">
              <Image
                src={item.url}
                alt={item.caption || `Foto ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 180px, 300px"
              />
            </div>

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
            </div>

            {item.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-2 text-white text-[10px] sm:text-[11px] leading-tight font-medium">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between text-white/80 z-10">
            <span className="text-xs font-mono font-medium">
              {lightboxIndex + 1} / {media.length}
            </span>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              aria-label="Fechar galeria"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <Image
              src={media[lightboxIndex].url}
              alt={media[lightboxIndex].caption || 'Foto em tela cheia'}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  className="absolute left-2 p-3 rounded-full bg-black/50 text-white/80 hover:text-white transition-all active:scale-95"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-2 p-3 rounded-full bg-black/50 text-white/80 hover:text-white transition-all active:scale-95"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {media[lightboxIndex].caption && (
            <div className="text-center text-white/90 text-xs sm:text-sm font-medium pb-2 max-w-lg mx-auto">
              {media[lightboxIndex].caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
