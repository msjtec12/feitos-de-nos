'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { OrderFormData } from '@/types/order';
import { maskPhone, maskCep, fetchCepAddress } from '@/lib/order-utils';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckSquare,
  Square,
  AlertCircle,
  Search,
  CheckCircle2,
  Loader2,
  Home,
  Sparkles,
} from 'lucide-react';

interface StepCustomerProps {
  formData: OrderFormData;
  updateForm: (fields: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isPhysical: boolean;
}

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export function StepCustomer({
  formData,
  updateForm,
  onNext,
  onBack,
  isPhysical,
}: StepCustomerProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepVerified, setCepVerified] = useState<boolean | null>(null);
  const [cepFeedbackMessage, setCepFeedbackMessage] = useState<string>('');

  // Handle CEP Lookup
  const handleLookupCep = useCallback(
    async (rawCep: string) => {
      const clean = rawCep.replace(/\D/g, '');
      if (clean.length !== 8) {
        setCepVerified(null);
        setCepFeedbackMessage('');
        return;
      }

      setIsSearchingCep(true);
      setCepFeedbackMessage('Verificando CEP nos Correios...');
      setCepVerified(null);

      const result = await fetchCepAddress(clean);
      setIsSearchingCep(false);

      if (result) {
        setCepVerified(true);
        const street = result.logradouro || formData.customerStreet || '';
        const neighborhood = result.bairro || formData.customerNeighborhood || '';
        const city = result.localidade || formData.customerCity;
        const state = result.uf || formData.customerState;

        updateForm({
          customerCity: city,
          customerState: state,
          customerStreet: street,
          customerNeighborhood: neighborhood,
        });

        setCepFeedbackMessage(
          `Endereço verificado: ${street ? street + ' - ' : ''}${neighborhood ? neighborhood + ', ' : ''}${city}/${state}`
        );

        // Clear any previous CEP or city error
        setErrors((prev) => ({
          ...prev,
          customerCep: '',
          customerCity: '',
          customerState: '',
          customerStreet: '',
        }));
      } else {
        setCepVerified(false);
        setCepFeedbackMessage('CEP não localizado. Verifique os dígitos ou preencha o endereço manualmente.');
      }
    },
    [formData.customerStreet, formData.customerNeighborhood, formData.customerCity, formData.customerState, updateForm]
  );

  // Auto trigger lookup if CEP is already 8 digits on mount (e.g. from localStorage)
  useEffect(() => {
    if (formData.customerCep && formData.customerCep.replace(/\D/g, '').length === 8 && cepVerified === null) {
      handleLookupCep(formData.customerCep);
    }
  }, [formData.customerCep, cepVerified, handleLookupCep]);

  const handleCepChange = (val: string) => {
    const masked = maskCep(val);
    updateForm({ customerCep: masked });
    const clean = masked.replace(/\D/g, '');
    if (clean.length === 8) {
      handleLookupCep(clean);
    } else {
      setCepVerified(null);
      setCepFeedbackMessage('');
    }
  };

  const validateAndNext = () => {
    const errs: Record<string, string> = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 3) {
      errs.customerName = 'Informe seu nome completo (ao menos 3 caracteres).';
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errs.customerPhone = 'Informe um número de WhatsApp válido com DDD.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail.trim() || !emailRegex.test(formData.customerEmail.trim())) {
      errs.customerEmail = 'Informe um e-mail válido para envio do comprovante.';
    }

    if (!formData.customerCity.trim()) {
      errs.customerCity = 'Informe a sua cidade.';
    }

    if (!formData.customerState.trim()) {
      errs.customerState = 'Selecione o estado.';
    }

    if (isPhysical) {
      const cleanCep = (formData.customerCep || '').replace(/\D/g, '');
      if (cleanCep.length < 8) {
        errs.customerCep = 'Informe o CEP completo (8 dígitos) para entrega.';
      }
      if (!formData.customerStreet?.trim()) {
        errs.customerStreet = 'Informe a rua / logradouro para a entrega.';
      }
      if (!formData.customerNumber?.trim()) {
        errs.customerNumber = 'Informe o número do endereço.';
      }
    }

    if (!formData.acceptedTerms) {
      errs.acceptedTerms = 'Você precisa aceitar os termos para continuar.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center sm:text-left space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#713C48]">
          Seus dados de contato e entrega
        </h2>
        <p className="text-sm sm:text-base text-[#302B2D]/75">
          Usaremos estes dados para enviar as orientações no WhatsApp e realizar a entrega com total segurança.
        </p>
      </div>

      <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-6 sm:p-8 space-y-7 shadow-sm">
        {/* Contact Info Block */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C96E5A] block">
            Informações do Comprador
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label
                htmlFor="customerName"
                className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
              >
                <User className="w-4 h-4 text-[#C96E5A]" />
                <span>Seu Nome Completo *</span>
              </label>
              <input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => {
                  updateForm({ customerName: e.target.value });
                  if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                }}
                placeholder="Ex: Ana Clara Silva"
                maxLength={80}
                className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                  errors.customerName ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="customerPhone"
                className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
              >
                <Phone className="w-4 h-4 text-[#C96E5A]" />
                <span>WhatsApp (com DDD) *</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => {
                  updateForm({ customerPhone: maskPhone(e.target.value) });
                  if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
                }}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                  errors.customerPhone ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-500 mt-1">{errors.customerPhone}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="customerEmail"
              className="flex items-center gap-2 text-sm font-semibold text-[#713C48]"
            >
              <Mail className="w-4 h-4 text-[#C96E5A]" />
              <span>E-mail *</span>
            </label>
            <input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => {
                updateForm({ customerEmail: e.target.value });
                if (errors.customerEmail) setErrors((prev) => ({ ...prev, customerEmail: '' }));
              }}
              placeholder="seuemail@exemplo.com"
              maxLength={80}
              className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                errors.customerEmail ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
              } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
            />
            {errors.customerEmail && (
              <p className="text-xs text-red-500 mt-1">{errors.customerEmail}</p>
            )}
          </div>
        </div>

        {/* Location / Physical Delivery Section with CEP Verification */}
        <div className="pt-6 border-t border-[#713C48]/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#713C48]">
              {isPhysical ? <Truck className="w-4 h-4 text-[#C96E5A]" /> : <MapPin className="w-4 h-4 text-[#C96E5A]" />}
              <span>{isPhysical ? 'Endereço de Entrega (Verificado por CEP) *' : 'Sua Localidade'}</span>
            </div>
            {isPhysical && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C96E5A]/15 text-[#C96E5A]">
                Item Físico Selecionado
              </span>
            )}
          </div>

          {/* CEP Input with Search Trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-6 space-y-1.5">
              <label htmlFor="customerCep" className="flex items-center justify-between text-xs font-semibold text-[#713C48]">
                <span>CEP {isPhysical ? '*' : '(Opcional para autocompletar)'}</span>
                <span className="text-[10px] text-[#302B2D]/60 font-normal">Digite os 8 números</span>
              </label>
              <div className="relative">
                <input
                  id="customerCep"
                  type="text"
                  value={formData.customerCep || ''}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                    errors.customerCep ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                  } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] pr-10`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#713C48]">
                  {isSearchingCep ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#C96E5A]" />
                  ) : cepVerified === true ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Search className="w-4 h-4 opacity-40" />
                  )}
                </div>
              </div>
              {errors.customerCep && (
                <p className="text-xs text-red-500 mt-1">{errors.customerCep}</p>
              )}
            </div>

            <div className="sm:col-span-6 flex items-center">
              <button
                type="button"
                onClick={() => handleLookupCep(formData.customerCep || '')}
                disabled={isSearchingCep || !formData.customerCep || formData.customerCep.replace(/\D/g, '').length < 8}
                className="w-full py-3 px-4 rounded-2xl bg-[#713C48]/10 hover:bg-[#713C48] text-[#713C48] hover:text-[#FFF8F0] text-xs font-semibold transition-colors disabled:opacity-40 disabled:hover:bg-[#713C48]/10 disabled:hover:text-[#713C48]"
              >
                {isSearchingCep ? 'Buscando nos Correios...' : 'Verificar endereço pelo CEP'}
              </button>
            </div>
          </div>

          {/* CEP Feedback Banner */}
          {cepFeedbackMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 transition-all ${
                cepVerified === true
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : cepVerified === false
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/20'
              }`}
            >
              {cepVerified === true ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{cepFeedbackMessage}</span>
            </div>
          )}

          {/* Detailed Address Grid (Auto-populated from CEP) */}
          <div className="space-y-4">
            {/* Street / Logradouro (Physical Orders) */}
            {isPhysical && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1.5">
                  <label htmlFor="customerStreet" className="flex items-center gap-1.5 text-xs font-semibold text-[#713C48]">
                    <Home className="w-3.5 h-3.5 text-[#C96E5A]" />
                    <span>Rua / Logradouro *</span>
                  </label>
                  <input
                    id="customerStreet"
                    type="text"
                    value={formData.customerStreet || ''}
                    onChange={(e) => {
                      updateForm({ customerStreet: e.target.value });
                      if (errors.customerStreet) setErrors((prev) => ({ ...prev, customerStreet: '' }));
                    }}
                    placeholder="Ex: Travessa Alfredo Eduardo Noronha"
                    className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                      errors.customerStreet ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                    } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]`}
                  />
                  {errors.customerStreet && (
                    <p className="text-xs text-red-500 mt-1">{errors.customerStreet}</p>
                  )}
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label htmlFor="customerNumber" className="text-xs font-semibold text-[#713C48]">
                    Número *
                  </label>
                  <input
                    id="customerNumber"
                    type="text"
                    value={formData.customerNumber || ''}
                    onChange={(e) => {
                      updateForm({ customerNumber: e.target.value });
                      if (errors.customerNumber) setErrors((prev) => ({ ...prev, customerNumber: '' }));
                    }}
                    placeholder="Ex: 120"
                    className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                      errors.customerNumber ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                    } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]`}
                  />
                  {errors.customerNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.customerNumber}</p>
                  )}
                </div>
              </div>
            )}

            {/* Neighborhood & Complement (Physical Orders) */}
            {isPhysical && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="customerNeighborhood" className="text-xs font-semibold text-[#713C48]">
                    Bairro
                  </label>
                  <input
                    id="customerNeighborhood"
                    type="text"
                    value={formData.customerNeighborhood || ''}
                    onChange={(e) => updateForm({ customerNeighborhood: e.target.value })}
                    placeholder="Ex: Jardim Wilma Flor"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="customerComplement" className="text-xs font-semibold text-[#713C48]">
                    Complemento (Opcional)
                  </label>
                  <input
                    id="customerComplement"
                    type="text"
                    value={formData.customerComplement || ''}
                    onChange={(e) => updateForm({ customerComplement: e.target.value })}
                    placeholder="Ex: Apto 32, Bloco B"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48]"
                  />
                </div>
              </div>
            )}

            {/* City & State (For All Orders) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="customerCity"
                  className="flex items-center gap-2 text-xs font-semibold text-[#713C48]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C96E5A]" />
                  <span>Cidade *</span>
                </label>
                <input
                  id="customerCity"
                  type="text"
                  value={formData.customerCity}
                  onChange={(e) => {
                    updateForm({ customerCity: e.target.value });
                    if (errors.customerCity) setErrors((prev) => ({ ...prev, customerCity: '' }));
                  }}
                  placeholder="Ex: São Paulo"
                  maxLength={50}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                    errors.customerCity ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                  } text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
                />
                {errors.customerCity && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerCity}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="customerState"
                  className="flex items-center gap-2 text-xs font-semibold text-[#713C48]"
                >
                  <span>Estado (UF) *</span>
                </label>
                <select
                  id="customerState"
                  value={formData.customerState}
                  onChange={(e) => {
                    updateForm({ customerState: e.target.value });
                    if (errors.customerState) setErrors((prev) => ({ ...prev, customerState: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border ${
                    errors.customerState ? 'border-red-400 ring-2 ring-red-100' : 'border-[#713C48]/20'
                  } text-[#302B2D] text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] transition-all`}
                >
                  <option value="">Selecione...</option>
                  {BRAZIL_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.customerState && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerState}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-1.5 pt-2">
          <label htmlFor="notes" className="text-xs font-semibold text-[#302B2D]/80">
            Observações ou pedidos especiais (Opcional)
          </label>
          <textarea
            id="notes"
            rows={2}
            value={formData.notes || ''}
            onChange={(e) => updateForm({ notes: e.target.value })}
            placeholder="Alguma data limite, surpresa especial ou detalhe que queira nos adiantar?"
            className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8F0] border border-[#713C48]/20 text-[#302B2D] placeholder-[#302B2D]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#713C48] resize-none"
          />
        </div>

        {/* Terms Consent */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => {
              const nextVal = !formData.acceptedTerms;
              updateForm({ acceptedTerms: nextVal });
              if (nextVal && errors.acceptedTerms) {
                setErrors((prev) => ({ ...prev, acceptedTerms: '' }));
              }
            }}
            className="flex items-start gap-3 text-left group focus-visible:outline-none"
          >
            <div className="mt-0.5 text-[#713C48]">
              {formData.acceptedTerms ? (
                <CheckSquare className="w-5 h-5 text-[#713C48]" />
              ) : (
                <Square className="w-5 h-5 text-[#302B2D]/40 group-hover:text-[#713C48]" />
              )}
            </div>
            <span className="text-xs sm:text-sm text-[#302B2D]/85 leading-relaxed">
              Li e concordo com os{' '}
              <Link
                href="/termos"
                target="_blank"
                className="text-[#713C48] underline font-semibold hover:text-[#C96E5A]"
                onClick={(e) => e.stopPropagation()}
              >
                Termos do Pedido
              </Link>{' '}
              e com a{' '}
              <Link
                href="/privacidade"
                target="_blank"
                className="text-[#713C48] underline font-semibold hover:text-[#C96E5A]"
                onClick={(e) => e.stopPropagation()}
              >
                Política de Privacidade
              </Link>
              , autorizando o contato para envio de materiais pelo WhatsApp. *
            </span>
          </button>
          {errors.acceptedTerms && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 mt-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.acceptedTerms}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#713C48]/10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full text-sm font-semibold text-[#713C48] hover:bg-[#713C48]/10 transition-colors"
        >
          ← Voltar
        </button>

        <button
          type="button"
          onClick={validateAndNext}
          className="px-8 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
        >
          Revisar Pedido →
        </button>
      </div>
    </div>
  );
}
