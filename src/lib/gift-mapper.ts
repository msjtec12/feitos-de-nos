import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { GiftExperience } from '@/types/gift';

/**
 * Converte GiftContentData e GiftThemeData para o formato de GiftExperience usado pelos componentes
 * Função pura e segura para execução no cliente e servidor
 */
export function mapContentToGiftExperience(
  content: GiftContentData,
  theme?: GiftThemeData | null
): GiftExperience {
  return {
    slug: content.slug || 'presente',
    openingText: content.openingText || {
      headline: 'Um Presente Feito de Nós',
      description: 'Criado com fotos, mensagens e vozes de quem mais te ama.',
      buttonLabel: 'Abrir Presente',
    },
    recipient: {
      name: content.recipient?.name || 'Presenteado',
      subtitle: content.recipient?.subtitle || 'Memórias Inesquecíveis',
      tagline: content.recipient?.tagline || 'Feito de Nós',
      introQuote: content.recipient?.introQuote || 'Histórias que viram presente.',
      featuredImage: content.recipient?.featuredImage
        ? {
            ...content.recipient.featuredImage,
            isAvailable: Boolean(content.recipient.featuredImage.url && content.recipient.featuredImage.url.trim() !== ''),
          }
        : {
            id: 'cover',
            url: '',
            altText: 'Foto de capa',
            aspectRatio: 'square',
            isAvailable: false,
          },
    },
    primaryAudio: content.primaryAudio
      ? {
          ...content.primaryAudio,
          isAvailable: Boolean(content.primaryAudio.audioUrl && content.primaryAudio.audioUrl.trim() !== ''),
        }
      : undefined,
    timelineMoments: (content.timelineMoments || []).map((m, idx) => ({
      ...m,
      image: m.image
        ? {
            ...m.image,
            isAvailable: Boolean(m.image.url && m.image.url.trim() !== ''),
          }
        : {
            id: `timeline-img-${idx}`,
            url: '',
            altText: m.title || `Foto do momento ${idx + 1}`,
            isAvailable: false,
          },
    })),
    contributorMessages: (content.contributorMessages || []).map((c) => ({
      ...c,
      audio: c.audio
        ? {
            ...c.audio,
            isAvailable: Boolean(c.audio.audioUrl && c.audio.audioUrl.trim() !== ''),
          }
        : undefined,
    })),
    galleryItems: (content.galleryItems || []).map((g) => ({
      ...g,
      isAvailable: Boolean(g.url && g.url.trim() !== ''),
    })),
    closing: content.closing || {
      headline: 'Para Sempre Guardado',
      message: 'Que essas lembranças continuem vivas por toda a vida.',
      signature: 'Com amor, Feito de Nós',
    },
    brand: content.brand || {
      brandName: 'Feito de Nós',
      slogan: 'Histórias que viram presente.',
    },
    theme: theme
      ? {
          styleId: theme.styleId || 'afetuoso',
          primaryColor: theme.primaryColor || '#713C48',
          accentColor: theme.accentColor || '#C96E5A',
          backgroundColor: theme.backgroundColor || '#FFF8F0',
          textColor: theme.textColor || '#302B2D',
          fontFamily: theme.fontFamily,
        }
      : {
          styleId: 'afetuoso',
          primaryColor: '#713C48',
          accentColor: '#C96E5A',
          backgroundColor: '#FFF8F0',
          textColor: '#302B2D',
        },
  };
}
