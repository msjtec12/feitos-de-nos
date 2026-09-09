import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/supabase/admin-queries';
import OrderDetailClientView from './OrderDetailClientView';

interface OrderPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { order } = await getOrderById(params.id);
  if (!order) {
    return { title: 'Pedido Não Encontrado | Feito de Nós Admin' };
  }
  return {
    title: `Pedido ${order.code} — ${order.recipient_name} | Feito de Nós Admin`,
  };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { order, history, giftPage } = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClientView order={order} history={history} giftPage={giftPage} />;
}
