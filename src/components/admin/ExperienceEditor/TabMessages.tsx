'use client';

import React, { useState } from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { ContributorMessage } from '@/types/gift';
import { MediaUploader } from '../MediaUploader';
import {
  Plus,
  Trash2,
  Users,
  Volume2,
  MessageSquareQuote,
  Copy,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface TabMessagesProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

export function TabMessages({ giftPageId, content, updateContent }: TabMessagesProps) {
  const messages = content.contributorMessages || [];
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddMessage = () => {
    const nextId = messages.length + 1;
    const newMessage: ContributorMessage = {
      id: `contributor-${nextId}-${crypto.randomUUID().slice(0, 4)}`,
      authorName: '',
      relation: '',
      writtenMessage: '',
    };

    updateContent({
      contributorMessages: [...messages, newMessage],
    });
  };

  const handleDuplicateMessage = (index: number) => {
    const source = messages[index];
    const duplicated: ContributorMessage = {
      ...source,
      id: `contributor-dup-${crypto.randomUUID().slice(0, 6)}`,
      authorName: `${source.authorName || 'Autor'} (Cópia)`,
    };
    const updated = [...messages];
    updated.splice(index + 1, 0, duplicated);
    updateContent({ contributorMessages: updated });
  };

  const handleUpdateMessage = (index: number, fields: Partial<ContributorMessage>) => {
    const updated = [...messages];
    updated[index] = { ...updated[index], ...fields };
    updateContent({ contributorMessages: updated });
  };

  const handleConfirmRemove = (index: number) => {
    const updated = messages.filter((_, i) => i !== index);
    updateContent({ contributorMessages: updated });
    setDeleteIndex(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= messages.length) return;

    const updated = [...messages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateContent({ contributorMessages: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#302B2D]/80 leading-relaxed">
          <strong className="text-[#713C48] block">Etapa 3 de 5: Mensagens de Amor & Vozes</strong>
          Reúna depoimentos, cartas e áudios de avós, padrinhos, tios e amigos queridos. Cada mensagem ganha um cartão dedicado na experiência.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#713C48]/10 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C96E5A]" />
            <span>Mensagens Cadastradas ({messages.length})</span>
          </h3>
          <p className="text-xs text-[#302B2D]/70 mt-0.5">
            Depoimentos individuais de quem faz parte dessa história com cartas e áudios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMessage}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold hover:bg-[#592F39] transition-all shadow-sm"
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
            Clique no botão acima para adicionar cartas e áudios carinhosos.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg, idx) => {
            const hasAudio = Boolean(msg.audio?.audioUrl);
            const msgLength = (msg.writtenMessage || '').length;

            return (
              <div
                key={msg.id || idx}
                className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="font-serif text-base font-bold text-[#713C48]">
                      {msg.authorName || `Mensagem #${idx + 1}`}
                      {msg.relation ? ` (${msg.relation})` : ''}
                    </span>
                    {hasAudio && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Áudio anexado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20 transition-colors"
                      title="Mover para cima"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === messages.length - 1}
                      className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20 transition-colors"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateMessage(idx)}
                      className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 transition-colors"
                      title="Duplicar mensagem"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteIndex(idx)}
                      className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors ml-1"
                      title="Remover mensagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Warning */}
                {deleteIndex === idx && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                    <span className="text-rose-900 font-medium">
                      Remover a mensagem de <strong>{msg.authorName || `Autor #${idx + 1}`}</strong>?
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setDeleteIndex(null)}
                        className="px-2.5 py-1 rounded-lg text-stone-600 hover:bg-stone-200 font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmRemove(idx)}
                        className="px-3 py-1 rounded-lg bg-rose-700 text-white font-bold hover:bg-rose-800 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#713C48]">Nome do Autor *</label>
                    <input
                      type="text"
                      maxLength={60}
                      value={msg.authorName || ''}
                      onChange={(e) => handleUpdateMessage(idx, { authorName: e.target.value })}
                      placeholder="Ex: Vovó Regina & Vovô Carlos"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#713C48]">Grau de Parentesco / Vínculo</label>
                    <input
                      type="text"
                      maxLength={60}
                      value={msg.relation || ''}
                      onChange={(e) => handleUpdateMessage(idx, { relation: e.target.value })}
                      placeholder="Ex: Avós Paternos, Padrinhos, Amigos de Infância"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-[#713C48]">Mensagem Escrita *</label>
                    <span className={`text-[10px] ${msgLength > 450 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
                      {msgLength}/500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={msg.writtenMessage || ''}
                    onChange={(e) => handleUpdateMessage(idx, { writtenMessage: e.target.value })}
                    placeholder="Escreva a dedicatória ou carta de amor..."
                    className="w-full p-3 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white resize-none transition-all"
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
                          title: `Áudio de ${msg.authorName || 'Familiar'}`,
                          audioUrl: url,
                          recordedBy: msg.authorName || '',
                          isAvailable: true,
                        },
                      });
                    }}
                    onRemove={() => {
                      handleUpdateMessage(idx, {
                        audio: undefined,
                      });
                    }}
                    helperText="Envie a gravação de voz recebida (MP3, M4A ou WebM)"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
