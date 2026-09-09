"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimelineMoment } from "@/types/gift";
import { MediaPlaceholder } from "../ui/MediaPlaceholder";
import { Calendar } from "lucide-react";

interface TimelineCardProps {
  moment: TimelineMoment;
  index: number;
}

export function TimelineCard({ moment, index }: TimelineCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group relative flex flex-col bg-white rounded-3xl p-4 sm:p-5 border border-brand-rose/30 shadow-sm hover:shadow-md transition-all duration-300 h-full select-none"
      aria-labelledby={`timeline-title-${moment.monthNumber}`}
    >
      {/* Cabeçalho do Cartão com Badge do Mês */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cream border border-brand-rose/40 text-brand-wine">
          <Calendar className="w-3.5 h-3.5 text-brand-terracotta" />
          <span className="font-semibold text-xs tracking-wider uppercase">
            {moment.title}
          </span>
        </div>
        <span className="text-xs font-mono font-medium text-brand-graphite/40">
          {String(moment.monthNumber).padStart(2, "0")}/12
        </span>
      </div>

      {/* Espaço para a Foto do Mês */}
      <div className="relative rounded-2xl overflow-hidden mb-3 aspect-square bg-brand-cream">
        <MediaPlaceholder
          item={moment.image}
          label={`${moment.title} — Foto`}
          sublabel="Substituir foto do mês"
          aspectRatio="square"
          className="h-full w-full"
        />
      </div>

      {/* Legenda Emocional */}
      <div className="mt-auto pt-1">
        <h3
          id={`timeline-title-${moment.monthNumber}`}
          className="font-serif text-base sm:text-lg text-brand-wine leading-snug"
        >
          {moment.caption}
        </h3>
        {moment.image.caption && (
          <p className="text-xs text-brand-graphite/60 mt-1 line-clamp-1">
            {moment.image.caption}
          </p>
        )}
      </div>
    </motion.article>
  );
}
