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

  return <ExperienceEditorClientView giftPage={giftPage} order={order} />;
}
