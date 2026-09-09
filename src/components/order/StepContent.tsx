'use client';

import React from 'react';
import { OrderFormData, OrderContentTypes } from '@/types/order';
import { Camera, FileText, Mic, Film, Music, Users2, Info, Check } from 'lucide-react';

interface StepContentProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ContentOption {
  key: keyof OrderContentTypes;
  title: string;
  description: string;
  icon: React.ElementType;
}

const CONTENT_OPTIONS: ContentOption[] = [
  {
    key: 'photos',
    title: 'Fotos e Linha do Tempo',
    description: 'Imagens em alta definição organizadas por datas, meses ou fases especiais.',
    icon: Camera,
  },
  {
    key: 'messages',
    title: 'Mensagens de Texto e Cartas',
    description: 'Palavras sinceras, dedicatórias e relatos que contam a essência da relação.',
    icon: FileText,
  },
  {
    key: 'audios',
    title: 'Áudios de Voz Emocionantes',
    description: 'Depoimentos gravados de pais, avós ou amigos com player interativo.',
    icon: Mic,
  },
  {
    key: 'video',
    title: 'Vídeo ou Clipe Especial',
    description: 'Inserção de vídeo comemorativo ou melhores momentos.',
    icon: Film,
  },
  {
    key: 'music',
    title: 'Música Tema / Trilha Sonora',
    description: 'A canção que marca a história de vocês tocando suavemente.',
    icon: Music,
  },
  {
    key: 'contributors',
    title: 'Múltiplos Colaboradores',
    description: 'Espaço dedicado para mensagens e fotos de vários familiares e padrinhos.',
    icon: Users2,
  },
];

export function StepContent({ formData, updateForm, onNext, onBack }: StepContentProps) {
  const toggleContent = (key: keyof OrderContentTypes) => {
    updateForm({
      contentTypes: {
        ...formData.contentTypes,
        [key]: !formData.contentTypes[key],
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Quais conteúdos você deseja incluir?
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Selecione o que você gostaria de reunir. Você pode ajustar ou adicionar mais itens depois no WhatsApp.
        </p>
      </div>

      {/* Helpful Notification Banner */}
      <div className="bg-[#C96E5A]/10 border border-[#C96E5A]/25 rounded-2xl p-4.5 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#302B2D]/85 leading-relaxed">
          <strong className="font-semibold text-[#713C48]">Fique tranquilo(a):</strong> nenhum arquivo precisa ser enviado agora! Após concluir este pedido, nossa equipe guiará o envio das fotos e áudios com todo o carinho direto pelo WhatsApp.
        </div>
      </div>

      {/* Grid of Checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONTENT_OPTIONS.map((item) => {
          const isChecked = formData.contentTypes[item.key];
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleContent(item.key)}
              className={`p-5 rounded-2xl text-left transition-all border-2 flex items-start gap-4 ${
                isChecked
                  ? 'bg-[#FFF8F0] border-[#713C48] shadow-sm'
                  : 'bg-white/70 border-[#713C48]/15 hover:border-[#713C48]/30 hover:bg-white'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  isChecked
                    ? 'bg-[#713C48] text-[#FFF8F0]'
                    : 'border border-[#713C48]/30 bg-white'
                }`}
              >
                {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#C96E5A]" />
                  <h3 className="font-semibold text-sm text-[#713C48]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#302B2D]/75 leading-relaxed">
                  {item.description}
                </p>
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
          Avançar para Estilo →
        </button>
      </div>
    </div>
  );
}
