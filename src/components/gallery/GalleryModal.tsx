"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { MediaItem } from "@/types/gift";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export function GalleryModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: GalleryModalProps) {
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

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
    // Trava scroll da página quando modal está aberto
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-graphite/90 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={`Visualizador de foto: ${currentItem.caption || currentItem.altText}`}
      >
        {/* Botão Fechar no canto superior direito */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Fechar visualizador de foto"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Botão Anterior */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-50 w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Botão Próximo */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-50 w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Conteúdo Central da Foto */}
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center text-center select-none"
        >
          <div className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl p-3 shadow-2xl border border-white/20 overflow-hidden">
            <MediaPlaceholder
              item={currentItem}
              label={currentItem.caption || "Memória do 1º ano"}
              sublabel="Substituir por fotografia real"
              aspectRatio={currentItem.aspectRatio || "portrait"}
              className="w-full max-h-[60vh] object-contain rounded-2xl"
            />
          </div>

          {/* Legenda e Contador */}
          <div className="mt-4 px-4 max-w-md">
            {currentItem.caption && (
              <p className="font-serif text-lg text-white mb-1">
                {currentItem.caption}
              </p>
            )}
            <p className="text-xs text-white/70 font-mono tracking-widest uppercase">
              Foto {currentIndex + 1} de {items.length}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
