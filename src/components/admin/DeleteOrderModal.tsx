'use client';

import React, { useState } from 'react';
import { OrderRow } from '@/types/database';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteOrderModalProps {
  order: OrderRow;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteOrderModal({ order, onClose, onSuccess }: DeleteOrderModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir pedido');

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao excluir pedido');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-order-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-rose-600" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <h3 id="delete-order-title" className="font-serif text-lg font-bold text-rose-900 leading-tight">
              Excluir Pedido {order.code}?
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Esta ação removerá o pedido e arquivará seus registros associados.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-rose-400 hover:text-rose-700 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-stone-700">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Cliente:</span>
              <strong className="text-stone-900">{order.customer_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">WhatsApp:</span>
              <span>{order.customer_whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Presenteado:</span>
              <strong className="text-[#713C48]">{order.recipient_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Valor:</span>
              <span>{(order.total_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Certifique-se de que não há pagamentos pendentes de estorno antes de confirmar a exclusão.
            </span>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </p>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold transition-all text-xs"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>{isDeleting ? 'Excluindo...' : 'Sim, Excluir Pedido'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
