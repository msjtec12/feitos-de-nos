'use client';

import React, { useState } from 'react';
import { OrderRow, OrderStatus } from '@/types/database';
import { CheckCircle2, Loader2, X, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AcceptOrderModalProps {
  order: OrderRow;
  onClose: () => void;
  onSuccess: (updatedOrder: OrderRow) => void;
}

export function AcceptOrderModal({ order, onClose, onSuccess }: AcceptOrderModalProps) {
  const router = useRouter();
  const [targetStatus, setTargetStatus] = useState<OrderStatus>(
    order.product_type === 'digital' ? 'approved' : 'in_production'
  );
  const [createGiftPage, setCreateGiftPage] = useState(true);
  const [note, setNote] = useState('Pedido aceito e aprovado pelo administrador');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Atualizar status
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao aceitar pedido');

      // 2. Se optou por criar a página de experiência vinculada
      let createdPageId: string | null = null;
      if (createGiftPage) {
        try {
          const pageRes = await fetch(`/api/admin/orders/${order.id}/create-page`, {
            method: 'POST',
          });
          const pageData = await pageRes.json();
          if (pageRes.ok && pageData.giftPage?.id) {
            createdPageId = pageData.giftPage.id;
          }
        } catch {
          // segue mesmo se já existir
        }
      }

      onSuccess({ ...order, status: targetStatus });
      onClose();

      if (createdPageId) {
        router.push(`/admin/paginas/${createdPageId}/editar`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao aceitar pedido');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accept-order-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-emerald-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-emerald-50 border-b border-emerald-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <h3 id="accept-order-title" className="font-serif text-lg font-bold text-emerald-950 leading-tight">
              Aceitar Pedido {order.code}
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              Confirme a aprovação do pedido para dar andamento na produção.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-emerald-400 hover:text-emerald-700 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleAccept} className="p-6 space-y-4 text-xs text-stone-700">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Cliente:</span>
              <strong className="text-stone-900">{order.customer_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Presenteado:</span>
              <strong className="text-[#713C48]">{order.recipient_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Formato:</span>
              <span className="font-medium text-stone-800">
                {order.product_type === 'digital'
                  ? 'História Digital'
                  : order.product_type === 'talking_card'
                  ? 'Cartão que Fala'
                  : 'Presente Interativo'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-stone-800 block">Definir Novo Status do Pedido:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetStatus('approved')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  targetStatus === 'approved'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Aprovado
              </button>

              <button
                type="button"
                onClick={() => setTargetStatus('in_production')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  targetStatus === 'in_production'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Em Produção
              </button>
            </div>
          </div>

          {/* Create page shortcut checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF8F0] border border-[#713C48]/15 cursor-pointer">
            <input
              type="checkbox"
              checked={createGiftPage}
              onChange={(e) => setCreateGiftPage(e.target.checked)}
              className="mt-0.5 rounded text-[#713C48] focus:ring-[#713C48]"
            />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-[#713C48] block flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-[#C96E5A]" />
                Criar / Abrir Página de Experiência
              </strong>
              <span>Gera o link e abre o editor de memórias deste presente após aceitar.</span>
            </div>
          </label>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold transition-all text-xs"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md transition-all text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{isSubmitting ? 'Salvando...' : 'Aceitar e Aprovar Pedido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
