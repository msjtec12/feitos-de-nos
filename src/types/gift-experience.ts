import { MediaItem, AudioMessage, Recipient, TimelineMoment, ContributorMessage, BrandSettings, GiftSoundtrack } from './gift';
import { StyleId } from './order';
import { GiftSectionCopy, GiftThemePresetId } from './theme';

export interface GiftContentData {
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
}

export interface GiftThemeData {
  presetId?: GiftThemePresetId;
  styleId: StyleId;
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
  fontFamily?: string;
  bgGradient?: string;
}

export const DEFAULT_GIFT_CONTENT: GiftContentData = {
  slug: 'presente',
  openingText: {
    headline: 'Um Presente Feito de Nós',
    description: 'Criado com fotos, mensagens e vozes de quem mais te ama.',
    buttonLabel: 'Abrir Presente',
  },
  recipient: {
    name: 'Nome do Presenteado',
    subtitle: 'Uma História Especial',
    tagline: 'Momentos inesquecíveis guardados para sempre',
    introQuote: 'Histórias que viram presente.',
    featuredImage: {
      id: 'cover',
      url: '/demo/images/hero-matheus.jpg',
      altText: 'Foto de capa',
      aspectRatio: 'square',
      placeholderColor: '#D9A4A0',
      isAvailable: false,
    },
  },
  soundtrack: {
    enabled: false,
    provider: 'spotify',
    url: '',
    title: 'Nossa música',
    message: '',
  },
  timelineMoments: [],
  contributorMessages: [],
  galleryItems: [],
  closing: {
    headline: 'Para Guardar no Coração',
    message: 'Que essas lembranças continuem vivas por toda a vida.',
    signature: 'Com amor, Feito de Nós',
  },
  brand: {
    brandName: 'Feito de Nós',
    slogan: 'Histórias que viram presente.',
  },
};

export const DEFAULT_GIFT_THEME: GiftThemeData = {
  styleId: 'afetuoso',
  primaryColor: '#713C48',
  secondaryColor: '#D9A4A0',
  accentColor: '#C96E5A',
  backgroundColor: '#FFF8F0',
  surfaceColor: '#FFFFFF',
  textColor: '#302B2D',
  mutedColor: '#817378',
  borderColor: '#E8DAD3',
};
