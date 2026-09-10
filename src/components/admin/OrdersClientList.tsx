'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OrderRow, OrderStatus, PaymentStatus, ProductType } from '@/types/database';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/admin/PaymentStatusBadge';
import { formatCurrency } from '@/lib/order-utils';
import { EditOrderModal } from '@/components/admin/EditOrderModal';
import { DeleteOrderModal } from '@/components/admin/DeleteOrderModal';
import { RejectOrderModal } from '@/components/admin/RejectOrderModal';
import { AcceptOrderModal } from '@/components/admin/AcceptOrderModal';
import {
  ShoppingBag,
  Search,
  PlusCircle,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface OrdersClientListProps {
  orders: OrderRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentSearch?: string;
  currentStatus?: string;
  currentPayment?: string;
  currentProduct?: string;
}

export default function OrdersClientList({
  orders: initialOrders,
  totalCount: initialTotalCount,
  page,
  pageSize,
  totalPages,
  currentSearch = '',
  currentStatus = 'all',
  currentPayment = 'all',
  currentProduct = 'all',
}: OrdersClientListProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);

  // Filter state
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [statusFilter, setStatusFilter] = useState(currentStatus);
  const [paymentFilter, setPaymentFilter] = useState(currentPayment);
  const [productFilter, setProductFilter] = useState(currentProduct);

  // Modals state
  const [editingOrder, setEditingOrder] = useState<OrderRow | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<OrderRow | null>(null);
  const [acceptingOrder, setAcceptingOrder] = useState<OrderRow | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<OrderRow | null>(null);

  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sincroniza se os props mudarem
  useEffect(() => {
    setOrders(initialOrders);
    setTotalCount(initialTotalCount);
  }, [initialOrders, initialTotalCount]);

  // Limpa toast após 4 segundos
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  const applyFilters = (s = searchTerm, st = statusFilter, p = paymentFilter, pr = productFilter) => {
    const params = new URLSearchParams();
    if (s.trim()) params.set('search', s.trim());
    if (st && st !== 'all') params.set('status', st);
    if (p && p !== 'all') params.set('payment', p);
    if (pr && pr !== 'all') params.set('product', pr);
    params.set('page', '1');
    router.push(`/admin/pedidos?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Handlers de sucesso das modais
  const handleEditSuccess = (updated: OrderRow) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setToastMsg({ text: `Pedido ${updated.code} atualizado com sucesso!`, type: 'success' });
    router.refresh();
  };

  const handleDeleteSuccess = (deletedId: string, code: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== deletedId));
    setTotalCount((prev) => Math.max(0, prev - 1));
    setToastMsg({ text: `Pedido ${code} excluído com sucesso!`, type: 'success' });
    router.refresh();
  };

  const handleStatusUpdateSuccess = (orderId: string, newStatus: OrderStatus, actionLabel: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setToastMsg({ text: `Pedido ${actionLabel} com sucesso!`, type: 'success' });
    router.refresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification Bar */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg border animate-in fade-in slide-in-from-top-3 ${
            toastMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMsg.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="p-1 hover:bg-black/5 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white/90 border border-[#713C48]/15 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, cliente, WhatsApp..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs text-[#302B2D] placeholder-[#302B2D]/40 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
            <Search className="w-4 h-4 text-[#713C48] absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>

          {/* Status Select */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                applyFilters(searchTerm, e.target.value, paymentFilter, productFilter);
              }}
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
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                applyFilters(searchTerm, statusFilter, e.target.value, productFilter);
              }}
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
              className="w-full py-2.5 rounded-2xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Orders Table View */}
      {orders.length === 0 ? (
        <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-[#C96E5A] mx-auto opacity-50" />
          <h3 className="font-serif text-xl text-[#713C48]">Nenhum pedido encontrado</h3>
          <p className="text-xs text-[#302B2D]/60 max-w-sm mx-auto">
            Tente ajustar os termos da busca ou os filtros selecionados acima.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden xl:block bg-white/95 border border-[#713C48]/15 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#713C48]/10 bg-[#FFF8F0]/80 text-[#713C48] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-5">Código</th>
                  <th className="py-4 px-4">Cliente</th>
                  <th className="py-4 px-4">Presenteado</th>
                  <th className="py-4 px-4">Formato</th>
                  <th className="py-4 px-4">Valor</th>
                  <th className="py-4 px-4">Pagamento</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Data</th>
                  <th className="py-4 px-5 text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#713C48]/10 text-[#302B2D]">
                {orders.map((order) => {
                  const isApproved = order.status === 'approved' || order.status === 'in_production' || order.status === 'completed';
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <tr key={order.id} className="hover:bg-[#FFF8F0]/50 transition-colors group">
                      <td className="py-3.5 px-5 font-mono font-bold text-[#713C48]">
                        <Link href={`/admin/pedidos/${order.id}`} className="hover:underline">
                          {order.code}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block text-stone-900">{order.customer_name}</span>
                        <span className="text-[11px] text-[#302B2D]/60">{order.customer_whatsapp}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium block">{order.recipient_name}</span>
                        <span className="text-[11px] text-[#C96E5A] font-semibold">{order.recipient_relationship}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium">
                        <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-medium">
                          {order.product_type === 'digital'
                            ? 'História Digital'
                            : order.product_type === 'talking_card'
                            ? 'Cartão que Fala'
                            : 'Presente Interativo'}
                        </span>
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
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botão Aceitar */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => setAcceptingOrder(order)}
                              title="Aceitar e aprovar pedido"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden 2xl:inline">Aceitar</span>
                            </button>
                          )}

                          {/* Botão Recusar */}
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => setRejectingOrder(order)}
                              title="Recusar ou cancelar pedido"
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span className="hidden 2xl:inline">Recusar</span>
                            </button>
                          )}

                          {/* Botão Editar */}
                          <button
                            type="button"
                            onClick={() => setEditingOrder(order)}
                            title="Editar informações do pedido"
                            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden 2xl:inline">Editar</span>
                          </button>

                          {/* Botão Excluir */}
                          <button
                            type="button"
                            onClick={() => setDeletingOrder(order)}
                            title="Excluir pedido"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Link Gerenciar */}
                          <Link
                            href={`/admin/pedidos/${order.id}`}
                            title="Abrir página completa do pedido"
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-[#713C48] rounded-lg transition-all border border-stone-200"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card Layout */}
          <div className="xl:hidden space-y-4">
            {orders.map((order) => {
              const isApproved = order.status === 'approved' || order.status === 'in_production' || order.status === 'completed';
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-white/95 border border-[#713C48]/15 rounded-3xl p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-mono font-bold text-[#713C48] text-sm hover:underline"
                    >
                      {order.code}
                    </Link>
                    <span className="text-[11px] text-[#302B2D]/60 font-medium">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Cliente:</span>
                      <strong className="text-stone-900">{order.customer_name} ({order.customer_whatsapp})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Presenteado:</span>
                      <strong className="text-[#713C48]">{order.recipient_name} ({order.recipient_relationship})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Formato:</span>
                      <span className="font-medium text-stone-700">
                        {order.product_type === 'digital'
                          ? 'História Digital'
                          : order.product_type === 'talking_card'
                          ? 'Cartão que Fala'
                          : 'Presente Interativo'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Valor Total:</span>
                      <strong className="text-[#713C48] text-sm">{formatCurrency(order.total_cents / 100)}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <OrderStatusBadge status={order.status} size="sm" />
                    <PaymentStatusBadge status={order.payment_status} size="sm" />
                  </div>

                  {/* Actions Bar on Mobile */}
                  <div className="pt-3 border-t border-[#713C48]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      {!isApproved && (
                        <button
                          type="button"
                          onClick={() => setAcceptingOrder(order)}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Aceitar</span>
                        </button>
                      )}

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setRejectingOrder(order)}
                          className="px-2.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <XCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Recusar</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditingOrder(order)}
                        className="px-2.5 py-1.5 bg-sky-50 text-sky-900 border border-sky-200 rounded-xl font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-700" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingOrder(order)}
                        className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold shadow-2xs"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#713C48] hover:underline"
                    >
                      <span>Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#713C48]/10 text-xs">
              <span className="text-[#302B2D]/60 font-medium">
                Página {page} de {totalPages} ({totalCount} pedidos)
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/pedidos?page=${page - 1}&search=${searchTerm}&status=${statusFilter}&payment=${paymentFilter}&product=${productFilter}`}
                  className={`p-2 rounded-xl border border-[#713C48]/20 text-[#713C48] hover:bg-[#713C48]/10 ${
                    page <= 1 ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/pedidos?page=${page + 1}&search=${searchTerm}&status=${statusFilter}&payment=${paymentFilter}&product=${productFilter}`}
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

      {/* Modals */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingOrder && (
        <DeleteOrderModal
          order={deletingOrder}
          onClose={() => setDeletingOrder(null)}
          onSuccess={() => handleDeleteSuccess(deletingOrder.id, deletingOrder.code)}
        />
      )}

      {acceptingOrder && (
        <AcceptOrderModal
          order={acceptingOrder}
          onClose={() => setAcceptingOrder(null)}
          onSuccess={(updated) => handleStatusUpdateSuccess(updated.id, updated.status, 'aceito')}
        />
      )}

      {rejectingOrder && (
        <RejectOrderModal
          order={rejectingOrder}
          onClose={() => setRejectingOrder(null)}
          onSuccess={() => handleStatusUpdateSuccess(rejectingOrder.id, 'cancelled', 'recusado')}
        />
      )}
    </div>
  );
}
