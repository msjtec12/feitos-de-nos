"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Sparkles } from "lucide-react";
import { MediaItem } from "@/types/gift";

export interface LightboxPhotoItem {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  altText?: string;
  badge?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: (MediaItem | LightboxPhotoItem)[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
  isInsideSimulator?: boolean;
}

export function GalleryModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  isInsideSimulator = false,
}: GalleryModalProps) {
  const currentItem = items[currentIndex];
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  // Gestos de toque (swipe left / swipe right) no celular
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Apenas considera se o movimento horizontal for predominante
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Suporte a teclado: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    if (!isInsideSimulator) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (!isInsideSimulator) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, onClose, handlePrev, handleNext, isInsideSimulator]);

  if (!isOpen || !currentItem) return null;

  const titleText = (currentItem as any).title || currentItem.caption || currentItem.altText || "Foto Especial";
  const badgeText = (currentItem as any).badge;
  const captionText = currentItem.caption && currentItem.caption !== titleText ? currentItem.caption : null;
  const imageUrl = currentItem.url;

  return (
    <AnimatePresence>
      <div
        className={`${
          isInsideSimulator ? "absolute" : "fixed"
        } inset-0 z-[100] flex flex-col items-center justify-between p-3 sm:p-6 bg-black/92 backdrop-blur-md select-none touch-pan-y`}
        role="dialog"
        aria-modal="true"
        aria-label={`Visualizador de foto: ${titleText}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Barra Superior com Contador, Badge e Botão Fechar */}
        <header className="w-full max-w-4xl flex items-center justify-between py-2 px-1 z-50 text-white">
          <div className="flex items-center gap-2">
            {badgeText ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold tracking-wider text-rose-200 border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{badgeText}</span>
              </span>
            ) : (
              <span className="text-xs text-white/80 font-mono tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                Foto {currentIndex + 1} de {items.length}
              </span>
            )}

            {items.length > 1 && badgeText && (
              <span className="text-[11px] text-white/60 font-mono">
                ({currentIndex + 1}/{items.length})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md border border-white/20"
            aria-label="Fechar visualizador"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Botão Anterior (Desktop & Tablet) */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 text-white items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white border border-white/20 active:scale-90"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Botão Próximo (Desktop & Tablet) */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 text-white items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white border border-white/20 active:scale-90"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Conteúdo Central da Foto */}
        <motion.div
          key={currentItem.id || currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="my-auto w-full max-w-2xl flex flex-col items-center justify-center text-center px-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-lg bg-black/40 rounded-3xl p-1 sm:p-2.5 shadow-2xl border border-white/15 overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={titleText}
                loading="eager"
                decoding="async"
                className="max-h-[62vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-2xl mx-auto shadow-lg"
              />
            ) : (
              <div className="w-full aspect-square max-w-xs flex flex-col items-center justify-center text-white/70 p-6">
                <Camera className="w-12 h-12 mb-2 text-rose-300 opacity-60" />
                <p className="text-sm font-serif">Foto ainda não adicionada.</p>
              </div>
            )}
          </div>

          {/* Legenda e Detalhes da Foto */}
          <div className="mt-3.5 px-3 max-w-md w-full">
            {titleText && (
              <h3 className="font-serif text-base sm:text-xl text-white font-medium leading-snug drop-shadow-xs">
                {titleText}
              </h3>
            )}
            {captionText && (
              <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed line-clamp-3">
                {captionText}
              </p>
            )}

            {/* Dica de navegação por toque para mobile */}
            {items.length > 1 && (
              <p className="text-[11px] text-white/40 mt-2 sm:hidden font-sans">
                Deslize para o lado para ver mais fotos
              </p>
            )}
          </div>
        </motion.div>

        {/* Rodapé Mobile: Botões de navegação rápida na parte inferior */}
        {items.length > 1 && (
          <footer className="w-full sm:hidden flex items-center justify-center gap-8 py-2 z-50">
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-full bg-white/20 active:bg-white/40 text-white text-xs font-semibold flex items-center gap-1 border border-white/20 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <span className="text-xs text-white/70 font-mono">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-full bg-white/20 active:bg-white/40 text-white text-xs font-semibold flex items-center gap-1 border border-white/20 transition-all active:scale-95"
            >
              <span>Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </footer>
        )}
      </div>
    </AnimatePresence>
  );
}
