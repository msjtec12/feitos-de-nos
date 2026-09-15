'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventRow, InvitationPlanId, EventStatus } from '@/types/invitation';
import {
  Sparkles,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Users,
  QrCode,
  Copy,
  Check,
  Calendar,
  MapPin,
  Heart,
  Eye,
} from 'lucide-react';

interface EventsListClientProps {
  initialEvents: EventRow[];
}

const STATUS_LABELS: Record<EventStatus, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700' },
  awaiting_content: { label: 'Aguardando Conteúdo', color: 'bg-amber-100 text-amber-800' },
  in_production: { label: 'Em Produção', color: 'bg-blue-100 text-blue-800' },
  awaiting_approval: { label: 'Aguardando Aprovação', color: 'bg-purple-100 text-purple-800' },
  published: { label: 'Publicado', color: 'bg-emerald-100 text-emerald-800' },
  completed: { label: 'Concluído', color: 'bg-teal-100 text-teal-800' },
  expired: { label: 'Expirado', color: 'bg-rose-100 text-rose-800' },
  unpublished: { label: 'Despublicado', color: 'bg-stone-100 text-stone-700' },
  archived: { label: 'Arquivado', color: 'bg-zinc-100 text-zinc-600' },
};

const PLAN_LABELS: Record<InvitationPlanId, { label: string; badgeColor: string }> = {
  essencial: { label: 'Essencial', badgeColor: 'border-slate-300 text-slate-700' },
  interativo: { label: 'Interativo', badgeColor: 'border-[#C96E5A] text-[#C96E5A] bg-[#C96E5A]/10' },
  completo: { label: 'Evento Completo (VIP)', badgeColor: 'border-[#713C48] text-[#713C48] bg-[#713C48]/10' },
};

export function EventsListClient({ initialEvents }: EventsListClientProps) {
  const [events, setEvents] = useState<EventRow[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      !searchTerm ||
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.host_names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.honoree_name && ev.honoree_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    const matchesPlan = planFilter === 'all' || ev.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleCopyLink = async (slug: string, id: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/convite/${slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#713C48] font-bold flex items-center gap-2">
            <span>Eventos e Convites</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#C96E5A]/15 text-[#C96E5A]">
              {events.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#302B2D]/75 mt-1">
            Gerencie convites digitais, confirmações de presença (RSVP) e check-in de portaria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/convites/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#713C48] text-white text-xs sm:text-sm font-semibold hover:bg-[#5a2e39] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Convite</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#713C48]/10 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, homenageado, anfitriões ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        {/* Status */}
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Publicados</option>
            <option value="in_production">Em Produção</option>
            <option value="awaiting_content">Aguardando Conteúdo</option>
            <option value="draft">Rascunhos</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>

        {/* Plan */}
        <div className="w-full md:w-auto">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          >
            <option value="all">Todos os Planos</option>
            <option value="essencial">Essencial</option>
            <option value="interativo">Interativo</option>
            <option value="completo">Evento Completo (VIP)</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#713C48]/10 space-y-3">
          <Heart className="w-10 h-10 mx-auto text-[#C96E5A]/50" />
          <h3 className="font-serif text-lg font-bold text-[#713C48]">
            Nenhum convite encontrado
          </h3>
          <p className="text-xs text-[#302B2D]/70 max-w-sm mx-auto">
            Tente ajustar os filtros ou crie um novo convite para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map((event) => {
            const statusConfig = STATUS_LABELS[event.status] || STATUS_LABELS.draft;
            const planConfig = PLAN_LABELS[event.plan] || PLAN_LABELS.interativo;
            const eventDateFormatted = new Date(event.event_date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#713C48]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${planConfig.badgeColor}`}
                    >
                      {planConfig.label}
                    </span>

                    <span className="text-xs text-[#302B2D]/50 font-mono">
                      /{event.slug}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#713C48]">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#302B2D]/75">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C96E5A]" />
                      {eventDateFormatted}
                    </span>

                    {event.venue_name && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C96E5A]" />
                        {event.venue_name}
                      </span>
                    )}

                    <span>
                      <strong>Anfitriões:</strong> {event.host_names}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Public Link */}
                  <Link
                    href={`/convite/${event.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                    title="Visualizar convite público"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </Link>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={() => handleCopyLink(event.slug, event.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                    title="Copiar link do convite"
                  >
                    {copiedId === event.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </>
                    )}
                  </button>

                  {/* Guests */}
                  <Link
                    href={`/admin/convites/${event.id}/convidados`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#C96E5A]/10 text-[#C96E5A] hover:bg-[#C96E5A]/20 text-xs font-semibold transition-colors"
                    title="Gerenciar lista de convidados e RSVP"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Convidados</span>
                  </Link>

                  {/* Check-in */}
                  <Link
                    href={`/admin/convites/${event.id}/check-in`}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                    title="Leitor de check-in para o dia da festa"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Check-in</span>
                  </Link>

                  {/* Edit */}
                  <Link
                    href={`/admin/convites/${event.id}/editar`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#713C48] text-white hover:bg-[#5a2e39] text-xs font-semibold transition-colors shadow-xs"
                    title="Editar informações e fotos"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
