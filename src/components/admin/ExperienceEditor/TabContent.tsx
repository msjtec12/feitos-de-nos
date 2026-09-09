'use client';

import React from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { MediaUploader } from '../MediaUploader';
import { User, Sparkles, Volume2, Info } from 'lucide-react';

interface TabContentProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

export function TabContent({ giftPageId, content, updateContent }: TabContentProps) {
  const recipient = content.recipient || {};
  const primaryAudio = content.primaryAudio || {
    id: 'primary-audio',
    title: 'Mensagem em Áudio',
    audioUrl: '',
    recordedBy: '',
  };

  const updateRecipient = (fields: Partial<typeof recipient>) => {
    updateContent({
      recipient: {
        ...recipient,
        ...fields,
      },
    });
  };

  const updatePrimaryAudio = (fields: Partial<typeof primaryAudio>) => {
    updateContent({
      primaryAudio: {
        ...primaryAudio,
        ...fields,
      },
    });
  };

  const nameLength = (recipient.name || '').length;
  const subtitleLength = (recipient.subtitle || '').length;
  const taglineLength = (recipient.tagline || '').length;
  const quoteLength = (recipient.introQuote || '').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#302B2D]/80 leading-relaxed">
          <strong className="text-[#713C48] block">Etapa 1 de 5: Apresentação da Experiência</strong>
          Defina o nome da pessoa presenteada, a mensagem de boas-vindas, a foto principal que estampa a capa e o áudio de abertura.
        </div>
      </div>

      {/* Recipient & Headline Card */}
      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <User className="w-4 h-4 text-[#C96E5A]" />
          <span>Informações do Homenageado</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#713C48]">Nome do Presenteado *</label>
              <span className={`text-[10px] ${nameLength > 50 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
                {nameLength}/60
              </span>
            </div>
            <input
              type="text"
              maxLength={60}
              value={recipient.name || ''}
              onChange={(e) => updateRecipient({ name: e.target.value })}
              placeholder="Ex: Matheus Akira"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#713C48]">Subtítulo ou Ocasião</label>
              <span className={`text-[10px] ${subtitleLength > 70 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
                {subtitleLength}/80
              </span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={recipient.subtitle || ''}
              onChange={(e) => updateRecipient({ subtitle: e.target.value })}
              placeholder="Ex: Meu Primeiro Ano de Vida, Nossos 10 Anos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Frase / Tagline de Destaque</label>
            <span className={`text-[10px] ${taglineLength > 110 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
              {taglineLength}/120
            </span>
          </div>
          <input
            type="text"
            maxLength={120}
            value={recipient.tagline || ''}
            onChange={(e) => updateRecipient({ tagline: e.target.value })}
            placeholder="Ex: 12 meses de puro amor, sorrisos e doces descobertas"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Citação ou Mensagem de Abertura</label>
            <span className={`text-[10px] ${quoteLength > 280 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
              {quoteLength}/300
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={300}
            value={recipient.introQuote || ''}
            onChange={(e) => updateRecipient({ introQuote: e.target.value })}
            placeholder="Ex: O ano em que o mundo ganhou você e a nossa vida se transformou em afeto infinito..."
            className="w-full p-3 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white resize-none transition-all"
          />
        </div>
      </div>

      {/* Featured Photo Upload Card */}
      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C96E5A]" />
          <span>Foto Principal de Capa</span>
        </h3>

        <MediaUploader
          giftPageId={giftPageId}
          sectionKey="cover"
          mediaType="image"
          currentUrl={recipient.featuredImage?.url}
          onUploaded={(url) => {
            updateRecipient({
              featuredImage: {
                id: 'cover-photo',
                url,
                altText: `Foto de capa de ${recipient.name || 'presenteado'}`,
                aspectRatio: 'square',
                isAvailable: true,
              },
            });
          }}
          onRemove={() => {
            updateRecipient({
              featuredImage: {
                id: 'cover-photo',
                url: '',
                altText: '',
                isAvailable: false,
              },
            });
          }}
          helperText="Envie a foto com boa iluminação e resolução (JPG, PNG ou WebP até 10MB)"
        />
      </div>

      {/* Primary Audio Player Card */}
      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#C96E5A]" />
          <span>Mensagem em Áudio Principal (Opcional)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Título do Áudio</label>
            <input
              type="text"
              value={primaryAudio.title || ''}
              onChange={(e) => updatePrimaryAudio({ title: e.target.value })}
              placeholder="Ex: Mensagem dos Pais, Carta de Amor"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Voz / Gravado Por</label>
            <input
              type="text"
              value={primaryAudio.recordedBy || ''}
              onChange={(e) => updatePrimaryAudio({ recordedBy: e.target.value })}
              placeholder="Ex: Papai e Mamãe, Seus Padrinhos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
            />
          </div>
        </div>

        <MediaUploader
          giftPageId={giftPageId}
          sectionKey="audio"
          mediaType="audio"
          currentUrl={primaryAudio.audioUrl}
          onUploaded={(url) => {
            updatePrimaryAudio({
              audioUrl: url,
              isAvailable: true,
            });
          }}
          onRemove={() => {
            updatePrimaryAudio({
              audioUrl: '',
              isAvailable: false,
            });
          }}
          helperText="Envie a gravação de voz (MP3, M4A ou WebM até 20MB)"
        />
      </div>
    </div>
  );
}
