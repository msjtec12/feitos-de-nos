'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GiftPageRow } from '@/types/database';
import { QRCodeModal } from '@/components/admin/QRCodeModal';

interface GiftPagesClientListProps {
  pages: GiftPageRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  currentSearch?: string;
  currentStatus?: string;
}

export default function GiftPagesClientList({
  pages,
  totalCount,
  page,
  pageSize,
  totalPages,
  currentSearch = '',
  currentStatus = 'all',
}: GiftPagesClientListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  // QR Code Modal
  const [selectedQrPage, setSelectedQrPage] = useState<GiftPageRow | null>(null);

  const applyFilters = (search: string, status: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (status && status !== 'all') params.set('status', status);
    params.set('page', '1');
    router.push(`/admin/paginas?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(searchTerm, selectedStatus);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    applyFilters(searchTerm, status);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedStatus && selectedStatus !== 'all') params.set('status', selectedStatus);
    params.set('page', newPage.toString());
    router.push(`/admin/paginas?${params.toString()}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#713C48]/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-[#713C48] font-bold">Páginas de Experiências</h1>
          <p className="text-sm text-[#2C2224]/70 mt-1">
            Gerencie, publique, personalize e acompanhe os links e QR Codes de cada presente.
          </p>
        </div>

        <Link
          href="/admin/paginas/nova"
          className="px-5 py-2.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>✨</span> Nova Página Avulsa
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#713C48]/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título ou presenteado..."
            className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#713C48] text-white text-xs font-medium rounded-xl hover:bg-[#592F39] transition-all"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Status:</span>
          {['all', 'draft', 'published', 'unpublished'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-[#713C48] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'all'
                ? 'Todos'
                : st === 'draft'
                ? 'Rascunhos'
                : st === 'published'
                ? 'Publicados'
                : 'Despublicados'}
            </button>
          ))}
        </div>
      </div>

      {/* Table & Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#713C48]/10 overflow-hidden">
        {pages.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <span className="text-4xl">📄</span>
            <p className="text-base font-serif text-[#713C48] font-bold">Nenhuma página encontrada</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Nenhuma página corresponde aos filtros atuais. Tente limpar os filtros ou crie uma nova página.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FFF8F0] border-b border-[#713C48]/10 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Título / Presenteado</th>
                  <th className="py-3.5 px-4">Pedido Vinculado</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Link Público & Token</th>
                  <th className="py-3.5 px-4">Data Revelação</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pages.map((p) => {
                  const orderInfo = (p as any).orders;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-stone-900 text-sm">{p.title}</div>
                        <div className="text-stone-500 text-xs">
                          Para: <strong className="text-[#713C48]">{p.recipient_name}</strong> •{' '}
                          <span className="capitalize">{p.template_type}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {orderInfo ? (
                          <div>
                            <Link
                              href={`/admin/pedidos/${p.order_id}`}
                              className="font-mono text-[#713C48] font-bold hover:underline"
                            >
                              {orderInfo.code}
                            </Link>
                            <div className="text-stone-500 text-[11px]">{orderInfo.customer_name}</div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Avulso</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            p.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {p.status === 'published'
                            ? 'Publicado'
                            : p.status === 'draft'
                            ? 'Rascunho'
                            : 'Despublicado'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono">
                        <a
                          href={`/p/${p.public_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C96E5A] hover:underline block truncate max-w-[180px]"
                          title={`/p/${p.public_token}`}
                        >
                          /p/{p.public_token.slice(0, 13)}...
                        </a>
                      </td>

                      <td className="py-4 px-4 text-stone-600">
                        {p.reveal_at ? (
                          <span className="text-[#C96E5A] font-medium">
                            {new Date(p.reveal_at).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-stone-400">Imediato</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedQrPage(p)}
                            title="Ver e Baixar QR Code"
                            className="p-1.5 text-stone-600 hover:text-[#713C48] hover:bg-stone-100 rounded-lg transition-all"
                          >
                            📱
                          </button>
                          <Link
                            href={`/admin/paginas/${p.id}/preview`}
                            title="Visualizar Prévia"
                            className="p-1.5 text-stone-600 hover:text-[#713C48] hover:bg-stone-100 rounded-lg transition-all"
                          >
                            👁️
                          </Link>
                          <Link
                            href={`/admin/paginas/${p.id}/editar`}
                            className="px-3 py-1 bg-[#713C48] hover:bg-[#592F39] text-white rounded-lg text-xs font-medium transition-all shadow-sm"
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>
              Total: <strong>{totalCount}</strong> experiências
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
              >
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQrPage && (
        <QRCodeModal
          publicToken={selectedQrPage.public_token}
          recipientName={selectedQrPage.recipient_name}
          giftTitle={selectedQrPage.title}
          onClose={() => setSelectedQrPage(null)}
        />
      )}
    </div>
  );
}
