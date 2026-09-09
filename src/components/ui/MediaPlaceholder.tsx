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
  sublabel = "Substituir pelo arquivo real",
  className = "",
}: MediaPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSrc = src || item?.url;
  const imageAlt = alt || item?.altText || label;
  const activeAspect = item?.aspectRatio || aspectRatio;

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
    auto: "h-full w-full min-h-[220px]",
  };

  // Se o caminho da imagem foi passado e não gerou erro, tenta renderizar a foto
  if (imageSrc && !imageError) {
    return (
      <figure className={`relative overflow-hidden rounded-2xl bg-brand-cream-dark ${aspectClasses[activeAspect]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-brand-rose-subtle to-brand-cream p-4 text-center">
            <Camera className="w-8 h-8 text-brand-rose animate-pulse mb-2" />
            <span className="text-xs text-brand-graphite-muted font-medium">Carregando imagem...</span>
          </div>
        )}
        {caption && (
          <figcaption className="sr-only">{caption}</figcaption>
        )}
      </figure>
    );
  }

  // Placeholder Editorial Afetivo com as cores da marca
  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-brand-rose/30 bg-gradient-to-br from-brand-rose-subtle via-brand-cream to-brand-terracotta-subtle flex flex-col items-center justify-center p-6 text-center shadow-sm select-none ${aspectClasses[activeAspect]} ${className}`}
      aria-label={imageAlt}
    >
      {/* Detalhe de moldura delicada com cantos arredondados */}
      <div className="absolute inset-2 rounded-xl border border-dashed border-brand-rose/40 pointer-events-none" />

      {/* Ícone editorial */}
      <div className="w-12 h-12 rounded-full bg-white/80 shadow-xs flex items-center justify-center text-brand-terracotta mb-3 border border-brand-rose/20">
        <Camera className="w-5 h-5 text-brand-wine/70" />
      </div>

      <p className="font-serif text-brand-wine text-sm md:text-base font-medium z-10 px-2 line-clamp-2">
        {caption || label}
      </p>

      <span className="text-[11px] uppercase tracking-wider text-brand-terracotta font-medium mt-1 z-10 opacity-80">
        {sublabel}
      </span>

      {/* Marca d'água sutil de contexto */}
      <div className="absolute bottom-2 right-2 opacity-15 pointer-events-none">
        <ImageIcon className="w-10 h-10 text-brand-wine" />
      </div>
    </figure>
  );
}
