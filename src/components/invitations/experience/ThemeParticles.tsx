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
  shape: 'sparkle' | 'star' | 'heart' | 'leaf' | 'confetti' | 'flame' | 'bubble' | 'music' | 'pixel';
}

export function ThemeParticles({ themeConfig, reducedMotion = false }: ThemeParticlesProps) {
  const intensity = themeConfig.animationIntensity || 'festive';
  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const themeSlug = (themeConfig.themeId || themeConfig.slug || '').toLowerCase();

  // Pausa automática quando a aba perde o foco (economia de recursos e bateria)
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

  // Limite otimizado de partículas por dispositivo e intensidade
  const count = intensity === 'none' ? 0 : intensity === 'soft' ? 10 : 20;

  const particles: Particle[] = useMemo(() => {
    if (intensity === 'none' || reducedMotion || !isTabVisible) {
      return [];
    }

    const slug = themeSlug;
    const items: Particle[] = [];

    let defaultShape: Particle['shape'] = 'sparkle';
    if (slug.includes('heroi') || slug.includes('super')) defaultShape = 'star';
    else if (slug.includes('monstrinho') || slug.includes('pokemon')) defaultShape = 'flame';
    else if (slug.includes('reino') || slug.includes('princesa')) defaultShape = 'sparkle';
    else if (slug.includes('pop') || slug.includes('musica')) defaultShape = 'music';
    else if (slug.includes('bloco') || slug.includes('pixel')) defaultShape = 'pixel';
    else if (slug.includes('dino') || slug.includes('safari')) defaultShape = 'leaf';
    else if (slug.includes('delicado') || slug.includes('bebe')) defaultShape = 'star';
    else if (slug.includes('romantico')) defaultShape = 'heart';
    else if (slug.includes('festivo')) defaultShape = 'confetti';

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

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        left: (i * (96 / count) + (i % 3) * 4) % 96,
        top: Math.random() * 95,
        size: 14 + Math.floor(Math.random() * 14), // 14px to 28px
        duration: 5 + Math.random() * 5,
        delay: (i * 0.3) % 3,
        opacity: 0.65 + Math.random() * 0.3, // 0.65 to 0.95
        color: colors[i % colors.length],
        shape: defaultShape,
      });
    }
    return items;
  }, [themeSlug, count, accentColor, primaryColor, intensity, reducedMotion, isTabVisible]);

  if (particles.length === 0 || !isTabVisible) {
    return null;
  }

  return (
    <div
      key={themeSlug}
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
          {/* 1. Comic Action Star */}
          {p.shape === 'star' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <polygon points="12,1 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" stroke="#DC2626" strokeWidth="1" />
            </svg>
          )}

          {/* 2. Elemental Flame */}
          {p.shape === 'flame' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <path d="M12 2C13 7 18 8 18 14C18 18 15 21 12 21C9 21 6 18 6 14C6 9 11 6 12 2Z" />
              <circle cx="12" cy="14" r="3" fill="#FEF08A" />
            </svg>
          )}

          {/* 3. Musical Note */}
          {p.shape === 'music' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}

          {/* 4. Pixel Cube */}
          {p.shape === 'pixel' && (
            <div
              className="w-full h-full border-2 border-black/40 shadow-xs"
              style={{ backgroundColor: p.color }}
            />
          )}

          {/* 5. Tropical Leaf */}
          {p.shape === 'leaf' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <path d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C19 4 17 8 17 8Z" />
            </svg>
          )}

          {/* 6. Heart */}
          {p.shape === 'heart' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-md">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}

          {/* 7. Confetti Ribbon */}
          {p.shape === 'confetti' && (
            <div
              className="w-full h-3 rounded-xs rotate-45 transform shadow-xs"
              style={{ backgroundColor: p.color }}
            />
          )}

          {/* 8. Sparkle Cross */}
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
