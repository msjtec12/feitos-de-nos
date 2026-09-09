'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GiftPageRow } from '@/types/database';
import { QRCodeModal } from '@/components/admin/QRCodeModal';
import { CreatePageHelpModal } from '@/components/admin/CreatePageHelpModal';
import {
  FileText,
  Search,
  Plus,
  HelpCircle,
  QrCode,
  Eye,
  Edit3,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
} from 'lucide-react';

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

  // Modals state
  const [selectedQrPage, setSelectedQrPage] = useState<GiftPageRow | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('fn_pages_onboarding_dismissed');
    if (!isDismissed) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    localStorage.setItem('fn_pages_onboarding_dismissed', 'true');
    setShowOnboarding(false);
  };

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

  // Helper to calculate experience completion percentage
  const calculateCompleteness = (pageRow: GiftPageRow) => {
    const content = (pageRow.content as any) || {};
    let score = 0;
    let total = 5;

    // 1. Recipient & Title
    if (pageRow.recipient_name && pageRow.title) score += 1;
    // 2. Cover Photo
    if (content.recipient?.featuredImage?.url) score += 1;
    // 3. Timeline Moments
    if (Array.isArray(content.timelineMoments) && content.timelineMoments.length > 0) score += 1;
    // 4. Messages
    if (Array.isArray(content.contributorMessages) && content.contributorMessages.length > 0) score += 1;
    // 5. Gallery or Audio
    if ((Array.isArray(content.galleryItems) && content.galleryItems.length > 0) || content.primaryAudio?.audioUrl) score += 1;

    return Math.round((score / total) * 100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#713C48]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#713C48]/10 text-[#713C48] text-xs font-bold mb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Gestão de Experiências</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#713C48] font-bold">
            Páginas e Histórias Afetivas
          </h1>
          <p className="text-xs sm:text-sm text-[#2C2224]/70 mt-0.5">
            Crie, edite, publique e gere QR Codes para cada presente personalizado.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-[#713C48]/20 bg-white hover:bg-[#FFF8F0] text-[#713C48] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#C96E5A]" />
            <span>Como criar?</span>
          </button>

          <Link
            href="/admin/paginas/nova"
            className="px-5 py-2.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Página Avulsa</span>
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist Banner (Dismissible) */}
      {showOnboarding && (
        <div className="bg-[#FFF8F0] border-2 border-[#713C48]/20 rounded-3xl p-5 sm:p-6 relative shadow-sm animate-in fade-in">
          <button
            type="button"
            onClick={dismissOnboarding}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#713C48]/60 hover:text-[#713C48] hover:bg-black/5 transition-colors"
            title="Dispensar aviso"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#713C48] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-[#FFF8F0]" />
            </div>

            <div className="space-y-2 flex-1 pr-6">
              <h3 className="font-serif text-base font-bold text-[#713C48]">
                Fluxo de Produção: Do Pedido à Experiência Publicada
              </h3>
              <p className="text-xs text-[#302B2D]/80 leading-relaxed">
                Para presentes encomendados no site, acesse o <strong>Pedido</strong> e clique em <em>&quot;Criar Experiência&quot;</em> para pré-carregar os dados. O editor permite montar a apresentação, linha do tempo, depoimentos com áudio e gerar o QR Code de impressão.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="bg-white/80 rounded-xl p-3 border border-[#713C48]/10">
                  <strong className="text-[#713C48] block mb-0.5">1. Apresentação</strong>
                  <span>Nome, capa e áudio de abertura.</span>
                </div>
                <div className="bg-white/80 rounded-xl p-3 border border-[#713C48]/10">
                  <strong className="text-[#713C48] block mb-0.5">2. Linha do Tempo</strong>
                  <span>Meses ou marcos com fotos e relatos.</span>
                </div>
                <div className="bg-white/80 rounded-xl p-3 border border-[#713C48]/10">
                  <strong className="text-[#713C48] block mb-0.5">3. QR Code & Publicação</strong>
                  <span>Cartão pronto para corte e impressão.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#713C48]/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título ou presenteado..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#713C48] focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#713C48] text-white text-xs font-bold rounded-xl hover:bg-[#592F39] transition-all shadow-xs"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-stone-500 font-semibold mr-1 whitespace-nowrap">Status:</span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'published', label: 'Publicados' },
            { id: 'draft', label: 'Rascunhos' },
            { id: 'unpublished', label: 'Despublicados' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleStatusChange(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === st.id
                  ? 'bg-[#713C48] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Grid / Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#713C48]/10 overflow-hidden">
        {pages.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FFF8F0] text-[#713C48] flex items-center justify-center mx-auto text-xl font-serif font-bold">
              <FileText className="w-6 h-6 text-[#C96E5A]" />
            </div>
            <p className="text-base font-serif text-[#713C48] font-bold">Nenhuma experiência encontrada</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Nenhuma página corresponde aos filtros atuais. Tente limpar os filtros ou crie uma nova experiência.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FFF8F0]/80 border-b border-[#713C48]/10 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-5">Capa & Experiência</th>
                  <th className="py-4 px-4">Pedido Vinculado</th>
                  <th className="py-4 px-4">Preenchimento</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Link Público & Token</th>
                  <th className="py-4 px-4">Data Revelação</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pages.map((p) => {
                  const orderInfo = (p as any).orders;
                  const content = (p.content as any) || {};
                  const coverUrl = content.recipient?.featuredImage?.url;
                  const completeness = calculateCompleteness(p);

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Cover & Experience Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-stone-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/admin/paginas/${p.id}/editar`}
                              className="font-bold text-stone-900 hover:text-[#713C48] text-sm hover:underline block truncate max-w-xs"
                            >
                              {p.title}
                            </Link>
                            <div className="text-stone-500 text-xs mt-0.5">
                              Para: <strong className="text-[#713C48]">{p.recipient_name}</strong>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Linked Order */}
                      <td className="py-4 px-4">
                        {orderInfo ? (
                          <div>
                            <Link
                              href={`/admin/pedidos/${p.order_id}`}
                              className="font-mono text-[#713C48] font-bold hover:underline"
                            >
                              {orderInfo.code}
                            </Link>
                            <div className="text-stone-500 text-[11px] truncate max-w-[140px]">
                              {orderInfo.customer_name}
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic text-xs">Página Avulsa</span>
                        )}
                      </td>

                      {/* Completeness Bar */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 w-28">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-stone-600">
                            <span>{completeness}%</span>
                            <span>{completeness === 100 ? 'Completo' : 'Em criação'}</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                completeness === 100
                                  ? 'bg-emerald-600'
                                  : completeness >= 60
                                  ? 'bg-[#C96E5A]'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${completeness}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            p.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : p.status === 'draft'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {p.status === 'published'
                            ? 'Publicado'
                            : p.status === 'draft'
                            ? 'Rascunho'
                            : 'Despublicado'}
                        </span>
                      </td>

                      {/* Public Token & Link */}
                      <td className="py-4 px-4 font-mono">
                        <a
                          href={`/p/${p.public_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C96E5A] hover:underline block truncate max-w-[150px] font-medium"
                          title={`/p/${p.public_token}`}
                        >
                          /p/{p.public_token.slice(0, 8)}...
                        </a>
                      </td>

                      {/* Reveal Date */}
                      <td className="py-4 px-4 text-stone-600">
                        {p.reveal_at ? (
                          <span className="text-[#C96E5A] font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(p.reveal_at).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-stone-400">Imediato</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedQrPage(p)}
                            title="Ver e Imprimir QR Code"
                            className="p-2 text-[#713C48] hover:bg-[#713C48]/10 rounded-xl transition-all border border-[#713C48]/20"
                          >
                            <QrCode className="w-3.5 h-3.5 text-[#C96E5A]" />
                          </button>
                          <Link
                            href={`/admin/paginas/${p.id}/preview`}
                            target="_blank"
                            title="Prévia Completa"
                            className="p-2 text-stone-700 hover:bg-stone-100 rounded-xl transition-all border border-stone-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/paginas/${p.id}/editar`}
                            className="px-3.5 py-1.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
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
          <div className="p-4 sm:p-5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>
              Total: <strong>{totalCount}</strong> experiências
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 disabled:opacity-40 hover:bg-stone-50 font-semibold"
              >
                Anterior
              </button>
              <span className="px-2 font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 disabled:opacity-40 hover:bg-stone-50 font-semibold"
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

      {/* Create Page Help Guide Modal */}
      {isHelpOpen && <CreatePageHelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
