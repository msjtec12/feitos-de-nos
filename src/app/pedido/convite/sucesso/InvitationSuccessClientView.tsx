'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { buildWhatsAppUrl } from '@/lib/order-utils';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Smartphone,
} from 'lucide-react';

export function InvitationSuccessClientView() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('codigo') || 'CV-NOVO-PEDIDO';
  const plan = searchParams.get('plano') || 'interativo';
  const slug = searchParams.get('slug') || '';

  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const whatsappMessage = `Olá, equipe Feito de Nós! Acabei de solicitar meu convite interativo (Código: ${orderCode}). Gostaria de dar andamento no envio das fotos e detalhes do evento.`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  return (
    <div className="max-w-2xl w-full bg-[#FFF8F0] rounded-3xl p-6 sm:p-10 border border-[#713C48]/15 shadow-xl text-center space-y-8">
      {/* Icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center ring-8 ring-emerald-50">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest font-extrabold text-[#C96E5A] bg-[#C96E5A]/10 px-3.5 py-1 rounded-full">
          Pedido Recebido com Sucesso!
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#713C48] font-bold">
          Seu convite está em preparação!
        </h1>
        <p className="text-sm sm:text-base text-[#302B2D]/80 leading-relaxed max-w-lg mx-auto">
          Registramos todos os dados do seu evento. O próximo passo é o alinhamento da arte e envio das fotos pelo WhatsApp.
        </p>
      </div>

      {/* Code Box */}
      <div className="bg-white rounded-2xl p-5 border border-[#713C48]/15 inline-flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-md mx-auto">
        <div className="text-left">
          <p className="text-[11px] uppercase tracking-wider text-[#302B2D]/60 font-semibold">
            Código do seu Pedido
          </p>
          <p className="font-mono text-xl font-bold text-[#713C48]">{orderCode}</p>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48]/10 text-[#713C48] text-xs font-semibold hover:bg-[#713C48]/15 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar código</span>
            </>
          )}
        </button>
      </div>

      {/* Next Steps List */}
      <div className="bg-[#FAF3EC] rounded-2xl p-6 text-left border border-[#713C48]/10 space-y-4">
        <h3 className="font-serif text-base font-bold text-[#713C48]">
          Como funciona a partir de agora:
        </h3>
        <ol className="space-y-3 text-xs sm:text-sm text-[#302B2D]/80">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#713C48] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </span>
            <span>
              <strong>Contato pelo WhatsApp:</strong> Nossa equipe entrará em contato ou você pode nos chamar diretamente pelo botão abaixo.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#713C48] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </span>
            <span>
              <strong>Envio das Fotos:</strong> Você nos envia as fotos do aniversariante, casal ou homenageado em alta resolução.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#713C48] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </span>
            <span>
              <strong>Prévia no seu celular:</strong> Você recebe o link exclusivo para testar no seu celular, conferir todos os textos e aprovar antes de enviar aos convidados!
            </span>
          </li>
        </ol>
      </div>

      {/* WhatsApp CTA */}
      <div className="space-y-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-base hover:bg-[#1EBE5D] transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Iniciar Atendimento no WhatsApp</span>
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href={`/app/convite/${slug || 'matheus-akira-1-ano'}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713C48] bg-[#713C48]/8 hover:bg-[#713C48]/15 transition-colors py-2 px-3.5 rounded-xl border border-[#713C48]/15"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Acessar App do Anfitrião</span>
          </Link>

          <span className="hidden sm:inline text-xs text-[#302B2D]/40">•</span>

          <Link
            href="/convite/matheus-akira-1-ano"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713C48] hover:text-[#C96E5A] transition-colors py-2 px-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Ver Exemplo Demo</span>
          </Link>

          <span className="hidden sm:inline text-xs text-[#302B2D]/40">•</span>

          <Link
            href="/"
            className="text-xs font-semibold text-[#302B2D]/70 hover:text-[#713C48] transition-colors py-2 px-3"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
