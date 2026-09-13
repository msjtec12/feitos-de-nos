import { mapContentToGiftExperience } from '@/lib/gift-mapper';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { GiftExperience } from '@/types/gift';
import { createSupabaseServerClient } from './server';

/**
 * Compatibilidade segura para links antigos /presente/[slug].
 * Lê somente páginas publicadas, não arquivadas e já reveladas.
 * O public_token é usado apenas no servidor para assinar as URLs internas de mídia.
 */
export async function getPublishedGiftBySlug(slug: string): Promise<GiftExperience | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  if (!cleanSlug || cleanSlug.length > 120) return null;

  try {
    const supabase = createSupabaseServerClient();
    const { data: pages, error } = await supabase
      .from('gift_pages')
      .select('public_token, content, theme, reveal_at')
      .eq('status', 'published')
      .is('archived_at', null)
      .contains('content', { slug: cleanSlug })
      .limit(1);

    if (error || !pages || pages.length === 0) return null;

    const page = pages[0] as {
      public_token: string;
      content: GiftContentData;
      theme: GiftThemeData | null;
      reveal_at: string | null;
    };

    if (page.reveal_at && new Date(page.reveal_at).getTime() > Date.now()) {
      return null;
    }

    return mapContentToGiftExperience(page.content, page.theme, page.public_token);
  } catch (error) {
    console.error('Erro ao buscar presente publicado por slug:', error);
    return null;
  }
}
