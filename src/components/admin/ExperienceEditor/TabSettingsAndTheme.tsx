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
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredStyles = React.useMemo(() => {
    if (selectedCategory === 'all') return STYLE_OPTIONS;
    return STYLE_OPTIONS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const handleStyleChange = (styleId: StyleId) => {
    const selected = STYLE_OPTIONS.find((s) => s.id === styleId);
    if (!selected) return;

    updateTheme({
      styleId,
      primaryColor: selected.primaryColor,
      accentColor: selected.accentColor,
      backgroundColor: selected.backgroundColor || '#FFF8F0',
      textColor: selected.textColor || '#302B2D',
    });
  };

  const handleResetToStyleDefaults = () => {
    const selected = STYLE_OPTIONS.find((s) => s.id === theme.styleId) || STYLE_OPTIONS[0];
    if (!selected) return;

    updateTheme({
      primaryColor: selected.primaryColor,
      accentColor: selected.accentColor,
      backgroundColor: selected.backgroundColor || '#FFF8F0',
      textColor: selected.textColor || '#302B2D',
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#C96E5A]" />
              <span>Paleta de Cores e Identidade Visual</span>
            </h3>
            <p className="text-xs text-[#302B2D]/70 mt-0.5">
              Escolha entre 12 paletas curadas ou personalize cores específicas abaixo.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'classicos', label: 'Clássicos' },
              { id: 'infantil', label: 'Bebês & Infantil' },
              { id: 'romantico', label: 'Amor & Casamento' },
              { id: 'natureza', label: 'Natureza & Luz' },
            ].map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isCatActive
                      ? 'bg-[#713C48] text-[#FFF8F0] shadow-xs'
                      : 'bg-[#FFF8F0] text-[#713C48] hover:bg-[#713C48]/10 border border-[#713C48]/15'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Palettes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredStyles.map((style) => {
            const isSelected = (theme.styleId || 'afetuoso') === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => handleStyleChange(style.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-[#FFF8F0] border-[#713C48] shadow-md ring-2 ring-[#713C48]/20'
                    : 'bg-white border-[#713C48]/15 hover:border-[#713C48]/40 hover:bg-[#FFF8F0]/40'
                }`}
              >
                <div className="space-y-3 w-full">
                  {/* Header with Title and Active Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-[#713C48] leading-tight">
                      {style.name}
                    </h4>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#713C48] bg-white px-2 py-0.5 rounded-full border border-[#713C48]/30 shadow-xs flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-[#713C48]" />
                        Ativa
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                        {style.category || 'Tema'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#302B2D]/75 leading-relaxed">
                    {style.description}
                  </p>

                  {/* High-Contrast Color Swatch Strip */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/90 w-full">
                    {/* Primary Color */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0" title={`Cor Primária: ${style.primaryColor}`}>
                      <div
                        className="w-5 h-5 rounded-full ring-2 ring-black/20 shadow-xs flex-shrink-0"
                        style={{ backgroundColor: style.primaryColor }}
                      />
                      <span className="text-[10px] font-mono text-stone-700 font-bold truncate">
                        {style.primaryColor}
                      </span>
                    </div>

                    {/* Accent Color */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0" title={`Cor de Acento: ${style.accentColor}`}>
                      <div
                        className="w-5 h-5 rounded-full ring-2 ring-black/20 shadow-xs flex-shrink-0"
                        style={{ backgroundColor: style.accentColor }}
                      />
                      <span className="text-[10px] font-mono text-stone-700 font-bold truncate">
                        {style.accentColor}
                      </span>
                    </div>

                    {/* Background Preview Block */}
                    <div
                      className="px-2 py-0.5 rounded-md ring-1 ring-black/25 text-[10px] font-mono font-bold shadow-xs flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: style.backgroundColor || '#FFF8F0',
                        color: style.textColor || '#302B2D',
                      }}
                      title={`Fundo: ${style.backgroundColor || '#FFF8F0'} | Texto: ${style.textColor || '#302B2D'}`}
                    >
                      Fundo
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Advanced Custom Color Customizer */}
        <div className="pt-6 border-t border-[#713C48]/15 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#C96E5A]/15 text-[#C96E5A] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#713C48]">
                  Personalização Avançada de Cores
                </h4>
                <p className="text-[11px] text-[#302B2D]/70">
                  Ajuste fino individual de cada elemento visual do tema.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToStyleDefaults}
              className="text-xs text-[#713C48] hover:text-[#592F39] hover:underline font-bold bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#713C48]/20 transition-all shadow-xs"
            >
              Restaurar cores originais da paleta
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Cor Primária */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#713C48]/15 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#713C48]">
                  1. Cor Primária
                </label>
                <span className="text-[10px] text-[#302B2D]/60 font-medium">Títulos & Destaques</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-shrink-0" title="Clique para escolher com conta-gotas">
                  <input
                    type="color"
                    value={theme.primaryColor || '#713C48'}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-md ring-2 ring-[#713C48]/30 p-0 bg-transparent block"
                  />
                </label>

                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#713C48]/60">#</span>
                  <input
                    type="text"
                    value={(theme.primaryColor || '#713C48').replace('#', '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                      updateTheme({ primaryColor: `#${raw}` });
                    }}
                    placeholder="713C48"
                    maxLength={6}
                    className="w-full pl-7 pr-3 py-2.5 bg-[#FFF8F0]/40 border border-[#713C48]/25 rounded-xl font-mono text-sm font-bold text-[#302B2D] uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#302B2D]/50 font-semibold mr-1">Sugestões:</span>
                {['#713C48', '#C96E5A', '#302B2D', '#A04A35', '#52799A', '#4D6D53'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateTheme({ primaryColor: c })}
                    className="w-5 h-5 rounded-full border border-black/20 hover:scale-125 transition-transform shadow-xs"
                    style={{ backgroundColor: c }}
                    title={`Aplicar ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* 2. Cor Secundária / Acento */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#713C48]/15 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#713C48]">
                  2. Cor Secundária (Acento)
                </label>
                <span className="text-[10px] text-[#302B2D]/60 font-medium">Badges, Ícones & Ondas</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-shrink-0" title="Clique para escolher com conta-gotas">
                  <input
                    type="color"
                    value={theme.accentColor || '#C96E5A'}
                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-md ring-2 ring-[#713C48]/30 p-0 bg-transparent block"
                  />
                </label>

                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#713C48]/60">#</span>
                  <input
                    type="text"
                    value={(theme.accentColor || '#C96E5A').replace('#', '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                      updateTheme({ accentColor: `#${raw}` });
                    }}
                    placeholder="C96E5A"
                    maxLength={6}
                    className="w-full pl-7 pr-3 py-2.5 bg-[#FFF8F0]/40 border border-[#713C48]/25 rounded-xl font-mono text-sm font-bold text-[#302B2D] uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#302B2D]/50 font-semibold mr-1">Sugestões:</span>
                {['#C96E5A', '#D9A4A0', '#BFA15F', '#D4A373', '#F4C2A5', '#E5B8C0'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateTheme({ accentColor: c })}
                    className="w-5 h-5 rounded-full border border-black/20 hover:scale-125 transition-transform shadow-xs"
                    style={{ backgroundColor: c }}
                    title={`Aplicar ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* 3. Fundo da Página */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#713C48]/15 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#713C48]">
                  3. Fundo da Página
                </label>
                <span className="text-[10px] text-[#302B2D]/60 font-medium">Tom do Papel / Fundo</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-shrink-0" title="Clique para escolher com conta-gotas">
                  <input
                    type="color"
                    value={theme.backgroundColor || '#FFF8F0'}
                    onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-md ring-2 ring-[#713C48]/30 p-0 bg-transparent block"
                  />
                </label>

                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#713C48]/60">#</span>
                  <input
                    type="text"
                    value={(theme.backgroundColor || '#FFF8F0').replace('#', '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                      updateTheme({ backgroundColor: `#${raw}` });
                    }}
                    placeholder="FFF8F0"
                    maxLength={6}
                    className="w-full pl-7 pr-3 py-2.5 bg-[#FFF8F0]/40 border border-[#713C48]/25 rounded-xl font-mono text-sm font-bold text-[#302B2D] uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#302B2D]/50 font-semibold mr-1">Sugestões:</span>
                {['#FFF8F0', '#FAF7F2', '#FDFBF7', '#FFF9F5', '#F3F7FA', '#FFF5F5'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateTheme({ backgroundColor: c })}
                    className="w-5 h-5 rounded-full border border-black/20 hover:scale-125 transition-transform shadow-xs"
                    style={{ backgroundColor: c }}
                    title={`Aplicar ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* 4. Cor dos Textos */}
            <div className="p-4 bg-white rounded-2xl border-2 border-[#713C48]/15 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#713C48]">
                  4. Cor dos Textos
                </label>
                <span className="text-[10px] text-[#302B2D]/60 font-medium">Legibilidade & Parágrafos</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-shrink-0" title="Clique para escolher com conta-gotas">
                  <input
                    type="color"
                    value={theme.textColor || '#302B2D'}
                    onChange={(e) => updateTheme({ textColor: e.target.value })}
                    className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white shadow-md ring-2 ring-[#713C48]/30 p-0 bg-transparent block"
                  />
                </label>

                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#713C48]/60">#</span>
                  <input
                    type="text"
                    value={(theme.textColor || '#302B2D').replace('#', '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                      updateTheme({ textColor: `#${raw}` });
                    }}
                    placeholder="302B2D"
                    maxLength={6}
                    className="w-full pl-7 pr-3 py-2.5 bg-[#FFF8F0]/40 border border-[#713C48]/25 rounded-xl font-mono text-sm font-bold text-[#302B2D] uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#302B2D]/50 font-semibold mr-1">Sugestões:</span>
                {['#302B2D', '#262224', '#332520', '#243342', '#2B171A', '#233226'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateTheme({ textColor: c })}
                    className="w-5 h-5 rounded-full border border-black/20 hover:scale-125 transition-transform shadow-xs"
                    style={{ backgroundColor: c }}
                    title={`Aplicar ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Live Contrast Test Card */}
          <div
            style={{
              backgroundColor: theme.backgroundColor || '#FFF8F0',
              color: theme.textColor || '#302B2D',
            }}
            className="p-4 sm:p-5 rounded-2xl border-2 border-black/15 shadow-sm space-y-2 transition-all"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span
                style={{ color: theme.primaryColor || '#713C48' }}
                className="font-serif font-bold text-sm sm:text-base"
              >
                Prévia ao Vivo: Título com Cor Primária
              </span>
              <span
                style={{
                  backgroundColor: theme.accentColor || '#C96E5A',
                  color: '#FFFFFF',
                }}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider"
              >
                Badge de Acento
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90 font-medium">
              Este quadro simula o contraste real do texto sobre o fundo personalizado. Acompanhe também no Simulador de Smartphone ao lado!
            </p>
          </div>
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

        {/* 6-Month Hosting Policy Notice */}
        <div className="p-3.5 bg-[#FFF8F0] border border-[#713C48]/15 rounded-2xl flex items-start gap-2.5 text-xs text-[#302B2D]/80">
          <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#713C48] font-semibold">Política de Hospedagem: 6 Meses Online</strong>
            <p className="text-[11px] text-[#302B2D]/70 mt-0.5">
              A página fica disponível publicamente no ar por 6 meses a partir da criação. O cliente e o presenteado contam com a funcionalidade de download completo das fotos e áudios gravados (.ZIP) diretamente na página para mantê-los salvos para sempre.
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
