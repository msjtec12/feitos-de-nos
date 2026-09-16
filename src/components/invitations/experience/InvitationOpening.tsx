'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { ChevronRight } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';

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
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md transition-all duration-700 select-none ${
        isOpening ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      style={{
        background: `radial-gradient(circle at 50% 22%, ${accentColor}55 0%, ${primaryColor}33 25%, rgba(15,13,14,.97) 68%)`,
      }}
    >
      {/* Botão de pular animação */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white/80 hover:text-white bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all active:scale-95 shadow-xs"
        title="Pular animação e ir direto ao convite"
      >
        <span>Pular</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      <div className={`relative w-full cursor-pointer ${isDino ? 'max-w-[320px]' : 'max-w-sm'}`} onClick={() => handleTriggerOpen(true)}>
        <div className="relative z-10 mb-2 space-y-1 text-center text-white">
          <span className="text-[10px] font-bold uppercase tracking-[.24em] text-white/70">
            {activeTheme.name}
          </span>
          <h2
            className="text-2xl font-black leading-tight drop-shadow-lg sm:text-3xl"
            style={{ fontFamily: themeConfig.headingFont || activeTheme.config.headingFont }}
          >
            {honoreeName || title}
          </h2>
          <p className="text-xs font-medium text-white/75">Um convite preparado especialmente para você</p>
        </div>

        {/* Halo estático e discreto atrás do invólucro do tema */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-25 blur-2xl pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Card interativo de abertura com asset vetorial personalizado por tema */}
        <div className={`relative max-h-[75vh] w-full mx-auto flex flex-col items-center justify-center transition-transform duration-500 hover:scale-[1.01] active:scale-[0.995] ${isDino ? 'aspect-[9/16] overflow-hidden rounded-[28px] border-[5px] border-[#f5dfab] bg-[#f8edce] shadow-[0_28px_80px_rgba(0,0,0,.42)]' : 'aspect-[3/4]'}`}>
          <div className="relative w-full h-full">
            <Image
              src={isDino ? '/invitations/themes/dinosaurs/safari-premium-background.webp' : openingSvg}
              alt={`Abertura temática ${activeTheme.name}`}
              fill
              priority
              className={isDino ? 'object-cover' : 'object-contain drop-shadow-2xl'}
            />
            {isDino && (
              <div className="absolute inset-x-[12%] top-[42%] rounded-2xl border border-[#b98748]/60 bg-[#fff4d6]/94 px-4 py-4 text-center shadow-[0_12px_30px_rgba(69,43,20,.24)] backdrop-blur-sm">
                <span className="block text-[9px] font-black uppercase tracking-[.2em] text-[#15803d]">Convite de expedição</span>
                <strong className="mt-1 block font-serif text-xl text-[#5b351f]">Uma aventura espera por você</strong>
              </div>
            )}
          </div>

          {/* Dica interativa de toque */}
          <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-800 shadow-md border border-black/10 backdrop-blur-xs"
            >
              <span>Toque para abrir o convite</span>
            </span>
          </div>
        </div>

        {/* Informações do convidado se houver */}
        {guestName && (
          <div className="text-center mt-3">
            <span className="text-xs text-white/90 font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/10">
              Convite especial para <strong className="text-white font-bold">{guestName}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
