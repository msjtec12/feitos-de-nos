'use client';

import React from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { TimelineMoment } from '@/types/gift';
import { MediaUploader } from '../MediaUploader';
import { Plus, Trash2, ChevronUp, ChevronDown, Calendar, Image as ImageIcon } from 'lucide-react';

interface TabTimelineProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

export function TabTimeline({ giftPageId, content, updateContent }: TabTimelineProps) {
  const moments = content.timelineMoments || [];

  const handleAddMoment = () => {
    const nextMonth = moments.length + 1;
    const newMoment: TimelineMoment = {
      monthNumber: nextMonth,
      title: `${nextMonth}º Mês — Um Novo Sorriso`,
      subtitle: `Mês ${nextMonth}`,
      caption: 'Escreva uma legenda carinhosa sobre este momento especial.',
      image: {
        id: `moment-${nextMonth}`,
        url: '',
        altText: `Foto do momento ${nextMonth}`,
        isAvailable: false,
      },
    };

    updateContent({
      timelineMoments: [...moments, newMoment],
    });
  };

  const handleUpdateMoment = (index: number, fields: Partial<TimelineMoment>) => {
    const updated = [...moments];
    updated[index] = { ...updated[index], ...fields };
    updateContent({ timelineMoments: updated });
  };

  const handleRemoveMoment = (index: number) => {
    const updated = moments.filter((_, i) => i !== index);
    updateContent({ timelineMoments: updated });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#713C48]/10 pb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C96E5A]" />
            <span>Linha do Tempo de Momentos ({moments.length})</span>
          </h3>
          <p className="text-xs text-[#302B2D]/70 mt-0.5">
            Adicione os 12 meses do bebê ou os marcos da história de amor.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMoment}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors shadow-sm"
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
          {moments.map((moment, idx) => (
            <div
              key={idx}
              className="bg-white/90 border border-[#713C48]/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative group"
            >
              <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-serif text-base font-semibold text-[#713C48]">
                    {moment.title || `Momento #${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20"
                    title="Mover para cima"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === moments.length - 1}
                    className="p-1.5 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20"
                    title="Mover para baixo"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMoment(idx)}
                    className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 ml-1"
                    title="Remover momento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#713C48]">Título do Momento *</label>
                  <input
                    type="text"
                    value={moment.title || ''}
                    onChange={(e) => handleUpdateMoment(idx, { title: e.target.value })}
                    placeholder="Ex: 1º Mês — Chegada ao Lar"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#713C48]">Subtítulo ou Data</label>
                  <input
                    type="text"
                    value={moment.subtitle || ''}
                    onChange={(e) => handleUpdateMoment(idx, { subtitle: e.target.value })}
                    placeholder="Ex: Abril de 2025"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#713C48]">Legenda / História do Mês</label>
                <textarea
                  rows={2}
                  value={moment.caption || ''}
                  onChange={(e) => handleUpdateMoment(idx, { caption: e.target.value })}
                  placeholder="Conte os detalhes, as primeiras gracinhas e o amor vivido..."
                  className="w-full p-3 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] resize-none"
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
          ))}
        </div>
      )}
    </div>
  );
}
