import React from "react";

interface BrandSymbolProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Símbolo oficial "Feito de Nós":
 * Coração estilizado formado por nó/laço entrelaçado contendo as ondas de áudio (memória de voz).
 * Lado esquerdo em Vinho (#713C48) e lado direito em Terracota (#C96E5A).
 */
export function BrandSymbol({
  className = "w-7 h-7",
  size = 28,
}: BrandSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Laço do Coração - Lado Vinho (#713C48) */}
      <path
        d="M20 72C10 68 4 58 4 45C4 28 18 16 32 16C42 16 50 24 53 34C48 45 40 54 28 62C20 67 12 70 8 72C15 74 24 74 34 71C46 67 55 58 62 48"
        stroke="#713C48"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Laço do Coração - Lado Terracota (#C96E5A) */}
      <path
        d="M50 31C55 20 66 14 78 14C90 14 98 24 98 38C98 52 87 64 74 69C62 74 48 72 38 67C26 61 16 52 10 40"
        stroke="#C96E5A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ondas Sonoras Verticais (Sound Waveform) no interior */}
      <rect x="68" y="32" width="4.5" height="14" rx="2.25" fill="#C96E5A" />
      <rect x="76" y="24" width="4.5" height="30" rx="2.25" fill="#C96E5A" />
      <rect x="84" y="32" width="4.5" height="14" rx="2.25" fill="#C96E5A" />
    </svg>
  );
}

/**
 * Divisor decorativo de linha de nó/fio afetivo inspirado no mockup
 */
export function DecorativeKnotDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 opacity-75 ${className}`} aria-hidden="true">
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-brand-rose" />
      <BrandSymbol size={22} />
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-brand-rose" />
    </div>
  );
}

/**
 * Ilustração vetorial decorativa de linha contínua que serpenteia no fundo da página
 */
export function BackgroundKnotArt({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute overflow-hidden ${className}`} aria-hidden="true">
      <svg
        width="320"
        height="600"
        viewBox="0 0 320 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-20"
      >
        <path
          d="M280 40C200 80 120 40 80 120C40 200 160 260 220 320C280 380 260 480 180 540C120 580 40 560 20 600"
          stroke="#C96E5A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
        <path
          d="M260 180C220 140 160 160 140 210C120 260 180 300 210 340C240 380 230 440 180 470"
          stroke="#713C48"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
