'use client';

import React, { useState } from 'react';
import { OrderFormData } from '@/types/order';
import { User, Heart, Calendar, Type, Sparkles } from 'lucide-react';

interface StepRecipientProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepRecipient({ formData, updateForm, onNext, onBack }: StepRecipientProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndNext = () => {
    const errs: Record<string, string> = {};
    if (!formData.recipientName.trim()) {
      errs.recipientName = 'Por favor, informe o nome de quem receberá o presente.';
    }
    if (!formData.recipientRelationship.trim()) {
      errs.recipientRelationship = 'Informe o grau de parentesco ou vínculo de carinho.';
    }
    if (!formData.giftTitle.trim()) {
      errs.giftTitle = 'Dê um título especial para o presente.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Quem é a pessoa homenageada?
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Essas informações darão o tom carinhoso para a capa e cabeçalho do presente.
        </p>
      </div>

      <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Recipient Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="recipientName"
            className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
          >
            <User className="w-4 h-4 text-[#C96E5A]" />
            <span>Nome de quem vai receber o presente *</span>
          </label>
          <input
            id="recipientName"
            type="text"
            value={formData.recipientName}
            onChange={(e) => {
              updateForm({ recipientName: e.target.value });
              if (errors.recipientName) setErrors((prev) => ({ ...prev, recipientName: '' }));
            }}
            placeholder="Ex: Matheus Akira, Gabriela, Vovó Maria..."
            maxLength={60}
            className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
              errors.recipientName ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
            } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
          />
          {errors.recipientName && (
            <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>
          )}
        </div>

        {/* Relationship and Date (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label
              htmlFor="recipientRelationship"
              className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
            >
              <Heart className="w-4 h-4 text-[#C96E5A]" />
              <span>Grau de parentesco ou vínculo *</span>
            </label>
            <input
              id="recipientRelationship"
              type="text"
              value={formData.recipientRelationship}
              onChange={(e) => {
                updateForm({ recipientRelationship: e.target.value });
                if (errors.recipientRelationship) setErrors((prev) => ({ ...prev, recipientRelationship: '' }));
              }}
              placeholder="Ex: Filho(a), Esposa, Mãe, Afilhado(a), Amigo..."
              maxLength={40}
              className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                errors.recipientRelationship ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
              } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
            />
            {errors.recipientRelationship && (
              <p className="text-xs text-red-500 mt-1">{errors.recipientRelationship}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="recipientDate"
              className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
            >
              <Calendar className="w-4 h-4 text-[#C96E5A]" />
              <span>Data especial ou Ocasião</span>
            </label>
            <input
              id="recipientDate"
              type="text"
              value={formData.recipientDate}
              onChange={(e) => updateForm({ recipientDate: e.target.value })}
              placeholder="Ex: 12/03/2026, 1º Aninho, 10 anos juntos..."
              maxLength={40}
              className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all"
            />
          </div>
        </div>

        {/* Gift Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="giftTitle"
            className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
          >
            <Type className="w-4 h-4 text-[#C96E5A]" />
            <span>Título do Presente *</span>
          </label>
          <input
            id="giftTitle"
            type="text"
            value={formData.giftTitle}
            onChange={(e) => {
              updateForm({ giftTitle: e.target.value });
              if (errors.giftTitle) setErrors((prev) => ({ ...prev, giftTitle: '' }));
            }}
            placeholder="Ex: O Primeiro Ano do Matheus, Nossa História de Amor..."
            maxLength={80}
            className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
              errors.giftTitle ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
            } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
          />
          {errors.giftTitle && (
            <p className="text-xs text-red-500 mt-1">{errors.giftTitle}</p>
          )}
        </div>

        {/* Opening Message */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="openingMessage"
              className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
            >
              <Sparkles className="w-4 h-4 text-[#C96E5A]" />
              <span>Dedicatória ou Frase de Abertura (Opcional)</span>
            </label>
            <span className="text-[11px] text-[#302B2D]/50 font-mono">
              {(formData.openingMessage || '').length}/200
            </span>
          </div>
          <textarea
            id="openingMessage"
            rows={3}
            value={formData.openingMessage || ''}
            onChange={(e) => updateForm({ openingMessage: e.target.value })}
            placeholder="Ex: O ano em que o mundo ganhou você e a nossa vida se transformou em amor..."
            maxLength={200}
            className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all resize-none"
          />
        </div>
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
          onClick={validateAndNext}
          className="px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
        >
          Avançar para Conteúdos →
        </button>
      </div>
    </div>
  );
}
