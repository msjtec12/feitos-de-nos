import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSessionAndProfile, getOrdersList } from '@/lib/supabase/admin-queries';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/admin/PaymentStatusBadge';
import { formatCurrency } from '@/lib/order-utils';
import { OrderStatus, PaymentStatus, ProductType } from '@/types/database';
import {
  ShoppingBag,
  Search,
  PlusCircle,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface PedidosPageProps {
  searchParams: {
    search?: string;
    status?: string;
    payment?: string;
    product?: string;
    page?: string;
  };
}

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#713C48]/10 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C96E5A]">
            Controle de Encomendas
          </span>
          <h1 className="font-serif text-3xl text-[#713C48]">
            Todos os Pedidos ({totalCount})
          </h1>
        </div>

        <Link
          href="/admin/pedidos/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#713C48] text-[#FFF8F0] text-xs sm:text-sm font-semibold hover:bg-[#5a2e39] transition-all shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#D9A4A0]" />
          <span>Cadastrar Novo Pedido</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <form method="GET" className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Buscar por código, cliente, WhatsApp..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs text-[#302B2D] placeholder-[#302B2D]/40 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
            <Search className="w-4 h-4 text-[#713C48] absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>

          {/* Status Select */}
          <div className="sm:col-span-3">
            <select
              name="status"
              defaultValue={status}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            >
              <option value="all">Todos os Status</option>
              <option value="new">Novos</option>
              <option value="contact_started">Contato Iniciado</option>
              <option value="awaiting_content">Aguardando Conteúdo</option>
              <option value="content_received">Conteúdo Recebido</option>
              <option value="creating">Em Criação</option>
              <option value="awaiting_approval">Aguardando Aprovação</option>
              <option value="approved">Aprovados</option>
              <option value="in_production">Em Produção Física</option>
              <option value="shipped">Enviados</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          {/* Payment Select */}
          <div className="sm:col-span-3">
            <select
              name="payment"
              defaultValue={paymentStatus}
              className="w-full px-3 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            >
              <option value="all">Todos os Pagamentos</option>
              <option value="pending">Pendente</option>
              <option value="deposit_paid">Sinal Pago (50%)</option>
              <option value="paid">Pago Integral</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Orders View */}
      {orders.length === 0 ? (
        <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-12 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-[#C96E5A] mx-auto opacity-50" />
          <h3 className="font-serif text-xl text-[#713C48]">Nenhum pedido encontrado</h3>
          <p className="text-xs text-[#302B2D]/60 max-w-sm mx-auto">
            Tente ajustar os termos da busca ou os filtros selecionados acima.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white/90 border border-[#713C48]/15 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#713C48]/10 bg-[#FFF8F0]/80 text-[#713C48] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Código</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Presenteado</th>
                  <th className="py-3.5 px-4">Formato</th>
                  <th className="py-3.5 px-4">Valor</th>
                  <th className="py-3.5 px-4">Pagamento</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#713C48]/10 text-[#302B2D]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#713C48]">
                      {order.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold block">{order.customer_name}</span>
                      <span className="text-[11px] text-[#302B2D]/60">{order.customer_whatsapp}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium block">{order.recipient_name}</span>
                      <span className="text-[11px] text-[#C96E5A]">{order.recipient_relationship}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium">
                      {order.product_type === 'digital'
                        ? 'História Digital'
                        : order.product_type === 'talking_card'
                        ? 'Cartão que Fala'
                        : 'Presente Interativo'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#713C48]">
                      {formatCurrency(order.total_cents / 100)}
                    </td>
                    <td className="py-3.5 px-4">
                      <PaymentStatusBadge status={order.payment_status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#302B2D]/60">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#713C48] hover:text-[#C96E5A]"
                      >
                        <span>Gerenciar</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/90 border border-[#713C48]/15 rounded-3xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-2">
                  <span className="font-mono font-bold text-[#713C48] text-sm">{order.code}</span>
                  <span className="text-[11px] text-[#302B2D]/60">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p>
                    <strong className="text-[#713C48]">Cliente:</strong> {order.customer_name} ({order.customer_whatsapp})
                  </p>
                  <p>
                    <strong className="text-[#713C48]">Presenteado:</strong> {order.recipient_name} ({order.recipient_relationship})
                  </p>
                  <p>
                    <strong className="text-[#713C48]">Valor:</strong> {formatCurrency(order.total_cents / 100)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <OrderStatusBadge status={order.status} size="sm" />
                  <PaymentStatusBadge status={order.payment_status} size="sm" />
                </div>

                <div className="pt-2 border-t border-[#713C48]/10 flex justify-end">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#713C48]"
                  >
                    <span>Ver Detalhes do Pedido</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#713C48]/10 text-xs">
              <span className="text-[#302B2D]/60">
                Página {page} de {totalPages} ({totalCount} pedidos)
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/pedidos?page=${page - 1}&search=${search}&status=${status}&payment=${paymentStatus}`}
                  className={`p-2 rounded-xl border border-[#713C48]/20 text-[#713C48] hover:bg-[#713C48]/10 ${
                    page <= 1 ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/pedidos?page=${page + 1}&search=${search}&status=${status}&payment=${paymentStatus}`}
                  className={`p-2 rounded-xl border border-[#713C48]/20 text-[#713C48] hover:bg-[#713C48]/10 ${
                    page >= totalPages ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
