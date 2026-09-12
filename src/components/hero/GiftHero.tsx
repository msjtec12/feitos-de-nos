"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { Recipient } from "@/types/gift";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";
import { BrandLogo } from "../brand/BrandLogo";
import { BrandSymbol, DecorativeKnotDivider } from "../brand/BrandSymbol";

interface GiftHeroProps {
  recipient: Recipient;
  onOpenPhoto?: () => void;
}

export function GiftHero({ recipient, onOpenPhoto }: GiftHeroProps) {
  const hasCoverPhoto = Boolean(
    recipient.featuredImage?.url && recipient.featuredImage.url.trim() !== ""
  );

  return (
    <section className="relative pt-6 pb-8 px-4 sm:px-6 max-w-2xl mx-auto w-full text-center">
      {/* Barra Superior de Identidade com Logo Oficial */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex justify-center"
      >
        <BrandLogo size="md" showSlogan={true} />
      </motion.div>

      {/* Badge Tagline "365 dias de amor" */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-rose/25 text-brand-wine text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 border border-brand-rose/40"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
        <span>{recipient.tagline}</span>
      </motion.div>

      {/* Nome do Destinatário: Matheus Akira */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-wine tracking-tight mb-1"
      >
        {recipient.name}
      </motion.h1>

      {/* Subtítulo: Meu primeiro ano */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-serif italic text-xl sm:text-2xl text-brand-terracotta mb-6"
      >
        {recipient.subtitle}
      </motion.p>

      {/* Cartão Fotográfico em Estilo Polaroid / Fine Art com Fita Adesiva Artesanal (Washi Tape) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="relative max-w-sm sm:max-w-md mx-auto mb-8 pt-3"
      >
        {/* Detalhe de Fita Adesiva Washi Tape no topo centro (como no mockup) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-[#EAD8C7]/85 backdrop-blur-xs rounded-xs shadow-xs border-y border-[#D6C2AF]/60 transform -rotate-1 pointer-events-none"
          aria-hidden="true"
        />

        {/* Moldura Branca Estilo Polaroid com Cantos Arredondados (Clicável) */}
        <div
          className={`bg-white p-3.5 sm:p-4 rounded-3xl shadow-md border border-brand-rose/30 hover:shadow-lg transition-all duration-300 ${
            hasCoverPhoto
              ? "cursor-pointer group active:scale-[0.98] hover:border-brand-wine/40"
              : ""
          }`}
          onClick={() => {
            if (hasCoverPhoto && onOpenPhoto) onOpenPhoto();
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && hasCoverPhoto && onOpenPhoto) {
              e.preventDefault();
              onOpenPhoto();
            }
          }}
          tabIndex={hasCoverPhoto ? 0 : undefined}
          role={hasCoverPhoto ? "button" : undefined}
          aria-label={hasCoverPhoto ? `Abrir foto principal de ${recipient.name}` : undefined}
        >
          <div className="relative rounded-2xl overflow-hidden bg-brand-cream aspect-[4/5]">
            <MediaPlaceholder
              item={recipient.featuredImage}
              label="Foto Principal de Destaque"
              sublabel={`Substituir pela fotografia do ${recipient.name}`}
              aspectRatio="portrait"
              className="h-full w-full object-cover"
            />

            {/* Dica visual de Zoom */}
            {hasCoverPhoto && (
              <div className="absolute inset-0 bg-brand-wine/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-full bg-white/95 text-brand-wine text-xs font-semibold shadow-md flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                  <span>Toque para ampliar</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Badge Flutuante no canto da foto */}
        <div className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-full bg-brand-wine text-brand-cream flex items-center justify-center shadow-md border-2 border-brand-cream pointer-events-none">
          <Heart className="w-4 h-4 fill-brand-rose text-brand-rose" />
        </div>
      </motion.div>

      {/* Frase Emocional */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="max-w-lg mx-auto px-2"
      >
        <blockquote className="relative">
          <p className="font-serif text-lg sm:text-xl text-brand-graphite/90 leading-relaxed italic">
            “{recipient.introQuote}”
          </p>
        </blockquote>

        <DecorativeKnotDivider className="my-6" />
      </motion.div>
    </section>
  );
}
