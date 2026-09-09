'use client';

import React, { useState } from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { TimelineMoment } from '@/types/gift';
import { MediaUploader } from '../MediaUploader';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Calendar,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface TabTimelineProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

export function TabTimeline({ giftPageId, content, updateContent }: TabTimelineProps) {
  const moments = content.timelineMoments || [];
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddMoment = () => {
    const nextMonth = moments.length + 1;
    const newMoment: TimelineMoment = {
      monthNumber: nextMonth,
      title: `${nextMonth}º Mês — Um Novo Sorriso`,
      subtitle: `Mês ${nextMonth}`,
      caption: 'Escreva uma legenda carinhosa sobre este momento especial.',
      image: {
        id: `moment-${nextMonth}-${crypto.randomUUID().slice(0, 4)}`,
        url: '',
        altText: `Foto do momento ${nextMonth}`,
        isAvailable: false,
      },
    };

    updateContent({
      timelineMoments: [...moments, newMoment],
    });
  };

  const handleDuplicateMoment = (index: number) => {
    const source = moments[index];
    const duplicated: TimelineMoment = {
      ...source,
      title: `${source.title} (Cópia)`,
      image: {
        ...source.image,
        id: `moment-dup-${crypto.randomUUID().slice(0, 6)}`,
      },
    };
    const updated = [...moments];
    updated.splice(index + 1, 0, duplicated);
    updateContent({ timelineMoments: updated });
  };

  const handleUpdateMoment = (index: number, fields: Partial<TimelineMoment>) => {
    const updated = [...moments];
    updated[index] = { ...updated[index], ...fields };
    updateContent({ timelineMoments: updated });
  };

  const handleConfirmRemove = (index: number) => {
    const updated = moments.filter((_, i) => i !== index);
    updateContent({ timelineMoments: updated });
    setDeleteIndex(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= moments.length) return;

    const updated = [...moments];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateContent({ timelineMoments: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#302B2D]/80 leading-relaxed">
          <strong className="text-[#713C48] block">Etapa 2 de 5: Linha do Tempo Cronológica</strong>
          Adicione os meses do primeiro ano do bebê ou os marcos mais marcantes da história de amor. Você pode adicionar quantos momentos desejar e reordená-los livremente.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#713C48]/10 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C96E5A]" />
            <span>Momentos Cadastrados ({moments.length})</span>
          </h3>
          <p className="text-xs text-[#302B2D]/70 mt-0.5">
            Organize a sequência cronológica que será exibida de forma interativa para o presenteado.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMoment}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold hover:bg-[#592F39] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Momento</span>
        </button>
      </div>

      {moments.length === 0 ? (
        <div className="border-2 border-dashed border-[#713C48]/20 rounded-3xl p-10 text-center space-y-3 bg-white/40">
          <Calendar className="w-8 h-8 text-[#C96E5A] mx-auto opacity-70" />
          <p className="text-sm font-semibold text-[#713C48]">Nenhum momento adicionado ainda</p>
          <p className="text-xs text-[#302B2D]/60 max-w-sm mx-auto">
            Clique no botão acima para adicionar o primeiro mês ou marco da linha do tempo.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {moments.map((moment, idx) => {
            const hasPhoto = Boolean(moment.image?.url);
            const titleLength = (moment.title || '').length;
            const captionLength = (moment.caption || '').length;

            return (
              <div
                key={idx}
                className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="font-serif text-base font-bold text-[#713C48]">
                      {moment.title || `Momento #${idx + 1}`}
                    </span>
                    {hasPhoto ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Foto pronta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Sem foto
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
                      disabled={idx === moments.length - 1}
                      className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20 transition-colors"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateMoment(idx)}
                      className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 transition-colors"
                      title="Duplicar momento"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteIndex(idx)}
                      className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors ml-1"
                      title="Remover momento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Warning */}
                {deleteIndex === idx && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                    <span className="text-rose-900 font-medium">
                      Tem certeza que deseja remover o <strong>{moment.title || `Momento #${idx + 1}`}</strong>?
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
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-[#713C48]">Título do Momento *</label>
                      <span className={`text-[10px] ${titleLength > 50 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
                        {titleLength}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={moment.title || ''}
                      onChange={(e) => handleUpdateMoment(idx, { title: e.target.value })}
                      placeholder="Ex: 1º Mês — Chegada ao Lar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#713C48]">Subtítulo ou Data</label>
                    <input
                      type="text"
                      maxLength={60}
                      value={moment.subtitle || ''}
                      onChange={(e) => handleUpdateMoment(idx, { subtitle: e.target.value })}
                      placeholder="Ex: Abril de 2025"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-[#713C48]">Legenda / História do Mês</label>
                    <span className={`text-[10px] ${captionLength > 250 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
                      {captionLength}/300
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={moment.caption || ''}
                    onChange={(e) => handleUpdateMoment(idx, { caption: e.target.value })}
                    placeholder="Conte os detalhes, as primeiras gracinhas e o amor vivido neste período..."
                    className="w-full p-3 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white resize-none transition-all"
                  />
                </div>

                <div className="pt-2">
                  <MediaUploader
                    giftPageId={giftPageId}
                    sectionKey={`timeline-${idx}`}
                    mediaType="image"
                    currentUrl={moment.image?.url}
                    onUploaded={(url) => {
                      handleUpdateMoment(idx, {
                        image: {
                          id: `timeline-photo-${idx}`,
                          url,
                          altText: moment.title || `Momento ${idx + 1}`,
                          isAvailable: true,
                        },
                      });
                    }}
                    onRemove={() => {
                      handleUpdateMoment(idx, {
                        image: {
                          id: `timeline-photo-${idx}`,
                          url: '',
                          altText: '',
                          isAvailable: false,
                        },
                      });
                    }}
                    label={`Foto do ${moment.title || `Momento #${idx + 1}`}`}
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
