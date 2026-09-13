import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { GiftExperience } from '@/types/gift';

function withMediaToken(url?: string | null, publicToken?: string | null): string {
  const value = (url || '').trim();
  if (!value || !publicToken || !value.startsWith('/api/media/')) return value;

  try {
    const separator = value.includes('?') ? '&' : '?';
    if (/[?&]token=/.test(value)) return value;
    return `${value}${separator}token=${encodeURIComponent(publicToken)}`;
  } catch {
    return value;
  }
}

/**
 * Converte GiftContentData e GiftThemeData para o formato de GiftExperience usado pelos componentes.
 * Quando publicToken é informado, URLs antigas de /api/media recebem automaticamente o token
 * necessário para continuar funcionando com o bucket privado endurecido.
 */
export function mapContentToGiftExperience(
  content: GiftContentData,
  theme?: GiftThemeData | null,
  publicToken?: string | null
): GiftExperience {
  const featuredImageUrl = withMediaToken(content.recipient?.featuredImage?.url, publicToken);
  const primaryAudioUrl = withMediaToken(content.primaryAudio?.audioUrl, publicToken);

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
            url: featuredImageUrl,
            isAvailable: Boolean(featuredImageUrl),
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
          audioUrl: primaryAudioUrl,
          isAvailable: Boolean(primaryAudioUrl),
        }
      : undefined,
    soundtrack:
      content.soundtrack?.enabled && content.soundtrack.url?.trim()
        ? {
            enabled: true,
            provider: 'spotify',
            url: content.soundtrack.url.trim(),
            title: content.soundtrack.title?.trim() || 'Nossa música',
            message: content.soundtrack.message?.trim() || '',
          }
        : undefined,
    timelineMoments: (content.timelineMoments || []).map((m, idx) => {
      const imageUrl = withMediaToken(m.image?.url, publicToken);
      return {
        ...m,
        image: m.image
          ? {
              ...m.image,
              url: imageUrl,
              isAvailable: Boolean(imageUrl),
            }
          : {
              id: `timeline-img-${idx}`,
              url: '',
              altText: m.title || `Foto do momento ${idx + 1}`,
              isAvailable: false,
            },
      };
    }),
    contributorMessages: (content.contributorMessages || []).map((c) => {
      const avatarUrl = withMediaToken(c.avatarImage?.url, publicToken);
      const audioUrl = withMediaToken(c.audio?.audioUrl, publicToken);
      return {
        ...c,
        avatarImage: c.avatarImage
          ? {
              ...c.avatarImage,
              url: avatarUrl,
              isAvailable: Boolean(avatarUrl),
            }
          : undefined,
        audio: c.audio
          ? {
              ...c.audio,
              audioUrl,
              isAvailable: Boolean(audioUrl),
            }
          : undefined,
      };
    }),
    galleryItems: (content.galleryItems || []).map((g) => {
      const galleryUrl = withMediaToken(g.url, publicToken);
      return {
        ...g,
        url: galleryUrl,
        isAvailable: Boolean(galleryUrl),
      };
    }),
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
