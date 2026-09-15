'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventRow, EventGuestRow } from '@/types/invitation';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Download,
  Copy,
  Check,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  QrCode,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface GuestsManagementClientProps {
  event: EventRow;
  initialGuests: EventGuestRow[];
}

export function GuestsManagementClient({
  event,
  initialGuests,
}: GuestsManagementClientProps) {
  const [guests, setGuests] = useState<EventGuestRow[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New Guest Form State
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestMaxCompanions, setNewGuestMaxCompanions] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      !searchTerm ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.phone && g.phone.includes(searchTerm)) ||
      (g.token && g.token.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || g.attendance_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const confirmedCount = guests.filter((g) => g.attendance_status === 'confirmed').length;
  const declinedCount = guests.filter((g) => g.attendance_status === 'declined').length;
  const pendingCount = guests.filter((g) => g.attendance_status === 'pending').length;
  const companionsTotal = guests
    .filter((g) => g.attendance_status === 'confirmed')
    .reduce((sum, g) => sum + (g.companions_count || 0), 0);
  const totalAttendingPeople = confirmedCount + companionsTotal;

  // Copy individual guest link
  const handleCopyLink = async (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/convite/${event.slug}/convidado/${token}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2500);
    } catch {
      // Fallback
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const headers = [
      'Nome',
      'Telefone',
      'Status RSVP',
      'Acompanhantes Confirmados',
      'Limite Acompanhantes',
      'Restrições Alimentares',
      'Recado',
      'Check-in Realizado?',
      'Link Individual',
    ];

    const rows = guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.phone || ''}"`,
      `"${g.attendance_status}"`,
      g.companions_count,
      g.max_companions,
      `"${(g.dietary_restrictions || '').replace(/"/g, '""')}"`,
      `"${(g.note || '').replace(/"/g, '""')}"`,
      g.checked_in_at ? 'Sim' : 'Não',
      `"${origin}/convite/${event.slug}/convidado/${g.token}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `convidados-${event.slug}-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Guest
  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/events/${event.id}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGuestName.trim(),
          phone: newGuestPhone.trim() || null,
          max_companions: Number(newGuestMaxCompanions),
          attendance_status: 'pending',
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.guest) {
        throw new Error(resData.error || 'Erro ao adicionar convidado');
      }

      setGuests((prev) => [...prev, resData.guest]);
      setNewGuestName('');
      setNewGuestPhone('');
      setIsAddingGuest(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Guest
  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Deseja realmente remover este convidado da lista?')) return;

    try {
      const res = await fetch(`/api/admin/events/${event.id}/guests?guestId=${guestId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setGuests((prev) => prev.filter((g) => g.id !== guestId));
      }
    } catch (err) {
      console.error('Error deleting guest:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/convites"
            className="p-2 rounded-xl bg-white border border-[#713C48]/15 hover:bg-slate-50 transition-colors text-[#713C48]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-[#713C48] font-bold">
              Gestão de Convidados & RSVP
            </h1>
            <p className="text-xs text-[#302B2D]/70 font-mono">
              {event.title} • /convite/{event.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/convites/${event.id}/check-in`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors border border-emerald-200"
          >
            <QrCode className="w-4 h-4" />
            <span>Abrir Check-in Portaria</span>
          </Link>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingGuest(!isAddingGuest)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48] text-white hover:bg-[#5a2e39] text-xs font-semibold transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Convidado</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Total na Lista
          </span>
          <span className="font-serif text-2xl font-bold text-slate-800">
            {guests.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block">
            Confirmados
          </span>
          <span className="font-serif text-2xl font-bold text-emerald-700">
            {confirmedCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-blue-600 block">
            Acompanhantes
          </span>
          <span className="font-serif text-2xl font-bold text-blue-700">
            +{companionsTotal}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-purple-600 block">
            Total Pessoas
          </span>
          <span className="font-serif text-2xl font-bold text-purple-700">
            {totalAttendingPeople}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Pendentes
          </span>
          <span className="font-serif text-2xl font-bold text-slate-500">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Add Guest Form (Collapsible) */}
      {isAddingGuest && (
        <form
          onSubmit={handleCreateGuest}
          className="bg-white rounded-3xl p-6 border border-[#713C48]/20 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200"
        >
          <h3 className="font-serif text-base font-bold text-[#713C48]">
            Cadastrar Novo Convidado / Família
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Convidado / Família *
              </label>
              <input
                type="text"
                placeholder="Ex: Titios Pedro e Mariana"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp (opcional)
              </label>
              <input
                type="tel"
                placeholder="11999999999"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Limite de Acompanhantes
              </label>
              <select
                value={newGuestMaxCompanions}
                onChange={(e) => setNewGuestMaxCompanions(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num === 0 ? 'Somente o titular' : `Até ${num} acompanhante${num > 1 ? 's' : ''}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingGuest(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#713C48] text-white text-xs font-bold hover:bg-[#5a2e39] transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>Salvar Convidado</span>
            </button>
          </div>
        </form>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar por nome, telefone ou token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
        >
          <option value="all">Todos os Status</option>
          <option value="confirmed">Confirmados</option>
          <option value="declined">Recusados</option>
          <option value="pending">Pendentes</option>
        </select>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Convidado</th>
                <th className="px-4 py-3.5">Status RSVP</th>
                <th className="px-4 py-3.5">Acompanhantes</th>
                <th className="px-4 py-3.5">Check-in</th>
                <th className="px-4 py-3.5">Link Individual</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    Nenhum convidado encontrado.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => {
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>Pendente</span>
                    </span>
                  );
                  if (g.attendance_status === 'confirmed') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmado</span>
                      </span>
                    );
                  } else if (g.attendance_status === 'declined') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                        <XCircle className="w-3 h-3" />
                        <span>Recusado</span>
                      </span>
                    );
                  }

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & details */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-sm">
                          {g.name}
                        </div>
                        {g.phone && (
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {g.phone}
                          </div>
                        )}
                        {g.dietary_restrictions && (
                          <div className="text-amber-700 text-[11px] mt-0.5">
                            Restrição: {g.dietary_restrictions}
                          </div>
                        )}
                        {g.note && (
                          <div className="text-slate-500 italic text-[11px] mt-0.5 truncate max-w-xs">
                            &quot;{g.note}&quot;
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">{statusBadge}</td>

                      {/* Companions */}
                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-700">
                          {g.companions_count} / {g.max_companions}
                        </span>
                      </td>

                      {/* Check-in */}
                      <td className="px-4 py-4">
                        {g.checked_in_at ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>
                              {new Date(g.checked_in_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Pendente</span>
                        )}
                      </td>

                      {/* Token Link */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(g.token)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors font-mono text-[11px]"
                          title="Copiar link com token individual"
                        >
                          {copiedToken === g.token ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>/{g.token}</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(g.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Excluir da lista"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
