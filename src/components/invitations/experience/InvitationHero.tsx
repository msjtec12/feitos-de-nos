'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { EventThemeConfig } from '@/types/invitation';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme, getThemeDefaultHeroImage } from '@/data/invitation-themes';

interface InvitationHeroProps {
  title?: string;
  honoreeName?: string | null;
  hostNames?: string;
  headline?: string | null;
  coverUrl?: string | null;
  eventDate?: string;
  themeConfig?: EventThemeConfig;
  isEditor?: boolean;
}

export function InvitationHero(props: InvitationHeroProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const title = contextValues?.event.title || props.title || 'Convite Especial';
  const honoreeName = contextValues?.event.honoree_name ?? props.honoreeName;
  const hostNames = contextValues?.event.host_names || props.hostNames || '';
  const headline = contextValues?.event.headline ?? props.headline;
  const coverUrl = contextValues?.event.cover_url ?? props.coverUrl;
  const isEditor = contextValues?.isSimulator ?? props.isEditor ?? false;

  const themeId = activeTheme.id;
  const assetFolder = activeTheme.assetFolder;
  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;

  const defaultArtwork = activeTheme.defaultHeroImage || getThemeDefaultHeroImage(themeId);

  const [imageSrc, setImageSrc] = useState<string>(() => {
    const trimmed = coverUrl?.trim();
    return trimmed || defaultArtwork;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const trimmed = coverUrl?.trim();
    if (trimmed) {
      setImageSrc(trimmed);
      setHasError(false);
    } else {
      setImageSrc(defaultArtwork);
      setHasError(false);
    }
  }, [coverUrl, themeId, defaultArtwork]);

  const handleImageError = () => {
    if (imageSrc !== defaultArtwork) {
      setImageSrc(defaultArtwork);
      setHasError(true);
    }
  };

  const isDino = assetFolder === 'dinosaurs';
  const isHero = assetFolder === 'heroes';
  const isReino = assetFolder === 'enchanted';
  const isPop = assetFolder === 'pop';
  const isBlocos = assetFolder === 'blocks';
  const isElemental = assetFolder === 'elemental';
  const isBaby = assetFolder === 'baby';
  const isRomantic = assetFolder === 'romantic';
  const isElegant = assetFolder === 'elegant';
  const isSacred = assetFolder === 'sacred';
  const isBotanical = assetFolder === 'botanical';
  const isMinimal = assetFolder === 'minimal';
  const isCelebration = assetFolder === 'celebration';

  // Resolução da moldura da foto com base no tema
  let frameWrapperClass = 'rounded-3xl shadow-xl overflow-hidden border-2 border-white/80';
  if (isDino) {
    frameWrapperClass = 'rounded-[38px] shadow-2xl border-4 border-[#C48243] bg-[#FEFCE8] p-1.5 ring-4 ring-[#15803D]/30';
  } else if (isHero) {
    frameWrapperClass = 'rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#DC2626] bg-amber-100 p-1';
  } else if (isReino) {
    frameWrapperClass = 'rounded-t-[140px] rounded-b-3xl border-4 border-amber-300 shadow-2xl p-1.5 bg-pink-100/50 ring-2 ring-amber-200';
  } else if (isPop) {
    frameWrapperClass = 'rounded-2xl border-4 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] bg-purple-950 p-2 pb-10';
  } else if (isBlocos) {
    frameWrapperClass = 'rounded-none border-4 border-emerald-950 shadow-[6px_6px_0px_#15803D] bg-emerald-900/10 p-1';
  } else if (isElemental) {
    frameWrapperClass = 'rounded-3xl border-4 border-amber-500 shadow-2xl bg-amber-100/50 p-1.5 ring-2 ring-red-400';
  } else if (isBaby) {
    frameWrapperClass = 'rounded-[44px] border-4 border-blue-200 shadow-lg bg-white p-2';
  } else if (isRomantic) {
    frameWrapperClass = 'rounded-full aspect-square border-4 border-rose-300 shadow-xl p-2 bg-[#FFF8F0] ring-2 ring-[#C96E5A]/30';
  } else if (isElegant) {
    frameWrapperClass = 'rounded-xl border border-[#D97706] shadow-2xl p-2 bg-[#1C1917] ring-1 ring-[#D97706]/50';
  } else if (isSacred) {
    frameWrapperClass = 'rounded-t-[130px] rounded-b-2xl border-2 border-emerald-300 shadow-xl p-1.5 bg-[#F0FDF4]';
  } else if (isBotanical) {
    frameWrapperClass = 'rounded-full aspect-square border-4 border-purple-300 shadow-xl p-2 bg-[#FAF5FF] ring-2 ring-emerald-300';
  } else if (isMinimal) {
    frameWrapperClass = 'rounded-none border border-black shadow-sm p-0 bg-white';
  } else if (isCelebration) {
    frameWrapperClass = 'rounded-3xl border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] p-1.5 bg-purple-950';
  }

  return (
    <section className="text-center pt-2 pb-6 px-4 space-y-4 relative">
      {/* 1. Placa ou Faixa Superior Temática */}
      <div className="flex justify-center max-w-sm mx-auto">
        {isDino ? (
          <div className="relative w-full max-w-[340px] h-[85px]">
            <Image
              src="/invitations/themes/dinosaurs/wooden-sign.svg"
              alt="Expedição de 1 Ano"
              fill
              priority
              className="object-contain drop-shadow-md"
            />
            {/* Texto suspenso na placa de madeira */}
            <div className="absolute inset-0 pt-7 flex items-center justify-center pointer-events-none">
              <span className="text-[#3B1E08] font-black text-xs sm:text-sm tracking-wider uppercase font-sans drop-shadow-xs">
                {activeTheme.heroBadge || 'EXPEDIÇÃO DE 1 ANO'}
              </span>
            </div>
          </div>
        ) : isHero ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-300 text-red-700 border-2 border-slate-900 shadow-[3px_3px_0px_#1E3A8A] font-black uppercase text-xs tracking-wider animate-comic-action">
            <span>⚡ {activeTheme.heroBadge || 'CONVITE OFICIAL EM QUADRINHOS'} ⚡</span>
          </div>
        ) : isReino ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-900 border-2 border-amber-300 shadow-sm font-serif font-bold text-xs tracking-wider">
            <span>👑 {activeTheme.heroBadge || 'CONVITE REAL ENCANTADO'} 👑</span>
          </div>
        ) : isPop ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900 text-pink-300 border-2 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)] font-bold text-xs tracking-wider">
            <span>🎵 {activeTheme.heroBadge || 'CONVITE VIP • PALCO PRINCIPAL'} 🎵</span>
          </div>
        ) : isBlocos ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-emerald-800 text-white border-2 border-emerald-950 shadow-[3px_3px_0px_#052E16] font-mono font-black text-xs tracking-wider">
            <span>🧱 {activeTheme.heroBadge || 'MISSÃO MUNDO PIXEL'} 💎</span>
          </div>
        ) : isBaby ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-blue-900 border border-blue-200 shadow-sm font-serif font-semibold text-xs tracking-wide">
            <span>🌙 {activeTheme.heroBadge || 'UM DIA MUITO ESPECIAL'} ⭐</span>
          </div>
        ) : isMinimal ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 border-b border-black text-slate-800 font-sans uppercase text-[10px] tracking-[3px] font-bold">
            <span>{activeTheme.heroBadge || 'EDIÇÃO EXCLUSIVA'}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-slate-800 border border-black/10 shadow-xs font-semibold text-xs tracking-wide backdrop-blur-xs">
            <span style={{ color: accentColor }}>✦</span>
            <span>{activeTheme.heroBadge || `Convite especial por ${hostNames}`}</span>
            <span style={{ color: accentColor }}>✦</span>
          </div>
        )}
      </div>

      {/* 2. Título Principal (Nome do Homenageado) com Tipografia Temática */}
      <div className="space-y-1.5 max-w-lg mx-auto">
        <h1
          className={`text-3xl sm:text-5xl font-black leading-tight tracking-tight ${
            isHero
              ? 'uppercase font-sans drop-shadow-[2px_2px_0px_#FACC15] text-blue-950'
              : isPop
              ? 'font-sans text-pink-600 drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]'
              : isBlocos
              ? 'font-mono text-emerald-900 tracking-tighter'
              : isMinimal
              ? 'font-sans font-light tracking-tight text-black'
              : 'font-serif'
          }`}
          style={{ color: isMinimal ? '#09090B' : primaryColor }}
        >
          {honoreeName || title}
        </h1>

        {headline ? (
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-md mx-auto">
            {headline}
          </p>
        ) : (
          <p className="text-xs text-slate-600 italic max-w-md mx-auto">
            Você foi convidado com muito carinho para celebrar esse grande momento!
          </p>
        )}
      </div>

      {/* 3. Foto / Arte Temática com Moldura e Ilustrações de Cenário */}
      <div className="max-w-xs sm:max-w-sm mx-auto pt-1 relative">
        {/* Ilustrações de Cenário para Dinossauros & Safari */}
        {isDino && (
          <>
            {/* Bebê Brontossauro na lateral esquerda */}
            <div className="absolute -left-10 bottom-2 w-24 h-24 z-20 pointer-events-none drop-shadow-lg">
              <Image
                src="/invitations/themes/dinosaurs/baby-dinos.svg"
                alt="Bebê Dinossauro"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Placa rústica de aventuras à direita */}
            <div className="absolute -right-4 top-4 z-20 bg-[#C48243] text-[#3B1E08] border-2 border-[#5A2F11] rounded-lg px-2 py-1 shadow-md text-[9px] font-black uppercase tracking-tight transform rotate-6">
              Grandes Aventuras! 🌿
            </div>
          </>
        )}

        {/* Stickers para Heróis */}
        {isHero && (
          <div className="absolute -top-4 -right-4 z-20 animate-comic-action drop-shadow-xl">
            <span className="bg-yellow-400 text-red-600 border-2 border-black font-black text-xs px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000]">
              POW! 💥
            </span>
          </div>
        )}

        {/* Moldura da Foto */}
        <div className={frameWrapperClass}>
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={honoreeName || title}
              fill
              priority
              sizes="(max-width: 640px) 280px, 360px"
              className="object-cover"
              onError={handleImageError}
            />
          </div>

          {/* Legenda de foto instantânea para o tema Pop */}
          {isPop && (
            <div className="pt-2 text-center">
              <span className="text-white text-xs font-mono font-bold tracking-widest uppercase">
                ★ TOUR VIP ★
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
