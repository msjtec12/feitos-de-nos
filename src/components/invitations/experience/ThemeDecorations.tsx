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
        filter="drop-shadow(0 4px 6px rgba(249, 115, 22, 0.3))"
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
        filter="drop-shadow(0 4px 6px rgba(2, 132, 199, 0.25))"
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

export function ElementalEarth({ className = 'w-12 h-12', primaryColor = '#15803D', accentColor = '#86EFAC' }: DecorationProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="earthGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>
      <rect x="22" y="32" width="36" height="34" rx="17" fill="url(#earthGrad)" filter="drop-shadow(0 4px 6px rgba(21, 128, 61, 0.25))" />
      <path d="M40 32C40 22 46 16 54 18C52 26 44 28 40 32Z" fill="#4ADE80" />
      <path d="M40 32C40 24 34 18 26 20C28 27 36 29 40 32Z" fill="#22C55E" />
      <circle cx="34" cy="46" r="3" fill="#14532D" />
      <circle cx="46" cy="46" r="3" fill="#14532D" />
      <circle cx="33" cy="45" r="1" fill="#FFFFFF" />
      <circle cx="45" cy="45" r="1" fill="#FFFFFF" />
      <path d="M37 52 Q40 56 43 52" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="50" r="2.5" fill="#F472B6" opacity="0.6" />
      <circle cx="50" cy="50" r="2.5" fill="#F472B6" opacity="0.6" />
    </svg>
  );
}

export function ElementalEnergy({ className = 'w-12 h-12', primaryColor = '#EAB308', accentColor = '#FEF08A' }: DecorationProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="energyGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>
      <polygon
        points="40,8 48,28 70,30 52,44 58,66 40,54 22,66 28,44 10,30 32,28"
        fill="url(#energyGrad)"
        filter="drop-shadow(0 4px 10px rgba(234, 179, 8, 0.4))"
      />
      <ellipse cx="36" cy="38" rx="2.5" ry="3" fill="#713F12" />
      <ellipse cx="44" cy="38" rx="2.5" ry="3" fill="#713F12" />
      <circle cx="35" cy="37" r="1" fill="#FFFFFF" />
      <circle cx="43" cy="37" r="1" fill="#FFFFFF" />
      <path d="M37 43 Q40 46 43 43" stroke="#713F12" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 2. Heróis Originais
export function HeroActionBurst({ className = 'w-14 h-14', text = 'POW!' }: { className?: string; text?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon
        points="50,5 62,24 85,15 80,38 98,50 80,62 85,85 62,76 50,95 38,76 15,85 20,62 2,50 20,38 15,15 38,24"
        fill="#FACC15"
        stroke="#DC2626"
        strokeWidth="4"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="#DC2626"
        fontSize="18"
        fontWeight="900"
        fontFamily="Impact, sans-serif"
        transform="rotate(-5 50 50)"
      >
        {text}
      </text>
    </svg>
  );
}

export function HeroShield({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M40 8 L66 18 V42 C66 60 40 72 40 72 C40 72 14 60 14 42 V18 L40 8 Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="3" />
      <path d="M40 16 L60 24 V42 C60 55 40 65 40 65 C40 65 20 55 20 42 V24 L40 16 Z" fill="#DC2626" />
      <polygon points="40,26 44,35 54,35 46,42 49,52 40,46 31,52 34,42 26,35 36,35" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
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
      <circle cx="40" cy="6" r="2" fill="#FDE047" className="animate-ping" />
    </svg>
  );
}

export function MagicButterfly({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30 30 C20 14 6 18 10 32 C12 38 24 36 30 32 Z" fill="#F472B6" opacity="0.85" />
      <path d="M30 30 C40 14 54 18 50 32 C48 38 36 36 30 32 Z" fill="#F472B6" opacity="0.85" />
      <path d="M30 32 C22 34 16 46 22 50 C26 52 30 42 30 32 Z" fill="#C084FC" opacity="0.75" />
      <path d="M30 32 C38 34 44 46 38 50 C34 52 30 42 30 32 Z" fill="#C084FC" opacity="0.75" />
      <line x1="30" y1="20" x2="30" y2="44" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="18" r="2" fill="#831843" />
    </svg>
  );
}

// 4. Pop & Música
export function NeonMusicNotes({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M20 44 C20 48 16 52 12 52 C8 52 6 48 8 44 C10 40 16 40 20 44 Z M20 44 V16 L44 10 V38 C44 42 40 46 36 46 C32 46 30 42 32 38 C34 34 40 34 44 38 Z"
        fill="#A855F7"
        stroke="#EC4899"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))"
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

export function DinoFootprint({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M30 24 C22 24 18 32 18 42 C18 50 24 54 30 54 C36 54 42 50 42 42 C42 32 38 24 30 24 Z"
        fill="#CA8A04"
        opacity="0.5"
      />
      <ellipse cx="18" cy="18" rx="5" ry="8" transform="rotate(-20 18 18)" fill="#CA8A04" opacity="0.5" />
      <ellipse cx="30" cy="14" rx="5" ry="9" fill="#CA8A04" opacity="0.5" />
      <ellipse cx="42" cy="18" rx="5" ry="8" transform="rotate(20 42 18)" fill="#CA8A04" opacity="0.5" />
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

// Master Decoration Selector based on theme slug
export function ThemeDecorationBadge({
  themeSlug,
  primaryColor,
  accentColor,
  className = 'w-12 h-12',
}: {
  themeSlug?: string;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
}) {
  const slug = themeSlug || '';

  if (slug.includes('monstrinho') || slug.includes('pokemon')) {
    return <ElementalFire className={className} primaryColor={primaryColor} accentColor={accentColor} />;
  }
  if (slug.includes('heroi') || slug.includes('super')) {
    return <HeroActionBurst className={className} />;
  }
  if (slug.includes('reino') || slug.includes('princesa')) {
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

  // Generic elegant sparkle badge
  return (
    <div className={'inline-flex items-center justify-center ' + className}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="20" cy="20" r="18" stroke={primaryColor || '#713C48'} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        <path d="M20 6 L22 17 L33 19 L22 21 L20 32 L18 21 L7 19 L18 17 Z" fill={accentColor || '#C96E5A'} />
      </svg>
    </div>
  );
}
