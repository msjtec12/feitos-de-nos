'use client';

import React from 'react';
import { GiftThemeData } from '@/types/gift-experience';
import { STYLE_OPTIONS } from '@/data/home-data';
import { GiftPageStatus } from '@/types/database';
import { StyleId } from '@/types/order';
import { Palette, Globe, Calendar, QrCode, ExternalLink, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { getGiftPagePublicUrl } from '@/lib/qr-code';

interface TabSettingsAndThemeProps {
  giftPageId: string;
  publicToken: string;
  status: GiftPageStatus;
  revealAt: string | null;
  theme: GiftThemeData;
  updateTheme: (fields: Partial<GiftThemeData>) => void;
  updatePageMeta: (fields: { status?: GiftPageStatus; reveal_at?: string | null }) => void;
  onOpenQRCode: () => void;
}

export function TabSettingsAndTheme({
  giftPageId,
  publicToken,
  status,
  revealAt,
  theme,
  updateTheme,
  updatePageMeta,
  onOpenQRCode,
}: TabSettingsAndThemeProps) {
  const publicUrl = getGiftPagePublicUrl(publicToken);

  const handleStyleChange = (styleId: StyleId) => {
    const selected = STYLE_OPTIONS.find((s) => s.id === styleId);
    if (!selected) return;

    updateTheme({
      styleId,
      primaryColor: selected.primaryColor,
      accentColor: selected.accentColor,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Visual Theme Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#C96E5A]" />
          <span>Estilo Visual & Cores</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = (theme.styleId || 'afetuoso') === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleChange(style.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20'
                    : 'bg-white/80 border-[#713C48]/15 hover:border-[#713C48]/40'
                }`}
              >
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: style.primaryColor }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: style.accentColor }}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-[#713C48]">{style.name}</h4>
                  <p className="text-[11px] text-[#302B2D]/70 leading-tight mt-0.5">{style.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Publication Status & Reveal Date */}
      <div className="space-y-4 pt-6 border-t border-[#713C48]/10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#C96E5A]" />
          <span>Status de Publicação & Revelação</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Status da Página</label>
            <select
              value={status}
              onChange={(e) => updatePageMeta({ status: e.target.value as GiftPageStatus })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            >
              <option value="draft">Rascunho (Privado para o Admin)</option>
              <option value="awaiting_approval">Aguardando Aprovação do Cliente</option>
              <option value="published">Publicado (Acessível via QR Code/Link)</option>
              <option value="unpublished">Despublicado (Acesso Bloqueado)</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">
              Data e Hora de Revelação da Surpresa (Opcional)
            </label>
            <input
              type="datetime-local"
              value={revealAt ? new Date(revealAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                updatePageMeta({ reveal_at: val });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
            <p className="text-[10px] text-[#302B2D]/60">
              Se configurada, a página exibirá contagem regressiva até esta data antes de abrir.
            </p>
          </div>
        </div>
      </div>

      {/* Public Link & QR Code Box */}
      <div className="bg-[#FFF8F0] border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#C96E5A]" />
            <h4 className="font-serif text-lg text-[#713C48]">Link Privado & QR Code</h4>
          </div>

          <button
            type="button"
            onClick={onOpenQRCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Ver QR Code / Imprimir</span>
          </button>
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#713C48]/15 text-xs text-[#302B2D] font-mono break-all flex items-center justify-between gap-2">
          <span>{publicUrl}</span>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-[#713C48] hover:text-[#5a2e39] flex-shrink-0"
            title="Abrir página"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
