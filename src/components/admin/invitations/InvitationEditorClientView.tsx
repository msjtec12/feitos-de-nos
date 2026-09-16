'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  EventDetailWithMedia,
  EventMediaRow,
  EventThemeConfig,
  EventStatus,
  InvitationPlanId,
  InvitationEventType,
} from '@/types/invitation';
import { INVITATION_EVENT_TYPES } from '@/data/invitation-event-types';
import { INVITATION_AUTHORIAL_THEMES } from '@/data/invitation-themes';
import { INVITATION_PLANS_LIST } from '@/data/invitation-plans';
import { InvitationPublicClientView } from '@/components/invitations/public/InvitationPublicClientView';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Columns,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Palette,
  Image as ImageIcon,
  Gift,
  Settings,
  Users,
  QrCode,
  Sparkles,
  Upload,
  Link2,
  Check,
  Play,
  EyeOff,
} from 'lucide-react';

interface InvitationEditorProps {
  event: EventDetailWithMedia;
}

type TabType = 'info' | 'datetime' | 'theme' | 'gallery' | 'gift' | 'rsvp';
type ViewMode = 'split' | 'editor' | 'simulator';

export function InvitationEditorClientView({ event: initialEvent }: InvitationEditorProps) {
  const router = useRouter();

  // Active state
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [simulatorKey, setSimulatorKey] = useState(0);
  const [testOpeningInSimulator, setTestOpeningInSimulator] = useState(false);
  const [simulatorReducedMotion, setSimulatorReducedMotion] = useState(false);

  // Form Fields
  const [title, setTitle] = useState(initialEvent.title);
  const [slug, setSlug] = useState(initialEvent.slug);
  const [eventType, setEventType] = useState<InvitationEventType>(initialEvent.event_type);
  const [plan, setPlan] = useState<InvitationPlanId>(initialEvent.plan);
  const [status, setStatus] = useState<EventStatus>(initialEvent.status);
  const [hostNames, setHostNames] = useState(initialEvent.host_names);
  const [honoreeName, setHonoreeName] = useState(initialEvent.honoree_name || '');
  const [headline, setHeadline] = useState(initialEvent.headline || '');
  const [openingMessage, setOpeningMessage] = useState(initialEvent.opening_message || '');

  // Date & Venue
  const [eventDate, setEventDate] = useState(
    initialEvent.event_date ? initialEvent.event_date.slice(0, 10) : ''
  );
  const [eventTime, setEventTime] = useState(
    initialEvent.event_date ? initialEvent.event_date.slice(11, 16) : '16:00'
  );
  const [venueName, setVenueName] = useState(initialEvent.venue_name || '');
  const [address, setAddress] = useState(initialEvent.address || '');
  const [mapsUrl, setMapsUrl] = useState(initialEvent.maps_url || '');
  const [dressCode, setDressCode] = useState(initialEvent.dress_code || '');

  // Gift
  const [giftInformation, setGiftInformation] = useState(initialEvent.gift_information || '');

  // Media
  const [coverUrl, setCoverUrl] = useState(initialEvent.cover_url || '');
  const [coverInputMode, setCoverInputMode] = useState<'file' | 'url'>('file');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [mediaList, setMediaList] = useState<EventMediaRow[]>(initialEvent.media || []);
  const [galleryInputMode, setGalleryInputMode] = useState<'file' | 'url'>('file');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Theme
  const [themeConfig, setThemeConfig] = useState<EventThemeConfig>(
    initialEvent.theme_config || {
      themeId: 'infantil-delicado',
      primaryColor: '#2563EB',
      accentColor: '#F59E0B',
      backgroundColor: '#F8FAFC',
      textColor: '#1E293B',
      photoStyle: 'rounded',
    }
  );

  // RSVP deadline
  const [rsvpDeadline, setRsvpDeadline] = useState(
    initialEvent.rsvp_deadline ? initialEvent.rsvp_deadline.slice(0, 10) : ''
  );

  // Sync state
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Construct live preview data
  const livePreviewEvent = useMemo<EventDetailWithMedia>(() => {
    const combinedDate = `${eventDate || '2026-10-24'}T${eventTime || '16:00'}:00-03:00`;
    return {
      ...initialEvent,
      title,
      slug,
      event_type: eventType,
      plan,
      status,
      host_names: hostNames,
      honoree_name: honoreeName || null,
      headline: headline || null,
      opening_message: openingMessage || null,
      event_date: combinedDate,
      venue_name: venueName || null,
      address: address || null,
      maps_url: mapsUrl || null,
      dress_code: dressCode || null,
      gift_information: giftInformation || null,
      cover_url: coverUrl || null,
      theme_config: themeConfig,
      rsvp_deadline: rsvpDeadline ? `${rsvpDeadline}T23:59:59-03:00` : null,
      media: mediaList,
    };
  }, [
    initialEvent,
    title,
    slug,
    eventType,
    plan,
    status,
    hostNames,
    honoreeName,
    headline,
    openingMessage,
    eventDate,
    eventTime,
    venueName,
    address,
    mapsUrl,
    dressCode,
    giftInformation,
    coverUrl,
    themeConfig,
    rsvpDeadline,
    mediaList,
  ]);

  // Handle Add Photo
  const handleAddMedia = () => {
    if (!newPhotoUrl.trim()) return;
    const newItem: EventMediaRow = {
      id: `media-${Date.now()}`,
      event_id: initialEvent.id,
      media_type: 'image',
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || null,
      sort_order: mediaList.length + 1,
      created_at: new Date().toISOString(),
    };
    setMediaList((prev) => [...prev, newItem]);
    if (!coverUrl) {
      setCoverUrl(newPhotoUrl.trim());
    }
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsDirty(true);
  };

  const handleRemoveMedia = (idx: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  // Upload file for Cover Photo
  const handleUploadCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', 'Foto de Capa');

      const res = await fetch(`/api/admin/events/${initialEvent.id}/upload`, {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();
      if (res.ok && resData.url) {
        setCoverUrl(resData.url);
        setIsDirty(true);
      } else {
        alert(resData.error || 'Erro ao enviar imagem de capa');
      }
    } catch (err) {
      console.error('Erro no upload da capa:', err);
      alert('Falha no upload do arquivo.');
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  // Upload file(s) for Gallery
  const handleUploadGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('caption', newPhotoCaption.trim() || file.name.replace(/\.[^/.]+$/, ''));

        const res = await fetch(`/api/admin/events/${initialEvent.id}/upload`, {
          method: 'POST',
          body: formData,
        });
        const resData = await res.json();
        if (res.ok && resData.url) {
          const newItem: EventMediaRow = {
            id: `media-${Date.now()}-${i}`,
            event_id: initialEvent.id,
            media_type: 'image',
            url: resData.url,
            caption: newPhotoCaption.trim() || null,
            sort_order: mediaList.length + 1 + i,
            created_at: new Date().toISOString(),
          };
          setMediaList((prev) => [...prev, newItem]);
          if (!coverUrl) {
            setCoverUrl(resData.url);
          }
        }
      }
      setNewPhotoCaption('');
      setIsDirty(true);
    } catch (err) {
      console.error('Erro no upload da galeria:', err);
      alert('Falha no upload dos arquivos da galeria.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Handle Theme Template Selection
  const handleApplyThemePreset = (presetId: string) => {
    const found = INVITATION_AUTHORIAL_THEMES.find((t) => t.id === presetId);
    if (found) {
      setThemeConfig({
        ...found.config,
        themeId: found.id,
        slug: found.id,
      });
      setIsDirty(true);
      setSimulatorKey((k) => k + 1);
    }
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    const combinedDate = `${eventDate}T${eventTime}:00-03:00`;

    try {
      const res = await fetch(`/api/admin/events/${initialEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          event_type: eventType,
          plan,
          status,
          host_names: hostNames,
          honoree_name: honoreeName || null,
          headline: headline || null,
          opening_message: openingMessage || null,
          event_date: combinedDate,
          venue_name: venueName || null,
          address: address || null,
          maps_url: mapsUrl || null,
          dress_code: dressCode || null,
          gift_information: giftInformation || null,
          cover_url: coverUrl || null,
          theme_config: themeConfig,
          rsvp_deadline: rsvpDeadline ? `${rsvpDeadline}T23:59:59-03:00` : null,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Erro ao salvar alterações.');
      }

      setIsDirty(false);
      setLastSavedTime(
        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-[#D9A4A0]/40">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#713C48]/15 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/convites"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#713C48] hover:bg-slate-100 transition-colors"
            title="Voltar para a lista"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base sm:text-lg text-[#713C48] truncate max-w-xs sm:max-w-md">
                {title || 'Sem título'}
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              /convite/{slug}
            </p>
          </div>
        </div>

        {/* View Mode Controls & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'split' ? 'bg-white shadow-xs text-[#713C48]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Dividido</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'editor' ? 'bg-white shadow-xs text-[#713C48]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'simulator' ? 'bg-white shadow-xs text-[#713C48]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>
          </div>

          <Link
            href={`/convite/${slug}`}
            target="_blank"
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            title="Abrir página pública"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <Link
            href={`/admin/convites/${initialEvent.id}/convidados`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C96E5A]/10 text-[#C96E5A] hover:bg-[#C96E5A]/20 text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Convidados</span>
          </Link>

          {lastSavedTime && !isDirty && !saveError && (
            <span className="hidden md:inline-block text-[11px] text-emerald-700 font-medium">
              Salvo às {lastSavedTime}
            </span>
          )}
          {saveError && (
            <span className="hidden md:inline-block text-[11px] text-red-600 font-medium">
              Falha ao salvar
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48] text-white hover:bg-[#5a2e39] text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Modular Editor */}
        {viewMode !== 'simulator' && (
          <div className="flex-1 flex flex-col overflow-y-auto max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Save Error Alert */}
            {saveError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div className="space-y-1">
                  <span className="font-semibold block">Erro ao salvar convite:</span>
                  <span className="leading-relaxed block">{saveError}</span>
                </div>
              </div>
            )}

            {/* Tabs Bar */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'info' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Informações
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('datetime')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'datetime' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Data & Local
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'theme' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tema & Cores
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'gallery' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Galeria ({mediaList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gift')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'gift' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Presentes / Pix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rsvp')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'rsvp' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                RSVP & Status
              </button>
            </div>

            {/* TAB 1: Informações Básicas */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#713C48]">
                  Informações Gerais do Convite
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Título do Evento
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Slug da URL
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Homenageado(a) / Noivos
                    </label>
                    <input
                      type="text"
                      value={honoreeName}
                      onChange={(e) => {
                        setHonoreeName(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Anfitriões (Quem convida)
                    </label>
                    <input
                      type="text"
                      value={hostNames}
                      onChange={(e) => {
                        setHostNames(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Evento
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => {
                        setEventType(e.target.value as InvitationEventType);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    >
                      {INVITATION_EVENT_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Frase em Destaque / Subtítulo
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => {
                        setHeadline(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Ex: Nosso raio de sol completa seu primeiro aninho!"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mensagem de Abertura dos Anfitriões
                    </label>
                    <textarea
                      rows={3}
                      value={openingMessage}
                      onChange={(e) => {
                        setOpeningMessage(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Recado afetuoso com a história ou mensagem aos convidados..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Data & Local */}
            {activeTab === 'datetime' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#713C48]">
                  Data, Horário e Localização
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data da Celebração
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Horário de Início
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => {
                        setEventTime(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Local / Buffet
                    </label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => {
                        setVenueName(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Ex: Villa Encantada"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Traje Sugerido / Dress Code
                    </label>
                    <input
                      type="text"
                      value={dressCode}
                      onChange={(e) => {
                        setDressCode(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Ex: Esporte fino / Tons pastéis"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Endereço Completo
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Ex: Alameda das Hortênsias, 420 - Jardim América, São Paulo - SP"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link Customizado do Google Maps (opcional)
                    </label>
                    <input
                      type="url"
                      value={mapsUrl}
                      onChange={(e) => {
                        setMapsUrl(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Deixe em branco para busca automática do endereço"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Tema & Cores */}
            {activeTab === 'theme' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#713C48]">
                    Personalização Visual do Convite
                  </h2>
                  <p className="text-xs text-slate-500">
                    Selecione um tema pré-definido ou ajuste os tons da paleta de cores.
                  </p>
                </div>

                {/* Preset Themes Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Paletas Pré-configuradas (13 Temas Autorais)
                    </label>
                    <span className="text-[11px] text-slate-500">13 temas disponíveis</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {INVITATION_AUTHORIAL_THEMES.map((t) => {
                      const isSelected = themeConfig.themeId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleApplyThemePreset(t.id)}
                          title={t.name}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[92px] ${
                            isSelected
                              ? 'border-[#713C48] bg-[#713C48]/8 ring-2 ring-[#713C48] shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: t.previewColors.primary }}
                              />
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: t.previewColors.accent }}
                              />
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: t.previewColors.background }}
                              />
                            </div>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#713C48] text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 break-words">
                            {t.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Colors Picker */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cor Principal
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.primaryColor || '#713C48'}
                        onChange={(e) => {
                          setThemeConfig((prev) => ({ ...prev, primaryColor: e.target.value }));
                          setIsDirty(true);
                        }}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                      />
                      <span className="text-xs font-mono">{themeConfig.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cor de Destaque
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.accentColor || '#C96E5A'}
                        onChange={(e) => {
                          setThemeConfig((prev) => ({ ...prev, accentColor: e.target.value }));
                          setIsDirty(true);
                        }}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                      />
                      <span className="text-xs font-mono">{themeConfig.accentColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cor do Fundo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.backgroundColor || '#FFF8F0'}
                        onChange={(e) => {
                          setThemeConfig((prev) => ({ ...prev, backgroundColor: e.target.value }));
                          setIsDirty(true);
                        }}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                      />
                      <span className="text-xs font-mono">{themeConfig.backgroundColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Moldura da Foto
                    </label>
                    <select
                      value={themeConfig.photoStyle || 'rounded'}
                      onChange={(e) => {
                        setThemeConfig((prev) => ({
                          ...prev,
                          photoStyle: e.target.value as any,
                        }));
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    >
                      <option value="rounded">Arredondada Suave</option>
                      <option value="polaroid">Polaroid Clássica</option>
                      <option value="arch">Arco Nobre</option>
                      <option value="classic">Clássico com Borda</option>
                      <option value="pixel">Pixel Art / Retrô</option>
                      <option value="gold-border">Borda Dourada / Luxo</option>
                      <option value="floral-wreath">Guirlanda Floral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estilo de Abertura
                    </label>
                    <select
                      value={themeConfig.openingStyle || 'envelope'}
                      onChange={(e) => {
                        setThemeConfig((prev) => ({
                          ...prev,
                          openingStyle: e.target.value as any,
                        }));
                        setIsDirty(true);
                        setSimulatorKey((k) => k + 1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    >
                      <option value="envelope">Envelope com Lacre de Cera</option>
                      <option value="gift-box">Caixa de Presente com Laço</option>
                      <option value="curtain">Cortina de Palco / Revelação</option>
                      <option value="card">Cartão Dobrável</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Intensidade de Animações
                    </label>
                    <select
                      value={themeConfig.animationIntensity || 'festive'}
                      onChange={(e) => {
                        setThemeConfig((prev) => ({
                          ...prev,
                          animationIntensity: e.target.value as any,
                        }));
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    >
                      <option value="festive">Festivo (Partículas & Brilho)</option>
                      <option value="soft">Suave (Efeitos Leves)</option>
                      <option value="none">Estático (Sem Partículas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Partículas de Fundo
                    </label>
                    <select
                      value={themeConfig.particlePreset || 'sparkles'}
                      onChange={(e) => {
                        setThemeConfig((prev) => ({
                          ...prev,
                          particlePreset: e.target.value as any,
                        }));
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    >
                      <option value="sparkles">Fagulhas & Brilho</option>
                      <option value="elemental">Monstrinhos & Elementos</option>
                      <option value="confetti">Chuva de Confetes</option>
                      <option value="stars">Estrelas Mágicas</option>
                      <option value="petals">Pétalas Florais</option>
                      <option value="bubbles">Bolhas Flutuantes</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Trilha Sonora / Música de Fundo (URL de áudio MP3)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://exemplo.com/musica.mp3"
                        value={themeConfig.musicTrackUrl || ''}
                        onChange={(e) => {
                          setThemeConfig((prev) => ({
                            ...prev,
                            musicTrackUrl: e.target.value,
                          }));
                          setIsDirty(true);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                      />
                      {themeConfig.musicTrackUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const audio = new Audio(themeConfig.musicTrackUrl!);
                            audio.play().catch(() => alert('Não foi possível reproduzir este áudio. Verifique se o link direto é público.'));
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Testar
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      * A música inicia apenas após o convidado tocar para abrir o convite, respeitando as políticas dos navegadores.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Galeria & Mídias */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#713C48]">
                    Fotos do Convite & Galeria
                  </h2>
                  <p className="text-xs text-slate-500">
                    Envie fotos do celular/computador ou insira URLs da internet (até {initialEvent.plan === 'completo' ? '15' : '5'} fotos na galeria).
                  </p>
                </div>

                {/* Cover Photo */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Foto Principal / Capa do Convite
                    </label>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setCoverInputMode('file')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                          coverInputMode === 'file' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Arquivo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverInputMode('url')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                          coverInputMode === 'url' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Link2 className="w-3 h-3" />
                        <span>URL</span>
                      </button>
                    </div>
                  </div>

                  {coverInputMode === 'file' ? (
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
                        {isUploadingCover ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C96E5A]" />
                            <span>Enviando arquivo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-[#C96E5A]" />
                            <span>Escolher Imagem do Dispositivo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadCoverFile}
                          disabled={isUploadingCover}
                          className="hidden"
                        />
                      </label>
                      {coverUrl && (
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Foto de capa definida</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => {
                        setCoverUrl(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  )}

                  {coverUrl && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-sm">
                        <span className="font-semibold text-slate-700 block">Prévia da Capa:</span>
                        <span className="font-mono text-[10px] text-slate-400 truncate block">{coverUrl}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Photo to Gallery */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700">
                      Adicionar Foto na Galeria
                    </h3>
                    <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setGalleryInputMode('file')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                          galleryInputMode === 'file' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Arquivo(s)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGalleryInputMode('url')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                          galleryInputMode === 'url' ? 'bg-[#713C48] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Link2 className="w-3 h-3" />
                        <span>URL</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="Legenda da foto (opcional, ex: 'Comemorando os 6 meses')"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48] mb-2"
                    />
                  </div>

                  {galleryInputMode === 'file' ? (
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#713C48] hover:bg-[#5a2e39] text-white rounded-xl text-xs font-bold transition-all shadow-xs">
                        {isUploadingGallery ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Enviando fotos...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Selecionar Fotos do Celular / Computador</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadGalleryFiles}
                          disabled={isUploadingGallery}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Selecione uma ou mais fotos simultâneas
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="Cole o link da foto (ex: https://images.unsplash.com/...)"
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                      />
                      <button
                        type="button"
                        onClick={handleAddMedia}
                        disabled={!newPhotoUrl.trim()}
                        className="px-4 py-2 rounded-xl bg-[#713C48] text-white text-xs font-semibold hover:bg-[#5a2e39] transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Current Media List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Fotos Cadastradas ({mediaList.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mediaList.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="overflow-hidden text-xs">
                            <span className="font-semibold text-slate-800 block truncate">
                              {item.caption || `Foto ${idx + 1}`}
                            </span>
                            <span className="text-slate-400 text-[10px] truncate block">
                              {item.url}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remover foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Presentes & Pix */}
            {activeTab === 'gift' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#713C48]">
                  Informações de Presentes & Chave Pix
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto de Orientação de Presentes / Chave Pix
                  </label>
                  <textarea
                    rows={4}
                    value={giftInformation}
                    onChange={(e) => {
                      setGiftInformation(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Ex: A sua presença é o nosso maior presente! Se desejar nos agraciar, sugerimos chave Pix: 11999999999 ou fraldas tamanho G."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Se você digitar uma chave Pix (e-mail, CPF ou celular) no texto, o convite gerará automaticamente o botão &quot;Copiar Pix&quot;.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: RSVP & Configurações */}
            {activeTab === 'rsvp' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-[#713C48]">
                  Configurações de RSVP & Publicação
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status da Página
                    </label>
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value as EventStatus);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="awaiting_content">Aguardando Conteúdo</option>
                      <option value="in_production">Em Produção</option>
                      <option value="awaiting_approval">Aguardando Aprovação</option>
                      <option value="published">Publicado (Ao Vivo)</option>
                      <option value="completed">Concluído</option>
                      <option value="expired">Expirado</option>
                      <option value="unpublished">Despublicado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Data Limite para Confirmação de Presença (RSVP)
                    </label>
                    <input
                      type="date"
                      value={rsvpDeadline}
                      onChange={(e) => {
                        setRsvpDeadline(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Smartphone Simulator */}
        {viewMode !== 'editor' && (
          <aside
            className={`${
              viewMode === 'simulator' ? 'w-full max-w-md mx-auto p-4' : 'w-[440px] border-l border-slate-200 p-4'
            } bg-slate-200/50 flex flex-col items-center justify-start overflow-hidden`}
          >
            {/* Simulator Control Header */}
            <div className="w-full max-w-[340px] flex items-center justify-between pb-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold">
                <Smartphone className="w-3.5 h-3.5 text-[#C96E5A]" />
                <span>Simulador iPhone</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSimulatorReducedMotion(!simulatorReducedMotion)}
                  className={
                    'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ' +
                    (simulatorReducedMotion
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700')
                  }
                  title={simulatorReducedMotion ? 'Ativar animações no simulador' : 'Pausar animações no simulador'}
                >
                  {simulatorReducedMotion ? <Play className="w-2.5 h-2.5 text-white" /> : <EyeOff className="w-2.5 h-2.5" />}
                  <span>{simulatorReducedMotion ? 'Pausado' : 'Reduzir'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTestOpeningInSimulator(!testOpeningInSimulator);
                    setSimulatorKey((k) => k + 1);
                  }}
                  className={
                    'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ' +
                    (testOpeningInSimulator
                      ? 'bg-[#713C48] text-white shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700')
                  }
                  title="Alternar entre ver o convite aberto ou testar a tela de abertura com o lacre"
                >
                  {testOpeningInSimulator ? 'Testando Lacre' : 'Ver Lacre'}
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorKey((k) => k + 1)}
                  title="Recarregar tela"
                  className="p-1 hover:bg-slate-300 rounded-md transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ao Vivo
                </span>
              </div>
            </div>

            {/* iPhone Mockup Frame */}
            <div className="phone-frame w-full max-w-[340px] h-[720px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col ring-1 ring-black/20">
              {/* Dynamic Island Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-3" />
              </div>

              {/* Inner Screen */}
              <div
                key={simulatorKey}
                className="phone-screen w-full h-full rounded-[40px] overflow-y-auto relative scrollbar-none transition-colors duration-300"
                style={{ backgroundColor: themeConfig.backgroundColor || '#FFF8F0' }}
              >
                <InvitationPublicClientView
                  event={livePreviewEvent}
                  initialEnvelopeOpened={!testOpeningInSimulator}
                  isSimulator={true}
                  simulatorReducedMotion={simulatorReducedMotion}
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Save Status Bar */}
      <footer className="bg-white border-t border-[#713C48]/15 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sticky bottom-0 z-40 shadow-lg text-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-[#713C48] hidden sm:inline truncate max-w-xs">
            {title || 'Sem título'}
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C96E5A]" />
              Salvando no banco de dados...
            </span>
          ) : isDirty ? (
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Alterações não salvas
            </span>
          ) : lastSavedTime ? (
            <span className="text-emerald-800 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Salvo às {lastSavedTime}
            </span>
          ) : (
            <span className="text-slate-500">Tudo sincronizado</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#713C48] hover:bg-[#5a2e39] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Salvar Alterações</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
