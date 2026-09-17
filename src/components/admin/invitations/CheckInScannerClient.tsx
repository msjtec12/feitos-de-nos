'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventRow, EventGuestRow } from '@/types/invitation';
import {
  ArrowLeft,
  QrCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Loader2,
  Check,
  Undo2,
  Camera,
} from 'lucide-react';

interface CheckInScannerClientProps {
  event: EventRow;
  initialGuests: EventGuestRow[];
  apiBasePath?: string;
  backHref?: string;
}

export function CheckInScannerClient({
  event,
  initialGuests,
  apiBasePath = '/api/admin/events',
  backHref,
}: CheckInScannerClientProps) {
  const [guests, setGuests] = useState<EventGuestRow[]>(initialGuests);
  const [inputToken, setInputToken] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckInResult, setLastCheckInResult] = useState<{
    guest: EventGuestRow;
    isDuplicate?: boolean;
    undone?: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Statistics
  const checkedInCount = guests.filter((g) => g.checked_in_at).length;
  const totalGuests = guests.length;

  // Filtered by name search
  const filteredCandidates = searchName.trim()
    ? guests.filter((g) => g.name.toLowerCase().includes(searchName.toLowerCase()))
    : [];

  const handlePerformCheckIn = async (identifier: { token?: string; guestId?: string }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${apiBasePath}/${event.id}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: identifier.token,
          guestId: identifier.guestId,
          action: 'check_in',
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.guest) {
        throw new Error(resData.error || 'Convidado não localizado');
      }

      const updatedGuest: EventGuestRow = resData.guest;
      const wasAlreadyCheckedIn = guests.find(
        (g) => g.id === updatedGuest.id && g.checked_in_at
      );

      setGuests((prev) =>
        prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g))
      );
      setLastCheckInResult({
        guest: updatedGuest,
        isDuplicate: Boolean(resData.isDuplicate || wasAlreadyCheckedIn),
      });

      // Clear search inputs
      setInputToken('');
      setSearchName('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao realizar check-in';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndoCheckIn = async (guestId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBasePath}/${event.id}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          action: 'undo',
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.guest) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? resData.guest : g))
        );
        setLastCheckInResult({
          guest: resData.guest,
          undone: true,
        });
      }
    } catch (err) {
      console.error('Error undoing check-in:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref || `/admin/convites/${event.id}/convidados`}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl text-[#713C48] font-bold">
              Check-in no Dia do Evento
            </h1>
            <p className="text-xs text-slate-500">{event.title}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Entradas
          </span>
          <span className="font-serif text-xl font-bold text-emerald-700">
            {checkedInCount} / {totalGuests}
          </span>
        </div>
      </div>

      {/* Result Card (Celebratory Confirmation or Warning) */}
      {lastCheckInResult && (
        <div
          className={`p-5 rounded-3xl border shadow-sm space-y-3 animate-in zoom-in-95 duration-200 ${
            lastCheckInResult.undone
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : lastCheckInResult.isDuplicate
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  lastCheckInResult.undone
                    ? 'bg-amber-100 text-amber-800'
                    : lastCheckInResult.isDuplicate
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {lastCheckInResult.undone ? (
                  <Undo2 className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider block">
                  {lastCheckInResult.undone
                    ? 'Check-in Desfeito'
                    : lastCheckInResult.isDuplicate
                    ? 'Atenção: Já realizou entrada!'
                    : 'Entrada Confirmada!'}
                </span>
                <h3 className="font-serif text-lg font-bold">
                  {lastCheckInResult.guest.name}
                </h3>
              </div>
            </div>

            {!lastCheckInResult.undone && (
              <button
                type="button"
                onClick={() => handleUndoCheckIn(lastCheckInResult.guest.id)}
                className="text-xs text-slate-500 hover:text-slate-800 underline p-1"
              >
                Desfazer
              </button>
            )}
          </div>

          <div className="text-xs space-y-1 pt-1 border-t border-black/5">
            <p>
              <strong>Acompanhantes:</strong>{' '}
              {lastCheckInResult.guest.companions_count > 0
                ? `+ ${lastCheckInResult.guest.companions_count} pessoa(s)`
                : 'Titular único'}
            </p>
            {lastCheckInResult.guest.dietary_restrictions && (
              <p className="text-amber-800">
                <strong>Restrições:</strong>{' '}
                {lastCheckInResult.guest.dietary_restrictions}
              </p>
            )}
            {lastCheckInResult.guest.checked_in_at && (
              <p className="text-slate-500 text-[11px]">
                Horário do registro:{' '}
                {new Date(lastCheckInResult.guest.checked_in_at).toLocaleTimeString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mode 1: QR Code Token Input */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#713C48] flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#C96E5A]" />
            <span>Leitura por Token / QR Code</span>
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputToken.trim()) {
              handlePerformCheckIn({ token: inputToken.trim() });
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Digite ou cole o token do QR Code..."
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputToken.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#713C48] text-white text-xs font-bold hover:bg-[#5a2e39] transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Validar</span>}
          </button>
        </form>
      </div>

      {/* Mode 2: Guest Search by Name with 1-touch Check-in */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-[#713C48] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#C96E5A]" />
          <span>Busca Rápida por Nome</span>
        </h3>

        <div className="relative">
          <input
            type="text"
            placeholder="Comece a digitar o nome do convidado..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
          />
        </div>

        {/* Candidate list */}
        {filteredCandidates.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 max-h-80 overflow-y-auto">
            {filteredCandidates.map((g) => {
              const isAlreadyCheckedIn = Boolean(g.checked_in_at);

              return (
                <div
                  key={g.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="font-serif font-bold text-sm text-slate-800 block truncate">
                      {g.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {g.companions_count > 0 ? `+${g.companions_count} acompanhante(s)` : 'Sem acompanhantes'}
                      {g.phone ? ` • ${g.phone}` : ''}
                    </span>
                  </div>

                  {isAlreadyCheckedIn ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Entrou</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handlePerformCheckIn({ guestId: g.id })}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                    >
                      Confirmar Entrada
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
