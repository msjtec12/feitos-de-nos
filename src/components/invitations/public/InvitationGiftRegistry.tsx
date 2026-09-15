'use client';

import React, { useState } from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { Gift, Copy, Check, HeartHandshake } from 'lucide-react';

interface InvitationGiftRegistryProps {
  giftInformation?: string | null;
  themeConfig: EventThemeConfig;
}

export function InvitationGiftRegistry({
  giftInformation,
  themeConfig,
}: InvitationGiftRegistryProps) {
  const [copied, setCopied] = useState(false);

  if (!giftInformation) return null;

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  // Check if there is an explicit Pix key inside giftInformation (e.g. key: xxx or email / phone / CPF)
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

  return (
    <section className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 text-center space-y-5">
        <div
          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          <Gift className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <span
            className="text-[11px] uppercase tracking-widest font-extrabold"
            style={{ color: accentColor }}
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

        <p className="text-xs sm:text-sm text-[#302B2D]/80 leading-relaxed max-w-md mx-auto">
          {giftInformation}
        </p>

        {/* If a Pix key is detected or provided */}
        {detectedPixKey && (
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-black/5 flex items-center justify-between gap-3 max-w-sm mx-auto">
              <div className="text-left overflow-hidden">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#302B2D]/50 block">
                  Chave Pix
                </span>
                <span className="font-mono text-xs text-[#1E293B] truncate block">
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

        <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-[#302B2D]/60 italic">
          <HeartHandshake className="w-4 h-4 text-[#C96E5A]" />
          <span>Sua presença e carinho são o que mais importa para nós!</span>
        </div>
      </div>
    </section>
  );
}
