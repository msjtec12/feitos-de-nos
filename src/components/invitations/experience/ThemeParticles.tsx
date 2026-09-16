'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { EventThemeConfig } from '@/types/invitation';

interface ThemeParticlesProps {
  themeConfig: EventThemeConfig;
  reducedMotion?: boolean;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  shape:
    | 'leaf'
    | 'flame'
    | 'comic-star'
    | 'sparkle'
    | 'music'
    | 'pixel'
    | 'star'
    | 'petal'
    | 'gold-dust'
    | 'peace-leaf'
    | 'lavender'
    | 'minimal'
    | 'confetti';
}

export function ThemeParticles({ themeConfig, reducedMotion = false }: ThemeParticlesProps) {
  const intensity = themeConfig.animationIntensity || 'festive';
  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const preset = themeConfig.particlePreset || 'sparkles';
  const slug = (themeConfig.theme_key || themeConfig.themeId || themeConfig.slug || '').toLowerCase();

  // Pausa automática quando a aba perde o foco
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const count = intensity === 'none' || preset === 'none' ? 0 : intensity === 'soft' ? 10 : 20;

  const particles: Particle[] = useMemo(() => {
    if (count === 0 || reducedMotion || !isTabVisible) {
      return [];
    }

    let shape: Particle['shape'] = 'sparkle';
    if (preset === 'leaves' || slug.includes('dino') || slug.includes('safari')) shape = 'leaf';
    else if (preset === 'elemental' || slug.includes('elemental') || slug.includes('monstrinho')) shape = 'flame';
    else if (preset === 'comic-stars' || slug.includes('heroi') || slug.includes('super')) shape = 'comic-star';
    else if (preset === 'notes' || slug.includes('pop') || slug.includes('musica')) shape = 'music';
    else if (preset === 'pixel-dust' || slug.includes('bloco') || slug.includes('pixel')) shape = 'pixel';
    else if (preset === 'stars' || slug.includes('delicado') || slug.includes('bebe')) shape = 'star';
    else if (preset === 'petals' || slug.includes('romantico')) shape = 'petal';
    else if (preset === 'gold-dust' || slug.includes('elegante')) shape = 'gold-dust';
    else if (preset === 'peace-feathers' || slug.includes('religioso') || slug.includes('sacro')) shape = 'peace-leaf';
    else if (preset === 'lavender-buds' || slug.includes('floral') || slug.includes('botanico')) shape = 'lavender';
    else if (preset === 'minimal-dust' || slug.includes('minimal')) shape = 'minimal';
    else if (preset === 'party-confetti' || slug.includes('festivo') || slug.includes('celebracao')) shape = 'confetti';

    const colors = [
      accentColor,
      primaryColor,
      '#F59E0B',
      '#EF4444',
      '#3B82F6',
      '#10B981',
      '#8B5CF6',
      '#EC4899',
    ];

    const items: Particle[] = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        left: (i * (96 / count) + (i % 3) * 4) % 96,
        top: Math.random() * 95,
        size: 14 + Math.floor(Math.random() * 14),
        duration: 5 + Math.random() * 5,
        delay: (i * 0.3) % 3,
        opacity: 0.65 + Math.random() * 0.3,
        color: colors[i % colors.length],
        shape,
      });
    }
    return items;
  }, [slug, preset, count, accentColor, primaryColor, reducedMotion, isTabVisible]);

  if (particles.length === 0 || !isTabVisible) {
    return null;
  }

  return (
    <div
      key={slug}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="invitation-particle absolute animate-party-float pointer-events-none"
          style={{
            left: p.left + '%',
            top: p.top + '%',
            width: p.size + 'px',
            height: p.size + 'px',
            opacity: p.opacity,
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        >
          {/* 1. Folha Tropical */}
          {p.shape === 'leaf' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <path d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C19 4 17 8 17 8Z" />
            </svg>
          )}

          {/* 2. Chama Elemental */}
          {p.shape === 'flame' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <path d="M12 2C13 7 18 8 18 14C18 18 15 21 12 21C9 21 6 18 6 14C6 9 11 6 12 2Z" />
              <circle cx="12" cy="14" r="3" fill="#FEF08A" />
            </svg>
          )}

          {/* 3. Estrela de Ação Comic */}
          {p.shape === 'comic-star' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <polygon points="12,1 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" stroke="#0F172A" strokeWidth="1" />
            </svg>
          )}

          {/* 4. Nota Musical */}
          {p.shape === 'music' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}

          {/* 5. Cubo Pixel */}
          {p.shape === 'pixel' && (
            <div
              className="w-full h-full border-2 border-black/40 shadow-xs"
              style={{ backgroundColor: p.color }}
            />
          )}

          {/* 6. Estrela Suave Bebê */}
          {p.shape === 'star' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          )}

          {/* 7. Pétala de Rosa */}
          {p.shape === 'petal' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <path d="M12 3 C16 8, 20 14, 18 19 C16 23, 8 23, 6 19 C4 14, 8 8, 12 3 Z" />
            </svg>
          )}

          {/* 8. Brilho Dourado */}
          {p.shape === 'gold-dust' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <polygon points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10" />
            </svg>
          )}

          {/* 9. Folha de Oliveira da Paz */}
          {p.shape === 'peace-leaf' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <ellipse cx="12" cy="12" rx="8" ry="4" transform="rotate(-35 12 12)" />
            </svg>
          )}

          {/* 10. Broto de Lavanda */}
          {p.shape === 'lavender' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <ellipse cx="10" cy="10" rx="3" ry="5" transform="rotate(-20 10 10)" />
              <ellipse cx="14" cy="14" rx="3" ry="5" transform="rotate(20 14 14)" />
            </svg>
          )}

          {/* 11. Partícula Minimalista */}
          {p.shape === 'minimal' && (
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: p.color }}
            />
          )}

          {/* 12. Confete Festivo */}
          {p.shape === 'confetti' && (
            <div
              className="w-full h-2.5 rounded-xs rotate-45 transform shadow-xs"
              style={{ backgroundColor: p.color }}
            />
          )}

          {/* 13. Brilho Mágico Padrão */}
          {p.shape === 'sparkle' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
