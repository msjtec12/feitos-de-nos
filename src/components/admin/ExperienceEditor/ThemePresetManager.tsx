'use client';

import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { GiftContentData } from '@/types/gift-experience';
import { GiftThemePresetId } from '@/types/theme';
import {
  GIFT_THEME_PRESETS,
  applyThemePresetToContent,
  getGiftThemePreset,
  themeFromPreset,
} from '@/data/theme-presets';
import { GIFT_FORMATS } from '@/data/home-data';

interface ThemePresetManagerProps {
  giftPageId: string;
  content: GiftContentData;
  updateContent: (fields: Partial<GiftContentData>) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  infantil: 'Bebê & Infantil',
  romantico: 'Amor & Casamento',
  familia: 'Família',
  celebracoes: 'Celebrações',
  homenagens: 'Homenagens',
  sazonal: 'Sazonais',
};

export function ThemePresetManager({ giftPageId, content, updateContent }: ThemePresetManagerProps) {
  const initialId = (content.themePresetId || 'primeiro-ano') as GiftThemePresetId;
  const [selectedId, setSelectedId] = React.useState<GiftThemePresetId>(initialId);
  const [category, setCategory] = React.useState<string>('all');
  const [isApplying, setIsApplying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (content.themePresetId && getGiftThemePreset(content.themePresetId)) {
      setSelectedId(content.themePresetId);
    }
  }, [content.themePresetId]);

  const filteredPresets = React.useMemo(() => {
    if (category === 'all') return GIFT_THEME_PRESETS;
    return GIFT_THEME_PRESETS.filter((preset) => preset.category === category);
  }, [category]);

  const selectedPreset = getGiftThemePreset(selectedId) || GIFT_THEME_PRESETS[0];
  const activePreset = getGiftThemePreset(content.themePresetId);

  const handleApply = async () => {
    if (!selectedPreset || isApplying) return;
    setIsApplying(true);
    setError(null);

    const nextContent = applyThemePresetToContent(content, selectedPreset);
    const nextTheme = themeFromPreset(selectedPreset);
    updateContent(nextContent);

    try {
      const response = await fetch(`/api/admin/pages/${giftPageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: nextContent, theme: nextTheme }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível aplicar o tema.');

      // Sincroniza o simulador e o editor visual com o tema que acabou de ser salvo.
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Erro ao aplicar o tema.');
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#C96E5A] font-bold mb-1.5">
            <Wand2 className="w-3.5 h-3.5" />
            Tema inteligente
          </div>
          <h3 className="font-serif text-xl text-[#713C48]">Estrutura, linguagem e visual por ocasião</h3>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            O tema troca frases-base, nomes das seções, sugestão de trilha e identidade visual sem apagar fotos, áudios, mensagens, galeria ou momentos já cadastrados.
          </p>
        </div>
        {activePreset && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {activePreset.shortName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button type="button" onClick={() => setCategory('all')} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${category === 'all' ? 'bg-[#713C48] text-white border-[#713C48]' : 'bg-[#FFF8F0] text-[#713C48] border-[#713C48]/15'}`}>Todos</button>
        {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setCategory(id)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${category === id ? 'bg-[#713C48] text-white border-[#713C48]' : 'bg-[#FFF8F0] text-[#713C48] border-[#713C48]/15'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
        {filteredPresets.map((preset) => {
          const selected = selectedId === preset.id;
          const format = GIFT_FORMATS.find((item) => item.id === preset.recommendedFormat);
          return (
            <button key={preset.id} type="button" onClick={() => setSelectedId(preset.id)} className={`rounded-2xl border-2 p-4 text-left transition-all ${selected ? 'border-[#713C48] bg-[#FFF8F0] ring-2 ring-[#713C48]/10' : 'border-stone-200 bg-white hover:border-[#713C48]/30'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#C96E5A]">{CATEGORY_LABELS[preset.category]}</span>
                  <h4 className="font-serif text-base text-[#713C48] leading-tight mt-0.5">{preset.shortName}</h4>
                </div>
                <div className="flex -space-x-1 shrink-0">
                  {[preset.palette.primary, preset.palette.secondary, preset.palette.accent].map((color) => (
                    <span key={color} className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-black/10" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-600 mt-2 line-clamp-3">{preset.description}</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-[10px]">
                <span className="text-stone-500">{preset.mood}</span>
                <span className="font-bold text-[#713C48] whitespace-nowrap">{format?.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedPreset && (
        <div className="rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Abertura sugerida</span>
              <p className="font-serif text-[#713C48] text-base mt-1">“{selectedPreset.defaultTexts.openingHeadline}”</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Estrutura</span>
              <p className="text-stone-700 mt-1">{selectedPreset.sectionCopy.timeline.eyebrow} • {selectedPreset.sectionCopy.messages.eyebrow} • {selectedPreset.sectionCopy.gallery.eyebrow}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#713C48]/10">
            <p className="text-[10px] text-stone-500 leading-relaxed max-w-xl">
              Ao aplicar, os textos-base e a paleta são salvos imediatamente. O nome do homenageado e todo o material enviado são preservados.
            </p>
            <button type="button" onClick={handleApply} disabled={isApplying} className="px-4 py-2.5 rounded-xl bg-[#713C48] hover:bg-[#592F39] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap">
              {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isApplying ? 'Aplicando...' : 'Aplicar e salvar tema'}
            </button>
          </div>
        </div>
      )}

      {error && <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">{error}</div>}
    </div>
  );
}
