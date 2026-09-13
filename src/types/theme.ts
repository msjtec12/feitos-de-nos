import { FormatId, OccasionId, StyleId } from './order';

export type GiftThemePresetId =
  | 'primeiro-ano'
  | 'amor-casal'
  | 'dia-das-maes'
  | 'dia-dos-pais'
  | 'aniversario'
  | 'casamento-bodas'
  | 'formatura'
  | 'amizade'
  | 'memorial'
  | 'religioso'
  | 'natal'
  | 'cha-de-bebe';

export type ThemeCategory =
  | 'infantil'
  | 'romantico'
  | 'familia'
  | 'celebracoes'
  | 'homenagens'
  | 'sazonal';

export interface SectionCopyBlock {
  eyebrow: string;
  title: string;
  description: string;
}

export interface GiftSectionCopy {
  timeline: SectionCopyBlock;
  messages: SectionCopyBlock;
  gallery: SectionCopyBlock;
  soundtrack: {
    eyebrow: string;
    defaultTitle: string;
    defaultMessage: string;
  };
}

export interface ThemePalettePreset {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}

export interface GiftThemePreset {
  id: GiftThemePresetId;
  occasionId: OccasionId;
  name: string;
  shortName: string;
  category: ThemeCategory;
  description: string;
  badge?: string;
  mood: string;
  recommendedStyleId: StyleId;
  recommendedFormat: FormatId;
  alternativeFormats: FormatId[];
  palette: ThemePalettePreset;
  defaultTexts: {
    openingHeadline: string;
    openingDescription: string;
    buttonLabel: string;
    recipientSubtitle: string;
    recipientTagline: string;
    introQuote: string;
    closingHeadline: string;
    closingMessage: string;
    closingSignature: string;
  };
  sectionCopy: GiftSectionCopy;
  layoutHints: {
    timelinePriority: 'high' | 'medium' | 'low';
    messagesPriority: 'high' | 'medium' | 'low';
    galleryStyle: 'grid' | 'mosaic' | 'carousel';
    soundtrackRecommended: boolean;
  };
  keywords: string[];
}
