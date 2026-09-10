'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GiftPageRow, OrderRow, GiftPageStatus } from '@/types/database';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { TabContent } from '@/components/admin/ExperienceEditor/TabContent';
import { TabTimeline } from '@/components/admin/ExperienceEditor/TabTimeline';
import { TabMessages } from '@/components/admin/ExperienceEditor/TabMessages';
import { TabGallery } from '@/components/admin/ExperienceEditor/TabGallery';
import { TabSettingsAndTheme } from '@/components/admin/ExperienceEditor/TabSettingsAndTheme';
import { QRCodeModal } from '@/components/admin/QRCodeModal';
import { mapContentToGiftExperience } from '@/lib/gift-mapper';
import {
  FileText,
  Clock,
  MessageSquareHeart,
  Image as ImageIcon,
  Sliders,
  Save,
  QrCode,
  ArrowLeft,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Check,
  Sparkles,
  Columns,
  RotateCcw,
} from 'lucide-react';

interface ExperienceEditorClientViewProps {
  giftPage: GiftPageRow;
  order: OrderRow | null;
}

type TabType = 'content' | 'timeline' | 'messages' | 'gallery' | 'settings';
type ViewMode = 'split' | 'editor' | 'simulator';

export default function ExperienceEditorClientView({
  giftPage: initialGiftPage,
  order,
}: ExperienceEditorClientViewProps) {
  const router = useRouter();
  const [giftPage, setGiftPage] = useState<GiftPageRow>(initialGiftPage);
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Content and Theme State
  const [content, setContent] = useState<GiftContentData>(
    (initialGiftPage.content as GiftContentData) || {}
  );
  const [theme, setTheme] = useState<GiftThemeData>(
    (initialGiftPage.theme as GiftThemeData) || { styleId: 'afetuoso', primaryColor: '#713C48', accentColor: '#C96E5A' }
  );
  const [title, setTitle] = useState(initialGiftPage.title || '');
  const [recipientName, setRecipientName] = useState(initialGiftPage.recipient_name || '');
  const [status, setStatus] = useState<GiftPageStatus>(initialGiftPage.status);
  const [revealAt, setRevealAt] = useState<string | null>(initialGiftPage.reveal_at);

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Warn user on unload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Content mutators
  const updateContent = (fields: Partial<GiftContentData>) => {
    setContent((prev) => ({ ...prev, ...fields }));
    setIsDirty(true);
    setFeedback(null);
  };

  const updateTheme = (fields: Partial<GiftThemeData>) => {
    setTheme((prev) => ({ ...prev, ...fields }));
    setIsDirty(true);
    setFeedback(null);
  };

  const updatePageMeta = (fields: { status?: GiftPageStatus; reveal_at?: string | null }) => {
    if (fields.status !== undefined) setStatus(fields.status);
    if (fields.reveal_at !== undefined) setRevealAt(fields.reveal_at);
    setIsDirty(true);
    setFeedback(null);
  };

  // Save handler
  const handleSave = async (andAdvance = false) => {
    setIsSaving(true);
    setFeedback(null);

    try {
      const payload = {
        title,
        recipient_name: recipientName || content.recipient?.name || title,
        status,
        reveal_at: revealAt,
        content,
        theme,
      };

      const res = await fetch(`/api/admin/pages/${giftPage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar alterações');

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastSavedTime(timeStr);
      setIsDirty(false);
      setFeedback({ text: `Alterações salvas às ${timeStr}`, type: 'success' });
      setGiftPage((prev) => ({
        ...prev,
        ...payload,
        updated_at: now.toISOString(),
      }));

      if (andAdvance) {
        const stepOrder: TabType[] = ['content', 'timeline', 'messages', 'gallery', 'settings'];
        const currentIdx = stepOrder.indexOf(activeTab);
        if (currentIdx < stepOrder.length - 1) {
          setActiveTab(stepOrder[currentIdx + 1]);
        }
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'Erro ao salvar alterações', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Stepper completion checks
  const stepStats = useMemo(() => {
    const hasName = Boolean(recipientName || content.recipient?.name);
    const hasCover = Boolean(content.recipient?.featuredImage?.url);
    const step1Done = hasName && hasCover;

    const timelineCount = (content.timelineMoments || []).length;
    const timelineWithPhoto = (content.timelineMoments || []).filter((m) => Boolean(m.image?.url)).length;
    const step2Done = timelineCount > 0;

    const messagesCount = (content.contributorMessages || []).length;
    const step3Done = messagesCount > 0;

    const galleryCount = (content.galleryItems || []).length;
    const step4Done = galleryCount > 0;

    const step5Done = Boolean(theme.styleId);

    return {
      content: {
        isDone: step1Done,
        countText: hasCover ? 'Capa pronta' : 'Falta capa',
        hasWarning: !step1Done,
      },
      timeline: {
        isDone: step2Done,
        countText: `${timelineCount} marcos (${timelineWithPhoto} fotos)`,
        hasWarning: timelineCount === 0,
      },
      messages: {
        isDone: step3Done,
        countText: `${messagesCount} mensagens`,
        hasWarning: false,
      },
      gallery: {
        isDone: step4Done,
        countText: `${galleryCount} fotos extras`,
        hasWarning: false,
      },
      settings: {
        isDone: step5Done,
        countText: `Estilo ${theme.styleId || 'Afetuoso'}`,
        hasWarning: false,
      },
    };
  }, [recipientName, content, theme]);

  // Live experience preview data
  const liveGiftExperience = useMemo(() => {
    return mapContentToGiftExperience(
      {
        ...content,
        recipient: {
          ...content.recipient,
          name: recipientName || content.recipient?.name || 'Presenteado',
        },
      },
      theme
    );
  }, [content, recipientName, theme]);

  // Sync live draft data to iframe preview in real time
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'UPDATE_EXPERIENCE', gift: liveGiftExperience },
        '*'
      );
    }
  }, [liveGiftExperience]);

  // Listen for iframe ready signal
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: 'UPDATE_EXPERIENCE', gift: liveGiftExperience },
            '*'
          );
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [liveGiftExperience]);

  const tabs: { id: TabType; stepNumber: number; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'content',
      stepNumber: 1,
      title: 'Apresentação',
      subtitle: stepStats.content.countText,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'timeline',
      stepNumber: 2,
      title: 'Linha do Tempo',
      subtitle: stepStats.timeline.countText,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'messages',
      stepNumber: 3,
      title: 'Mensagens & Vozes',
      subtitle: stepStats.messages.countText,
      icon: <MessageSquareHeart className="w-4 h-4" />,
    },
    {
      id: 'gallery',
      stepNumber: 4,
      title: 'Galeria de Fotos',
      subtitle: stepStats.gallery.countText,
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'settings',
      stepNumber: 5,
      title: 'Tema & Publicação',
      subtitle: stepStats.settings.countText,
      icon: <Sliders className="w-4 h-4" />,
    },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto pb-24">
      {/* Top Header Bar */}
      <header className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-[#713C48]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href={order ? `/admin/pedidos/${order.id}` : '/admin/paginas'}
              className="text-xs text-[#713C48] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{order ? `Pedido ${order.code}` : 'Lista de Páginas'}</span>
            </Link>
            <span className="text-stone-300">•</span>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                status === 'published'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : status === 'draft'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {status === 'published' ? 'Publicado' : status === 'draft' ? 'Rascunho' : status}
            </span>
            {isDirty && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-semibold animate-pulse">
                ● Alterações não salvas
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="text"
              maxLength={80}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Título da Página"
              className="text-lg sm:text-xl font-serif font-bold text-[#713C48] bg-transparent border-b border-dashed border-[#713C48]/30 hover:border-[#713C48] focus:border-[#713C48] focus:outline-none px-1 py-0.5 w-full max-w-md"
            />
          </div>
        </div>

        {/* Action Header Buttons & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              title="Exibir apenas o formulário do editor em largura total"
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'editor'
                  ? 'bg-white text-[#713C48] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              title="Exibir editor e simulador lado a lado"
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-white text-[#713C48] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lado a Lado</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('simulator')}
              title="Exibir apenas o simulador de smartphone"
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'simulator'
                  ? 'bg-white text-[#713C48] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulador</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 text-[#713C48] border border-stone-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-[#C96E5A]" />
            <span>QR Code</span>
          </button>

          <Link
            href={`/admin/paginas/${giftPage.id}/preview`}
            target="_blank"
            className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Prévia Completa</span>
          </Link>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 bg-[#713C48] hover:bg-[#592F39] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </header>

      {/* Stepper Navigation */}
      <nav aria-label="Progresso de edição da experiência" className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-[#713C48]/10 overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between gap-2">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const stats = stepStats[tab.id];

            return (
              <React.Fragment key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-3 rounded-2xl text-left transition-all border flex items-center gap-3 relative ${
                    isActive
                      ? 'bg-[#FFF8F0] border-[#713C48] ring-2 ring-[#713C48]/20 shadow-xs'
                      : stats.isDone
                      ? 'bg-white border-stone-200 hover:border-[#713C48]/40'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isActive
                        ? 'bg-[#713C48] text-white'
                        : stats.isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {stats.isDone && !isActive ? (
                      <Check className="w-4 h-4 text-emerald-700" />
                    ) : (
                      tab.stepNumber
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-[#713C48]' : 'text-[#302B2D]'}`}>
                        {tab.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 truncate mt-0.5">{tab.subtitle}</p>
                  </div>
                </button>

                {idx < tabs.length - 1 && (
                  <div className="w-4 h-0.5 bg-stone-200 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* Main Layout */}
      <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'xl:grid-cols-12 gap-8' : 'gap-6'}`}>
        {/* Editor Form Column */}
        {viewMode !== 'simulator' && (
          <div className={viewMode === 'split' ? 'xl:col-span-7 space-y-6' : 'space-y-6 max-w-4xl mx-auto w-full'}>
            {/* Active Tab Card Body */}
            <div className="bg-transparent space-y-6 min-h-[500px]">
              {activeTab === 'content' && (
                <TabContent
                  giftPageId={giftPage.id}
                  content={content}
                  updateContent={updateContent}
                />
              )}

              {activeTab === 'timeline' && (
                <TabTimeline
                  giftPageId={giftPage.id}
                  content={content}
                  updateContent={updateContent}
                />
              )}

              {activeTab === 'messages' && (
                <TabMessages
                  giftPageId={giftPage.id}
                  content={content}
                  updateContent={updateContent}
                />
              )}

              {activeTab === 'gallery' && (
                <TabGallery
                  giftPageId={giftPage.id}
                  content={content}
                  updateContent={updateContent}
                />
              )}

              {activeTab === 'settings' && (
                <TabSettingsAndTheme
                  giftPageId={giftPage.id}
                  publicToken={giftPage.public_token}
                  status={status}
                  revealAt={revealAt}
                  theme={theme}
                  updateTheme={updateTheme}
                  updatePageMeta={updatePageMeta}
                  onOpenQRCode={() => setIsQrModalOpen(true)}
                />
              )}
            </div>

            {/* Bottom Step Navigation Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#713C48]/15 shadow-sm flex items-center justify-between gap-3">
              <div>
                {currentTabIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar: {tabs[currentTabIndex - 1].title}</span>
                  </button>
                ) : (
                  <span className="text-xs text-stone-400 font-medium pl-2">Primeira etapa</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-[#713C48]/30 text-[#713C48] hover:bg-[#713C48]/5 text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
                </button>

                {currentTabIndex < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>Salvar e Avançar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      updatePageMeta({ status: 'published' });
                      handleSave(false);
                    }}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publicar Experiência</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Simulator Phone Column (Isolated iframe with true mobile viewport) */}
        {viewMode !== 'editor' && (
          <aside
            aria-label="Simulador ao vivo em smartphone"
            className={viewMode === 'split' ? 'xl:col-span-5 flex flex-col items-center' : 'max-w-md mx-auto w-full flex flex-col items-center'}
          >
            <div className="sticky top-6 w-full max-w-[390px] space-y-3">
              <div className="flex items-center justify-between text-xs px-2">
                <span className="font-bold text-[#713C48] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#C96E5A]" />
                  Simulador de Smartphone
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (iframeRef.current) {
                        iframeRef.current.src = `/admin/paginas/${giftPage.id}/preview?embed=1`;
                      }
                    }}
                    title="Recarregar tela do simulador"
                    className="p-1 hover:bg-stone-200/60 rounded-md text-stone-500 hover:text-stone-800 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ao vivo
                  </span>
                </div>
              </div>

              {/* Realistic iPhone mockup frame */}
              <div className="w-full h-[680px] bg-stone-900 rounded-[48px] p-2.5 shadow-2xl border-4 border-stone-800 relative overflow-hidden flex flex-col ring-1 ring-black/20">
                {/* iPhone Dynamic Island / Notch */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-800 ml-auto mr-2" />
                </div>

                {/* Inner Screen iframe */}
                <iframe
                  ref={iframeRef}
                  src={`/admin/paginas/${giftPage.id}/preview?embed=1`}
                  className="w-full h-full bg-[#FFF8F0] rounded-[38px] border-0"
                  title="Simulador de Smartphone ao Vivo"
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Status & Save Bar (Fixed at bottom) */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#713C48]/15 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-serif font-bold text-[#713C48] hidden sm:inline truncate max-w-xs">
            {title || 'Sem título'}
          </span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-stone-600 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C96E5A]" />
              Salvando alterações no Supabase...
            </span>
          ) : isDirty ? (
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Alterações pendentes de salvamento
            </span>
          ) : lastSavedTime ? (
            <span className="text-emerald-800 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Salvo às {lastSavedTime}
            </span>
          ) : (
            <span className="text-stone-500">Tudo sincronizado</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
          >
            QR Code
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#713C48] hover:bg-[#592F39] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Salvar</span>
          </button>
        </div>
      </footer>

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <QRCodeModal
          publicToken={giftPage.public_token}
          recipientName={recipientName || content.recipient?.name || 'Presente'}
          giftTitle={title}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </div>
  );
}
