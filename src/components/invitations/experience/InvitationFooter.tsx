'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Sparkles } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { getInvitationThemeCopy } from '@/lib/invitations/theme-copy';

interface InvitationFooterProps {
  themeKey?: string;
}

export function InvitationFooter({ themeKey }: InvitationFooterProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(themeKey);
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const primaryColor = activeTheme.previewColors.primary;
  const dividerSvg = activeTheme.assets.dividerSvg;
  const themeCopy = getInvitationThemeCopy(activeTheme);

  return (
    <footer className="pt-6 pb-12 text-center space-y-4 relative z-10 overflow-hidden">
      {/* 1. Cenário Ilustrado / Divisor de Rodapé do Tema */}
      <div className="max-w-xs mx-auto px-4">
        {isDino ? (
          <div className="space-y-3">
            {/* Mensagem de encerramento afetuosa */}
            <p className="font-serif italic text-sm text-[#5C3A21] font-semibold">
              {themeCopy.closing}
            </p>
            <div className="flex items-center justify-center gap-2 text-[#C48243]">
              <span className="h-[1px] w-8 bg-[#C48243]/40" />
              <span>♥</span>
              <span className="h-[1px] w-8 bg-[#C48243]/40" />
            </div>
            {/* Trilha de pegadas na terra/areia */}
            <div className="relative w-full h-8 flex items-center justify-center">
              <Image
                src="/invitations/themes/dinosaurs/footprints.svg"
                alt="Pegadas de dinossauro"
                fill
                className="object-contain opacity-70"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Divisor SVG próprio do tema */}
            {dividerSvg && (
              <div className="relative w-full h-7 flex items-center justify-center">
                <Image
                  src={dividerSvg}
                  alt={`Divisor ${activeTheme.name}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-xs font-semibold" style={{ color: primaryColor }}>
              {themeCopy.closing}
            </p>
            {activeTheme.scenery.footerThemeNote && (
              <p className="text-[11px] text-slate-500">
                {activeTheme.scenery.footerThemeNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. Marca Feito de Nós */}
      <div className="pt-4 border-t border-black/5 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Feito de Nós"
        >
          <BrandLogo size="sm" />
        </Link>
        <p className="text-[11px] text-slate-500">
          Momentos especiais começam com um convite inesquecível.
        </p>
        <div>
          <Link
            href="/convites"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713C48] hover:text-[#C96E5A] bg-white/80 px-3 py-1 rounded-full border border-black/5 shadow-2xs transition-all hover:bg-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Crie um convite interativo para o seu evento</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
