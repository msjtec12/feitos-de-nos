import { MediaItem, AudioMessage, Recipient, TimelineMoment, ContributorMessage, BrandSettings } from './gift';
import { StyleId } from './order';

export interface GiftContentData {
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
}

export interface GiftThemeData {
  styleId: StyleId;
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
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
  accentColor: '#C96E5A',
};
