'use client';

import React, { useState } from 'react';
import { OrderRow } from '@/types/database';
import { XCircle, Loader2, X, AlertCircle } from 'lucide-react';

interface RejectOrderModalProps {
  order: OrderRow;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_REASONS = [
  'Cancelamento solicitado pelo cliente via WhatsApp',
  'Pagamento não confirmado / expirado',
  'Falta de envio dos dados e arquivos necessários',
  'Duplicidade de pedido no sistema',
  'Desistência antes do início da produção',
];

export function RejectOrderModal({ order, onClose, onSuccess }: RejectOrderModalProps) {
  const [reason, setReason] = useState<string>(COMMON_REASONS[0]);
  const [customNote, setCustomNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const finalNote = customNote.trim() ? `${reason}: ${customNote.trim()}` : reason;

      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          note: finalNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao recusar pedido');

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao recusar pedido');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-order-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-amber-50 border-b border-amber-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-amber-700" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <h3 id="reject-order-title" className="font-serif text-lg font-bold text-amber-950 leading-tight">
              Recusar / Cancelar Pedido {order.code}
            </h3>
            <p className="text-xs text-amber-800 mt-0.5">
              O status do pedido passará para <strong>Cancelado</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-amber-700 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleReject} className="p-6 space-y-4 text-xs text-stone-700">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Cliente:</span>
              <strong className="text-stone-900">{order.customer_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Presenteado:</span>
              <strong className="text-[#713C48]">{order.recipient_name}</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-stone-800 block">Motivo da Recusa / Cancelamento:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              {COMMON_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="Outro motivo">Outro motivo</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-stone-700 block">Detalhes Adicionais (Opcional):</label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Descreva detalhes adicionais sobre o cancelamento..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

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
              Voltar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shadow-md transition-all text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              <span>{isSubmitting ? 'Cancelando...' : 'Confirmar Cancelamento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
