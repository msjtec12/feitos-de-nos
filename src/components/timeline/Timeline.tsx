"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TimelineMoment } from "@/types/gift";
import { SectionCopyBlock } from "@/types/theme";
import { TimelineCard } from "./TimelineCard";

interface TimelineProps {
  moments: TimelineMoment[];
  forceMobileCarousel?: boolean;
  onOpenPhoto?: (index: number) => void;
  copy?: SectionCopyBlock;
}

const DEFAULT_COPY: SectionCopyBlock = {
  eyebrow: 'Linha do Tempo',
  title: 'Momentos que merecem ser lembrados',
  description: 'Uma sequência de capítulos, descobertas e lembranças que ajudam a contar esta história.',
};

export function Timeline({ moments, forceMobileCarousel = false, onOpenPhoto, copy = DEFAULT_COPY }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  if (!moments || moments.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 280;
    scrollContainerRef.current.scrollBy({ left: direction === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full" aria-labelledby="timeline-heading">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{copy.eyebrow}</span>
          </div>
          <h2 id="timeline-heading" className="font-serif text-3xl sm:text-4xl text-brand-wine tracking-tight">
            {copy.title}
          </h2>
          <p className="text-sm sm:text-base text-brand-graphite/70 mt-1 max-w-xl">{copy.description}</p>
        </div>

        <div className={`items-center gap-2 self-end md:self-auto shrink-0 ${forceMobileCarousel ? 'flex' : 'flex md:hidden'}`}>
          <button type="button" onClick={() => scroll("left")} className="w-10 h-10 rounded-full bg-white border border-brand-rose/40 text-brand-wine flex items-center justify-center shadow-xs hover:bg-brand-cream active:scale-95 transition-all" aria-label="Ver momentos anteriores">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => scroll("right")} className="w-10 h-10 rounded-full bg-white border border-brand-rose/40 text-brand-wine flex items-center justify-center shadow-xs hover:bg-brand-cream active:scale-95 transition-all" aria-label="Ver próximos momentos">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={forceMobileCarousel ? 'block -mx-4 px-4' : 'md:hidden -mx-4 px-4'}>
        <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2 px-1 scroll-smooth" tabIndex={0} role="region" aria-label={copy.title}>
          {moments.map((moment, index) => (
            <div key={`${moment.monthNumber}-${index}`} className="w-[280px] shrink-0 snap-start">
              <TimelineCard moment={moment} index={index} onOpenPhoto={() => onOpenPhoto?.(index)} />
            </div>
          ))}
          <div className="w-4 shrink-0" aria-hidden="true" />
        </div>
        <p className="text-[11px] text-center text-brand-graphite/50 mt-1">Deslize para ver todos os momentos</p>
      </div>

      {!forceMobileCarousel && (
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {moments.map((moment, index) => (
            <TimelineCard key={`${moment.monthNumber}-${index}`} moment={moment} index={index} onOpenPhoto={() => onOpenPhoto?.(index)} />
          ))}
        </div>
      )}
    </section>
  );
}
