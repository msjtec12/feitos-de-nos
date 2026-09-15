'use client';

import React, { useState } from 'react';
import { EventRow, EventGuestRow, EventThemeConfig, ConfirmationEffect } from '@/types/invitation';
import {
  CheckCircle2,
  XCircle,
  Users,
  Utensils,
  MessageSquare,
  Loader2,
  AlertCircle,
  Sparkles,
  Heart,
  PartyPopper,
} from 'lucide-react';
import { ThemeDecorationBadge } from './ThemeDecorations';

interface RsvpExperienceProps {
  event: EventRow;
  guest?: EventGuestRow | null;
  themeConfig: EventThemeConfig;
}

export function RsvpExperience({ event, guest, themeConfig }: RsvpExperienceProps) {
  const [name, setName] = useState(guest?.name || '');
  const [phone, setPhone] = useState(guest?.phone || '');
  const [attendance, setAttendance] = useState<'confirmed' | 'declined'>(
    guest?.attendance_status === 'declined' ? 'declined' : 'confirmed'
  );
  const [companionsCount, setCompanionsCount] = useState<number>(
    guest?.companions_count || 0
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    guest?.dietary_restrictions || ''
  );
  const [note, setNote] = useState(guest?.note || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(
    guest ? guest.attendance_status !== 'pending' : false
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';
  const confirmationEffect: ConfirmationEffect = themeConfig.confirmationEffect || 'confetti-burst';

  const maxCompanionsAllowed = guest?.max_companions ?? 5;

  const isDeadlinePassed = event.rsvp_deadline
    ? new Date(event.rsvp_deadline).getTime() < Date.now()
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome para confirmar presença.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/convites/${event.slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: guest?.token || null,
          name: name.trim(),
          phone: phone.trim() || null,
          attendance,
          companionsCount: attendance === 'confirmed' ? Number(companionsCount) : 0,
          dietaryRestrictions: dietaryRestrictions.trim() || null,
          note: note.trim() || null,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Erro ao registrar confirmação.');
      }

      setIsSuccess(true);
      if (attendance === 'confirmed') {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao conectar com o servidor.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="max-w-xl mx-auto px-4 py-8 space-y-6 relative">
      {/* Celebration Overlay Effect */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="text-center animate-in zoom-in-50 duration-500 p-6 rounded-3xl bg-white/90 shadow-2xl border-2 border-emerald-400 backdrop-blur-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <PartyPopper className="w-9 h-9 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-black" style={{ color: primaryColor }}>
              Presença Confirmada! 🎉
            </h3>
            <p className="text-xs text-[#302B2D]/80 mt-1">
              Mal podemos esperar para celebrar com você!
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span
            className="text-[11px] uppercase tracking-widest font-extrabold"
            style={{ color: accentColor }}
          >
            Confirmação de Presença
          </span>
          <h3
            className="font-serif text-2xl sm:text-3xl font-bold"
            style={{ color: primaryColor }}
          >
            Você vai comemorar conosco?
          </h3>
          {event.rsvp_deadline && (
            <p className="text-xs text-[#302B2D]/70">
              Favor confirmar até{' '}
              {new Date(event.rsvp_deadline).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
              })}
            </p>
          )}
        </div>

        {isDeadlinePassed && !isSuccess && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm text-center">
            O prazo limite para confirmação de presença encerrou em{' '}
            {new Date(event.rsvp_deadline!).toLocaleDateString('pt-BR')}. Se precisar confirmar, contate os anfitriões diretamente.
          </div>
        )}

        {/* Success State */}
        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-[#FAF3EC] border border-[#713C48]/10 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {attendance === 'confirmed' ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Heart className="w-6 h-6 text-rose-500" />
              )}
            </div>

            <h4 className="font-serif text-xl font-bold" style={{ color: primaryColor }}>
              {attendance === 'confirmed'
                ? 'Presença Confirmada com Sucesso!'
                : 'Agradecemos por nos avisar!'}
            </h4>

            <p className="text-xs sm:text-sm text-[#302B2D]/80 leading-relaxed max-w-sm mx-auto">
              {attendance === 'confirmed'
                ? `Que alegria, ${name}! Sua confirmação foi registrada com carinho para ${event.title}.`
                : `Sentiremos sua falta no grande dia, ${name}. Agradecemos o carinho por nos avisar com antecedência.`}
            </p>

            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="text-xs text-[#713C48] underline pt-2 hover:opacity-80"
            >
              Deseja alterar sua resposta?
            </button>
          </div>
        ) : (
          /* RSVP Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Attendance Choice Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttendance('confirmed')}
                className={
                  'flex items-center justify-center gap-2 p-3.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all ' +
                  (attendance === 'confirmed'
                    ? 'bg-[#15803D] text-white shadow-sm ring-2 ring-[#15803D]/30'
                    : 'bg-[#FFF8F0] text-[#302B2D]/80 border border-black/5 hover:bg-[#FAF3EC]')
                }
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sim, eu vou!</span>
              </button>

              <button
                type="button"
                onClick={() => setAttendance('declined')}
                className={
                  'flex items-center justify-center gap-2 p-3.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all ' +
                  (attendance === 'declined'
                    ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-700/30'
                    : 'bg-[#FFF8F0] text-[#302B2D]/80 border border-black/5 hover:bg-[#FAF3EC]')
                }
              >
                <XCircle className="w-4 h-4" />
                <span>Não poderei ir</span>
              </button>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#302B2D]/80 block">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Clara Santos"
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#302B2D]/80 block">
                WhatsApp / Celular
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all"
              />
            </div>

            {/* Companions Count (Only if confirmed) */}
            {attendance === 'confirmed' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#302B2D]/80 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#C96E5A]" />
                    <span>Acompanhantes adicionais</span>
                  </span>
                  <span className="text-[11px] text-[#302B2D]/60">
                    Máx: {maxCompanionsAllowed}
                  </span>
                </label>
                <select
                  value={companionsCount}
                  onChange={(e) => setCompanionsCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all"
                >
                  {Array.from({ length: maxCompanionsAllowed + 1 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i === 0 ? 'Apenas eu (0 acompanhantes)' : `+${i} acompanhante${i > 1 ? 's' : ''}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dietary Restrictions (Only if confirmed) */}
            {attendance === 'confirmed' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#302B2D]/80 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#C96E5A]" />
                  <span>Restrições alimentares ou alergias (opcional)</span>
                </label>
                <input
                  type="text"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="Ex: Vegetariano, intolerância a glúten, etc."
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all"
                />
              </div>
            )}

            {/* Note for hosts */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#302B2D]/80 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#C96E5A]" />
                <span>Recado com carinho para os anfitriões (opcional)</span>
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Deixe uma mensagem especial..."
                className="w-full px-4 py-2.5 rounded-2xl border border-black/10 bg-[#FFF8F0]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]/30 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando sua confirmação...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {attendance === 'confirmed'
                      ? 'Confirmar Minha Presença'
                      : 'Enviar Justificativa'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
