'use client';

import React, { useState } from 'react';
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
import { PresenteClientView } from '@/app/presente/[slug]/PresenteClientView';
import { mapContentToGiftExperience } from '@/lib/gift-mapper';
import {
  FileText,
  Clock,
  MessageSquareHeart,
  Image as ImageIcon,
  Sliders,
  Eye,
  Save,
  QrCode,
  ArrowLeft,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface ExperienceEditorClientViewProps {
  giftPage: GiftPageRow;
  order: OrderRow | null;
}

type TabType = 'content' | 'timeline' | 'messages' | 'gallery' | 'settings';

export default function ExperienceEditorClientView({
  giftPage: initialGiftPage,
  order,
}: ExperienceEditorClientViewProps) {
  const router = useRouter();
  const [giftPage, setGiftPage] = useState<GiftPageRow>(initialGiftPage);
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [showLivePreview, setShowLivePreview] = useState(false);

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
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Content mutators
  const updateContent = (fields: Partial<GiftContentData>) => {
    setContent((prev) => ({ ...prev, ...fields }));
  };

  const updateTheme = (fields: Partial<GiftThemeData>) => {
    setTheme((prev) => ({ ...prev, ...fields }));
  };

  const updatePageMeta = (fields: { status?: GiftPageStatus; reveal_at?: string | null }) => {
    if (fields.status !== undefined) setStatus(fields.status);
    if (fields.reveal_at !== undefined) setRevealAt(fields.reveal_at);
  };

  // Save handler
  const handleSave = async () => {
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

      setFeedback({ text: 'Alterações salvas com sucesso!', type: 'success' });
      setGiftPage((prev) => ({
        ...prev,
        ...payload,
        updated_at: new Date().toISOString(),
      }));
    } catch (err: any) {
      setFeedback({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Live experience preview data
  const liveGiftExperience = mapContentToGiftExperience(
    {
      ...content,
      recipient: {
        ...content.recipient,
        name: recipientName || content.recipient?.name || 'Presenteado',
      },
    },
    theme
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: '1. Apresentação', icon: <FileText className="w-4 h-4" /> },
    { id: 'timeline', label: '2. Linha do Tempo', icon: <Clock className="w-4 h-4" /> },
    { id: 'messages', label: '3. Mensagens & Vozes', icon: <MessageSquareHeart className="w-4 h-4" /> },
    { id: 'gallery', label: '4. Galeria de Fotos', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'settings', label: '5. Tema & Publicação', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#713C48]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href={order ? `/admin/pedidos/${order.id}` : '/admin/paginas'}
              className="text-xs text-[#713C48] hover:underline flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{order ? `Voltar ao Pedido ${order.code}` : 'Voltar para Páginas'}</span>
            </Link>
            <span className="text-stone-300">•</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                status === 'published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : status === 'draft'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da Página"
              className="text-xl sm:text-2xl font-serif font-bold text-[#713C48] bg-transparent border-b border-dashed border-stone-300 hover:border-[#713C48] focus:border-[#713C48] focus:outline-none px-1 py-0.5"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              showLivePreview
                ? 'bg-[#713C48] text-white border-[#713C48]'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{showLivePreview ? 'Ocultar Simulador' : 'Simulador Mobile'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 text-[#713C48] border border-stone-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>

          <Link
            href={`/admin/paginas/${giftPage.id}/preview`}
            target="_blank"
            className="px-3.5 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Prévia Completa</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#713C48] hover:bg-[#592F39] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Main Layout: Tabs on left/center & optional Live Simulator on right */}
      <div className={`grid grid-cols-1 ${showLivePreview ? 'lg:grid-cols-12 gap-8' : 'gap-6'}`}>
        {/* Editor Column */}
        <div className={showLivePreview ? 'lg:col-span-7 space-y-6' : 'space-y-6'}>
          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-[#713C48]/10 flex overflow-x-auto gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#713C48] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Body */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 min-h-[500px]">
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
        </div>

        {/* Live Simulator Phone Column */}
        {showLivePreview && (
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-6 w-full max-w-[380px] space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 px-2">
                <span className="font-semibold text-[#713C48] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Simulador de Visualização
                </span>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded">Atualização em tempo real</span>
              </div>

              {/* iPhone style mockup frame */}
              <div className="w-full h-[640px] bg-stone-900 rounded-[42px] p-3 shadow-2xl border-4 border-stone-800 relative overflow-hidden flex flex-col">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-30" />
                <div className="w-full h-full bg-[#FFF8F0] rounded-[32px] overflow-y-auto relative scrollbar-none">
                  <PresenteClientView gift={liveGiftExperience} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
