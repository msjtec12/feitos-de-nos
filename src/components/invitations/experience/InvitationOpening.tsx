'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { ThemeParticles } from './ThemeParticles';

interface InvitationOpeningProps {
  title?: string;
  honoreeName?: string | null;
  hostNames?: string;
  guestName?: string | null;
  themeConfig?: EventThemeConfig;
  hasMusic?: boolean;
  slug?: string;
  onOpen?: (withAudioGesture: boolean) => void;
}

export function InvitationOpening(props: InvitationOpeningProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const title = contextValues?.event.title || props.title || 'Convite Especial';
  const honoreeName = contextValues?.event.honoree_name ?? props.honoreeName;
  const hostNames = contextValues?.event.host_names || props.hostNames || '';
  const guestName = contextValues?.guest?.name ?? props.guestName;
  const slug = contextValues?.event.slug || props.slug;
  const onOpen = contextValues?.handleOpenInvitation || props.onOpen;
  const isEnvelopeOpened = contextValues ? contextValues.envelopeOpened : false;

  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(isEnvelopeOpened);

  // Sincronizar com estado do contexto
  useEffect(() => {
    setIsDismissed(isEnvelopeOpened);
    if (!isEnvelopeOpened) {
      setIsOpening(false);
    }
  }, [isEnvelopeOpened]);

  // Verificar se o convite já foi aberto nesta sessão
  useEffect(() => {
    if (!slug) return;
    try {
      const opened = sessionStorage.getItem('invitation_opened_' + slug);
      if (opened === 'true') {
        setIsDismissed(true);
        if (onOpen) onOpen(false);
      }
    } catch {
      // Ignorar erro de storage
    }
  }, [slug, onOpen]);

  if (isDismissed) return null;

  const handleTriggerOpen = (withAudioGesture = true) => {
    if (isOpening) return;
    setIsOpening(true);

    if (slug) {
      try {
        sessionStorage.setItem('invitation_opened_' + slug, 'true');
      } catch {
        // Ignorar
      }
    }

    setTimeout(() => {
      setIsDismissed(true);
      if (onOpen) onOpen(withAudioGesture);
    }, 700);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleTriggerOpen(false);
  };

  const openingSvg = activeTheme.assets.openingCoverSvg;
  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const displayName = honoreeName || title;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-5 overflow-hidden transition-all duration-700 select-none ${
        isOpening ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      style={{
        background: `radial-gradient(circle at 50% 30%, ${accentColor}44 0%, ${primaryColor}28 35%, rgba(12, 10, 11, 0.98) 75%)`,
      }}
    >
      {/* Partículas sutis no fundo da abertura */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ThemeParticles themeConfig={themeConfig} />
      </div>

      {/* Botão discreto de pular animação */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 shadow-xs border border-white/10"
        title="Pular animação e ir direto ao convite"
      >
        <span>Pular</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Conteúdo Central: Cabeçalho + Cartão Interativo + Indicador de Toque */}
      <div
        className="relative z-10 w-full max-w-[360px] sm:max-w-[380px] flex flex-col items-center cursor-pointer group"
        onClick={() => handleTriggerOpen(true)}
      >
        {/* Cabeçalho Elegante */}
        <div className="mb-3 sm:mb-4 text-center space-y-1.5 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest bg-white/10 text-white/90 border border-white/15 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{activeTheme.heroBadge || activeTheme.name}</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
            style={{ fontFamily: themeConfig.headingFont || activeTheme.config.headingFont }}
          >
            {displayName}
          </h2>

          {guestName ? (
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/30 backdrop-blur-xs">
                Convite especial para <strong className="text-white font-bold ml-1">{guestName}</strong>
              </span>
            </div>
          ) : (
            <p className="text-xs font-medium text-white/80 drop-shadow-sm">
              Um convite preparado especialmente para você
            </p>
          )}
        </div>

        {/* Aura de iluminação pulsante suave atrás do cartão */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] rounded-full opacity-35 blur-3xl pointer-events-none group-hover:opacity-50 transition-opacity duration-700"
          style={{ backgroundColor: accentColor }}
        />

        {/* O Cartão / Envelope Temático */}
        <div className="relative w-full aspect-[320/440] max-h-[62vh] sm:max-h-[68vh] rounded-[24px] overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-active:scale-[0.98] drop-shadow-[0_22px_45px_rgba(0,0,0,0.65)]">
          {/* Ilustração vetorial rica exclusiva do tema */}
          <div className="relative w-full h-full">
            <Image
              src={openingSvg}
              alt={`Cartão do tema ${activeTheme.name}`}
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Efeito de brilho de luz diagonal suave passando sobre o cartão */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Dica interativa animada de toque */}
        <div className="mt-3.5 sm:mt-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-lg border border-white/40 backdrop-blur-md transition-all group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Toque no cartão para abrir</span>
          </span>
        </div>
      </div>
    </div>
  );
}
