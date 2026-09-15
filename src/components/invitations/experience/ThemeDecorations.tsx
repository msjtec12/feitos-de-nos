'use client';

import React from 'react';

interface DecorationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
}

// 1. Monstrinhos Elementais
export function ElementalFire({ className = 'w-12 h-12', primaryColor = '#F97316', accentColor = '#FBBF24' }: DecorationProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="fireGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="70%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
      </defs>
      <path
        d="M40 8C43 24 58 26 58 44C58 58 49 68 40 68C31 68 22 58 22 44C22 28 36 20 40 8Z"
        fill="url(#fireGlow)"
        filter="drop-shadow(0 4px 6px rgba(249, 115, 22, 0.4))"
      />
      <path d="M40 28C43 36 50 40 50 48C50 56 45 60 40 60C35 60 30 56 30 48C30 38 38 34 40 28Z" fill="#FEF08A" />
      <ellipse cx="36" cy="46" rx="2.5" ry="3.5" fill="#1E293B" />
      <ellipse cx="44" cy="46" rx="2.5" ry="3.5" fill="#1E293B" />
      <circle cx="35" cy="45" r="1" fill="#FFFFFF" />
      <circle cx="43" cy="45" r="1" fill="#FFFFFF" />
      <path d="M38 51 Q40 53 42 51" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="24" r="2.5" fill={accentColor} className="animate-ping" style={{ animationDuration: '2s' }} />
      <circle cx="60" cy="30" r="2" fill={primaryColor} />
    </svg>
  );
}

export function ElementalWater({ className = 'w-12 h-12', primaryColor = '#0284C7', accentColor = '#38BDF8' }: DecorationProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>
      <path
        d="M40 12C40 12 60 36 60 50C60 62 51 70 40 70C29 70 20 62 20 50C20 36 40 12 40 12Z"
        fill="url(#waterGrad)"
        filter="drop-shadow(0 4px 6px rgba(2, 132, 199, 0.35))"
      />
      <path d="M30 38C26 44 26 52 28 56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="36" cy="50" rx="2.5" ry="3.5" fill="#0C4A6E" />
      <ellipse cx="44" cy="50" rx="2.5" ry="3.5" fill="#0C4A6E" />
      <circle cx="35" cy="49" r="1" fill="#FFFFFF" />
      <circle cx="43" cy="49" r="1" fill="#FFFFFF" />
      <path d="M37 55 Q40 58 43 55" stroke="#0C4A6E" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="31" cy="52" rx="2" ry="1.2" fill="#F472B6" opacity="0.5" />
      <ellipse cx="49" cy="52" rx="2" ry="1.2" fill="#F472B6" opacity="0.5" />
      <circle cx="62" cy="24" r="3" fill="#BAE6FD" opacity="0.8" />
      <circle cx="18" cy="34" r="2" fill="#7DD3FC" opacity="0.7" />
    </svg>
  );
}

// 2. Heróis Originais
export function HeroActionBurst({ className = 'w-16 h-16', text = 'POW!' }: { className?: string; text?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon
        points="50,4 64,22 88,12 82,36 100,50 82,64 88,88 64,78 50,96 36,78 12,88 18,64 0,50 18,36 12,12 36,22"
        fill="#FACC15"
        stroke="#DC2626"
        strokeWidth="4.5"
        strokeLinejoin="round"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="#DC2626"
        fontSize="20"
        fontWeight="900"
        fontFamily="Impact, sans-serif"
        transform="rotate(-6 50 50)"
      >
        {text}
      </text>
    </svg>
  );
}

export function HeroShield({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M40 6 L68 18 V44 C68 62 40 74 40 74 C40 74 12 62 12 44 V18 L40 6 Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="3.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
      <path d="M40 14 L62 24 V44 C62 57 40 67 40 67 C40 67 18 57 18 44 V24 L40 14 Z" fill="#DC2626" />
      <polygon points="40,24 45,35 56,35 47,43 51,54 40,47 29,54 33,43 24,35 35,35" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
    </svg>
  );
}

// 3. Reino Encantado
export function FairyCastle({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="22" y="38" width="36" height="30" rx="3" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2" />
      <rect x="32" y="24" width="16" height="20" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
      <polygon points="40,8 30,24 50,24" fill="#EC4899" stroke="#DB2777" strokeWidth="1.5" />
      <rect x="18" y="28" width="12" height="24" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
      <polygon points="24,14 16,28 32,28" fill="#EC4899" stroke="#DB2777" strokeWidth="1.5" />
      <rect x="50" y="28" width="12" height="24" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
      <polygon points="56,14 48,28 64,28" fill="#EC4899" stroke="#DB2777" strokeWidth="1.5" />
      <path d="M34 68 V52 C34 48 46 48 46 52 V68 Z" fill="#BE185D" />
      <circle cx="40" cy="6" r="2.5" fill="#FDE047" className="animate-ping" />
    </svg>
  );
}

// 4. Pop & Música
export function NeonMusicNotes({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M20 44 C20 48 16 52 12 52 C8 52 6 48 8 44 C10 40 16 40 20 44 Z M20 44 V16 L44 10 V38 C44 42 40 46 36 46 C32 46 30 42 32 38 C34 34 40 34 44 38 Z"
        fill="#A855F7"
        stroke="#EC4899"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 10px rgba(236, 72, 153, 0.7))"
      />
      <line x1="20" y1="22" x2="44" y2="16" stroke="#22D3EE" strokeWidth="3" />
    </svg>
  );
}

// 5. Aventura em Blocos (Pixel Art)
export function PixelGrassBlock({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="8" y="24" width="48" height="32" fill="#78350F" />
      <rect x="16" y="32" width="6" height="6" fill="#92400E" />
      <rect x="36" y="42" width="8" height="6" fill="#5B21B6" opacity="0.3" />
      <rect x="44" y="30" width="6" height="6" fill="#92400E" />
      <rect x="24" y="44" width="6" height="6" fill="#B45309" />
      <rect x="8" y="16" width="48" height="14" fill="#22C55E" />
      <rect x="14" y="30" width="6" height="8" fill="#16A34A" />
      <rect x="26" y="30" width="8" height="12" fill="#15803D" />
      <rect x="42" y="30" width="6" height="10" fill="#16A34A" />
      <rect x="8" y="8" width="48" height="12" fill="#4ADE80" />
    </svg>
  );
}

// 6. Dinossauros & Safari
export function FriendlyDino({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 48 C16 48 24 54 32 54 C46 54 54 44 54 34 V20 C54 14 62 12 68 14 C74 16 76 22 72 26 C68 28 64 26 62 30 V42 C62 58 48 68 32 68 C22 68 14 60 10 52 Z"
        fill="#15803D"
      />
      <path d="M34 50 C44 50 50 44 52 38 C54 48 48 60 36 62 C30 62 26 58 24 54 Z" fill="#86EFAC" />
      <circle cx="68" cy="18" r="2" fill="#052E16" />
      <circle cx="67.5" cy="17.5" r="0.6" fill="#FFFFFF" />
      <rect x="28" y="62" width="6" height="10" rx="3" fill="#15803D" />
      <rect x="42" y="62" width="6" height="10" rx="3" fill="#15803D" />
      <circle cx="36" cy="46" r="3" fill="#166534" />
      <circle cx="44" cy="40" r="3.5" fill="#166534" />
      <circle cx="48" cy="30" r="2.5" fill="#166534" />
    </svg>
  );
}

// 7. Bebê Delicado
export function DreamyMoon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M35 10 C46 10 56 18 58 30 C46 30 36 40 36 52 C36 56 37 60 39 63 C24 62 12 49 12 35 C12 21 22 10 35 10 Z"
        fill="#FDE68A"
        stroke="#F59E0B"
        strokeWidth="1.5"
      />
      <path d="M22 34 Q26 38 30 34" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <circle cx="56" cy="14" r="3.5" fill="#BFDBFE" />
      <polygon points="52,38 54,42 58,42 55,45 56,49 52,47 48,49 49,45 46,42 50,42" fill="#93C5FD" />
    </svg>
  );
}

// Master Decoration Selector - checks themeId OR themeSlug OR eventType
export function ThemeDecorationBadge({
  themeSlug,
  themeId,
  primaryColor,
  accentColor,
  className = 'w-14 h-14',
}: {
  themeSlug?: string;
  themeId?: string;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
}) {
  const slug = (themeId || themeSlug || '').toLowerCase();

  if (slug.includes('monstrinho') || slug.includes('pokemon') || slug.includes('elemental')) {
    return <ElementalFire className={className} primaryColor={primaryColor} accentColor={accentColor} />;
  }
  if (slug.includes('heroi') || slug.includes('super') || slug.includes('comic')) {
    return <HeroActionBurst className={className} text="POW!" />;
  }
  if (slug.includes('reino') || slug.includes('princesa') || slug.includes('castelo')) {
    return <FairyCastle className={className} />;
  }
  if (slug.includes('pop') || slug.includes('k-pop') || slug.includes('musica')) {
    return <NeonMusicNotes className={className} />;
  }
  if (slug.includes('bloco') || slug.includes('mine') || slug.includes('pixel')) {
    return <PixelGrassBlock className={className} />;
  }
  if (slug.includes('dino') || slug.includes('safari')) {
    return <FriendlyDino className={className} />;
  }
  if (slug.includes('delicado') || slug.includes('bebe')) {
    return <DreamyMoon className={className} />;
  }

  // Romântico / Elegante / Floral / Default
  return (
    <div className={'inline-flex items-center justify-center ' + className}>
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <circle cx="30" cy="30" r="26" stroke={primaryColor || '#713C48'} strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
        <path d="M30 10 L34 24 L48 28 L34 32 L30 46 L26 32 L12 28 L26 24 Z" fill={accentColor || '#C96E5A'} />
        <circle cx="30" cy="28" r="3" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// Full Thematic Banner Badge for the Header
export function ThematicHeaderBanner({
  themeId,
  themeSlug,
  primaryColor = '#713C48',
  accentColor = '#C96E5A',
  badgeText,
}: {
  themeId?: string;
  themeSlug?: string;
  primaryColor?: string;
  accentColor?: string;
  badgeText?: string;
}) {
  const slug = (themeId || themeSlug || '').toLowerCase();

  // 1. Heróis: Comic Action Ribbon
  if (slug.includes('heroi') || slug.includes('super')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-300 text-red-700 border-2 border-red-600 shadow-[3px_3px_0px_#1E3A8A] font-black uppercase text-xs tracking-wider animate-comic-action">
        <HeroShield className="w-5 h-5 shrink-0" />
        <span>{badgeText || '⚡ SUPER CONVITE OFICIAL ⚡'}</span>
      </div>
    );
  }

  // 2. Monstrinhos: Elemental Energy Pill
  if (slug.includes('monstrinho') || slug.includes('pokemon')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold text-xs tracking-wider shadow-md ring-2 ring-white">
        <span className="animate-bounce">🔥</span>
        <span>{badgeText || '✨ AVENTURA DOS ELEMENTOS ✨'}</span>
        <span className="animate-pulse">⚡</span>
      </div>
    );
  }

  // 3. Reino Encantado: Royal Gold Tiara Ribbon
  if (slug.includes('reino') || slug.includes('princesa')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-900 border-2 border-amber-300 shadow-sm font-serif font-bold text-xs tracking-wider">
        <span>👑</span>
        <span>{badgeText || 'CONVITE REAL ENCANTADO'}</span>
        <span>✨</span>
      </div>
    );
  }

  // 4. Pop & Música: Neon Concert Badge
  if (slug.includes('pop') || slug.includes('musica')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900 text-pink-300 border-2 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)] font-bold text-xs tracking-wider">
        <span>🎵</span>
        <span>{badgeText || 'CONVITE VIP • PALCO PRINCIPAL'}</span>
        <span className="animate-pulse">✨</span>
      </div>
    );
  }

  // 5. Aventura em Blocos: Pixel Box Badge
  if (slug.includes('bloco') || slug.includes('pixel')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-emerald-700 text-white border-2 border-emerald-950 shadow-[3px_3px_0px_#052E16] font-mono font-black text-xs tracking-wider">
        <span>🧱</span>
        <span>{badgeText || 'MISSÃO MUNDO PIXEL'}</span>
        <span>💎</span>
      </div>
    );
  }

  // 6. Dinossauros: Safari Stamp
  if (slug.includes('dino') || slug.includes('safari')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-100 text-emerald-900 border-2 border-emerald-700 shadow-xs font-bold text-xs tracking-wider">
        <span>🦖</span>
        <span>{badgeText || 'EXPEDIÇÃO JURÁSSICA'}</span>
        <span>🌿</span>
      </div>
    );
  }

  // 7. Bebê Delicado: Dreamy Cloud Badge
  if (slug.includes('delicado') || slug.includes('bebe')) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-blue-900 border border-blue-200 shadow-sm font-serif font-semibold text-xs tracking-wide">
        <span>🌙</span>
        <span>{badgeText || 'UM DIA MUITO ESPECIAL'}</span>
        <span>⭐</span>
      </div>
    );
  }

  // Standard Default
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-[#302B2D] border border-black/5 shadow-xs font-semibold text-xs tracking-wide">
      <span style={{ color: accentColor }}>✦</span>
      <span>{badgeText || 'CONVITE EXCLUSIVO'}</span>
      <span style={{ color: accentColor }}>✦</span>
    </div>
  );
}
