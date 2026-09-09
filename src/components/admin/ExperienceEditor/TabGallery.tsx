'use client';

import React, { useState } from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { MediaItem } from '@/types/gift';
import { MediaUploader } from '../MediaUploader';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  HeartHandshake,
  ChevronUp,
  ChevronDown,
  Info,
} from 'lucide-react';

interface TabGalleryProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

export function TabGallery({ giftPageId, content, updateContent }: TabGalleryProps) {
  const gallery = content.galleryItems || [];
  const closing = content.closing || {
    headline: 'Para Sempre Guardado',
    message: 'Que essas lembranças continuem vivas e aquecendo os corações.',
    signature: 'Com todo amor, Feito de Nós',
  };

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleAddGalleryItem = () => {
    const nextNum = gallery.length + 1;
    const newItem: MediaItem = {
      id: `gallery-${nextNum}-${crypto.randomUUID().slice(0, 4)}`,
      url: '',
      altText: `Foto da galeria #${nextNum}`,
      caption: '',
      aspectRatio: 'square',
      isAvailable: false,
    };

    updateContent({
      galleryItems: [...gallery, newItem],
    });
  };

  const handleUpdateGalleryItem = (index: number, fields: Partial<MediaItem>) => {
    const updated = [...gallery];
    updated[index] = { ...updated[index], ...fields };
    updateContent({ galleryItems: updated });
  };

  const handleConfirmRemove = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    updateContent({ galleryItems: updated });
    setDeleteIndex(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const updated = [...gallery];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    updateContent({ galleryItems: updated });
  };

  const updateClosing = (fields: Partial<typeof closing>) => {
    updateContent({
      closing: {
        ...closing,
        ...fields,
      },
    });
  };

  const headlineLength = (closing.headline || '').length;
  const messageLength = (closing.message || '').length;
  const signatureLength = (closing.signature || '').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#302B2D]/80 leading-relaxed">
          <strong className="text-[#713C48] block">Etapa 4 de 5: Galeria de Fotos & Encerramento</strong>
          Adicione fotos complementares em alta resolução e redija a dedicatória final que encerra a experiência com chave de ouro.
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#713C48]/10 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#C96E5A]" />
              <span>Galeria de Fotos Extras ({gallery.length})</span>
            </h3>
            <p className="text-xs text-[#302B2D]/70 mt-0.5">
              Fotos adicionais exibidas na grade interativa com visualização em modal expandido.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGalleryItem}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold hover:bg-[#592F39] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Foto</span>
          </button>
        </div>

        {gallery.length === 0 ? (
          <div className="border-2 border-dashed border-[#713C48]/20 rounded-3xl p-8 text-center space-y-2 bg-white/40">
            <ImageIcon className="w-7 h-7 text-[#C96E5A] mx-auto opacity-70" />
            <p className="text-xs font-semibold text-[#713C48]">Nenhuma foto extra na galeria</p>
            <p className="text-[11px] text-[#302B2D]/60">
              Você pode adicionar fotos complementares de momentos especiais aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gallery.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white border border-[#713C48]/15 rounded-3xl p-4 space-y-3 shadow-sm relative transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-2">
                  <span className="text-xs font-bold text-[#713C48]">
                    Foto #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20 transition-colors"
                      title="Mover para cima"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === gallery.length - 1}
                      className="p-1 rounded-lg text-[#713C48] hover:bg-[#713C48]/10 disabled:opacity-20 transition-colors"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteIndex(idx)}
                      className="p-1 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Remover foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {deleteIndex === idx && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-2 text-xs animate-in fade-in">
                    <span className="text-rose-900 font-medium">Remover Foto #{idx + 1}?</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setDeleteIndex(null)}
                        className="px-2 py-0.5 rounded text-stone-600 font-medium hover:bg-stone-200"
                      >
                        Não
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmRemove(idx)}
                        className="px-2.5 py-0.5 rounded bg-rose-700 text-white font-bold hover:bg-rose-800"
                      >
                        Sim
                      </button>
                    </div>
                  </div>
                )}

                <MediaUploader
                  giftPageId={giftPageId}
                  sectionKey={`gallery-${idx}`}
                  mediaType="image"
                  currentUrl={item.url}
                  onUploaded={(url) => {
                    handleUpdateGalleryItem(idx, {
                      url,
                      isAvailable: true,
                    });
                  }}
                  onRemove={() => {
                    handleUpdateGalleryItem(idx, {
                      url: '',
                      isAvailable: false,
                    });
                  }}
                  helperText="Envie a foto em alta resolução (até 10MB)"
                />

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#713C48]">Legenda (Opcional)</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={item.caption || ''}
                    onChange={(e) => handleUpdateGalleryItem(idx, { caption: e.target.value })}
                    placeholder="Ex: Sorriso que ilumina todos os dias"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Closing Section */}
      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#C96E5A]" />
          <span>Mensagem de Encerramento</span>
        </h3>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Título do Encerramento</label>
            <span className={`text-[10px] ${headlineLength > 65 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
              {headlineLength}/80
            </span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={closing.headline || ''}
            onChange={(e) => updateClosing({ headline: e.target.value })}
            placeholder="Ex: Para Sempre Guardado, O Amor que nos Une"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Texto da Mensagem Final</label>
            <span className={`text-[10px] ${messageLength > 350 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
              {messageLength}/400
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={400}
            value={closing.message || ''}
            onChange={(e) => updateClosing({ message: e.target.value })}
            placeholder="Ex: Que você cresça sabendo o quanto foi e sempre será amado por cada um de nós..."
            className="w-full p-3 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white resize-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Assinatura / Quem presenteia</label>
            <span className={`text-[10px] ${signatureLength > 65 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>
              {signatureLength}/80
            </span>
          </div>
          <input
            type="text"
            maxLength={80}
            value={closing.signature || ''}
            onChange={(e) => updateClosing({ signature: e.target.value })}
            placeholder="Ex: Com todo o amor, Seus Pais e Padrinhos"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
}
