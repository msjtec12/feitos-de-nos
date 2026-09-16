'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { EventRow, EventGuestRow, EventThemeConfig, ConfirmationEffect } from '@/types/invitation';
import {
  CheckCircle2,
  XCircle,
  Users,
  Utensils,
  MessageSquare,
  Loader2,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { useOptionalInvitationTheme } from './InvitationExperience';
import { getInvitationTheme } from '@/data/invitation-themes';
import { getThemeButtonClass, getThemeCardClass } from '@/lib/invitations/theme-ui';
import { getInvitationThemeCopy } from '@/lib/invitations/theme-copy';

interface RsvpExperienceProps {
  event?: EventRow;
  guest?: EventGuestRow | null;
  themeConfig?: EventThemeConfig;
  initiallyExpanded?: boolean;
  hideCollapsedCta?: boolean;
  expansionSignal?: number;
}

export function RsvpExperience(props: RsvpExperienceProps) {
  const contextValues = useOptionalInvitationTheme();

  const activeTheme = contextValues?.theme || getInvitationTheme(props.themeConfig?.theme_key || props.themeConfig?.themeId || props.themeConfig?.slug);
  const themeConfig = contextValues?.themeConfig || props.themeConfig || activeTheme.config;
  const event = contextValues?.event || props.event;
  const guest = contextValues?.guest ?? props.guest;

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
  const [showForm, setShowForm] = useState(Boolean(props.initiallyExpanded));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const isDino = activeTheme.assetFolder === 'dinosaurs';
  const cardClass = `invitation-themed-card ${getThemeCardClass(activeTheme, 'p-5 sm:p-7')} space-y-4`;
  const buttonClass = getThemeButtonClass(activeTheme);
  const themeCopy = getInvitationThemeCopy(activeTheme);

  useEffect(() => {
    if (props.expansionSignal && props.expansionSignal > 0) {
      setShowForm(true);
    }
  }, [props.expansionSignal]);

  if (!event) return null;

  const isDeadlinePassed = event.rsvp_deadline
    ? new Date(event.rsvp_deadline).getTime() < Date.now()
    : false;

  if (props.hideCollapsedCta && !isSuccess && !showForm) return null;

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
    <section id="rsvp" className="max-w-xl mx-auto px-4 py-6 space-y-6 relative">
      {/* Celebração pós-confirmação com efeito temático */}
      {showCelebration && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="text-center animate-in zoom-in-50 duration-500 p-6 rounded-3xl bg-white/95 shadow-2xl border-2 border-emerald-400 backdrop-blur-md max-w-sm mx-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <PartyPopper className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-black" style={{ color: primaryColor }}>
              Presença Confirmada! 🎉
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              Mal podemos esperar para celebrar com você!
            </p>
          </div>
        </div>
      )}

      {/* Primeiro contato: um CTA forte como na peça gráfica. O formulário
          só aparece depois do toque para manter o convite elegante e leve. */}
      {!isSuccess && !showForm ? (
        <div className="mx-auto max-w-lg space-y-3 text-center">
          <span
            className="block text-[10px] font-black uppercase tracking-[.18em]"
            style={{ color: isDino ? '#15803D' : accentColor }}
          >
            {themeCopy.rsvpKicker}
          </span>

          {isDino ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={isDeadlinePassed}
              className="relative mx-auto flex h-[76px] w-full max-w-md items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Image
                src="/invitations/themes/dinosaurs/wood-button.svg"
                alt=""
                fill
                className="object-contain drop-shadow-[0_12px_18px_rgba(69,43,20,.28)]"
              />
              <span className="relative z-10 text-xl font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.65)] sm:text-2xl">
                Confirmar presença ›
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={isDeadlinePassed}
              className={`w-full px-6 py-4 text-base font-black uppercase tracking-[.08em] transition-transform hover:scale-[1.015] active:scale-[.985] disabled:opacity-50 sm:text-lg ${buttonClass}`}
            >
              Confirmar presença ›
            </button>
          )}

          {isDeadlinePassed && (
            <p className="text-xs font-semibold text-slate-500">O prazo de confirmação foi encerrado.</p>
          )}
        </div>
      ) : !isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={cardClass}>
            <div className="text-center space-y-1">
              <span
                className="text-[11px] uppercase tracking-widest font-extrabold block"
                style={{ color: isDino ? '#15803D' : accentColor }}
              >
                {themeCopy.rsvpKicker}
              </span>
              <h3
                className="text-2xl sm:text-3xl font-bold font-serif"
                style={{ color: primaryColor }}
              >
                {themeCopy.rsvpTitle}
              </h3>
              {event.rsvp_deadline && (
                <p className="text-xs text-slate-500">
                  Favor confirmar até {new Date(event.rsvp_deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
              )}
            </div>

            {/* Alternância: Confirmar ou Recusar */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAttendance('confirmed')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  attendance === 'confirmed'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sim, eu vou!</span>
              </button>

              <button
                type="button"
                onClick={() => setAttendance('declined')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  attendance === 'declined'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Não poderei ir</span>
              </button>
            </div>

            {/* Campo Nome */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Seu Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Clara Silva"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Campo Telefone */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">WhatsApp / Telefone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Acompanhantes se confirmado */}
            {attendance === 'confirmed' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Número de Acompanhantes</span>
                  <span className="text-slate-500 font-normal">Além de você</span>
                </label>
                <select
                  value={companionsCount}
                  onChange={(e) => setCompanionsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value={0}>Apenas eu</option>
                  <option value={1}>+1 acompanhante</option>
                  <option value={2}>+2 acompanhantes</option>
                  <option value={3}>+3 acompanhantes</option>
                  <option value={4}>+4 acompanhantes</option>
                </select>
              </div>
            )}

            {/* Erro */}
            {errorMessage && (
              <p className="text-xs text-rose-600 font-semibold text-center">{errorMessage}</p>
            )}

            {/* BOTÃO PRINCIPAL DE RSVP: ESTILIZADO DE ACORDO COM O TEMA */}
            <div className="pt-2">
              {isDino ? (
                /* Botão de Prancha de Madeira Rústica Entalhada com Veios */
                <button
                  type="submit"
                  disabled={isSubmitting || isDeadlinePassed}
                  className="relative w-full max-w-sm mx-auto h-[62px] flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <Image
                    src="/invitations/themes/dinosaurs/wood-button.svg"
                    alt="Confirmar presença"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-sans font-black text-lg sm:text-xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {isSubmitting ? 'Enviando...' : 'Confirmar presença >'}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isDeadlinePassed}
                  className={`w-full py-3.5 font-black uppercase tracking-wide text-sm hover:opacity-95 active:scale-[.98] transition-all disabled:opacity-50 ${buttonClass}`}
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
                </button>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className={`invitation-themed-card ${getThemeCardClass(activeTheme, 'p-6 sm:p-8')} text-center space-y-3`}>
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-xl font-bold" style={{ color: primaryColor }}>
            {attendance === 'confirmed' ? 'Presença Confirmada!' : 'Resposta Registrada'}
          </h4>
          <p className="text-xs text-slate-600">
            {attendance === 'confirmed'
              ? 'Obrigado por confirmar! Aguardamos você para celebrar juntos.'
              : 'Agradecemos pelo carinho em nos avisar!'}
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline pt-1"
          >
            Alterar minha resposta
          </button>
        </div>
      )}
    </section>
  );
}