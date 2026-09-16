'use client';

import React, { useState } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { Gift, Copy, Check } from 'lucide-react';
import { useOptionalInvitationTheme } from '../experience/InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';

interface InvitationGiftRegistryProps {
  giftInformation?: string | null;
  themeConfig?: EventThemeConfig;
}

export function InvitationGiftRegistry(props: InvitationGiftRegistryProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const giftInformation = contextValues?.event.gift_information ?? props.giftInformation;

  const [copied, setCopied] = useState(false);

  if (!giftInformation) return null;

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const isHero = activeTheme.assetFolder === 'heroes';
  const isBlocos = activeTheme.assetFolder === 'blocks';

  // Identificar chave Pix se houver
  const pixMatch = giftInformation.match(/(?:pix|chave)\s*(?::|é)?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d{11}|\d{14}|[a-zA-Z0-9-]{20,})/i);
  const detectedPixKey = pixMatch ? pixMatch[1] : null;

  const handleCopyPix = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  let cardContainerClass = 'bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 text-center space-y-4';
  if (isDino) {
    cardContainerClass = 'bg-[#FAF5E6] rounded-[28px] p-6 sm:p-8 shadow-md border-2 border-[#D4C29D] text-center space-y-4';
  } else if (isHero) {
    cardContainerClass = 'bg-white rounded-2xl p-6 sm:p-8 border-3 border-slate-900 shadow-[5px_5px_0px_#DC2626] text-center space-y-4';
  } else if (isBlocos) {
    cardContainerClass = 'bg-[#F0FDF4] rounded-none p-6 sm:p-8 border-3 border-emerald-950 shadow-[5px_5px_0px_#15803D] text-center space-y-4 font-mono';
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-4 space-y-4">
      <div className={cardContainerClass}>
        <div
          className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: isDino ? '#E07A28' : `${accentColor}18`,
            color: isDino ? '#FFFFFF' : accentColor,
          }}
        >
          <Gift className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span
            className="text-[11px] uppercase tracking-widest font-extrabold block"
            style={{ color: isDino ? '#15803D' : accentColor }}
          >
            Mimo & Sugestão
          </span>
          <h3
            className="font-serif text-2xl sm:text-3xl font-bold"
            style={{ color: primaryColor }}
          >
            Lista de Presentes
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
          {giftInformation}
        </p>

        {/* Chave Pix destacada */}
        {detectedPixKey && (
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 max-w-sm mx-auto">
              <div className="text-left overflow-hidden">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                  Chave Pix
                </span>
                <span className="font-mono text-xs text-slate-800 truncate block">
                  {detectedPixKey}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyPix(detectedPixKey)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Pix</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
