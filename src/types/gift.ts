/**
 * Feito de Nós — Tipos de Domínio para a Experiência do Presente
 */

import { GiftSectionCopy, GiftThemePresetId } from './theme';

export interface MediaItem {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  width?: number;
  height?: number;
  placeholderColor?: string;
  isAvailable?: boolean;
}

export interface AudioMessage {
  id: string;
  title: string;
  audioUrl: string;
  durationSeconds?: number;
  recordedBy?: string;
  transcript?: string;
  isAvailable?: boolean;
}

export interface GiftSoundtrack {
  enabled: boolean;
  provider: 'spotify';
  url: string;
  title?: string;
  message?: string;
}

export interface Recipient {
  name: string;
  subtitle: string;
  tagline: string;
  featuredImage: MediaItem;
  introQuote: string;
}

export interface TimelineMoment {
  monthNumber: number;
  title: string;
  subtitle: string;
  caption: string;
  image: MediaItem;
  themeColor?: string;
}

export interface ContributorMessage {
  id: string;
  authorName: string;
  relation: string;
  avatarImage?: MediaItem;
  writtenMessage: string;
  audio?: AudioMessage;
}

export interface BrandSettings {
  brandName: string;
  slogan: string;
  logoUrl?: string;
  symbolUrl?: string;
}

export interface GiftExperience {
  slug: string;
  themePresetId?: GiftThemePresetId;
  openingText: {
    headline: string;
    description: string;
    buttonLabel: string;
  };
  recipient: Recipient;
  primaryAudio?: AudioMessage;
  soundtrack?: GiftSoundtrack;
  timelineMoments: TimelineMoment[];
  contributorMessages: ContributorMessage[];
  galleryItems: MediaItem[];
  sectionCopy?: GiftSectionCopy;
  closing: {
    headline: string;
    message: string;
    signature: string;
  };
  brand: BrandSettings;
  theme?: {
    presetId?: GiftThemePresetId;
    styleId?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    surfaceColor?: string;
    textColor?: string;
    mutedColor?: string;
    borderColor?: string;
    fontFamily?: string;
  };
}
