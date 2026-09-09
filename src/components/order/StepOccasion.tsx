'use client';

import React from 'react';
import { OCCASIONS } from '@/data/home-data';
import { OccasionId, OrderFormData } from '@/types/order';
import { Baby, Heart, Users, Sparkles, Check } from 'lucide-react';

interface StepOccasionProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
}

const OCCASION_ICONS: Record<OccasionId, React.ElementType> = {
  'primeiro-ano': Baby,
  'nossa-historia': Heart,
  vozes: Users,
  especial: Sparkles,
};

export function StepOccasion({ formData, updateForm, onNext }: StepOccasionProps) {
  const handleSelect = (id: OccasionId) => {
    const selected = OCCASIONS.find((o) => o.id === id);
    updateForm({
      occasion: id,
      // Automatically set suggested style if not customized
      style: selected?.suggestedStyle || formData.style,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Qual é a ocasião do seu presente?
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Selecione a coleção que melhor representa a história que você quer eternizar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {OCCASIONS.map((occ) => {
          const isSelected = formData.occasion === occ.id;
          const Icon = OCCASION_ICONS[occ.id] || Sparkles;

          return (
            <button
              key={occ.id}
              type="button"
              onClick={() => handleSelect(occ.id)}
              className={`p-6 rounded-3xl text-left transition-all border-2 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20'
                  : 'bg-white/70 border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#713C48] text-[#FFF8F0] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#713C48] text-[#FFF8F0]'
                      : 'bg-[#713C48]/10 text-[#713C48] group-hover:bg-[#713C48]/20'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C96E5A]">
                    {occ.subtitle}
                  </span>
                  <h3 className="font-serif text-xl text-[#713C48] mt-0.5">
                    {occ.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#302B2D]/75 leading-relaxed">
                  {occ.description}
                </p>
              </div>

              {occ.badge && !isSelected && (
                <span className="inline-block mt-4 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C96E5A]/10 text-[#C96E5A] w-fit">
                  {occ.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
        >
          Avançar para Formato →
        </button>
      </div>
    </div>
  );
}
