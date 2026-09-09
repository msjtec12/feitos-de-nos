'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OrderRow, OrderStatusHistoryRow, GiftPageRow, OrderStatus, PaymentStatus } from '@/types/database';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/admin/PaymentStatusBadge';
import { ProductionChecklist } from '@/components/admin/ProductionChecklist';
import { QRCodeModal } from '@/components/admin/QRCodeModal';

interface OrderDetailClientViewProps {
  order: OrderRow;
  history: OrderStatusHistoryRow[];
  giftPage: GiftPageRow | null;
}

const ALL_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: 'new', label: 'Novo Pedido' },
  { id: 'contact_started', label: 'Contato Iniciado' },
  { id: 'awaiting_content', label: 'Aguardando Conteúdo' },
  { id: 'content_received', label: 'Conteúdo Recebido' },
  { id: 'creating', label: 'Em Criação' },
  { id: 'awaiting_approval', label: 'Aguardando Aprovação' },
  { id: 'approved', label: 'Aprovado pelo Cliente' },
  { id: 'in_production', label: 'Em Produção Física' },
  { id: 'shipped', label: 'Enviado / Rastreio' },
  { id: 'completed', label: 'Concluído / Entregue' },
  { id: 'cancelled', label: 'Cancelado' },
];

const ALL_PAYMENT_STATUSES: { id: PaymentStatus; label: string }[] = [
  { id: 'pending', label: 'Pendente' },
  { id: 'deposit_paid', label: 'Sinal Pago (50%)' },
  { id: 'paid', label: 'Totalmente Pago' },
  { id: 'refunded', label: 'Reembolsado' },
];

export default function OrderDetailClientView({
  order: initialOrder,
  history: initialHistory,
  giftPage: initialGiftPage,
}: OrderDetailClientViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderRow>(initialOrder);
  const [history, setHistory] = useState<OrderStatusHistoryRow[]>(initialHistory);
  const [giftPage, setGiftPage] = useState<GiftPageRow | null>(initialGiftPage);

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState<PaymentStatus>(order.payment_status);
  const [freightReais, setFreightReais] = useState<string>(
    (order.freight_cents / 100).toFixed(2).replace('.', ',')
  );
  const [internalNotes, setInternalNotes] = useState(order.internal_notes || '');
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Formatação de valores
  const formatMoney = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // WhatsApp Link Helper
  const cleanPhone = order.customer_whatsapp.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  const generateWhatsAppUrl = (customText: string) => {
    const encoded = encodeURIComponent(customText);
    return `https://wa.me/${waPhone}?text=${encoded}`;
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar status');

      setOrder((prev) => ({ ...prev, status: selectedStatus }));
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          order_id: order.id,
          previous_status: order.status,
          new_status: selectedStatus,
          admin_id: null,
          note: statusNote || `Status alterado para ${selectedStatus}`,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setStatusNote('');
      setFeedbackMsg({ text: 'Status atualizado com sucesso!', type: 'success' });
      router.refresh();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPayment(true);
    setFeedbackMsg(null);

    try {
      const parsedFreight = Math.round(parseFloat(freightReais.replace(',', '.')) * 100) || 0;
      const res = await fetch(`/api/admin/orders/${order.id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: selectedPayment,
          freight_cents: parsedFreight,
          internal_notes: internalNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar financeiro');

      setOrder((prev) => ({
        ...prev,
        payment_status: selectedPayment,
        freight_cents: parsedFreight,
        total_cents: prev.price_cents + parsedFreight,
        internal_notes: internalNotes,
      }));

      setFeedbackMsg({ text: 'Informações financeiras atualizadas!', type: 'success' });
      router.refresh();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message, type: 'error' });
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleCreateGiftPage = async () => {
    setIsCreatingPage(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/create-page`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar página');

      setGiftPage(data.giftPage);
      setFeedbackMsg({ text: 'Página de experiência criada! Redirecionando para o editor...', type: 'success' });
      router.push(`/admin/paginas/${data.giftPage.id}/editar`);
    } catch (err: any) {
      setFeedbackMsg({ text: err.message, type: 'error' });
      setIsCreatingPage(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#713C48]/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pedidos"
              className="text-xs text-[#713C48] hover:underline flex items-center gap-1 font-medium"
            >
              ← Voltar para pedidos
            </Link>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">
              Criado em {new Date(order.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          <h1 className="text-3xl font-serif text-[#713C48] font-bold mt-2 flex items-center gap-3">
            Pedido {order.code}
          </h1>
          <p className="text-sm text-[#2C2224]/80 mt-1">
            Cliente: <strong className="text-[#713C48]">{order.customer_name}</strong> | Presenteado:{' '}
            <strong>{order.recipient_name}</strong> ({order.recipient_relationship})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={order.status} size="md" />
          <PaymentStatusBadge status={order.payment_status} size="md" />
          <a
            href={generateWhatsAppUrl(`Olá ${order.customer_name}! Aqui é da equipe Feito de Nós referente ao seu pedido ${order.code}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <span>💬</span> Abrir WhatsApp
          </a>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Main Grid: Left Details & Right Side Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Order Details & Experiences */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Linked Gift Page */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#FFF8F0] text-[#713C48] text-xl">🎁</span>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#713C48]">Página de Experiência do Presente</h2>
                  <p className="text-xs text-[#2C2224]/60">Link dinâmico e QR Code exclusivo para esta entrega</p>
                </div>
              </div>
              {giftPage && (
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    giftPage.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : giftPage.status === 'draft'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {giftPage.status.toUpperCase()}
                </span>
              )}
            </div>

            {giftPage ? (
              <div className="bg-[#FFF8F0] rounded-xl p-5 border border-[#C96E5A]/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-[#713C48] text-base">{giftPage.title}</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Token público: <code className="bg-white px-2 py-0.5 rounded border text-[11px]">{giftPage.public_token}</code>
                    </p>
                    {giftPage.reveal_at && (
                      <p className="text-xs text-[#C96E5A] mt-1">
                        ⏰ Revelação agendada para: {new Date(giftPage.reveal_at).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQrModalOpen(true)}
                      className="px-3 py-1.5 bg-white hover:bg-stone-50 text-[#713C48] border border-[#713C48]/20 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>📱</span> QR Code
                    </button>
                    <Link
                      href={`/admin/paginas/${giftPage.id}/editar`}
                      className="px-3 py-1.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-lg text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>✏️</span> Editar Página
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#713C48]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#2C2224]/70">
                    URL pública:{' '}
                    <a
                      href={`/p/${giftPage.public_token}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C96E5A] hover:underline font-mono"
                    >
                      /p/{giftPage.public_token}
                    </a>
                  </span>
                  <Link
                    href={`/admin/paginas/${giftPage.id}/preview`}
                    className="text-[#713C48] font-medium hover:underline"
                  >
                    Visualizar prévia interna →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-300 space-y-3">
                <p className="text-sm text-stone-600">
                  Nenhuma página de presente foi criada para este pedido ainda.
                </p>
                <button
                  type="button"
                  onClick={handleCreateGiftPage}
                  disabled={isCreatingPage}
                  className="px-5 py-2.5 bg-[#713C48] hover:bg-[#592F39] disabled:opacity-50 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                >
                  {isCreatingPage ? 'Criando experiência...' : '✨ Criar Página deste Pedido'}
                </button>
              </div>
            )}
          </div>

          {/* Section: Order Specifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-6">
            <h2 className="font-serif text-lg font-bold text-[#713C48] border-b border-[#713C48]/10 pb-3">
              Especificações da Encomenda
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-xs text-stone-500 block uppercase tracking-wider">Produto Selecionado</span>
                <strong className="text-stone-800 text-base">
                  {order.product_type === 'digital'
                    ? 'História Digital (R$ 59,90)'
                    : order.product_type === 'talking_card'
                    ? 'Cartão que Fala (R$ 99,90)'
                    : 'Presente Interativo (R$ 199,90)'}
                </strong>
              </div>

              <div>
                <span className="text-xs text-stone-500 block uppercase tracking-wider">Coleção & Tema</span>
                <strong className="text-stone-800 capitalize">
                  {order.collection_type} • Estilo {order.visual_style}
                </strong>
              </div>

              <div>
                <span className="text-xs text-stone-500 block uppercase tracking-wider">Título Solicitado</span>
                <span className="text-stone-800 font-medium">{order.requested_title}</span>
              </div>

              <div>
                <span className="text-xs text-stone-500 block uppercase tracking-wider">Data Comemorativa</span>
                <span className="text-stone-800">
                  {order.occasion_date
                    ? new Date(order.occasion_date).toLocaleDateString('pt-BR')
                    : 'Não informada'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-stone-500 block uppercase tracking-wider">Frase de Abertura / Homenagem</span>
                <blockquote className="italic text-stone-700 bg-stone-50 p-3 rounded-lg border-l-2 border-[#C96E5A] mt-1">
                  &ldquo;{order.main_phrase || 'Sem frase informada'}&rdquo;
                </blockquote>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-stone-500 block uppercase tracking-wider">Conteúdos Inclusos Solicitados</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {order.requested_contents?.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-lg font-medium"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {order.customer_notes && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-stone-500 block uppercase tracking-wider">Observações do Cliente</span>
                  <p className="text-stone-700 bg-amber-50/50 border border-amber-200/60 p-3 rounded-lg text-xs mt-1">
                    {order.customer_notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Physical Production Checklist (for physical products) */}
          {(order.product_type === 'talking_card' || order.product_type === 'interactive_gift') && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#FFF8F0] text-[#713C48] text-xl">📦</span>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#713C48]">Controle de Produção Física</h2>
                  <p className="text-xs text-[#2C2224]/60">Etapas de confecção, teste de QR Code e expedição</p>
                </div>
              </div>
              <ProductionChecklist
                orderId={order.id}
                isPhysical={true}
                initialNotes={order.internal_notes}
              />
            </div>
          )}

          {/* Section: Status History Log */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#713C48] border-b border-[#713C48]/10 pb-3">
              Histórico de Alterações & Auditoria
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {history.map((h) => (
                <div key={h.id} className="flex items-start gap-3 text-xs border-l-2 border-[#C96E5A]/40 pl-3 py-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={h.new_status} size="sm" />
                      <span className="text-stone-400">
                        {new Date(h.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    {h.note && <p className="text-stone-600">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Customer Data, Financial & Status Workflow */}
        <div className="space-y-8">
          {/* Box: Customer Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-4">
            <h2 className="font-serif text-base font-bold text-[#713C48] border-b border-[#713C48]/10 pb-2">
              Dados do Comprador
            </h2>
            <div className="space-y-3 text-xs text-stone-700">
              <div>
                <span className="text-stone-400 block uppercase text-[10px]">Nome Completo</span>
                <strong className="text-sm text-[#2C2224]">{order.customer_name}</strong>
              </div>
              <div>
                <span className="text-stone-400 block uppercase text-[10px]">WhatsApp</span>
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-medium hover:underline text-sm flex items-center gap-1 mt-0.5"
                >
                  <span>📱</span> {order.customer_whatsapp}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block uppercase text-[10px]">E-mail</span>
                <a href={`mailto:${order.customer_email}`} className="text-stone-800 hover:underline">
                  {order.customer_email}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block uppercase text-[10px]">Cidade / UF</span>
                <span>
                  {order.customer_city} / {order.customer_state}
                </span>
              </div>
              {order.customer_zipcode && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-stone-400 block uppercase text-[10px]">Endereço para Envio</span>
                  <p className="mt-0.5 text-stone-800 font-medium leading-relaxed">
                    {order.customer_street}, {order.customer_number || 'S/N'}{' '}
                    {order.customer_complement ? `(${order.customer_complement})` : ''}
                    <br />
                    {order.customer_neighborhood} — {order.customer_city}/{order.customer_state}
                    <br />
                    CEP: {order.customer_zipcode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Box: Status Workflow Changer */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-4">
            <h2 className="font-serif text-base font-bold text-[#713C48] border-b border-[#713C48]/10 pb-2">
              Atualizar Status do Pedido
            </h2>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Novo Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nota do Histórico (Opcional)
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ex: Áudios aprovados no WhatsApp"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingStatus || selectedStatus === order.status}
                className="w-full py-2.5 bg-[#713C48] hover:bg-[#592F39] disabled:opacity-40 text-white rounded-xl text-xs font-medium shadow-sm transition-all"
              >
                {isUpdatingStatus ? 'Salvando...' : 'Salvar Novo Status'}
              </button>
            </form>
          </div>

          {/* Box: Financial & Freight Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-4">
            <h2 className="font-serif text-base font-bold text-[#713C48] border-b border-[#713C48]/10 pb-2">
              Financeiro & Pagamento
            </h2>
            <form onSubmit={handleUpdatePayment} className="space-y-4 text-xs">
              <div className="space-y-1 text-stone-700">
                <div className="flex justify-between">
                  <span>Valor do Produto:</span>
                  <strong>{formatMoney(order.price_cents)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <strong>{formatMoney(order.freight_cents)}</strong>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#713C48] pt-2 border-t border-stone-100">
                  <span>Total do Pedido:</span>
                  <span>{formatMoney(order.total_cents)}</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Status do Pagamento</label>
                <select
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                >
                  {ALL_PAYMENT_STATUSES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Valor do Frete (R$)</label>
                <input
                  type="text"
                  value={freightReais}
                  onChange={(e) => setFreightReais(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Notas Internas (Privadas)</label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Anotações internas sobre pagamento, comprovantes ou detalhes..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPayment}
                className="w-full py-2.5 bg-[#C96E5A] hover:bg-[#b05845] disabled:opacity-40 text-white rounded-xl text-xs font-medium shadow-sm transition-all"
              >
                {isUpdatingPayment ? 'Salvando...' : 'Atualizar Financeiro & Notas'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {giftPage && isQrModalOpen && (
        <QRCodeModal
          publicToken={giftPage.public_token}
          recipientName={order.recipient_name}
          giftTitle={giftPage.title}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </div>
  );
}
