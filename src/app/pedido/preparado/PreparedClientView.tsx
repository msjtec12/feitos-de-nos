'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PreparedOrder } from '@/types/order';
import { loadPreparedOrder, buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/order-utils';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Heart,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export function PreparedClientView() {
  const [order, setOrder] = useState<PreparedOrder | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadPreparedOrder();
    setOrder(loaded);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="py-24 text-center text-[#713C48]">
        <div className="w-8 h-8 mx-auto border-3 border-[#713C48] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Carregando dados do pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#713C48]/10 text-[#713C48] flex items-center justify-center">
          <Heart className="w-8 h-8 text-[#C96E5A]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-[#713C48]">
            Nenhum pedido encontrado
          </h2>
          <p className="text-sm text-[#302B2D]/75">
            Parece que você ainda não configurou um presente ou o histórico foi limpo.
          </p>
        </div>
        <Link
          href="/pedido"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md"
        >
          <span>Criar um presente agora</span>
        </Link>
      </div>
    );
  }

  const messageText = buildWhatsAppMessage(order);
  const whatsAppUrl = buildWhatsAppUrl(messageText);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 shadow-sm mb-1">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
          Tudo pronto! Seu pedido foi preparado.
        </h1>
        <p className="text-base text-[#302B2D]/80 max-w-lg mx-auto">
          Agora basta enviar o pedido para o nosso WhatsApp oficial para receber as instruções de envio de fotos e áudios.
        </p>
      </div>

      {/* Order Code Card */}
      <div className="bg-[#FFF8F0] border-2 border-[#713C48]/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#713C48]/10 pb-5">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C96E5A]">
              Código do Pedido
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-[#713C48] tracking-wider">
              {order.code}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-xs text-[#302B2D]/60 block">Valor Total:</span>
            <span className="font-serif text-2xl font-bold text-[#713C48]">
              {order.formattedTotal}
            </span>
          </div>
        </div>

        {/* Primary WhatsApp Action */}
        <div className="space-y-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-base sm:text-lg hover:bg-[#20ba5a] transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            <span>Enviar Pedido para o WhatsApp</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713C48] hover:text-[#5a2e39] py-1 px-3 rounded-lg hover:bg-[#713C48]/5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700">Mensagem copiada com sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar texto do pedido para a área de transferência</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Next Steps Guidance */}
        <div className="bg-white/80 rounded-2xl p-5 border border-[#713C48]/10 space-y-3 text-left">
          <h3 className="font-semibold text-xs sm:text-sm text-[#713C48] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C96E5A]" />
            <span>Próximos Passos Acolhedores:</span>
          </h3>
          <ol className="space-y-2 text-xs sm:text-sm text-[#302B2D]/80">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#713C48]">1.</span>
              <span>Ao abrir o WhatsApp, a mensagem estruturada já estará no campo de texto pronta para enviar.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#713C48]">2.</span>
              <span>Nossa equipe responderá com um roteiro prático e seguro para você enviar as fotos, textos e áudios.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#713C48]">3.</span>
              <span>Você receberá uma prévia completa para aprovar cada detalhe com calma antes da liberação.</span>
            </li>
          </ol>
        </div>

        {/* Message Preview Accordion / Textarea */}
        <div className="space-y-2 text-left">
          <span className="text-xs font-semibold text-[#302B2D]/70 uppercase tracking-wider block">
            Prévia da Mensagem Gerada:
          </span>
          <pre className="p-4 rounded-xl bg-white/60 border border-[#713C48]/15 text-xs text-[#302B2D]/85 whitespace-pre-wrap font-sans leading-relaxed">
            {messageText}
          </pre>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          href="/pedido"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#713C48] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar e editar informações</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#302B2D]/70 hover:text-[#713C48]"
        >
          <span>Ir para a Página Inicial</span>
        </Link>
      </div>
    </div>
  );
}
