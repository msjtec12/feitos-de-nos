'use client';

import React, { useMemo } from 'react';
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
  shape: 'circle' | 'sparkle' | 'leaf' | 'confetti' | 'heart' | 'star';
}

export function ThemeParticles({ themeConfig, reducedMotion = false }: ThemeParticlesProps) {
  const intensity = themeConfig.animationIntensity || 'subtle';
  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const count = intensity === 'festive' ? 24 : 12;

  const particles: Particle[] = useMemo(() => {
    if (intensity === 'none' || reducedMotion) {
      return [];
    }

    const slug = themeConfig.slug || '';
    const items: Particle[] = [];

    let defaultShape: Particle['shape'] = 'sparkle';
    if (slug.includes('monstrinho')) defaultShape = 'sparkle';
    else if (slug.includes('heroi')) defaultShape = 'star';
    else if (slug.includes('reino')) defaultShape = 'sparkle';
    else if (slug.includes('dino')) defaultShape = 'leaf';
    else if (slug.includes('romantico') || slug.includes('delicado')) defaultShape = 'heart';
    else if (slug.includes('festivo') || slug.includes('pop')) defaultShape = 'confetti';

    const colors = [accentColor, primaryColor, '#F59E0B', '#EC4899', '#38BDF8'];

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        left: (i * (100 / count) + Math.random() * 5) % 100,
        top: Math.random() * 100,
        size: 6 + Math.floor(Math.random() * 10),
        duration: 8 + Math.random() * 8,
        delay: Math.random() * 5,
        opacity: 0.25 + Math.random() * 0.45,
        color: colors[i % colors.length],
        shape: defaultShape,
      });
    }
    return items;
  }, [themeConfig.slug, count, accentColor, primaryColor, intensity, reducedMotion]);

  if (particles.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float"
          style={{
            left: p.left + '%',
            top: p.top + '%',
            width: p.size + 'px',
            height: p.size + 'px',
            opacity: p.opacity,
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
            animationIterationCount: 'infinite',
          }}
        >
          {p.shape === 'heart' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}

          {p.shape === 'star' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            </svg>
          )}

          {p.shape === 'leaf' && (
            <svg viewBox="0 0 24 24" fill={p.color} className="w-full h-full drop-shadow-sm">
              <path d="M17 8C8 10 5 16 5 21C10 21 16 18 18 9C19 4 17 8 17 8Z" />
            </svg>
          )}

          {p.shape === 'confetti' && (
            <div
              className="w-full h-2 rounded-xs rotate-45 transform"
              style={{ backgroundColor: p.color }}
            />
          )}

          {p.shape === 'sparkle' && (
            <svg viewBox="0 0 20 20" fill={p.color} className="w-full h-full drop-shadow-sm">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
            </svg>
          )}

          {p.shape === 'circle' && (
            <div
              className="w-full h-full rounded-full blur-[0.5px]"
              style={{ backgroundColor: p.color }}
            />
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes floatSlow {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-24px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }
        .animate-float {
          animation-name: floatSlow;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </div>
  );
}
