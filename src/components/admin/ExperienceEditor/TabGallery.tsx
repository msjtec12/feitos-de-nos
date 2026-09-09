'use client';

import React from 'react';
import { GiftContentData } from '@/types/gift-experience';
import { MediaItem } from '@/types/gift';
import { MediaUploader } from '../MediaUploader';
import { Plus, Trash2, Image as ImageIcon, HeartHandshake, Sparkles } from 'lucide-react';

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

  const handleRemoveGalleryItem = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
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

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Gallery Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#713C48]/10 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#C96E5A]" />
              <span>Galeria de Fotos Extras ({gallery.length})</span>
            </h3>
            <p className="text-xs text-[#302B2D]/70 mt-0.5">
              Fotos adicionais exibidas na grade interativa com visualização em modal/lightbox.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGalleryItem}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Foto à Galeria</span>
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
                className="bg-white/90 border border-[#713C48]/20 rounded-3xl p-4 space-y-3 shadow-sm relative group"
              >
                <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-2">
                  <span className="text-xs font-semibold text-[#713C48]">
                    Foto #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(idx)}
                    className="p-1 rounded-lg text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

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
                    value={item.caption || ''}
                    onChange={(e) => handleUpdateGalleryItem(idx, { caption: e.target.value })}
                    placeholder="Ex: Sorriso que ilumina tudo"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Closing Section */}
      <div className="space-y-4 pt-6 border-t border-[#713C48]/10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#C96E5A]" />
          <span>Mensagem de Encerramento</span>
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#713C48]">Título do Encerramento</label>
          <input
            type="text"
            value={closing.headline || ''}
            onChange={(e) => updateClosing({ headline: e.target.value })}
            placeholder="Ex: Para Sempre Guardado, O Amor que nos Une"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#713C48]">Texto da Mensagem Final</label>
          <textarea
            rows={3}
            value={closing.message || ''}
            onChange={(e) => updateClosing({ message: e.target.value })}
            placeholder="Ex: Que você cresça sabendo o quanto foi e sempre será amado por cada um de nós..."
            className="w-full p-3 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#713C48]">Assinatura / Quem presenteia</label>
          <input
            type="text"
            value={closing.signature || ''}
            onChange={(e) => updateClosing({ signature: e.target.value })}
            placeholder="Ex: Com todo o amor, Seus Pais e Padrinhos"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>
      </div>
    </div>
  );
}
