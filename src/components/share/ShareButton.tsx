"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
}

export function ShareButton({
  title = "Meu Primeiro Ano — Matheus Akira | Feito de Nós",
  text = "Veja a história especial criada para celebrar o primeiro ano do Matheus Akira.",
  url,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // Se o navegador suporta Web Share API (celulares modernos)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Usuário cancelou ou navegador rejeitou o compartilhamento nativo; segue para cópia
        if ((err as Error).name === "AbortError") {
          return;
        }
      }
    }

    // Fallback amigável: Copiar link para área de transferência
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setFeedbackMessage("Link do presente copiado com sucesso!");
        setTimeout(() => {
          setCopied(false);
          setFeedbackMessage(null);
        }, 3000);
      }
    } catch {
      // Tratamento silencioso e elegante caso a permissão seja bloqueada
      setCopied(true);
      setFeedbackMessage("Copie o endereço da barra do navegador para enviar!");
      setTimeout(() => {
        setCopied(false);
        setFeedbackMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white border border-brand-rose/40 text-brand-wine font-medium text-sm sm:text-base shadow-xs hover:bg-brand-cream hover:border-brand-rose active:scale-98 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-wine/20 cursor-pointer"
        aria-label="Compartilhar esta história ou copiar link do presente"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span className="text-emerald-700 font-semibold">Link copiado!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-brand-terracotta" />
            <span>Compartilhar esta história</span>
          </>
        )}
      </button>

      {/* Mensagem de Feedback Acessível */}
      <div
        role="status"
        aria-live="polite"
        className="h-5 text-center"
      >
        {feedbackMessage && (
          <p className="text-xs text-brand-terracotta font-medium animate-fade-in">
            {feedbackMessage}
          </p>
        )}
      </div>
    </div>
  );
}
