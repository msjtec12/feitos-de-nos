'use client';

import React, { useState } from 'react';
import { OrderRow, OrderStatus, PaymentStatus, ProductType } from '@/types/database';
import {
  X,
  Save,
  Loader2,
  AlertCircle,
  User,
  Heart,
  CreditCard,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ORDER_PRICES_CENTS } from '@/lib/validation/order-schema';

interface EditOrderModalProps {
  order: OrderRow;
  onClose: () => void;
  onSuccess: (updatedOrder: OrderRow) => void;
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
  { id: 'paid', label: 'Pago Integral' },
  { id: 'refunded', label: 'Reembolsado' },
];

export function EditOrderModal({ order, onClose, onSuccess }: EditOrderModalProps) {
  const [activeTab, setActiveTab] = useState<'customer' | 'gift' | 'pricing' | 'status'>('customer');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState(order.customer_name);
  const [customerWhatsapp, setCustomerWhatsapp] = useState(order.customer_whatsapp);
  const [customerEmail, setCustomerEmail] = useState(order.customer_email);
  const [customerZipcode, setCustomerZipcode] = useState(order.customer_zipcode || '');
  const [customerStreet, setCustomerStreet] = useState(order.customer_street || '');
  const [customerNumber, setCustomerNumber] = useState(order.customer_number || '');
  const [customerComplement, setCustomerComplement] = useState(order.customer_complement || '');
  const [customerNeighborhood, setCustomerNeighborhood] = useState(order.customer_neighborhood || '');
  const [customerCity, setCustomerCity] = useState(order.customer_city || '');
  const [customerState, setCustomerState] = useState(order.customer_state || 'SP');

  const [recipientName, setRecipientName] = useState(order.recipient_name);
  const [recipientRelationship, setRecipientRelationship] = useState(order.recipient_relationship || '');
  const [requestedTitle, setRequestedTitle] = useState(order.requested_title || '');
  const [mainPhrase, setMainPhrase] = useState(order.main_phrase || '');
  const [occasionType, setOccasionType] = useState(order.occasion_type || 'presente');
  const [occasionDate, setOccasionDate] = useState(
    order.occasion_date ? new Date(order.occasion_date).toISOString().slice(0, 10) : ''
  );

  const [productType, setProductType] = useState<ProductType>(order.product_type);
  const [priceReais, setPriceReais] = useState<string>(
    (order.price_cents / 100).toFixed(2).replace('.', ',')
  );
  const [freightReais, setFreightReais] = useState<string>(
    (order.freight_cents / 100).toFixed(2).replace('.', ',')
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.payment_status);

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [statusNote, setStatusNote] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>(order.customer_notes || '');
  const [internalNotes, setInternalNotes] = useState<string>(order.internal_notes || '');

  // Atualizar preço padrão ao mudar tipo de produto
  const handleProductTypeChange = (newType: ProductType) => {
    setProductType(newType);
    const defaultCents = ORDER_PRICES_CENTS[newType] || 5990;
    setPriceReais((defaultCents / 100).toFixed(2).replace('.', ','));
  };

  const calculateTotal = () => {
    const p = parseFloat(priceReais.replace(',', '.')) || 0;
    const f = parseFloat(freightReais.replace(',', '.')) || 0;
    return (p + f).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const priceCents = Math.round((parseFloat(priceReais.replace(',', '.')) || 0) * 100);
      const freightCents = Math.round((parseFloat(freightReais.replace(',', '.')) || 0) * 100);

      const payload = {
        customer_name: customerName.trim(),
        customer_whatsapp: customerWhatsapp.trim(),
        customer_email: customerEmail.trim(),
        customer_zipcode: customerZipcode.trim() || null,
        customer_street: customerStreet.trim() || null,
        customer_number: customerNumber.trim() || null,
        customer_complement: customerComplement.trim() || null,
        customer_neighborhood: customerNeighborhood.trim() || null,
        customer_city: customerCity.trim() || 'Não informada',
        customer_state: customerState.trim() || 'SP',
        recipient_name: recipientName.trim(),
        recipient_relationship: recipientRelationship.trim(),
        requested_title: requestedTitle.trim(),
        main_phrase: mainPhrase.trim() || null,
        occasion_type: occasionType,
        occasion_date: occasionDate ? new Date(occasionDate).toISOString() : null,
        product_type: productType,
        price_cents: priceCents,
        freight_cents: freightCents,
        payment_status: paymentStatus,
        status,
        status_note: statusNote.trim() || undefined,
        customer_notes: customerNotes.trim() || null,
        internal_notes: internalNotes.trim() || null,
      };

      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar alterações no pedido');

      onSuccess(data.order || { ...order, ...payload, total_cents: priceCents + freightCents });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar pedido');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-order-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-[#713C48]/20 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#713C48]/10 bg-[#FFF8F0] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-white px-2.5 py-0.5 rounded-lg border border-[#713C48]/20 text-[#713C48]">
                {order.code}
              </span>
              <span className="text-xs text-stone-500 font-semibold">Editar Pedido</span>
            </div>
            <h2 id="edit-order-title" className="font-serif text-xl sm:text-2xl text-[#713C48] font-bold">
              {recipientName ? `Homenagem para ${recipientName}` : 'Edição de Encomenda'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-4 sm:px-6 overflow-x-auto text-xs">
          {[
            { id: 'customer', label: '1. Comprador', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'gift', label: '2. Homenagem', icon: <Heart className="w-3.5 h-3.5" /> },
            { id: 'pricing', label: '3. Formato & Valores', icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: 'status', label: '4. Status & Notas', icon: <FileText className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#713C48] text-[#713C48] bg-white rounded-t-xl'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-stone-800">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: Dados do Comprador */}
          {activeTab === 'customer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Nome do Comprador *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    required
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-[#713C48]">E-mail</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <h4 className="font-bold text-stone-700 text-xs uppercase tracking-wider">Endereço de Entrega (Produtos Físicos)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-stone-600">CEP</label>
                    <input
                      type="text"
                      value={customerZipcode}
                      onChange={(e) => setCustomerZipcode(e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-medium text-stone-600">Rua / Logradouro</label>
                    <input
                      type="text"
                      value={customerStreet}
                      onChange={(e) => setCustomerStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-stone-600">Número</label>
                    <input
                      type="text"
                      value={customerNumber}
                      onChange={(e) => setCustomerNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-stone-600">Complemento</label>
                    <input
                      type="text"
                      value={customerComplement}
                      onChange={(e) => setCustomerComplement(e.target.value)}
                      placeholder="Apto, Bloco..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-stone-600">Bairro</label>
                    <input
                      type="text"
                      value={customerNeighborhood}
                      onChange={(e) => setCustomerNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-medium text-stone-600">Cidade</label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-stone-600">Estado (UF)</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48] uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Dados da Homenagem */}
          {activeTab === 'gift' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Nome do Presenteado *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ex: Matheus Akira"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Relação / Parentesco</label>
                  <input
                    type="text"
                    value={recipientRelationship}
                    onChange={(e) => setRecipientRelationship(e.target.value)}
                    placeholder="Ex: Filho, Afilhado, Mãe..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-[#713C48]">Título Solicitado para a Página *</label>
                  <input
                    type="text"
                    required
                    value={requestedTitle}
                    onChange={(e) => setRequestedTitle(e.target.value)}
                    placeholder="Ex: 365 Dias de Amor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Tipo de Ocasião</label>
                  <input
                    type="text"
                    value={occasionType}
                    onChange={(e) => setOccasionType(e.target.value)}
                    placeholder="Ex: Primeiro Ano, Casamento, Aniversário..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Data Comemorativa</label>
                  <input
                    type="date"
                    value={occasionDate}
                    onChange={(e) => setOccasionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-[#713C48]">Frase de Abertura / Mensagem Principal</label>
                  <textarea
                    rows={2}
                    value={mainPhrase}
                    onChange={(e) => setMainPhrase(e.target.value)}
                    placeholder="Ex: Histórias que viram presente."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Formato & Valores */}
          {activeTab === 'pricing' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#713C48]">Formato do Produto</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'digital', label: 'História Digital', price: 'R$ 59,90' },
                    { id: 'talking_card', label: 'Cartão que Fala', price: 'R$ 99,90' },
                    { id: 'interactive_gift', label: 'Presente Interativo', price: 'R$ 199,90' },
                  ].map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleProductTypeChange(prod.id as ProductType)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        productType === prod.id
                          ? 'bg-[#FFF8F0] border-[#713C48] ring-2 ring-[#713C48]/20 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-[#713C48]/40'
                      }`}
                    >
                      <strong className="block text-[#713C48]">{prod.label}</strong>
                      <span className="text-stone-500 text-[11px]">{prod.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Preço do Produto (R$)</label>
                  <input
                    type="text"
                    value={priceReais}
                    onChange={(e) => setPriceReais(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48] font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#713C48]">Valor do Frete (R$)</label>
                  <input
                    type="text"
                    value={freightReais}
                    onChange={(e) => setFreightReais(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48] font-bold"
                  />
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 flex items-center justify-between font-bold text-sm">
                  <span className="text-[#713C48]">Valor Total do Pedido:</span>
                  <span className="text-base text-[#713C48]">{calculateTotal()}</span>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-[#713C48]">Status do Pagamento</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48] font-semibold"
                  >
                    {ALL_PAYMENT_STATUSES.map((ps) => (
                      <option key={ps.id} value={ps.id}>
                        {ps.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Status & Notas */}
          {activeTab === 'status' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <label className="font-semibold text-[#713C48]">Status do Fluxo de Produção</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48] font-semibold"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {status !== order.status && (
                <div className="space-y-1 animate-in fade-in">
                  <label className="font-semibold text-[#C96E5A]">Motivo / Nota da Alteração de Status</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Ex: Cliente aprovou o modelo por WhatsApp"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#C96E5A]/30 bg-[#FFF8F0] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Observações Enviadas pelo Cliente</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Instruções ou preferências enviadas no checkout..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Anotações Internas da Equipe (Privadas)</label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Anotações internas sobre conferência, rastreio, contatos..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
