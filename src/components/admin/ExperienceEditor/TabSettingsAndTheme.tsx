'use client';

import React from 'react';
import { GiftThemeData } from '@/types/gift-experience';
import { STYLE_OPTIONS } from '@/data/home-data';
import { GiftPageStatus } from '@/types/database';
import { StyleId } from '@/types/order';
import {
  Palette,
  Globe,
  Calendar,
  QrCode,
  ExternalLink,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
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

  const statusDescriptions: Record<GiftPageStatus, { title: string; desc: string; badgeClass: string }> = {
    draft: {
      title: 'Rascunho',
      desc: 'Privado. Apenas administradores conseguem visualizar e editar.',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    awaiting_approval: {
      title: 'Aguardando Aprovação',
      desc: 'Pronto para revisão do cliente antes do envio final.',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    published: {
      title: 'Publicado',
      desc: 'Ativo e acessível publicamente pelo link ou QR Code.',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    unpublished: {
      title: 'Despublicado',
      desc: 'Pausado temporariamente. O link público exibirá aviso de indisponibilidade.',
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
    },
    archived: {
      title: 'Arquivado',
      desc: 'Finalizado e arquivado para histórico permanente.',
      badgeClass: 'bg-stone-200 text-stone-800 border-stone-300',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#302B2D]/80 leading-relaxed">
          <strong className="text-[#713C48] block">Etapa 5 de 5: Tema Visual & Publicação</strong>
          Personalize as cores que compõem o design da página, defina a visibilidade (Rascunho vs Publicado) e agende uma data de revelação se o presente for uma surpresa futura.
        </div>
      </div>

      {/* Visual Theme Selection */}
      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#C96E5A]" />
          <span>Paleta de Cores e Identidade Visual</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = (theme.styleId || 'afetuoso') === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleChange(style.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-3.5 relative ${
                  isSelected
                    ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20'
                    : 'bg-[#FFF8F0]/40 border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-[#FFF8F0]/70'
                }`}
              >
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: style.primaryColor }}
                  />
                  <div
                    className="w-7 h-7 rounded-full border border-black/10 shadow-xs -ml-2"
                    style={{ backgroundColor: style.accentColor }}
                  />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="font-bold text-xs text-[#713C48]">{style.name}</h4>
                  <p className="text-[11px] text-[#302B2D]/70 leading-tight mt-0.5">{style.description}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 text-[#713C48]">
                    <CheckCircle2 className="w-4 h-4 text-[#713C48]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Publication Status & Reveal Date */}
      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#C96E5A]" />
          <span>Status de Visibilidade & Agendamento</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Status Atual da Página</label>
            <select
              value={status}
              onChange={(e) => updatePageMeta({ status: e.target.value as GiftPageStatus })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white font-medium"
            >
              <option value="draft">Rascunho (Privado para o Admin)</option>
              <option value="awaiting_approval">Aguardando Aprovação do Cliente</option>
              <option value="published">Publicado (Acessível via QR Code/Link)</option>
              <option value="unpublished">Despublicado (Acesso Bloqueado)</option>
              <option value="archived">Arquivado</option>
            </select>

            <p className="text-[11px] text-[#302B2D]/70 mt-1">
              {statusDescriptions[status]?.desc}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C96E5A]" />
              <span>Data e Hora da Revelação (Opcional)</span>
            </label>
            <input
              type="datetime-local"
              value={revealAt ? new Date(revealAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                const val = e.target.value ? new Date(e.target.value).toISOString() : null;
                updatePageMeta({ reveal_at: val });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white"
            />
            <p className="text-[10px] text-[#302B2D]/60 mt-1">
              {revealAt ? (
                <span className="text-[#C96E5A] font-semibold">
                  A página exibirá contagem regressiva até {new Date(revealAt).toLocaleString('pt-BR')}.
                </span>
              ) : (
                'Deixe em branco para liberação imediata assim que publicada.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Public Link & QR Code Box */}
      <div className="bg-[#FFF8F0] border border-[#713C48]/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#C96E5A]" />
            <h4 className="font-serif text-lg font-bold text-[#713C48]">Link Privado & QR Code</h4>
          </div>

          <button
            type="button"
            onClick={onOpenQRCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-bold hover:bg-[#592F39] transition-all shadow-sm"
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
            className="p-1 text-[#713C48] hover:text-[#592F39] flex-shrink-0"
            title="Abrir página no navegador"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
