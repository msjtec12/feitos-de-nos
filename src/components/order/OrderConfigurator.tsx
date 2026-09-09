'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderFormData, OccasionId, FormatId, StyleId, PreparedOrder } from '@/types/order';
import { GIFT_FORMATS } from '@/data/home-data';
import {
  generateOrderCode,
  formatCurrency,
  getFormatPrice,
  saveOrderDraft,
  loadOrderDraft,
  savePreparedOrder,
} from '@/lib/order-utils';
import { OrderStepper } from './OrderStepper';
import { StepOccasion } from './StepOccasion';
import { StepFormat } from './StepFormat';
import { StepRecipient } from './StepRecipient';
import { StepContent } from './StepContent';
import { StepStyle } from './StepStyle';
import { StepCustomer } from './StepCustomer';
import { StepReview } from './StepReview';

const INITIAL_FORM_DATA: OrderFormData = {
  occasion: 'primeiro-ano',
  format: 'interativo',
  recipientName: '',
  recipientRelationship: '',
  recipientDate: '',
  giftTitle: '',
  openingMessage: '',
  contentTypes: {
    photos: true,
    messages: true,
    audios: true,
    video: false,
    music: false,
    contributors: true,
  },
  style: 'infantil-suave',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerCity: '',
  customerState: 'SP',
  customerCep: '',
  customerStreet: '',
  notes: '',
  acceptedTerms: false,
};

export function OrderConfigurator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from LocalStorage and URL searchParams
  useEffect(() => {
    const savedDraft = loadOrderDraft();
    let initial = savedDraft || INITIAL_FORM_DATA;

    const paramColecao = searchParams.get('colecao') as OccasionId | null;
    const paramFormato = searchParams.get('formato') as FormatId | null;

    if (paramColecao && ['primeiro-ano', 'nossa-historia', 'vozes', 'especial'].includes(paramColecao)) {
      initial = { ...initial, occasion: paramColecao };
    }

    if (paramFormato && ['digital', 'cartao', 'interativo'].includes(paramFormato)) {
      initial = { ...initial, format: paramFormato };
    }

    setFormData(initial);
    setIsHydrated(true);
  }, [searchParams]);

  // Persist form changes
  const updateForm = (fields: Partial<OrderFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...fields };
      saveOrderDraft(updated);
      return updated;
    });
  };

  const handleNext = () => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 7);
      setMaxReachedStep((m) => Math.max(m, next));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return next;
    });
  };

  const handleBack = () => {
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return next;
    });
  };

  const handleJumpToStep = (step: number) => {
    if (step <= maxReachedStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const code = generateOrderCode();
    const totalPrice = getFormatPrice(formData.format);

    const preparedOrder: PreparedOrder = {
      code,
      createdAt: new Date().toISOString(),
      data: formData,
      totalPrice,
      formattedTotal: formatCurrency(totalPrice),
    };

    savePreparedOrder(preparedOrder);
    router.push('/pedido/preparado');
  };

  const isPhysical = GIFT_FORMATS.find((f) => f.id === formData.format)?.isPhysical ?? false;

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-[#713C48]">
        <div className="w-8 h-8 mx-auto border-3 border-[#713C48] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium">Carregando configurador...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Stepper Bar */}
      <OrderStepper
        currentStep={currentStep}
        totalSteps={7}
        onSelectStep={handleJumpToStep}
        maxReachedStep={maxReachedStep}
      />

      {/* Dynamic Step Panels */}
      <div className="mt-4">
        {currentStep === 1 && (
          <StepOccasion
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <StepFormat
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <StepRecipient
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <StepContent
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <StepStyle
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 6 && (
          <StepCustomer
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
            isPhysical={isPhysical}
          />
        )}

        {currentStep === 7 && (
          <StepReview
            formData={formData}
            onJumpToStep={handleJumpToStep}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
