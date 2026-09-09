'use client';

import React, { useState } from 'react';
import { ProductionChecklistState, DEFAULT_PRODUCTION_CHECKLIST } from '@/types/admin';
import { CheckSquare, Square, Save, Loader2, Sparkles, Truck } from 'lucide-react';

interface ProductionChecklistProps {
  orderId: string;
  isPhysical: boolean;
  initialNotes?: string | null;
  onSaveNotes?: (notes: string) => Promise<void>;
}

interface ChecklistItem {
  key: keyof ProductionChecklistState;
  label: string;
  physicalOnly?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { key: 'contentReceived', label: 'Conteúdo (fotos, textos e áudios) recebido' },
  { key: 'pageAssembled', label: 'Experiência digital montada no editor' },
  { key: 'clientApproved', label: 'Cliente aprovou a prévia da página' },
  { key: 'acrylicArtApproved', label: 'Arte da placa de acrílico/cartão validada', physicalOnly: true },
  { key: 'paymentConfirmed', label: 'Pagamento integral ou sinal confirmado' },
  { key: 'sentToProduction', label: 'Enviado para a produção física/gráfica', physicalOnly: true },
  { key: 'qualityChecked', label: 'Produto final conferido com cuidado', physicalOnly: true },
  { key: 'packagingPrepared', label: 'Embalagem de presente e laço preparados', physicalOnly: true },
  { key: 'shipped', label: 'Item postado / código de rastreio enviado', physicalOnly: true },
  { key: 'delivered', label: 'Presente entregue e ativado com sucesso' },
];

export function ProductionChecklist({
  orderId,
  isPhysical,
  initialNotes = '',
  onSaveNotes,
}: ProductionChecklistProps) {
  // Store checklist in local storage keyed by orderId for instant reactivity
  const storageKey = `feito_de_nos_prod_checklist_${orderId}`;

  const [checklist, setChecklist] = useState<ProductionChecklistState>(() => {
    if (typeof window === 'undefined') return DEFAULT_PRODUCTION_CHECKLIST;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTION_CHECKLIST;
    } catch {
      return DEFAULT_PRODUCTION_CHECKLIST;
    }
  });

  const [notes, setNotes] = useState(initialNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleItem = (key: keyof ProductionChecklistState) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar checklist:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!onSaveNotes) return;
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onSaveNotes(notes);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Erro ao salvar notas:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const visibleItems = CHECKLIST_ITEMS.filter((item) => !item.physicalOnly || isPhysical);
  const completedCount = visibleItems.filter((item) => checklist[item.key]).length;
  const progressPercent = Math.round((completedCount / visibleItems.length) * 100);

  return (
    <div className="bg-[#FFF8F0] border border-[#713C48]/15 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#713C48]/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C96E5A]" />
            <h3 className="font-serif text-xl text-[#713C48]">
              {isPhysical ? 'Controle de Produção e Expedição Física' : 'Controle de Produção Digital'}
            </h3>
          </div>
          <p className="text-xs text-[#302B2D]/70 mt-0.5">
            Acompanhe o passo a passo da confecção até a entrega final.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#713C48]">
            {completedCount} de {visibleItems.length} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#713C48]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C96E5A] to-[#713C48] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Items Checklist */}
      <div className="space-y-2.5">
        {visibleItems.map((item) => {
          const isDone = checklist[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleItem(item.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all border ${
                isDone
                  ? 'bg-green-50/60 border-green-200 text-green-900'
                  : 'bg-white/80 border-[#713C48]/10 text-[#302B2D]/80 hover:bg-white'
              }`}
            >
              <div className="text-[#713C48]">
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-green-600" />
                ) : (
                  <Square className="w-5 h-5 text-[#302B2D]/30" />
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through opacity-80' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Internal Notes Textarea */}
      <div className="space-y-2 pt-2 border-t border-[#713C48]/10">
        <label htmlFor="internalNotes" className="text-xs font-semibold text-[#713C48]">
          Anotações Internas da Produção (Visível apenas para a equipe)
        </label>
        <textarea
          id="internalNotes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Rastreamento: QB123456789BR. Cliente solicitou placa com moldura extra. Detalhes de embalagem..."
          className="w-full p-3 rounded-2xl bg-white border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-green-700 font-medium">
            {savedSuccess && '✓ Anotações salvas com sucesso!'}
          </span>
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Salvar Anotações</span>
          </button>
        </div>
      </div>
    </div>
  );
}
