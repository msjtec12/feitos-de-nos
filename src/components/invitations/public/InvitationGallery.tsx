'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { EventMediaRow, EventThemeConfig } from '@/types/invitation';
import { ChevronLeft, ChevronRight, X, Sparkles, ZoomIn } from 'lucide-react';

interface InvitationGalleryProps {
  media: EventMediaRow[];
  themeConfig: EventThemeConfig;
}

export function InvitationGallery({ media, themeConfig }: InvitationGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % media.length);
  };

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + media.length) % media.length);
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      showPrev();
    } else if (deltaX < -50) {
      showNext();
    }
    setTouchStartX(null);
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-1">
        <span
          className="text-[11px] uppercase tracking-widest font-extrabold"
          style={{ color: accentColor }}
        >
          Nossas Memórias
        </span>
        <h3
          className="font-serif text-2xl sm:text-3xl font-bold"
          style={{ color: primaryColor }}
        >
          Galeria de Momentos
        </h3>
        <p className="text-xs text-[#302B2D]/70">
          Toque nas fotos para ver em tela cheia
        </p>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {media.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm cursor-pointer bg-slate-100 hover:shadow-md transition-all"
          >
            <Image
              src={item.url}
              alt={item.caption || `Foto ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 180px, 300px"
            />

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
            </div>

            {item.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2.5 pt-6 text-white text-[11px] leading-tight font-medium">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header: Counter and Close */}
          <div className="flex items-center justify-between text-white/80 z-10">
            <span className="text-xs font-mono font-medium">
              {lightboxIndex + 1} / {media.length}
            </span>

            <button
              type="button"
              onClick={closeLightbox}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fechar galeria"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Photo */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <div className="relative w-full h-full max-w-2xl max-h-[75vh]">
              <Image
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].caption || 'Foto em destaque'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>

            {/* Prev button */}
            {media.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {media.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="text-center text-white/90 text-xs sm:text-sm font-light pb-2 min-h-[36px]">
            {media[lightboxIndex].caption || ''}
          </div>
        </div>
      )}
    </section>
  );
}
