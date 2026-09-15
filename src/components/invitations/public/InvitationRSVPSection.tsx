'use client';

import React, { useState } from 'react';
import { EventRow, EventGuestRow, EventThemeConfig } from '@/types/invitation';
import {
  CheckCircle2,
  XCircle,
  Users,
  Utensils,
  MessageSquare,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface InvitationRSVPSectionProps {
  event: EventRow;
  guest?: EventGuestRow | null;
  themeConfig: EventThemeConfig;
}

export function InvitationRSVPSection({
  event,
  guest,
  themeConfig,
}: InvitationRSVPSectionProps) {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  const maxCompanionsAllowed = guest?.max_companions ?? 5;

  // Deadline calculation
  const isDeadlinePassed = event.rsvp_deadline
    ? new Date(event.rsvp_deadline).getTime() < Date.now()
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome para a confirmação.');
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
        throw new Error(resData.error || 'Erro ao registrar sua confirmação.');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação com o servidor.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 space-y-6">
        {/* Section Header */}
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
            O prazo limite para confirmação de presença foi encerrado em{' '}
            {new Date(event.rsvp_deadline!).toLocaleDateString('pt-BR')}. Caso precise de auxílio, entre em contato diretamente com os anfitriões.
          </div>
        )}

        {/* Success State */}
        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-[#FAF3EC] border border-[#713C48]/10 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4
              className="font-serif text-xl font-bold"
              style={{ color: primaryColor }}
            >
              {attendance === 'confirmed'
                ? 'Presença Confirmada com Sucesso!'
                : 'Resposta Registrada'}
            </h4>
            <p className="text-xs sm:text-sm text-[#302B2D]/80 leading-relaxed max-w-sm mx-auto">
              {attendance === 'confirmed'
                ? `Que alegria ter você conosco, ${name}! Seu lugar está reservado.`
                : `Agradecemos por nos avisar, ${name}. Sentiremos sua falta nessa comemoração!`}
            </p>
            {guest && (
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs text-[#713C48] underline pt-2"
              >
                Alterar minha resposta
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Attendance Toggle */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setAttendance('confirmed')}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  attendance === 'confirmed'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sim, eu vou!</span>
              </button>

              <button
                type="button"
                onClick={() => setAttendance('declined')}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  attendance === 'declined'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs ring-2 ring-rose-500'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Não poderei ir</span>
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-[#713C48] mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como gostaria de ser identificado(a)?"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>

            {/* If Confirmed, show companion count and dietary options */}
            {attendance === 'confirmed' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#713C48] mb-1">
                    Número de Acompanhantes (além de você)
                  </label>
                  <select
                    value={companionsCount}
                    onChange={(e) => setCompanionsCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  >
                    {Array.from({ length: maxCompanionsAllowed + 1 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? 'Somente eu' : `+ ${i} acompanhante${i > 1 ? 's' : ''}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#713C48] mb-1">
                    Restrições Alimentares ou Alergias (opcional)
                  </label>
                  <input
                    type="text"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="Ex: Vegetariano, intolerância a lactose, celíaco"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </>
            )}

            {/* Note to hosts */}
            <div>
              <label className="block text-xs font-semibold text-[#713C48] mb-1">
                Deixar um Recado aos Anfitriões (opcional)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Envie uma mensagem de carinho..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isDeadlinePassed}
              className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <span>Confirmar Resposta</span>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
