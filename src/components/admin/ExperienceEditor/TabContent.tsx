'use client';

import React from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { MediaUploader } from '../MediaUploader';
import { User, Sparkles, Volume2, Type } from 'lucide-react';

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

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Recipient & Headline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <User className="w-4 h-4 text-[#C96E5A]" />
          <span>Apresentação & Homenageado</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Nome da Pessoa Presenteada *</label>
            <input
              type="text"
              value={recipient.name || ''}
              onChange={(e) => updateRecipient({ name: e.target.value })}
              placeholder="Ex: Matheus Akira"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Subtítulo ou Tema da Ocasião</label>
            <input
              type="text"
              value={recipient.subtitle || ''}
              onChange={(e) => updateRecipient({ subtitle: e.target.value })}
              placeholder="Ex: Meu Primeiro Ano, 10 Anos de Amor"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#713C48]">Frase / Tagline de Destaque</label>
          <input
            type="text"
            value={recipient.tagline || ''}
            onChange={(e) => updateRecipient({ tagline: e.target.value })}
            placeholder="Ex: 12 meses de puro amor, sorrisos e descobertas"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#713C48]">Citação ou Mensagem de Abertura</label>
          <textarea
            rows={3}
            value={recipient.introQuote || ''}
            onChange={(e) => updateRecipient({ introQuote: e.target.value })}
            placeholder="Ex: O ano em que o mundo ganhou você e a nossa vida se transformou em amor..."
            className="w-full p-3 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] resize-none"
          />
        </div>
      </div>

      {/* Featured Photo Upload */}
      <div className="space-y-3 pt-4 border-t border-[#713C48]/10">
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
          helperText="Envie a melhor foto para a capa da experiência (quadrada ou vertical, até 10MB)"
        />
      </div>

      {/* Primary Audio Player */}
      <div className="space-y-4 pt-4 border-t border-[#713C48]/10">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Voz / Gravado Por</label>
            <input
              type="text"
              value={primaryAudio.recordedBy || ''}
              onChange={(e) => updatePrimaryAudio({ recordedBy: e.target.value })}
              placeholder="Ex: Papai e Mamãe, Seus Padrinhos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
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
          helperText="Envie o arquivo gravado de áudio (MP3 ou M4A, até 20MB)"
        />
      </div>
    </div>
  );
}
