'use client';

import React from 'react';
import { EyeOff, Play } from 'lucide-react';

interface MotionPreferenceControlProps {
  reducedMotion: boolean;
  onToggle: () => void;
  accentColor?: string;
}

export function MotionPreferenceControl({
  reducedMotion,
  onToggle,
  accentColor = '#C96E5A',
}: MotionPreferenceControlProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed top-4 left-4 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/80 hover:bg-white text-[#302B2D]/80 backdrop-blur-md shadow-xs border border-black/5 transition-all hover:scale-105 active:scale-95"
      aria-label={reducedMotion ? 'Ativar animações' : 'Reduzir animações'}
      title={reducedMotion ? 'Ativar animações' : 'Reduzir animações visuais'}
    >
      {reducedMotion ? (
        <>
          <Play className="w-3 h-3" style={{ color: accentColor }} />
          <span>Ativar Animações</span>
        </>
      ) : (
        <>
          <EyeOff className="w-3 h-3 text-[#302B2D]/60" />
          <span>Reduzir Efeitos</span>
        </>
      )}
    </button>
  );
}
