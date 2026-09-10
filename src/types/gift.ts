/**
 * Feito de Nós — Tipos de Domínio para a Experiência do Presente
 * 
 * Estrutura preparada para mapeamento direto com tabelas futuras do Supabase:
 * - gifts
 * - recipients
 * - timeline_moments
 * - contributor_messages
 * - media_items
 */

export interface MediaItem {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  width?: number;
  height?: number;
  placeholderColor?: string;
  isAvailable?: boolean; // Define explicitamente se o arquivo de imagem real existe no servidor
}

export interface AudioMessage {
  id: string;
  title: string;
  audioUrl: string;
  durationSeconds?: number;
  recordedBy?: string;
  transcript?: string;
  isAvailable?: boolean; // Define explicitamente se o arquivo de áudio real existe no servidor
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
  openingText: {
    headline: string;
    description: string;
    buttonLabel: string;
  };
  recipient: Recipient;
  primaryAudio?: AudioMessage;
  timelineMoments: TimelineMoment[];
  contributorMessages: ContributorMessage[];
  galleryItems: MediaItem[];
  closing: {
    headline: string;
    message: string;
    signature: string;
  };
  brand: BrandSettings;
  theme?: {
    styleId?: string;
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
  };
}
