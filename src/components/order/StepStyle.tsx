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
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredStyles = React.useMemo(() => {
    if (selectedCategory === 'all') return STYLE_OPTIONS;
    return STYLE_OPTIONS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelect = (id: StyleId) => {
    updateForm({ style: id });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
            Qual estilo visual combina mais?
          </h2>
          <p className="text-sm sm:text-base text-[#302B2D]/75">
            Defina a paleta de cores e o sentimento predominante da experiência visual do presente.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'classicos', label: 'Clássicos' },
            { id: 'infantil', label: 'Bebês & Infantil' },
            { id: 'romantico', label: 'Amor & Casamento' },
            { id: 'natureza', label: 'Natureza & Luz' },
          ].map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isCatActive
                    ? 'bg-[#713C48] text-[#FFF8F0] shadow-xs'
                    : 'bg-[#FFF8F0] text-[#713C48] hover:bg-[#713C48]/10 border border-[#713C48]/15'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStyles.map((style) => {
          const isSelected = formData.style === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelect(style.id)}
              className={`p-5 rounded-3xl text-left transition-all border-2 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20'
                  : 'bg-white/70 border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#713C48] text-[#FFF8F0] flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-3.5">
                {/* Visual Color Preview Bars */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: style.primaryColor }}
                    title={`Cor Principal: ${style.primaryColor}`}
                  />
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border border-black/10 -ml-1"
                    style={{ backgroundColor: style.accentColor }}
                    title={`Cor de Destaque: ${style.accentColor}`}
                  />
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border border-black/10 -ml-1"
                    style={{ backgroundColor: style.backgroundColor || '#FFF8F0' }}
                    title={`Fundo: ${style.backgroundColor || '#FFF8F0'}`}
                  />
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#713C48]">
                    {style.name}
                  </h3>
                  <p className="text-xs text-[#302B2D]/75 leading-relaxed mt-1">
                    {style.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#713C48]/10 flex items-center justify-between text-xs text-[#713C48] font-medium">
                <span>{isSelected ? 'Estilo Selecionado' : 'Escolher paleta'}</span>
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
