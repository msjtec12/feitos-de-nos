import { EventThemeConfig } from '@/types/invitation';

export interface AuthorialThemeDefinition {
  id: string;
  name: string;
  category: 'infantil' | 'romantico' | 'classico' | 'botanico' | 'moderno' | 'celebracao';
  description: string;
  config: EventThemeConfig;
  previewColors: {
    primary: string;
    background: string;
    accent: string;
    card: string;
  };
}

export const INVITATION_AUTHORIAL_THEMES: AuthorialThemeDefinition[] = [
  {
    id: 'infantil-delicado',
    name: 'Infantil Delicado',
    category: 'infantil',
    description: 'Tons suaves de azul-bebê e marfim, com toque afetuoso e acolhedor para os primeiros anos.',
    previewColors: {
      primary: '#3B82F6',
      background: '#F8FAFC',
      accent: '#F59E0B',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'infantil-delicado',
      themeName: 'Infantil Delicado',
      primaryColor: '#2563EB',
      secondaryColor: '#DBEAFE',
      accentColor: '#F59E0B',
      backgroundColor: '#F8FAFC',
      surfaceColor: '#FFFFFF',
      textColor: '#1E293B',
      mutedColor: '#64748B',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'rounded',
      buttonStyle: 'pill',
    },
  },
  {
    id: 'romantico',
    name: 'Romântico & Suave',
    category: 'romantico',
    description: 'Rosa chá, champanhe e tons quentes para casamentos intimistas, noivados e bodas.',
    previewColors: {
      primary: '#E11D48',
      background: '#FFF1F2',
      accent: '#D97706',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'romantico',
      themeName: 'Romântico & Suave',
      primaryColor: '#BE123C',
      secondaryColor: '#FFE4E6',
      accentColor: '#D97706',
      backgroundColor: '#FFF1F2',
      surfaceColor: '#FFFFFF',
      textColor: '#37181F',
      mutedColor: '#884D58',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'arch',
      buttonStyle: 'pill',
    },
  },
  {
    id: 'elegante',
    name: 'Elegante Nobre',
    category: 'classico',
    description: 'Marfim, ouro acetinado e grafite nobre para celebrações solenes e sofisticadas.',
    previewColors: {
      primary: '#B45309',
      background: '#FAFAF9',
      accent: '#D97706',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'elegante',
      themeName: 'Elegante Nobre',
      primaryColor: '#92400E',
      secondaryColor: '#FEF3C7',
      accentColor: '#D97706',
      backgroundColor: '#FAFAF9',
      surfaceColor: '#FFFFFF',
      textColor: '#1C1917',
      mutedColor: '#78716C',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'classic',
      buttonStyle: 'rounded',
    },
  },
  {
    id: 'religioso',
    name: 'Serenidade & Fé',
    category: 'classico',
    description: 'Luz, linho e ouro pálido para batizados, apresentações e primeira eucaristia.',
    previewColors: {
      primary: '#0D9488',
      background: '#F0FDFA',
      accent: '#CA8A04',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'religioso',
      themeName: 'Serenidade & Fé',
      primaryColor: '#0F766E',
      secondaryColor: '#CCFBF1',
      accentColor: '#CA8A04',
      backgroundColor: '#F0FDFA',
      surfaceColor: '#FFFFFF',
      textColor: '#134E4A',
      mutedColor: '#5E817C',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'arch',
      buttonStyle: 'pill',
    },
  },
  {
    id: 'floral',
    name: 'Floral & Jardim',
    category: 'botanico',
    description: 'Verde sálvia, eucalipto e toques florais delicados para festas ao ar livre e aniversários.',
    previewColors: {
      primary: '#15803D',
      background: '#F0FDF4',
      accent: '#EAB308',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'floral',
      themeName: 'Floral & Jardim',
      primaryColor: '#166534',
      secondaryColor: '#DCFCE7',
      accentColor: '#EAB308',
      backgroundColor: '#F0FDF4',
      surfaceColor: '#FFFFFF',
      textColor: '#14532D',
      mutedColor: '#4D7C5E',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'rounded',
      buttonStyle: 'pill',
    },
  },
  {
    id: 'minimalista',
    name: 'Minimalista Contemporâneo',
    category: 'moderno',
    description: 'Linhas puras, contraste limpo e tipografia editorial moderna para formaturas e recepções.',
    previewColors: {
      primary: '#0F172A',
      background: '#F8FAFC',
      accent: '#64748B',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'minimalista',
      themeName: 'Minimalista Contemporâneo',
      primaryColor: '#0F172A',
      secondaryColor: '#E2E8F0',
      accentColor: '#475569',
      backgroundColor: '#F8FAFC',
      surfaceColor: '#FFFFFF',
      textColor: '#0F172A',
      mutedColor: '#64748B',
      headingFont: 'Plus Jakarta Sans, sans-serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'polaroid',
      buttonStyle: 'smooth',
    },
  },
  {
    id: 'festivo',
    name: 'Celebração & Brilho',
    category: 'celebracao',
    description: 'Cores alegres e calorosas, transmitindo energia festiva e entusiasmo contagiante.',
    previewColors: {
      primary: '#7C3AED',
      background: '#FAF5FF',
      accent: '#F59E0B',
      card: '#FFFFFF',
    },
    config: {
      themeId: 'festivo',
      themeName: 'Celebração & Brilho',
      primaryColor: '#6D28D9',
      secondaryColor: '#EDE9FE',
      accentColor: '#F59E0B',
      backgroundColor: '#FAF5FF',
      surfaceColor: '#FFFFFF',
      textColor: '#2E1065',
      mutedColor: '#7C3AED',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      photoStyle: 'rounded',
      buttonStyle: 'pill',
    },
  },
];

export function getThemeById(themeId?: string): AuthorialThemeDefinition {
  if (!themeId) return INVITATION_AUTHORIAL_THEMES[0];
  return (
    INVITATION_AUTHORIAL_THEMES.find((t) => t.id === themeId) ||
    INVITATION_AUTHORIAL_THEMES[0]
  );
}
