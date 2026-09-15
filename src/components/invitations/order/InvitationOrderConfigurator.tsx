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

  const [themeId, setThemeId] = useState('infantil-delicado');
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
    } else if (eventType === 'batizado' || eventType === 'primeira-comunhao') {
      setThemeId('religioso');
    } else if (eventType === '15-anos' || eventType === 'bodas') {
      setThemeId('elegante');
    }
  }, [eventType]);

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
                Escolha a Paleta e o Estilo Visual
              </h2>
              <p className="text-xs sm:text-sm text-[#302B2D]/75">
                Nossos temas autorais foram desenhados com harmonia de cores, tipografia elegante e elementos nobres.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {INVITATION_AUTHORIAL_THEMES.map((theme) => {
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
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-serif font-bold text-base text-[#713C48]">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#C96E5A] shrink-0" />
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
