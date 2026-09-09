'use client';

import React from 'react';
import { DIFFERENTIATORS } from '@/data/home-data';
import { Eye, Mic, Feather, Smartphone, Lock } from 'lucide-react';

const DIFF_ICONS = [Eye, Mic, Feather, Smartphone, Lock];

export function DifferentiatorsSection() {
  return (
    <section id="diferenciais" className="py-20 bg-white/40 border-t border-[#713C48]/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C96E5A]">
            Cuidado em Cada Detalhe
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            O que torna o Feito de Nós tão especial
          </h2>
          <p className="text-base sm:text-lg text-[#302B2D]/80 leading-relaxed font-normal">
            Não entregamos apenas fotos ou links genéricos: criamos uma cápsula viva de memória com alma e afeto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DIFFERENTIATORS.map((item, idx) => {
            const Icon = DIFF_ICONS[idx] || Feather;
            return (
              <div
                key={idx}
                className="bg-[#FFF8F0] rounded-3xl p-7 border border-[#713C48]/15 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-[#713C48]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#302B2D]/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
