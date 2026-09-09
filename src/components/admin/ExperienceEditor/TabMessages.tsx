'use client';

import React from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { ContributorMessage } from '@/types/gift';
import { MediaUploader } from '../MediaUploader';
import { Plus, Trash2, Users, Volume2, MessageSquareQuote } from 'lucide-react';

interface TabMessagesProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

export function TabMessages({ giftPageId, content, updateContent }: TabMessagesProps) {
  const messages = content.contributorMessages || [];

  const handleAddMessage = () => {
    const nextId = messages.length + 1;
    const newMessage: ContributorMessage = {
      id: `contributor-${nextId}-${crypto.randomUUID().slice(0, 4)}`,
      authorName: 'Vovô e Vovó',
      relation: 'Avós',
      writtenMessage: 'Você é a maior bênção das nossas vidas. Estaremos sempre aqui para te amar e proteger.',
    };

    updateContent({
      contributorMessages: [...messages, newMessage],
    });
  };

  const handleUpdateMessage = (index: number, fields: Partial<ContributorMessage>) => {
    const updated = [...messages];
    updated[index] = { ...updated[index], ...fields };
    updateContent({ contributorMessages: updated });
  };

  const handleRemoveMessage = (index: number) => {
    const updated = messages.filter((_, i) => i !== index);
    updateContent({ contributorMessages: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#713C48]/10 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C96E5A]" />
            <span>Mensagens & Vozes de Familiares / Amigos ({messages.length})</span>
          </h3>
          <p className="text-xs text-[#302B2D]/70 mt-0.5">
            Depoimentos individuais com textos, fotos e áudios de quem faz parte dessa história.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMessage}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Mensagem</span>
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="border-2 border-dashed border-[#713C48]/20 rounded-3xl p-10 text-center space-y-3 bg-white/40">
          <MessageSquareQuote className="w-8 h-8 text-[#C96E5A] mx-auto opacity-70" />
          <p className="text-sm font-semibold text-[#713C48]">Nenhuma mensagem individual adicionada</p>
          <p className="text-xs text-[#302B2D]/60 max-w-sm mx-auto">
            Clique no botão acima para adicionar cartas e áudios de avós, padrinhos e amigos.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className="bg-white/90 border border-[#713C48]/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative group"
            >
              <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#713C48]/10 text-[#713C48] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-serif text-base font-semibold text-[#713C48]">
                    {msg.authorName || 'Autor'} ({msg.relation || 'Relação'})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMessage(idx)}
                  className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50"
                  title="Remover mensagem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#713C48]">Nome do Autor *</label>
                  <input
                    type="text"
                    value={msg.authorName || ''}
                    onChange={(e) => handleUpdateMessage(idx, { authorName: e.target.value })}
                    placeholder="Ex: Vovó Regina & Vovô Carlos"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#713C48]">Grau de Parentesco / Vínculo</label>
                  <input
                    type="text"
                    value={msg.relation || ''}
                    onChange={(e) => handleUpdateMessage(idx, { relation: e.target.value })}
                    placeholder="Ex: Avós, Padrinhos, Titia"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#713C48]">Mensagem Escrita *</label>
                <textarea
                  rows={3}
                  value={msg.writtenMessage || ''}
                  onChange={(e) => handleUpdateMessage(idx, { writtenMessage: e.target.value })}
                  placeholder="Escreva a dedicatória ou carta de amor..."
                  className="w-full p-3 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] resize-none"
                />
              </div>

              {/* Contributor Audio Upload */}
              <div className="pt-2 border-t border-[#713C48]/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#713C48]">
                  <Volume2 className="w-3.5 h-3.5 text-[#C96E5A]" />
                  <span>Áudio de Voz Desta Mensagem (Opcional)</span>
                </div>
                <MediaUploader
                  giftPageId={giftPageId}
                  sectionKey={`contributor-audio-${idx}`}
                  mediaType="audio"
                  currentUrl={msg.audio?.audioUrl}
                  onUploaded={(url) => {
                    handleUpdateMessage(idx, {
                      audio: {
                        id: `audio-${msg.id}`,
                        title: `Áudio de ${msg.authorName}`,
                        audioUrl: url,
                        recordedBy: msg.authorName,
                        isAvailable: true,
                      },
                    });
                  }}
                  onRemove={() => {
                    handleUpdateMessage(idx, {
                      audio: undefined,
                    });
                  }}
                  helperText="Envie a gravação de voz enviada pelo colaborador (MP3 ou M4A)"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
