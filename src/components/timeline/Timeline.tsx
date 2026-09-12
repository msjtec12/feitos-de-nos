"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TimelineMoment } from "@/types/gift";
import { TimelineCard } from "./TimelineCard";

interface TimelineProps {
  moments: TimelineMoment[];
  forceMobileCarousel?: boolean;
  onOpenPhoto?: (index: number) => void;
}

export function Timeline({ moments, forceMobileCarousel = false, onOpenPhoto }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 280; // largura aproximada do card mobile
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full" aria-labelledby="timeline-heading">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Linha do Tempo</span>
          </div>
          <h2
            id="timeline-heading"
            className="font-serif text-3xl sm:text-4xl text-brand-wine tracking-tight"
          >
            Doze meses, milhares de lembranças
          </h2>
          <p className="text-sm sm:text-base text-brand-graphite/70 mt-1 max-w-xl">
            Cada mês representou uma nova descoberta, um novo sorriso e um marco inesquecível na vida de toda a família.
          </p>
        </div>

        {/* Botões de navegação para mobile/tablet */}
        <div className={`items-center gap-2 self-end md:self-auto shrink-0 ${forceMobileCarousel ? 'flex' : 'flex md:hidden'}`}>
          <button
            type="button"
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white border border-brand-rose/40 text-brand-wine flex items-center justify-center shadow-xs hover:bg-brand-cream active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-wine"
            aria-label="Rolar meses anteriores"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white border border-brand-rose/40 text-brand-wine flex items-center justify-center shadow-xs hover:bg-brand-cream active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-wine"
            aria-label="Rolar próximos meses"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visualização Mobile: Carrossel Snap com visualização parcial */}
      <div className={forceMobileCarousel ? 'block -mx-4 px-4' : 'md:hidden -mx-4 px-4'}>
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2 px-1 scroll-smooth"
          tabIndex={0}
          role="region"
          aria-label="Carrossel dos doze meses"
        >
          {moments.map((moment, index) => (
            <div
              key={moment.monthNumber}
              className="w-[280px] shrink-0 snap-start"
            >
              <TimelineCard
                moment={moment}
                index={index}
                onOpenPhoto={() => onOpenPhoto?.(index)}
              />
            </div>
          ))}
          {/* Espaçador final para garantir visualização confortável do último card */}
          <div className="w-4 shrink-0" aria-hidden="true" />
        </div>

        <p className="text-[11px] text-center text-brand-graphite/50 mt-1">
          Deslize para ver todos os momentos
        </p>
      </div>

      {/* Visualização Desktop: Grade Equilibrada */}
      {!forceMobileCarousel && (
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {moments.map((moment, index) => (
            <TimelineCard
              key={moment.monthNumber}
              moment={moment}
              index={index}
              onOpenPhoto={() => onOpenPhoto?.(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
