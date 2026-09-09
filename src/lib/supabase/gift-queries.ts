import { createSupabaseAdminClient } from './server';
import { GiftPageRow } from '@/types/database';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { GiftExperience } from '@/types/gift';

export interface PublicGiftExperienceResult {
  isFound: boolean;
  isPublished: boolean;
  isRevealed: boolean;
  revealAt: string | null;
  title: string;
  recipientName: string;
  templateType: string;
  content: GiftContentData | null;
  theme: GiftThemeData | null;
  publicToken: string;
}

/**
 * Consulta página de presente pelo public_token seguro
 * Valida regras de publicação, arquivamento e data de revelação
 */
export async function getPublicGiftByToken(
  token: string
): Promise<PublicGiftExperienceResult | null> {
  // Valida formato de UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(token)) {
    return null;
  }

  const adminClient = createSupabaseAdminClient();

  const { data: page, error } = await adminClient
    .from('gift_pages')
    .select('*')
    .eq('public_token', token)
    .is('archived_at', null)
    .maybeSingle();

  if (error || !page) {
    return null;
  }

  const giftPage = page as GiftPageRow;

  // Checa status de publicação
  const isPublished = giftPage.status === 'published';

  // Checa se a data de revelação (reveal_at) já chegou
  let isRevealed = true;
  if (giftPage.reveal_at) {
    const revealTime = new Date(giftPage.reveal_at).getTime();
    if (revealTime > Date.now()) {
      isRevealed = false;
    }
  }

  return {
    isFound: true,
    isPublished,
    isRevealed,
    revealAt: giftPage.reveal_at,
    title: giftPage.title,
    recipientName: giftPage.recipient_name,
    templateType: giftPage.template_type,
    content: giftPage.content as GiftContentData,
    theme: giftPage.theme as GiftThemeData,
    publicToken: giftPage.public_token,
  };
}

export { mapContentToGiftExperience } from '@/lib/gift-mapper';
