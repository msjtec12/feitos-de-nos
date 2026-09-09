'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ShoppingBag, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

interface CreatePageHelpModalProps {
  onClose: () => void;
}

export function CreatePageHelpModal({ onClose }: CreatePageHelpModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFF8F0] border border-[#713C48]/20 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#713C48] hover:bg-[#713C48]/10 transition-colors"
          aria-label="Fechar guia"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#713C48]/10 text-[#713C48] text-[11px] font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Guia de Criação</span>
          </div>
          <h2 id="help-modal-title" className="font-serif text-2xl text-[#713C48] font-bold">
            Como criar uma nova página?
          </h2>
          <p className="text-xs text-[#302B2D]/70">
            Você pode criar experiências personalizadas de duas formas no sistema Feito de Nós:
          </p>
        </div>

        {/* Option 1: A partir de um Pedido */}
        <div className="bg-white border-2 border-[#713C48]/30 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 bg-[#713C48] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
            Recomendado
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#C96E5A]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#713C48]">
                1. A partir de um Pedido existente
              </h3>
              <p className="text-[11px] text-[#302B2D]/70">
                O fluxo natural de produção dos presentes encomendados pelos clientes.
              </p>
            </div>
          </div>

          <ul className="text-xs text-[#302B2D]/80 space-y-1.5 pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Importa automaticamente o nome do homenageado, frases e estilo visual.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Vincula o código do pedido (FN-XXXX) ao link da experiência e ao QR Code.</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/admin/pedidos"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#713C48] hover:text-[#592F39] hover:underline"
            >
              <span>Ir para a Lista de Pedidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Option 2: Página Avulsa */}
        <div className="bg-white border border-[#713C48]/15 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] border border-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#C96E5A]" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#713C48]">
                2. Criar Página Avulsa / Demonstração
              </h3>
              <p className="text-[11px] text-[#302B2D]/70">
                Para amostras de portfólio, testes de design ou presentes diretos.
              </p>
            </div>
          </div>

          <ul className="text-xs text-[#302B2D]/80 space-y-1.5 pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 flex-shrink-0 mt-0.5" />
              <span>Cria uma nova experiência do zero sem necessidade de vincular a um cliente.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 flex-shrink-0 mt-0.5" />
              <span>Permite publicação e geração de QR Code independentes.</span>
            </li>
          </ul>

          <div className="pt-2">
            <Link
              href="/admin/paginas/nova"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C96E5A] hover:text-[#713C48] hover:underline"
            >
              <span>Criar Página Avulsa Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
