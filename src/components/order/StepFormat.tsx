'use client';

import React from 'react';
import { GIFT_FORMATS } from '@/data/home-data';
import { FormatId, OrderFormData } from '@/types/order';
import { Check, Sparkles } from 'lucide-react';

interface StepFormatProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepFormat({ formData, updateForm, onNext, onBack }: StepFormatProps) {
  const handleSelect = (id: FormatId) => {
    updateForm({ format: id });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Como você deseja entregar o presente?
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Escolha entre a praticidade 100% digital ou a emoção de entregar em mãos com itens físicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {GIFT_FORMATS.map((fmt) => {
          const isSelected = formData.format === fmt.id;
          const isPopular = fmt.popular;

          return (
            <button
              key={fmt.id}
              type="button"
              onClick={() => handleSelect(fmt.id)}
              className={`rounded-3xl p-6 text-left transition-all border-2 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#FFF8F0] border-[#713C48] shadow-lg ring-2 ring-[#713C48]/20 scale-[1.02]'
                  : 'bg-white/70 border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-white'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#713C48] text-[#FFF8F0] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#D9A4A0]" />
                  <span>{fmt.badge || 'Mais Escolhido'}</span>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#713C48] text-[#FFF8F0] flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#713C48]">
                    {fmt.title}
                  </h3>
                  <p className="text-xs text-[#302B2D]/70 mt-1 min-h-[32px]">
                    {fmt.description}
                  </p>
                </div>

                <div className="py-2 border-y border-[#713C48]/10">
                  <span className="text-xs text-[#302B2D]/60 uppercase">R$ </span>
                  <span className="font-serif text-3xl font-bold text-[#713C48]">
                    {fmt.price}
                  </span>
                  <span className="text-xs text-[#302B2D]/60"> taxa única</span>
                </div>

                <ul className="space-y-2 text-xs text-[#302B2D]/80">
                  {fmt.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C96E5A] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#713C48]/10">
                <span
                  className={`block text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#713C48] text-[#FFF8F0]'
                      : 'bg-[#713C48]/5 text-[#713C48] group-hover:bg-[#713C48]/10'
                  }`}
                >
                  {isSelected ? 'Selecionado ✓' : 'Selecionar'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#713C48]/10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full text-sm font-semibold text-[#713C48] hover:bg-[#713C48]/10 transition-colors"
        >
          ← Voltar
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
        >
          Avançar para Presenteado →
        </button>
      </div>
    </div>
  );
}
