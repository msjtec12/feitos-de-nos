'use client';

import React from 'react';
import { OrderFormData } from '@/types/order';
import { OCCASIONS, GIFT_FORMATS, STYLE_OPTIONS } from '@/data/home-data';
import { formatCurrency } from '@/lib/order-utils';
import { Heart, Edit3, CheckCircle2, QrCode, Sparkles, MessageSquare } from 'lucide-react';

interface StepReviewProps {
  formData: OrderFormData;
  onJumpToStep: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function StepReview({ formData, onJumpToStep, onSubmit, onBack, isSubmitting }: StepReviewProps) {
  const occasion = OCCASIONS.find((o) => o.id === formData.occasion);
  const format = GIFT_FORMATS.find((f) => f.id === formData.format);
  const style = STYLE_OPTIONS.find((s) => s.id === formData.style);

  const price = format ? format.price : 59.90;
  const formattedPrice = formatCurrency(price);

  const contents: string[] = [];
  if (formData.contentTypes.photos) contents.push('Fotos');
  if (formData.contentTypes.messages) contents.push('Mensagens de texto');
  if (formData.contentTypes.audios) contents.push('Áudios de voz');
  if (formData.contentTypes.video) contents.push('Vídeo');
  if (formData.contentTypes.music) contents.push('Música tema');
  if (formData.contentTypes.contributors) contents.push('Colaboradores');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Revisão do seu Pedido
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Confira os detalhes abaixo antes de gerar o código do pedido e enviar para o WhatsApp.
        </p>
      </div>

      {/* Summary Box */}
      <div className="bg-white/85 border-2 border-[#713C48]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        {/* Total Price Banner */}
        <div className="bg-[#FFF8F0] border border-[#713C48]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#713C48] text-[#FFF8F0] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D9A4A0]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#C96E5A]">
                {format?.title || 'Formato'}
              </p>
              <h3 className="font-serif text-xl text-[#713C48]">
                {occasion?.title || 'Presente Feito de Nós'}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#302B2D]/60 block sm:inline mr-2">Investimento total:</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#713C48]">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Column 1: Gift Details */}
          <div className="space-y-4 bg-[#FFF8F0]/60 p-5 rounded-2xl border border-[#713C48]/10">
            <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#713C48]">
                Detalhes do Presente
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(3)}
                className="text-xs text-[#C96E5A] hover:text-[#713C48] font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>

            <div className="space-y-2 text-sm text-[#302B2D]">
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Presenteado:</span>
                <strong className="font-semibold text-[#713C48]">{formData.recipientName}</strong> ({formData.recipientRelationship})
              </div>
              {formData.recipientDate && (
                <div>
                  <span className="text-xs text-[#302B2D]/60 block">Data / Ocasião:</span>
                  <span>{formData.recipientDate}</span>
                </div>
              )}
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Título:</span>
                <span>{formData.giftTitle}</span>
              </div>
              {formData.openingMessage && (
                <div>
                  <span className="text-xs text-[#302B2D]/60 block">Dedicatória:</span>
                  <p className="italic text-xs text-[#302B2D]/80 bg-white/70 p-2.5 rounded-lg mt-0.5 border border-[#713C48]/10">
                    &ldquo;{formData.openingMessage}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Format, Style & Contents */}
          <div className="space-y-4 bg-[#FFF8F0]/60 p-5 rounded-2xl border border-[#713C48]/10">
            <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#713C48]">
                Formato & Estilo
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(2)}
                className="text-xs text-[#C96E5A] hover:text-[#713C48] font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>

            <div className="space-y-2 text-sm text-[#302B2D]">
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Formato de entrega:</span>
                <strong className="font-semibold text-[#713C48]">{format?.title}</strong> ({format?.isPhysical ? 'Físico + Digital' : 'Digital'})
              </div>
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Estilo visual:</span>
                <span className="font-medium text-[#713C48]">{style?.name}</span> ({style?.description})
              </div>
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Conteúdos inclusos:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {contents.map((c, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#713C48]/10 text-[#713C48] font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Customer Info */}
          <div className="md:col-span-2 space-y-4 bg-[#FFF8F0]/60 p-5 rounded-2xl border border-[#713C48]/10">
            <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#713C48]">
                Seus Dados de Contato
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(6)}
                className="text-xs text-[#C96E5A] hover:text-[#713C48] font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#302B2D]">
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Comprador:</span>
                <strong className="font-semibold">{formData.customerName}</strong>
              </div>
              <div>
                <span className="text-xs text-[#302B2D]/60 block">WhatsApp:</span>
                <span className="font-mono">{formData.customerPhone}</span>
              </div>
              <div>
                <span className="text-xs text-[#302B2D]/60 block">E-mail:</span>
                <span>{formData.customerEmail}</span>
              </div>
              <div>
                <span className="text-xs text-[#302B2D]/60 block">Localidade:</span>
                <span>{formData.customerCity} / {formData.customerState}</span>
              </div>
              {formData.customerCep && (
                <div>
                  <span className="text-xs text-[#302B2D]/60 block">CEP:</span>
                  <span className="font-mono">{formData.customerCep}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Next Step Notice */}
      <div className="bg-[#713C48]/5 border border-[#713C48]/15 rounded-2xl p-4.5 flex items-start gap-3.5">
        <MessageSquare className="w-5 h-5 text-[#713C48] flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-[#302B2D]/85 leading-relaxed">
          Ao clicar no botão abaixo, geraremos o <strong>código exclusivo do seu pedido</strong> e direcionaremos você para a página de envio com o link oficial do WhatsApp.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#713C48]/10">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-[#713C48] hover:bg-[#713C48]/10 transition-colors text-center"
        >
          ← Voltar e Ajustar
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-base hover:bg-[#5a2e39] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48] disabled:opacity-50"
        >
          <Heart className="w-5 h-5 text-[#D9A4A0] fill-current" />
          <span>{isSubmitting ? 'Gerando Pedido...' : 'Preparar pedido no WhatsApp →'}</span>
        </button>
      </div>
    </div>
  );
}
