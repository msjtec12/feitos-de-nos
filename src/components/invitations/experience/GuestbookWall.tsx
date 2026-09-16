'use client';

import React, { useState } from 'react';
import { EventGuestbookMessageRow, EventThemeConfig } from '@/types/invitation';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { getThemeButtonClass, getThemeCardClass } from '@/lib/invitations/theme-ui';
import { getInvitationThemeCopy } from '@/lib/invitations/theme-copy';

interface GuestbookWallProps {
  eventId?: string;
  slug?: string;
  messages?: EventGuestbookMessageRow[];
  themeConfig?: EventThemeConfig;
}

export function GuestbookWall(props: GuestbookWallProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const eventId = contextValues?.event.id || props.eventId || '';
  const slug = contextValues?.event.slug || props.slug || '';
  const messages = props.messages || [];

  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const isDino = activeTheme.assetFolder === 'dinosaurs';

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

  const wallCardClass = `invitation-themed-card ${getThemeCardClass(activeTheme, 'p-6 sm:p-8')} space-y-6`;
  const buttonClass = getThemeButtonClass(activeTheme);
  const themeCopy = getInvitationThemeCopy(activeTheme);

  return (
    <section className="max-w-xl mx-auto px-4 py-4 space-y-4">
      <div className={wallCardClass}>
        {/* Header */}
        <div className="text-center space-y-1">
          <span
            className="text-[11px] uppercase tracking-widest font-extrabold block"
            style={{ color: isDino ? '#15803D' : accentColor }}
          >
            {themeCopy.guestbookKicker}
          </span>
          <h3
            className="font-serif text-2xl sm:text-3xl font-bold"
            style={{ color: primaryColor }}
          >
            {themeCopy.guestbookTitle}
          </h3>
          <p className="text-xs text-slate-500">
            Deixe seus votos especiais para tornar este dia ainda mais inesquecível
          </p>
        </div>

        {/* Formulário de envio */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Seu Nome</label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ex: Titia Cecília"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sua Mensagem</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva seus votos para este dia tão aguardado..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-white"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 font-semibold text-center">{errorMessage}</p>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recado enviado com sucesso!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex w-full items-center justify-center gap-2 py-3 text-xs font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${buttonClass}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Enviando recado...' : 'Publicar no Mural'}</span>
          </button>
        </form>

        {/* Lista de Recados */}
        {messages && messages.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-black/5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
              Recados de Amigos & Família ({messages.length})
            </h4>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {messages.map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{m.guest_name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    &ldquo;{m.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
