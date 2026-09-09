'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface OrderStepperProps {
  currentStep: number;
  totalSteps: number;
  onSelectStep?: (step: number) => void;
  maxReachedStep: number;
}

const STEP_LABELS = [
  'Ocasião',
  'Formato',
  'Presenteado',
  'Conteúdos',
  'Estilo',
  'Seus Dados',
  'Revisão',
];

export function OrderStepper({
  currentStep,
  totalSteps,
  onSelectStep,
  maxReachedStep,
}: OrderStepperProps) {
  return (
    <div className="w-full py-4 mb-8">
      {/* Mobile Step Header */}
      <div className="flex sm:hidden items-center justify-between mb-3 text-sm">
        <span className="font-semibold text-[#713C48]">
          Etapa {currentStep} de {totalSteps}: {STEP_LABELS[currentStep - 1]}
        </span>
        <span className="text-xs text-[#302B2D]/60 font-mono">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>

      {/* Progress Bar (Mobile & Desktop) */}
      <div className="w-full h-2 bg-[#713C48]/10 rounded-full overflow-hidden mb-6 sm:mb-8">
        <div
          className="h-full bg-gradient-to-r from-[#C96E5A] to-[#713C48] transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Desktop Step Badges */}
      <nav aria-label="Progresso do pedido" className="hidden sm:flex items-center justify-between relative">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCurrent = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          const canClick = onSelectStep && stepNum <= maxReachedStep;

          return (
            <button
              key={stepNum}
              type="button"
              disabled={!canClick}
              onClick={() => canClick && onSelectStep(stepNum)}
              className={`flex flex-col items-center group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded-xl p-1 ${
                canClick ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-[#713C48] text-[#FFF8F0]'
                    : isCurrent
                    ? 'bg-[#C96E5A] text-[#FFF8F0] ring-4 ring-[#C96E5A]/20 scale-110'
                    : 'bg-white border border-[#713C48]/20 text-[#302B2D]/50 group-hover:border-[#713C48]/50'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium transition-colors ${
                  isCurrent
                    ? 'text-[#713C48] font-bold'
                    : isCompleted
                    ? 'text-[#302B2D]/80'
                    : 'text-[#302B2D]/40'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
