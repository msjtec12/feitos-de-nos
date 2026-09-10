import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSessionAndProfile, getOrdersList } from '@/lib/supabase/admin-queries';
import OrdersClientList from '@/components/admin/OrdersClientList';
import { OrderStatus, PaymentStatus, ProductType } from '@/types/database';

interface PedidosPageProps {
  searchParams: {
    search?: string;
    status?: string;
    payment?: string;
    product?: string;
    page?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function AdminPedidosPage({ searchParams }: PedidosPageProps) {
  const { user, profile } = await getAdminSessionAndProfile();

  if (!user || !profile) {
    redirect('/admin/login');
  }

  const page = parseInt(searchParams.page || '1', 10) || 1;
  const status = (searchParams.status as OrderStatus) || 'all';
  const paymentStatus = (searchParams.payment as PaymentStatus) || 'all';
  const productType = (searchParams.product as ProductType) || 'all';
  const search = searchParams.search || '';

  const { orders, totalCount, totalPages } = await getOrdersList({
    search,
    status,
    paymentStatus,
    productType,
    page,
    pageSize: 15,
  });

  return (
    <OrdersClientList
      orders={orders}
      totalCount={totalCount}
      page={page}
      pageSize={15}
      totalPages={totalPages}
      currentSearch={search}
      currentStatus={status}
      currentPayment={paymentStatus}
      currentProduct={productType}
    />
  );
}
