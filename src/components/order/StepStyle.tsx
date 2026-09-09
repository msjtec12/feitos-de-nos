'use client';

import React from 'react';
import { STYLE_OPTIONS } from '@/data/home-data';
import { StyleId, OrderFormData } from '@/types/order';
import { Check, Sparkles, Palette } from 'lucide-react';

interface StepStyleProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepStyle({ formData, updateForm, onNext, onBack }: StepStyleProps) {
  const handleSelect = (id: StyleId) => {
    updateForm({ style: id });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Qual estilo visual combina mais?
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Defina a paleta de cores e o sentimento predominante da experiência visual do presente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = formData.style === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelect(style.id)}
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

              <div className="space-y-4">
                {/* Visual Color Preview Bars */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: style.primaryColor }}
                    title={`Cor Principal: ${style.primaryColor}`}
                  />
                  <div
                    className="w-8 h-8 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: style.accentColor }}
                    title={`Cor de Destaque: ${style.accentColor}`}
                  />
                  <div
                    className="w-8 h-8 rounded-full bg-[#FFF8F0] shadow-inner border border-[#713C48]/20 flex items-center justify-center text-[10px] font-mono text-[#713C48]"
                    title="Fundo Creme Acolhedor"
                  >
                    ✦
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-[#713C48]">
                    {style.name}
                  </h3>
                  <p className="text-xs text-[#302B2D]/75 leading-relaxed mt-1">
                    {style.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#713C48]/10 flex items-center justify-between text-xs text-[#713C48] font-medium">
                <span>{isSelected ? 'Estilo Ativo' : 'Escolher este estilo'}</span>
                <Palette className="w-3.5 h-3.5 opacity-60" />
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
          Avançar para Seus Dados →
        </button>
      </div>
    </div>
  );
}
