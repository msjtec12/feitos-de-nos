'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductType, PaymentStatus, OrderStatus } from '@/types/database';

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('SP');
  const [customerZipcode, setCustomerZipcode] = useState('');
  const [customerStreet, setCustomerStreet] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerComplement, setCustomerComplement] = useState('');
  const [customerNeighborhood, setCustomerNeighborhood] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientRelationship, setRecipientRelationship] = useState('Filho(a)');
  const [occasionType, setOccasionType] = useState('primeiro-ano');
  const [occasionDate, setOccasionDate] = useState('');
  const [requestedTitle, setRequestedTitle] = useState('');
  const [mainPhrase, setMainPhrase] = useState('');

  const [productType, setProductType] = useState<ProductType>('digital');
  const [collectionType, setCollectionType] = useState('primeiro-ano');
  const [visualStyle, setVisualStyle] = useState('afetuoso');
  const [freightReais, setFreightReais] = useState('0,00');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [status, setStatus] = useState<OrderStatus>('new');
  const [internalNotes, setInternalNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const parsedFreight = Math.round(parseFloat(freightReais.replace(',', '.')) * 100) || 0;

      const payload = {
        customer_name: customerName,
        customer_email: customerEmail || undefined,
        customer_whatsapp: customerWhatsapp,
        customer_city: customerCity,
        customer_state: customerState,
        customer_zipcode: customerZipcode || undefined,
        customer_street: customerStreet || undefined,
        customer_number: customerNumber || undefined,
        customer_complement: customerComplement || undefined,
        customer_neighborhood: customerNeighborhood || undefined,
        recipient_name: recipientName,
        recipient_relationship: recipientRelationship,
        occasion_type: occasionType,
        occasion_date: occasionDate || undefined,
        requested_title: requestedTitle || `Presente para ${recipientName}`,
        main_phrase: mainPhrase || undefined,
        collection_type: collectionType,
        product_type: productType,
        visual_style: visualStyle,
        freight_cents: parsedFreight,
        payment_status: paymentStatus,
        status,
        internal_notes: internalNotes || 'Cadastrado manualmente pelo painel',
      };

      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao registrar pedido');

      router.push(`/admin/pedidos/${data.order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocorreu um erro ao salvar o pedido');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[#713C48]/10 pb-6">
        <div>
          <Link
            href="/admin/pedidos"
            className="text-xs text-[#713C48] hover:underline flex items-center gap-1 font-medium"
          >
            ← Voltar para pedidos
          </Link>
          <h1 className="text-3xl font-serif text-[#713C48] font-bold mt-2">
            Cadastrar Novo Pedido Manual
          </h1>
          <p className="text-sm text-[#2C2224]/70 mt-1">
            Insira os dados de um cliente recebido por WhatsApp, direct ou presencialmente.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-800">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#713C48] border-b border-[#713C48]/10 pb-3 flex items-center gap-2">
            <span>👤</span> Dados do Comprador
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                WhatsApp com DDD *
              </label>
              <input
                type="tel"
                required
                value={customerWhatsapp}
                onChange={(e) => setCustomerWhatsapp(e.target.value)}
                placeholder="11999998888"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-mail (Opcional)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="mariana@exemplo.com"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Cidade</label>
                <input
                  type="text"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none uppercase"
                />
              </div>
            </div>
          </div>

          {(productType === 'talking_card' || productType === 'interactive_gift') && (
            <div className="pt-4 border-t border-stone-100 space-y-4">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Endereço de Entrega (Produto Físico)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-stone-700 mb-1">CEP</label>
                  <input
                    type="text"
                    value={customerZipcode}
                    onChange={(e) => setCustomerZipcode(e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">Rua / Avenida</label>
                  <input
                    type="text"
                    value={customerStreet}
                    onChange={(e) => setCustomerStreet(e.target.value)}
                    placeholder="Rua das Flores"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-stone-700 mb-1">Número</label>
                  <input
                    type="text"
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={customerComplement}
                    onChange={(e) => setCustomerComplement(e.target.value)}
                    placeholder="Apto 42"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={customerNeighborhood}
                    onChange={(e) => setCustomerNeighborhood(e.target.value)}
                    placeholder="Jardim América"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gift section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#713C48] border-b border-[#713C48]/10 pb-3 flex items-center gap-2">
            <span>🎁</span> Detalhes da Homenagem & Produto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome do Presenteado *
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ex: Matheus Akira"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Vínculo Afetivo
              </label>
              <input
                type="text"
                value={recipientRelationship}
                onChange={(e) => setRecipientRelationship(e.target.value)}
                placeholder="Ex: Filho(a), Pai, Avó, Amigo(a)"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Título da Experiência
              </label>
              <input
                type="text"
                value={requestedTitle}
                onChange={(e) => setRequestedTitle(e.target.value)}
                placeholder="Ex: Matheus Akira — Meu Primeiro Ano"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Data Comemorativa (Opcional)
              </label>
              <input
                type="date"
                value={occasionDate}
                onChange={(e) => setOccasionDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Frase de Abertura / Dedicatória Principal
              </label>
              <input
                type="text"
                value={mainPhrase}
                onChange={(e) => setMainPhrase(e.target.value)}
                placeholder="Ex: Cada detalhe de um ano inesquecível guardado com todo o amor."
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Formato do Produto</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              >
                <option value="digital">História Digital (R$ 59,90)</option>
                <option value="talking_card">Cartão que Fala (R$ 99,90)</option>
                <option value="interactive_gift">Presente Interativo (R$ 199,90)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Estilo Visual</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              >
                <option value="afetuoso">Afetuoso & Acolhedor (Vinho e Terracota)</option>
                <option value="minimalista">Minimalista Contemporâneo</option>
                <option value="festivo">Festivo & Vibrante</option>
                <option value="nostalgico">Nostálgico & Vintage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational & Financial */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#713C48] border-b border-[#713C48]/10 pb-3 flex items-center gap-2">
            <span>⚙️</span> Operacional & Financeiro
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status Inicial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              >
                <option value="new">Novo Pedido</option>
                <option value="contact_started">Contato Iniciado</option>
                <option value="awaiting_content">Aguardando Conteúdo</option>
                <option value="creating">Em Criação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Pagamento</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              >
                <option value="pending">Pendente</option>
                <option value="deposit_paid">Sinal Pago (50%)</option>
                <option value="paid">Totalmente Pago</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Frete (R$)</label>
              <input
                type="text"
                value={freightReais}
                onChange={(e) => setFreightReais(e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Notas Internas</label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Anotações internas sobre combinação com cliente, prazos..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/pedidos"
            className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#713C48] hover:bg-[#592F39] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Salvando Pedido...' : 'Salvar e Abrir Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
}
