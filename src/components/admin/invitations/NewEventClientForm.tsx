'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INVITATION_EVENT_TYPES } from '@/data/invitation-event-types';
import { INVITATION_PLANS_LIST } from '@/data/invitation-plans';
import { INVITATION_AUTHORIAL_THEMES } from '@/data/invitation-themes';
import { InvitationPlanId, InvitationEventType } from '@/types/invitation';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
  Calendar,
  MapPin,
  Heart,
} from 'lucide-react';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function NewEventClientForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [eventType, setEventType] = useState<InvitationEventType>('aniversario-infantil');
  const [plan, setPlan] = useState<InvitationPlanId>('interativo');
  const [hostNames, setHostNames] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('16:00');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [themeId, setThemeId] = useState('infantil-delicado');
  const [openingMessage, setOpeningMessage] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [giftInformation, setGiftInformation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !hostNames.trim() || !eventDate.trim()) {
      setErrorMessage('Preencha os campos obrigatórios (Título, Slug, Anfitriões e Data).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const fullEventDate = `${eventDate}T${eventTime || '16:00'}:00-03:00`;

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          event_type: eventType,
          plan,
          host_names: hostNames.trim(),
          honoree_name: honoreeName.trim() || null,
          event_date: fullEventDate,
          venue_name: venueName.trim() || null,
          address: address.trim() || null,
          theme_id: themeId,
          opening_message: openingMessage.trim() || null,
          dress_code: dressCode.trim() || null,
          gift_information: giftInformation.trim() || null,
          status: 'draft',
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.event) {
        throw new Error(resData.error || 'Erro ao criar evento.');
      }

      router.push(`/admin/convites/${resData.event.id}/editar`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação';
      setErrorMessage(msg);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/convites"
            className="p-2 rounded-xl bg-white border border-[#713C48]/15 hover:bg-slate-50 transition-colors text-[#713C48]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-[#713C48] font-bold">
              Novo Convite / Evento
            </h1>
            <p className="text-xs text-[#302B2D]/70">
              Cadastre as informações básicas e continue no editor interativo.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#713C48]/15 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Título do Convite *
            </label>
            <input
              type="text"
              placeholder="Ex: O Primeiro Aninho do Matheus Akira"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Slug da URL *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                /convite/
              </span>
              <input
                type="text"
                placeholder="matheus-akira-1-ano"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                required
                className="w-full px-3 py-2.5 rounded-r-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Tipo de Celebração *
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as InvitationEventType)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            >
              {INVITATION_EVENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Plano Contratado *
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as InvitationPlanId)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            >
              {INVITATION_PLANS_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.formattedPrice})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Tema Visual *
            </label>
            <select
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            >
              {INVITATION_AUTHORIAL_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Homenageado(a) / Noivos (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Matheus Akira"
              value={honoreeName}
              onChange={(e) => setHonoreeName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Anfitriões (Quem convida) *
            </label>
            <input
              type="text"
              placeholder="Ex: Camila & Lucas"
              value={hostNames}
              onChange={(e) => setHostNames(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Data do Evento *
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Horário de Início *
            </label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Nome do Local (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Espaço Villa Encantada"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Traje / Dress Code (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Esporte fino"
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Endereço Completo (para Google Maps / Waze)
            </label>
            <input
              type="text"
              placeholder="Ex: Alameda das Hortênsias, 420 - Jardim América, São Paulo - SP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Orientações de Presentes / Chave Pix (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Chave Pix ou lista de presentes..."
              value={giftInformation}
              onChange={(e) => setGiftInformation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#713C48] mb-1">
              Mensagem Afetiva dos Anfitriões (opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Recado especial que aparece no convite..."
              value={openingMessage}
              onChange={(e) => setOpeningMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div className="space-y-1">
              <span className="font-semibold block">Não foi possível criar o convite:</span>
              <span className="leading-relaxed block">{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/admin/convites"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#713C48] text-white text-xs font-semibold hover:bg-[#5a2e39] transition-all shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Criando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Criar e Abrir Editor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
