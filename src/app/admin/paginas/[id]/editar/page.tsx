import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGiftPageById } from '@/lib/supabase/admin-queries';
import ExperienceEditorClientView from './ExperienceEditorClientView';

interface EditorPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: EditorPageProps): Promise<Metadata> {
  const { giftPage } = await getGiftPageById(params.id);
  if (!giftPage) {
    return { title: 'Página Não Encontrada | Feito de Nós Admin' };
  }
  return {
    title: `Editar: ${giftPage.title} | Feito de Nós Admin`,
  };
}

export default async function GiftPageEditorPage({ params }: EditorPageProps) {
  const { giftPage, order } = await getGiftPageById(params.id);

  if (!giftPage) {
    notFound();
  }

  // Algumas páginas antigas podem ter recipient_name diferente do nome já salvo
  // dentro do conteúdo. O conteúdo editável é a fonte de verdade para o editor,
  // evitando que um valor legado (ex.: "teset") sobrescreva o nome correto.
  const content = giftPage.content as {
    recipient?: { name?: string | null };
  } | null;
  const contentRecipientName = content?.recipient?.name?.trim();

  const normalizedGiftPage = contentRecipientName
    ? { ...giftPage, recipient_name: contentRecipientName }
    : giftPage;

  return (
    <ExperienceEditorClientView
      giftPage={normalizedGiftPage}
      order={order}
    />
  );
}
