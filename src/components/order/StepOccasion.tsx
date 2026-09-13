'use client';

import React from 'react';
import { GIFT_FORMATS, OCCASIONS } from '@/data/home-data';
import { OccasionId, OrderFormData } from '@/types/order';
import { Baby, Heart, Users, Sparkles, Gift, Award, Check } from 'lucide-react';

interface StepOccasionProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
}

const OCCASION_ICONS: Partial<Record<OccasionId, React.ElementType>> = {
  'primeiro-ano': Baby,
  'amor-casal': Heart,
  'nossa-historia': Heart,
  'dia-das-maes': Heart,
  'dia-dos-pais': Users,
  aniversario: Gift,
  'casamento-bodas': Heart,
  formatura: Award,
  amizade: Users,
  memorial: Heart,
  religioso: Sparkles,
  natal: Gift,
  'cha-de-bebe': Baby,
  vozes: Users,
  especial: Sparkles,
};

export function StepOccasion({ formData, updateForm, onNext }: StepOccasionProps) {
  const handleSelect = (id: OccasionId) => {
    const selected = OCCASIONS.find((o) => o.id === id);
    updateForm({
      occasion: id,
      style: selected?.suggestedStyle || formData.style,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C96E5A]/10 text-[#C96E5A] text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Coleções temáticas
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Que história você quer transformar em presente?
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75 max-w-2xl">
          A ocasião define mais do que a cor: ela orienta as frases, a estrutura das seções, a paleta e o formato mais indicado para a experiência.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OCCASIONS.map((occ) => {
          const isSelected = formData.occasion === occ.id;
          const Icon = OCCASION_ICONS[occ.id] || Sparkles;
          const recommendedFormat = GIFT_FORMATS.find((format) => format.id === occ.recommendedFormat);

          return (
            <button
              key={occ.id}
              type="button"
              onClick={() => handleSelect(occ.id)}
              className={`p-5 rounded-3xl text-left transition-all border-2 flex flex-col justify-between relative group min-h-[275px] ${
                isSelected
                  ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20'
                  : 'bg-white/80 border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-white hover:-translate-y-0.5'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#713C48] text-[#FFF8F0] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-[#713C48] text-white' : 'bg-[#713C48]/10 text-[#713C48]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {occ.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C96E5A]/10 text-[#A8503E]">
                      {occ.badge}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C96E5A]">
                    {occ.subtitle}
                  </span>
                  <h3 className="font-serif text-xl text-[#713C48] mt-0.5">{occ.title}</h3>
                </div>

                <p className="text-xs text-[#302B2D]/75 leading-relaxed">{occ.description}</p>

                {occ.structureHighlights && (
                  <div className="flex flex-wrap gap-1.5">
                    {occ.structureHighlights.slice(0, 3).map((item) => (
                      <span key={item} className="text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {recommendedFormat && (
                <div className="mt-4 pt-3 border-t border-[#713C48]/10 flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-stone-500 font-semibold uppercase tracking-wider">Formato indicado</span>
                  <span className="font-bold text-[#713C48]">{recommendedFormat.title}</span>
                </div>
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
