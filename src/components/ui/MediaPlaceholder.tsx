"use client";

import React, { useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import { MediaItem } from "@/types/gift";

interface MediaPlaceholderProps {
  item?: MediaItem;
  src?: string;
  alt?: string;
  caption?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
  label?: string;
  sublabel?: string;
  className?: string;
  priority?: boolean;
}

export function MediaPlaceholder({
  item,
  src,
  alt,
  caption,
  aspectRatio = "portrait",
  label = "Foto da memória",
  sublabel = "Foto será adicionada em breve.",
  className = "",
}: MediaPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSrc = src || item?.url;
  const imageAlt = alt || item?.altText || label;
  const activeAspect = item?.aspectRatio || aspectRatio;
  const hasUrl = Boolean(imageSrc && imageSrc.trim() !== '');
  const isAvailable = (item?.isAvailable ?? hasUrl) && hasUrl;

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
    auto: "h-full w-full min-h-[220px]",
  };

  // Se a mídia possuir URL e não estiver com erro
  if (isAvailable && imageSrc && !imageError) {
    return (
      <figure className={`relative overflow-hidden rounded-2xl bg-brand-cream-dark ${aspectClasses[activeAspect]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {caption && (
          <figcaption className="sr-only">{caption}</figcaption>
        )}
      </figure>
    );
  }

  // Placeholder Definitivo e Elegante (Zero requisições de rede para arquivos inexistentes)
  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-brand-rose/30 bg-gradient-to-br from-brand-rose/10 via-brand-cream to-brand-terracotta/10 flex flex-col items-center justify-center p-5 text-center shadow-xs select-none ${aspectClasses[activeAspect]} ${className}`}
      aria-label={`${imageAlt} - Foto será adicionada em breve.`}
    >
      {/* Moldura delicada interna */}
      <div className="absolute inset-2 rounded-xl border border-dashed border-brand-rose/40 pointer-events-none" />

      {/* Ícone de câmera delicado */}
      <div className="w-11 h-11 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-brand-wine/70 mb-2.5 border border-brand-rose/25">
        <Camera className="w-5 h-5" />
      </div>

      {/* Legenda / Título da Memória */}
      <p className="font-serif text-brand-wine text-sm sm:text-base font-medium z-10 px-2 line-clamp-2">
        {caption || label}
      </p>

      {/* Mensagem Obrigatória Padronizada */}
      <span className="text-[11px] sm:text-xs tracking-wider text-brand-terracotta font-semibold mt-1.5 z-10">
        Foto será adicionada em breve.
      </span>

      {/* Marca d'água sutil */}
      <div className="absolute bottom-2 right-2 opacity-10 pointer-events-none">
        <ImageIcon className="w-8 h-8 text-brand-wine" />
      </div>
    </figure>
  );
}
