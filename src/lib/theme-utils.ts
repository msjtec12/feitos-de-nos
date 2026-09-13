import React from 'react';

export interface ThemeColorsInput {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
  surfaceColor?: string | null;
  textColor?: string | null;
  mutedColor?: string | null;
  borderColor?: string | null;
  [key: string]: any;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex?: string | null): RgbColor | null {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

export function hexToRgbChannels(hex?: string | null, fallback: string = '113 60 72'): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return fallback;
  return `${rgb.r} ${rgb.g} ${rgb.b}`;
}

export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (val: number) => {
    const res = percent > 0
      ? Math.round(val + (255 - val) * percent)
      : Math.round(val * (1 + percent));
    return Math.min(255, Math.max(0, res)).toString(16).padStart(2, '0');
  };
  return `#${adjust(rgb.r)}${adjust(rgb.g)}${adjust(rgb.b)}`;
}

/**
 * Gera as variáveis CSS da experiência. As quatro cores históricas continuam
 * funcionando, enquanto presets novos podem fornecer uma paleta completa.
 */
export function getThemeCssVariables(theme?: ThemeColorsInput | null): React.CSSProperties {
  const primary = theme?.primaryColor || '#713C48';
  const secondary = theme?.secondaryColor || adjustBrightness(primary, 0.42);
  const accent = theme?.accentColor || '#C96E5A';
  const bg = theme?.backgroundColor || '#FFF8F0';
  const surface = theme?.surfaceColor || '#FFFFFF';
  const text = theme?.textColor || '#302B2D';
  const muted = theme?.mutedColor || adjustBrightness(text, 0.35);
  const border = theme?.borderColor || adjustBrightness(primary, 0.78);

  const primaryRgb = hexToRgbChannels(primary, '113 60 72');
  const accentRgb = hexToRgbChannels(accent, '201 110 90');
  const bgRgb = hexToRgbChannels(bg, '255 248 240');
  const textRgb = hexToRgbChannels(text, '48 43 45');

  const primaryDark = adjustBrightness(primary, -0.2);
  const primaryLight = adjustBrightness(primary, 0.2);
  const primarySubtle = adjustBrightness(primary, 0.85);
  const accentDark = adjustBrightness(accent, -0.2);
  const accentLight = adjustBrightness(accent, 0.2);
  const accentSubtle = adjustBrightness(accent, 0.85);
  const bgDark = adjustBrightness(bg, -0.05);
  const roseRgb = hexToRgbChannels(secondary, '217 164 160');
  const rose = secondary;
  const textLight = adjustBrightness(text, 0.55);

  return {
    '--theme-primary': primary,
    '--theme-primary-rgb': primaryRgb,
    '--theme-primary-dark': primaryDark,
    '--theme-primary-light': primaryLight,
    '--theme-primary-subtle': primarySubtle,
    '--theme-secondary': secondary,
    '--theme-secondary-rgb': hexToRgbChannels(secondary, '217 164 160'),
    '--theme-accent': accent,
    '--theme-accent-rgb': accentRgb,
    '--theme-accent-dark': accentDark,
    '--theme-accent-light': accentLight,
    '--theme-accent-subtle': accentSubtle,
    '--theme-bg': bg,
    '--theme-bg-rgb': bgRgb,
    '--theme-bg-dark': bgDark,
    '--theme-surface': surface,
    '--theme-surface-rgb': hexToRgbChannels(surface, '255 255 255'),
    '--theme-border': border,
    '--theme-border-rgb': hexToRgbChannels(border, '232 218 211'),
    '--theme-rose': rose,
    '--theme-rose-rgb': roseRgb,
    '--theme-rose-subtle': adjustBrightness(secondary, 0.82),
    '--theme-text': text,
    '--theme-text-rgb': textRgb,
    '--theme-text-muted': muted,
    '--theme-text-light': textLight,
    '--theme-muted': muted,
    backgroundColor: bg,
    color: text,
  } as React.CSSProperties;
}
