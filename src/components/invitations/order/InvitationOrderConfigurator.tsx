'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { INVITATION_EVENT_TYPES, EventTypeMetadata } from '@/data/invitation-event-types';
import { INVITATION_PLANS_LIST, formatCentsToReais } from '@/data/invitation-plans';
import { INVITATION_AUTHORIAL_THEMES } from '@/data/invitation-themes';
import { InvitationPlanId, InvitationEventType } from '@/types/invitation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Palette,
  ShieldCheck,
  User,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  Loader2,
  AlertCircle,
  Upload,
  Link2,
  Image as ImageIcon,
  Trash2,
  Check,
  Plus,
  Star,
} from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Ocasião' },
  { number: 2, title: 'Detalhes' },
  { number: 3, title: 'Estilo' },
  { number: 4, title: 'Plano' },
  { number: 5, title: 'Contato' },
  { number: 6, title: 'Resumo' },
];

export function InvitationOrderConfigurator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query pre-fill
  const paramPlan = searchParams.get('plano') as InvitationPlanId | null;
  const paramTipo = searchParams.get('tipo') as InvitationEventType | null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [eventType, setEventType] = useState<InvitationEventType>(paramTipo || 'aniversario-infantil');
  const [title, setTitle] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [hostNames, setHostNames] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [giftInformation, setGiftInformation] = useState('');
  const [openingMessage, setOpeningMessage] = useState('');

  // Media & Photos State (Arquivos e URLs/Drive)
  const [photoFiles, setPhotoFiles] = useState<{ url: string; name: string }[]>([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string>('');
  const [photoLinks, setPhotoLinks] = useState<string>('');
  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string>('');
  const [photoInputMode, setPhotoInputMode] = useState<'files' | 'url'>('files');
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  // Theme & Category Filter State
  const [themeId, setThemeId] = useState('infantil-pokemon');
  const [themeFilterCategory, setThemeFilterCategory] = useState<string>('personagens');
  const [planId, setPlanId] = useState<InvitationPlanId>(paramPlan || 'interativo');

  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('SP');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Auto-adapt theme on event type change
  useEffect(() => {
    if (eventType === 'casamento' || eventType === 'noivado') {
      setThemeId('romantico');
      setThemeFilterCategory('romantico');
    } else if (eventType === 'batizado' || eventType === 'primeira-comunhao') {
      setThemeId('religioso');
      setThemeFilterCategory('classico');
    } else if (eventType === '15-anos' || eventType === 'bodas') {
      setThemeId('elegante');
      setThemeFilterCategory('classico');
    } else if (eventType === 'aniversario-infantil') {
      setThemeFilterCategory('personagens');
    }
  }, [eventType]);

  // Upload handler for files
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);
    setErrorMessage(null);

    const newUploaded: { url: string; name: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('caption', file.name);

        const res = await fetch('/api/upload-media', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          newUploaded.push({ url: data.url, name: file.name });
        } else {
          console.warn('Erro ao carregar arquivo:', file.name, data.error);
        }
      } catch (err) {
        console.error('Falha de conexão ao enviar arquivo:', err);
      }
    }

    if (newUploaded.length > 0) {
      setPhotoFiles((prev) => {
        const combined = [...prev, ...newUploaded];
        if (!coverPhotoUrl && combined.length > 0) {
          setCoverPhotoUrl(combined[0].url);
        }
        return combined;
      });
    }

    setIsUploadingPhotos(false);
    e.target.value = '';
  };

  // Add individual photo URL
  const handleAddPhotoFromUrl = () => {
    if (!singlePhotoUrl.trim()) return;
    const url = singlePhotoUrl.trim();
    const name = `Foto URL ${photoFiles.length + 1}`;
    setPhotoFiles((prev) => {
      const combined = [...prev, { url, name }];
      if (!coverPhotoUrl) {
        setCoverPhotoUrl(url);
      }
      return combined;
    });
    setSinglePhotoUrl('');
  };

  // Remove photo
  const handleRemovePhoto = (urlToRemove: string) => {
    setPhotoFiles((prev) => {
      const filtered = prev.filter((p) => p.url !== urlToRemove);
      if (coverPhotoUrl === urlToRemove) {
        setCoverPhotoUrl(filtered.length > 0 ? filtered[0].url : '');
      }
      return filtered;
    });
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);

    if (step === 1) {
      if (!eventType) {
        setErrorMessage('Por favor, selecione o tipo de ocasião do seu evento.');
        return false;
      }
    }

    if (step === 2) {
      if (!title.trim()) {
        setErrorMessage('Por favor, informe o título do convite (ex: Aniversário do Matheus).');
        return false;
      }
      if (!hostNames.trim()) {
        setErrorMessage('Por favor, informe quem está convidando (ex: Os pais Camila & Lucas).');
        return false;
      }
      if (!eventDate.trim()) {
        setErrorMessage('Por favor, informe a data do evento.');
        return false;
      }
      if (!eventTime.trim()) {
        setErrorMessage('Por favor, informe o horário do evento.');
        return false;
      }
      if (!address.trim()) {
        setErrorMessage('Por favor, informe o endereço ou local da celebração.');
        return false;
      }
    }

    if (step === 3) {
      if (!themeId) {
        setErrorMessage('Por favor, selecione um tema visual.');
        return false;
      }
    }

    if (step === 4) {
      if (!planId) {
        setErrorMessage('Por favor, escolha um plano.');
        return false;
      }
    }

    if (step === 5) {
      if (!customerName.trim() || customerName.trim().length < 3) {
        setErrorMessage('Por favor, informe seu nome completo.');
        return false;
      }
      if (!customerPhone.trim() || customerPhone.trim().replace(/\D/g, '').length < 10) {
        setErrorMessage('Por favor, informe um WhatsApp válido com DDD.');
        return false;
      }
      if (!customerEmail.trim() || !customerEmail.includes('@')) {
        setErrorMessage('Por favor, informe um e-mail válido.');
        return false;
      }
      if (!customerCity.trim()) {
        setErrorMessage('Por favor, informe sua cidade.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPlan = INVITATION_PLANS_LIST.find((p) => p.id === planId) || INVITATION_PLANS_LIST[1];
  const selectedTheme = INVITATION_AUTHORIAL_THEMES.find((t) => t.id === themeId) || INVITATION_AUTHORIAL_THEMES[0];
  const selectedEventTypeMeta = INVITATION_EVENT_TYPES.find((t) => t.id === eventType) || INVITATION_EVENT_TYPES[0];

  const handleSubmitOrder = async () => {
    if (!acceptedTerms) {
      setErrorMessage('Você deve concordar com os termos de contratação para finalizar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/orders/invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          plan: planId,
          themeId,
          title,
          honoreeName,
          hostNames,
          eventDate,
          eventTime,
          venueName,
          address,
          dressCode,
          giftInformation,
          openingMessage,
          customerName,
          customerPhone,
          customerEmail,
          customerCity,
          customerState,
          notes,
          coverPhotoUrl: coverPhotoUrl || (photoFiles.length > 0 ? photoFiles[0].url : ''),
          photoUrls: photoFiles.map((p) => p.url),
          photoLinks: photoLinks.trim(),
          acceptedTerms: true,
          honeypot: '',
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Erro ao processar pedido.');
      }

      // Redireciona para página de sucesso
      router.push(
        `/pedido/convite/sucesso?codigo=${encodeURIComponent(
          resData.orderCode
        )}&slug=${encodeURIComponent(resData.eventSlug || '')}&plano=${encodeURIComponent(
          planId
        )}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na comunicação com o servidor.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Step Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C96E5A]">
              Convite Feito de Nós • Passo {currentStep} de 6
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#713C48] font-bold">
              {STEPS[currentStep - 1].title}
            </h1>
          </div>
          <span className="text-sm font-semibold text-[#713C48] bg-[#713C48]/10 px-3 py-1 rounded-full">
            {formatCentsToReais(selectedPlan.priceCents)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#713C48]/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#C96E5A] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Ocasião */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#713C48]/15 shadow-sm">
            <h2 className="font-serif text-xl text-[#713C48] font-bold mb-2">
              Qual celebração você está preparando?
            </h2>
            <p className="text-sm text-[#302B2D]/75 mb-6">
              Selecione o tipo de evento para adaptarmos os campos e a linguagem do seu convite.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {INVITATION_EVENT_TYPES.map((type) => {
                const isSelected = eventType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEventType(type.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#C96E5A] bg-[#C96E5A]/10 shadow-sm'
                        : 'border-[#713C48]/10 bg-white hover:border-[#713C48]/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif font-bold text-sm text-[#713C48]">
                          {type.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#C96E5A] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#302B2D]/70 line-clamp-2">
                        {type.shortDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Detalhes do Evento */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#713C48]/15 shadow-sm space-y-5">
            <div>
              <h2 className="font-serif text-xl text-[#713C48] font-bold mb-1">
                Informações da Celebração
              </h2>
              <p className="text-xs sm:text-sm text-[#302B2D]/75">
                Esses dados aparecerão destacados na página do seu convite e na agenda dos convidados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Título do Convite *
                </label>
                <input
                  type="text"
                  placeholder="Ex: 1º Aninho do Matheus Akira ou Casamento de Camila & Lucas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Homenageado(a) / Noivos / Formando(a)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Matheus Akira"
                  value={honoreeName}
                  onChange={(e) => setHonoreeName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Quem está convidando (Anfitriões) *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Camila & Lucas ou Família Silva"
                  value={hostNames}
                  onChange={(e) => setHostNames(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Horário de Início *
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Nome do Local / Espaço (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Villa Encantada Buffet ou Espaço Jardim Real"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Traje sugerido / Dress Code (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Esporte fino, casual arrumadinho, branco"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Endereço Completo para GPS/Maps *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Alameda das Hortênsias, 420 - Jardim América, São Paulo - SP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Informações de Presentes ou Chave Pix (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Chave Pix (celular) 11999999999 ou sugestão de fraldas G/XG"
                  value={giftInformation}
                  onChange={(e) => setGiftInformation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Mensagem Afetiva dos Anfitriões (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Um recado carinhoso que será exibido em destaque no convite..."
                  value={openingMessage}
                  onChange={(e) => setOpeningMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              {/* Fotos e Mídias (Arquivos ou Links) */}
              <div className="sm:col-span-2 pt-4 border-t border-[#713C48]/15 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#713C48] uppercase tracking-wider">
                      Fotos do Convite & Capa (Opcional)
                    </label>
                    <p className="text-xs text-[#302B2D]/70">
                      Envie arquivos do celular/PC ou informe links da nuvem (Google Drive, OneDrive, etc.).
                    </p>
                  </div>

                  {/* Mode switcher */}
                  <div className="inline-flex p-1 rounded-xl bg-white border border-[#713C48]/20 self-start text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setPhotoInputMode('files')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        photoInputMode === 'files'
                          ? 'bg-[#713C48] text-[#FFF8F0] shadow-xs'
                          : 'text-[#302B2D]/75 hover:text-[#713C48]'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Arquivos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoInputMode('url')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        photoInputMode === 'url'
                          ? 'bg-[#713C48] text-[#FFF8F0] shadow-xs'
                          : 'text-[#302B2D]/75 hover:text-[#713C48]'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>URL / Nuvem</span>
                    </button>
                  </div>
                </div>

                {/* Mode: Files */}
                {photoInputMode === 'files' && (
                  <div className="p-5 rounded-2xl bg-white border border-dashed border-[#713C48]/30 flex flex-col items-center justify-center text-center space-y-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#C96E5A]/10 flex items-center justify-center text-[#C96E5A]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#713C48] text-white text-xs font-bold hover:bg-[#5a2e39] transition-all shadow-xs">
                        {isUploadingPhotos ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Enviando fotos...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Escolher Fotos do Celular ou Computador</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadFiles}
                          disabled={isUploadingPhotos}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-[#302B2D]/60">
                      Você pode selecionar várias fotos de uma vez (JPG, PNG ou WebP).
                    </p>
                  </div>
                )}

                {/* Mode: URL / Drive */}
                {photoInputMode === 'url' && (
                  <div className="p-4 rounded-2xl bg-white border border-[#713C48]/20 space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#713C48] mb-1">
                        Link de Pasta na Nuvem (Google Drive, Dropbox, OneDrive, iCloud)
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/drive/folders/..."
                        value={photoLinks}
                        onChange={(e) => setPhotoLinks(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#713C48]/20 bg-[#FFF8F0]/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                      />
                      <p className="text-[11px] text-[#302B2D]/60 mt-1">
                        Lembre-se de deixar a pasta com permissão de visualização pública ou compartilhada.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#713C48]/10">
                      <label className="block text-xs font-semibold text-[#713C48] mb-1">
                        Ou Adicionar Imagem Direta por Link / URL Web
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://exemplo.com/foto-do-aniversario.jpg"
                          value={singlePhotoUrl}
                          onChange={(e) => setSinglePhotoUrl(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-xl border border-[#713C48]/20 bg-[#FFF8F0]/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoFromUrl}
                          disabled={!singlePhotoUrl.trim()}
                          className="px-4 py-2 rounded-xl bg-[#713C48] text-white text-xs font-semibold hover:bg-[#5a2e39] transition-all flex items-center gap-1 disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Previews of attached photos */}
                {photoFiles.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#713C48]">
                        {photoFiles.length} foto(s) anexada(s):
                      </span>
                      <span className="text-[11px] text-[#302B2D]/60">
                        Clique em &quot;Capa&quot; para definir a foto principal
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {photoFiles.map((photo, pIdx) => {
                        const isCover = coverPhotoUrl === photo.url || (!coverPhotoUrl && pIdx === 0);
                        return (
                          <div
                            key={photo.url + pIdx}
                            className={`group relative rounded-xl overflow-hidden border bg-white aspect-square flex flex-col justify-between shadow-xs transition-all ${
                              isCover ? 'ring-2 ring-[#C96E5A] border-[#C96E5A]' : 'border-[#713C48]/20'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Cover Badge */}
                            {isCover && (
                              <span className="absolute top-1.5 left-1.5 bg-[#C96E5A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Capa
                              </span>
                            )}

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.url)}
                                className="self-end p-1 rounded-md bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                                title="Remover foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => setCoverPhotoUrl(photo.url)}
                                  className="w-full py-1 rounded bg-white/95 text-[#713C48] text-[10px] font-bold hover:bg-white transition-colors"
                                >
                                  Usar como Capa
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-[#302B2D]/65 bg-white/60 p-2.5 rounded-xl border border-[#713C48]/10">
                  💡 <strong>Fique tranquilo:</strong> Caso prefira, você também poderá nos enviar ou complementar suas fotos diretamente pelo WhatsApp após concluir o pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Tema Visual Autoral */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#713C48]/15 shadow-sm space-y-4">
            <div>
              <h2 className="font-serif text-xl text-[#713C48] font-bold mb-1">
                Escolha o Tema e Estilo Visual
              </h2>
              <p className="text-xs sm:text-sm text-[#302B2D]/75">
                Nossos temas foram desenhados com harmonia de cores, tipografia elegante e elementos nobres, incluindo os personagens infantis favoritos.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'todos', label: 'Todos os Temas' },
                { id: 'personagens', label: '⭐ Personagens Infantis' },
                { id: 'infantil', label: 'Infantil Suave & Bebê' },
                { id: 'romantico', label: 'Casamento & Romântico' },
                { id: 'classico', label: 'Clássico & Religioso' },
                { id: 'celebracao', label: 'Festas & Moderno' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setThemeFilterCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    themeFilterCategory === cat.id
                      ? 'bg-[#713C48] text-[#FFF8F0] shadow-sm'
                      : 'bg-white text-[#713C48] border border-[#713C48]/20 hover:border-[#713C48]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {INVITATION_AUTHORIAL_THEMES.filter((theme) => {
                if (themeFilterCategory === 'todos') return true;
                if (themeFilterCategory === 'personagens') return theme.category === 'personagens';
                if (themeFilterCategory === 'infantil') return theme.category === 'infantil';
                if (themeFilterCategory === 'romantico') return theme.category === 'romantico';
                if (themeFilterCategory === 'classico') return theme.category === 'classico';
                if (themeFilterCategory === 'celebracao') return theme.category === 'celebracao' || theme.category === 'moderno' || theme.category === 'botanico';
                return true;
              }).map((theme) => {
                const isSelected = themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#C96E5A] bg-[#C96E5A]/10 shadow-md ring-2 ring-[#C96E5A]'
                        : 'border-[#713C48]/15 bg-white hover:border-[#713C48]/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#713C48]">
                            {theme.name}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#C96E5A] shrink-0" />
                        )}
                      </div>

                      {/* Theme Category Badge */}
                      <div className="mb-3">
                        {theme.category === 'personagens' && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            ⭐ Personagem Infantil
                          </span>
                        )}
                        {theme.category === 'infantil' && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            Infantil & Bebê
                          </span>
                        )}
                        {theme.category === 'romantico' && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">
                            Romântico & Casamento
                          </span>
                        )}
                        {theme.category === 'classico' && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            Clássico & Nobre
                          </span>
                        )}
                        {(theme.category === 'celebracao' || theme.category === 'moderno' || theme.category === 'botanico') && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Festa & Celebração
                          </span>
                        )}
                      </div>

                      {/* Color dots preview */}
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: theme.previewColors.primary }}
                          title="Cor Principal"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: theme.previewColors.accent }}
                          title="Destaque"
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: theme.previewColors.background }}
                          title="Fundo"
                        />
                      </div>

                      <p className="text-xs text-[#302B2D]/75 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Escolha do Plano */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#713C48]/15 shadow-sm space-y-4">
            <div>
              <h2 className="font-serif text-xl text-[#713C48] font-bold mb-1">
                Selecione o Plano Ideal
              </h2>
              <p className="text-xs sm:text-sm text-[#302B2D]/75">
                Todos os planos contam com nossa curadoria artesanal e suporte atencioso.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {INVITATION_PLANS_LIST.map((plan) => {
                const isSelected = planId === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#C96E5A] bg-[#C96E5A]/10 shadow-md ring-2 ring-[#C96E5A]'
                        : 'border-[#713C48]/15 bg-white hover:border-[#713C48]/30'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#C96E5A] text-white">
                        {plan.badge}
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-[#713C48]">
                          {plan.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#C96E5A] shrink-0" />
                        )}
                      </div>

                      <div className="text-2xl font-extrabold text-[#713C48]">
                        {formatCentsToReais(plan.priceCents)}
                      </div>

                      <p className="text-xs text-[#302B2D]/70 min-h-[32px]">
                        {plan.tagline}
                      </p>

                      <div className="pt-2 text-[11px] font-semibold text-[#C96E5A]">
                        Ativo por {plan.retentionDays} dias
                      </div>

                      <ul className="pt-3 border-t border-[#713C48]/10 space-y-1.5 text-xs text-[#302B2D]/80">
                        {plan.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C96E5A]" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Contato do Contratante */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#713C48]/15 shadow-sm space-y-5">
            <div>
              <h2 className="font-serif text-xl text-[#713C48] font-bold mb-1">
                Seus Dados para Contato
              </h2>
              <p className="text-xs sm:text-sm text-[#302B2D]/75">
                Usaremos essas informações para enviar o link do convite e alinhar a aprovação.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Camila Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Seu E-mail *
                </label>
                <input
                  type="email"
                  placeholder="camila@exemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Cidade *
                </label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Estado (UF) *
                </label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="SP"
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#713C48] mb-1.5">
                  Observações ou Pedidos Especiais (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Alguma orientação específica para a nossa equipe de design?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#713C48]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Resumo e Confirmação */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FFF8F0] p-6 sm:p-8 rounded-3xl border border-[#713C48]/15 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl text-[#713C48] font-bold mb-1">
                Revise seu Pedido de Convite
              </h2>
              <p className="text-xs sm:text-sm text-[#302B2D]/75">
                Confira os detalhes abaixo antes de confirmar o seu pedido.
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-white rounded-2xl p-5 border border-[#713C48]/10 space-y-4 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#713C48]/10">
                <span className="font-semibold text-[#713C48]">Plano Selecionado:</span>
                <span className="font-bold text-[#713C48]">{selectedPlan.name} ({formatCentsToReais(selectedPlan.priceCents)})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#302B2D]/80">
                <div>
                  <strong className="text-[#713C48]">Celebração:</strong> {title}
                </div>
                <div>
                  <strong className="text-[#713C48]">Ocasião:</strong> {selectedEventTypeMeta.title}
                </div>
                <div>
                  <strong className="text-[#713C48]">Anfitriões:</strong> {hostNames}
                </div>
                <div>
                  <strong className="text-[#713C48]">Data & Hora:</strong> {eventDate} às {eventTime}
                </div>
                <div>
                  <strong className="text-[#713C48]">Local:</strong> {venueName || address}
                </div>
                <div>
                  <strong className="text-[#713C48]">Tema Visual:</strong> {selectedTheme.name}
                </div>
                <div>
                  <strong className="text-[#713C48]">Contato:</strong> {customerName} ({customerPhone})
                </div>
                <div>
                  <strong className="text-[#713C48]">Permanência:</strong> {selectedPlan.retentionDays} dias online
                </div>
                <div className="sm:col-span-2 pt-1 border-t border-[#713C48]/10 flex items-center gap-2">
                  <strong className="text-[#713C48]">Fotos & Mídias:</strong>
                  {photoFiles.length > 0 ? (
                    <span className="text-emerald-700 font-medium">
                      {photoFiles.length} foto(s) anexada(s) {coverPhotoUrl ? '(foto de capa inclusa)' : ''}
                    </span>
                  ) : photoLinks ? (
                    <span className="text-emerald-700 font-medium">Link de álbum na nuvem informado</span>
                  ) : (
                    <span className="text-slate-500 italic">Poderá enviar posteriormente pelo WhatsApp</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#713C48]/10 flex items-center justify-between">
                <span className="font-bold text-base text-[#713C48]">Total do Pedido:</span>
                <span className="font-serif text-2xl font-extrabold text-[#713C48]">
                  {formatCentsToReais(selectedPlan.priceCents)}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 rounded border-[#713C48]/30 text-[#713C48] focus:ring-[#713C48] mt-0.5"
              />
              <span className="text-xs text-[#302B2D]/80 leading-relaxed">
                Concordo com os termos de prestação de serviços do <strong>Feito de Nós</strong> e autorizo o início da produção artesanal do meu convite interativo.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#713C48]/25 text-[#713C48] font-semibold text-sm hover:bg-[#713C48]/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md"
          >
            <span>Avançar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#C96E5A] text-white font-bold text-sm hover:bg-[#b05845] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando Pedido...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar e Enviar Pedido</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
