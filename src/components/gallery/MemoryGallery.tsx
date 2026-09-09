"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, ZoomIn } from "lucide-react";
import { MediaItem } from "@/types/gift";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";
import { GalleryModal } from "./GalleryModal";

interface MemoryGalleryProps {
  items: MediaItem[];
}

export function MemoryGallery({ items }: MemoryGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhotoIndex(null);
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full" aria-labelledby="gallery-heading">
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-rose/25 text-brand-wine text-xs font-semibold tracking-wider uppercase mb-3">
          <Camera className="w-3.5 h-3.5 text-brand-terracotta" />
          <span>Álbum de Momentos</span>
        </div>
        <h2
          id="gallery-heading"
          className="font-serif text-3xl sm:text-4xl text-brand-wine tracking-tight"
        >
          Galeria de Memórias
        </h2>
        <p className="text-sm sm:text-base text-brand-graphite/70 mt-2">
          Pequenos instantes do cotidiano que se tornaram grandes lembranças guardadas no coração.
        </p>
      </div>

      {/* Grade Responsiva de Fotos com Variadas Proporções */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {items.map((item, index) => {
          // Layout com variação visual harmônica
          const isSpanRow = index === 2 || index === 9;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden bg-white p-2 border border-brand-rose/30 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer ${
                isSpanRow ? "sm:col-span-2" : ""
              }`}
              onClick={() => openPhoto(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPhoto(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Abrir foto ampliada: ${item.caption || item.altText}`}
            >
              <div className="relative rounded-xl overflow-hidden bg-brand-cream aspect-square">
                <MediaPlaceholder
                  item={item}
                  label={item.caption || `Foto ${index + 1}`}
                  sublabel="Substituir foto"
                  aspectRatio={isSpanRow ? "landscape" : item.aspectRatio || "square"}
                  className="h-full w-full object-cover"
                />

                {/* Efeito Hover com ícone de Zoom */}
                <div className="absolute inset-0 bg-brand-wine/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-brand-wine flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {item.caption && (
                <p className="text-xs font-serif text-brand-wine mt-2 px-1 text-center truncate">
                  {item.caption}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Modal Lightbox */}
      <GalleryModal
        isOpen={selectedPhotoIndex !== null}
        onClose={closePhoto}
        items={items}
        currentIndex={selectedPhotoIndex ?? 0}
        onNavigate={(newIndex) => setSelectedPhotoIndex(newIndex)}
      />
    </section>
  );
}
