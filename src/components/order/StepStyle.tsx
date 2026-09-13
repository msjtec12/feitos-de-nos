'use client';

import React from 'react';
import { OCCASIONS, STYLE_OPTIONS } from '@/data/home-data';
import { StyleId, OrderFormData } from '@/types/order';
import { Check, Palette, Sparkles } from 'lucide-react';

interface StepStyleProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const STYLE_CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'classicos', label: 'Clássicos' },
  { id: 'infantil', label: 'Bebê & Infantil' },
  { id: 'romantico', label: 'Amor & Casamento' },
  { id: 'familia', label: 'Família' },
  { id: 'celebracoes', label: 'Celebrações' },
  { id: 'natureza', label: 'Natureza' },
  { id: 'serenos', label: 'Serenos' },
  { id: 'sazonal', label: 'Sazonais' },
];

export function StepStyle({ formData, updateForm, onNext, onBack }: StepStyleProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const occasion = OCCASIONS.find((item) => item.id === formData.occasion);

  const filteredStyles = React.useMemo(() => {
    if (selectedCategory === 'all') return STYLE_OPTIONS;
    return STYLE_OPTIONS.filter((style) => style.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelect = (id: StyleId) => updateForm({ style: id });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#713C48]/10 text-[#713C48] text-[11px] font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            Identidade visual
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
            Escolha a atmosfera da experiência
          </h2>
          <p className="text-sm sm:text-base text-[#302B2D]/75 max-w-2xl">
            Cada paleta combina cor principal, apoio, acento, fundo e contraste. Você escolhe o estilo agora e ainda poderá fazer ajustes finos no editor.
          </p>
        </div>

        {occasion && (
          <div className="rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 px-4 py-3 text-xs text-[#302B2D]/75 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#C96E5A] shrink-0 mt-0.5" />
            <span>
              Para <strong className="text-[#713C48]">{occasion.title}</strong>, destacamos a paleta{' '}
              <strong className="text-[#713C48]">{STYLE_OPTIONS.find((s) => s.id === occasion.suggestedStyle)?.name}</strong>. Ela já foi selecionada como ponto de partida, mas você pode trocar.
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {STYLE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${active ? 'bg-[#713C48] text-white shadow-xs' : 'bg-white text-[#713C48] border border-[#713C48]/15 hover:bg-[#713C48]/5'}`}
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
          const isRecommended = occasion?.suggestedStyle === style.id;
          const colors = [
            style.primaryColor,
            style.secondaryColor || style.accentColor,
            style.accentColor,
            style.backgroundColor || '#FFF8F0',
          ];

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelect(style.id)}
              className={`p-5 rounded-3xl text-left transition-all border-2 flex flex-col justify-between relative group min-h-[235px] ${isSelected ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20' : 'bg-white/80 border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-white hover:-translate-y-0.5'}`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#713C48] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {colors.map((color, index) => (
                      <span
                        key={`${color}-${index}`}
                        className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  {isRecommended && (
                    <span className="ml-auto mr-7 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#C96E5A]/10 text-[#A8503E]">
                      Indicado
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#713C48]">{style.name}</h3>
                  <p className="text-xs text-[#302B2D]/75 leading-relaxed mt-1">{style.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-stone-500">
                  <span className="truncate">Fundo {style.backgroundColor}</span>
                  <span className="truncate">Texto {style.textColor}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#713C48]/10 flex items-center justify-between text-xs text-[#713C48] font-medium">
                <span>{isSelected ? 'Paleta selecionada' : 'Escolher paleta'}</span>
                <Palette className="w-3.5 h-3.5 opacity-60" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#713C48]/10">
        <button type="button" onClick={onBack} className="px-6 py-3 rounded-full text-sm font-semibold text-[#713C48] hover:bg-[#713C48]/10 transition-colors">← Voltar</button>
        <button type="button" onClick={onNext} className="px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-lg">Avançar para Seus Dados →</button>
      </div>
    </div>
  );
}
