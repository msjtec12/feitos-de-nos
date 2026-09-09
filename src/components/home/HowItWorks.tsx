'use client';

import React from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data/home-data';
import { Palette, MessageCircle, CheckCircle2, Gift } from 'lucide-react';

const STEP_ICONS = [Palette, MessageCircle, CheckCircle2, Gift];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-[#FFF8F0] border-t border-[#713C48]/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C96E5A]">
            Passo a Passo Acolhedor
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Como seu presente ganha vida
          </h2>
          <p className="text-base sm:text-lg text-[#302B2D]/80 leading-relaxed font-normal">
            Criamos uma jornada sem complicação. Você só precisa escolher o formato e nos contar as memórias; nós cuidamos do design e da emoção.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[idx] || Gift;
            return (
              <div
                key={step.step}
                className="relative bg-[#FFF8F0] rounded-3xl p-6 border border-[#713C48]/15 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center group-hover:bg-[#713C48] group-hover:text-[#FFF8F0] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#C96E5A]/60">
                    {step.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-[#713C48] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#302B2D]/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subtle indicator line */}
                <div className="h-1 w-10 bg-[#C96E5A]/30 rounded-full group-hover:w-full group-hover:bg-[#C96E5A] transition-all duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
