'use client';

import React, { useState } from 'react';
import { EventGuestbookMessageRow, EventThemeConfig } from '@/types/invitation';
import { Heart, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface GuestbookWallProps {
  eventId: string;
  slug: string;
  messages: EventGuestbookMessageRow[];
  themeConfig: EventThemeConfig;
}

export function GuestbookWall({
  eventId,
  slug,
  messages,
  themeConfig,
}: GuestbookWallProps) {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const themeSlug = themeConfig.slug || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) {
      setErrorMessage('Por favor, preencha seu nome e sua mensagem.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/convites/${slug}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          guestName: guestName.trim(),
          message: message.trim(),
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Erro ao enviar recado.');
      }

      setIsSuccess(true);
      setGuestName('');
      setMessage('');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Themed card classes
  let cardClasses = 'bg-[#FFF8F0]/70 p-4 rounded-2xl border border-black/5';
  if (themeSlug.includes('heroi')) {
    cardClasses = 'bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_rgba(0,0,0,1)]';
  } else if (themeSlug.includes('bloco')) {
    cardClasses = 'bg-emerald-50/80 p-4 rounded-none border-2 border-emerald-700 shadow-[2px_2px_0px_#15803D]';
  } else if (themeSlug.includes('reino')) {
    cardClasses = 'bg-pink-50/70 p-4 rounded-3xl border border-pink-200 shadow-xs';
  }

  return (
    <section className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span
            className="text-[11px] uppercase tracking-widest font-extrabold"
            style={{ color: accentColor }}
          >
            Mural de Recados
          </span>
          <h3
            className="font-serif text-2xl sm:text-3xl font-bold"
            style={{ color: primaryColor }}
          >
            Mensagens de Carinho
          </h3>
          <p className="text-xs text-[#302B2D]/70">
            Deixe seus votos especiais para tornar este dia ainda mais inesquecível
          </p>
        </div>

        {/* Send message form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Mensagem enviada com carinho! Os anfitriões ficarão radiantes ao ler.
              </span>
            </div>
          )}

          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all"
          />

          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva sua mensagem com carinho..."
            className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all resize-none"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Enviando...' : 'Publicar no Mural'}</span>
          </button>
        </form>

        {/* Existing Messages list */}
        {messages && messages.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-black/5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#302B2D]/60 text-center">
              Recados Recebidos ({messages.length})
            </h4>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {messages.map((item) => (
                <div key={item.id} className={cardClasses}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs" style={{ color: primaryColor }}>
                      {item.guest_name}
                    </span>
                    <span className="text-[10px] text-[#302B2D]/50">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#302B2D]/85 italic">
                    “{item.message}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10px] text-center text-[#302B2D]/50">
          * As mensagens passam por moderação dos anfitriões para preservar o carinho do evento.
        </p>
      </div>
    </section>
  );
}
