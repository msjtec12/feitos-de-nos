'use client';

import React, { useState } from 'react';
import { EventGuestbookMessageRow, EventThemeConfig } from '@/types/invitation';
import { Heart, MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';

interface InvitationGuestbookProps {
  eventId: string;
  slug: string;
  messages: EventGuestbookMessageRow[];
  themeConfig: EventThemeConfig;
}

export function InvitationGuestbook({
  eventId,
  slug,
  messages: initialMessages,
  themeConfig,
}: InvitationGuestbookProps) {
  const [messages, setMessages] = useState<EventGuestbookMessageRow[]>(initialMessages || []);
  const [authorName, setAuthorName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    setIsSending(true);
    try {
      // Create local optimistic message
      const optimisticMsg: EventGuestbookMessageRow = {
        id: `local-${Date.now()}`,
        event_id: eventId,
        guest_name: authorName.trim(),
        message: messageText.trim(),
        moderation_status: 'approved',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [optimisticMsg, ...prev]);
      setAuthorName('');
      setMessageText('');
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    } catch (err) {
      console.error('Error posting message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-1">
        <span
          className="text-[11px] uppercase tracking-widest font-extrabold"
          style={{ color: accentColor }}
        >
          Carinho & Afeto
        </span>
        <h3
          className="font-serif text-2xl sm:text-3xl font-bold"
          style={{ color: primaryColor }}
        >
          Mural de Recados
        </h3>
        <p className="text-xs text-[#302B2D]/70">
          Deixe uma mensagem especial para guardar com carinho
        </p>
      </div>

      {/* Messages List */}
      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-black/5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#1E293B]">
                  {item.guest_name}
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              </div>
              <p className="text-xs sm:text-sm text-[#302B2D]/80 leading-relaxed font-light italic">
                “{item.message}”
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 text-center border border-black/5 text-xs text-[#302B2D]/60 italic">
          Seja o primeiro a deixar um recado afetuoso!
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-black/5 space-y-3"
      >
        <h4 className="font-serif font-bold text-sm text-[#1E293B] flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
          <span>Escrever um recado</span>
        </h4>

        {sentSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium">
            Seu recado foi adicionado ao mural com carinho!
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Seu nome"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        <div>
          <textarea
            rows={2}
            placeholder="Sua mensagem..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Recado</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
