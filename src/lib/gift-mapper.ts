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
    recipient: content.recipient || {
      name: 'Presenteado',
      subtitle: 'Memórias Inesquecíveis',
      tagline: 'Feito de Nós',
      introQuote: 'Histórias que viram presente.',
      featuredImage: {
        id: 'cover',
        url: '/demo/images/hero-matheus.jpg',
        altText: 'Foto de capa',
        aspectRatio: 'square',
        isAvailable: false,
      },
    },
    primaryAudio: content.primaryAudio,
    timelineMoments: content.timelineMoments || [],
    contributorMessages: content.contributorMessages || [],
    galleryItems: content.galleryItems || [],
    closing: content.closing || {
      headline: 'Para Sempre Guardado',
      message: 'Que essas lembranças continuem vivas por toda a vida.',
      signature: 'Com amor, Feito de Nós',
    },
    brand: content.brand || {
      brandName: 'Feito de Nós',
      slogan: 'Histórias que viram presente.',
    },
  };
}
