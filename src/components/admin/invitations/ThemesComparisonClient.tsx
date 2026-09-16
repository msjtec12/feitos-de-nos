'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  EventDetailWithMedia,
  EventGuestRow,
  EventGuestbookMessageRow,
} from '@/types/invitation';
import { AuthorialThemeDefinition } from '@/data/invitation-themes';
import { InvitationPublicClientView } from '@/components/invitations/public/InvitationPublicClientView';
import {
  ArrowLeft,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Grid,
  Maximize2,
  Table,
  CheckCircle2,
  Compass,
  Palette,
  Sliders,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ThemesComparisonClientProps {
  baseEvent: EventDetailWithMedia;
  demoGuests: EventGuestRow[];
  themes: AuthorialThemeDefinition[];
}

type ViewMode = 'grid' | 'focus' | 'matrix';
type CategoryFilter = 'all' | 'personagens' | 'infantil' | 'romantico' | 'classico' | 'botanico' | 'moderno' | 'celebracao';

const DEMO_GUESTBOOK_MESSAGES: EventGuestbookMessageRow[] = [
  {
    id: 'msg-demo-1',
    event_id: 'e0000000-0000-4000-8000-000000000001',
    guest_name: 'Vovó Ana e Vovô Carlos',
    message: 'Que alegria imensa celebrar esse primeiro aninho com você, nosso netinho querido!',
    moderation_status: 'approved',
    created_at: '2026-09-10T12:00:00Z',
  },
  {
    id: 'msg-demo-2',
    event_id: 'e0000000-0000-4000-8000-000000000001',
    guest_name: 'Madrinha Júlia',
    message: 'Um ano de pura luz e amor! Já estamos com as roupinhas prontas para festejar!',
    moderation_status: 'approved',
    created_at: '2026-09-11T15:30:00Z',
  },
];

const DISTINCTIVE_BADGES: Record<string, string[]> = {
  'infantil-monstrinhos-elementais': [
    'Cristais dos 4 Elementos',
    'Moldura Rúnica',
    'Card de Pergaminho',
    'Faíscas Mágicas',
  ],
  'infantil-herois-originais': [
    'Emblemas de Quadrinhos',
    'Moldura Action Burst',
    'Painéis com Halftone',
    'Estrelas & Faixas HQ',
  ],
  'infantil-reino-encantado': [
    'Medalhões Nobres Reais',
    'Moldura em Arco Dourado',
    'Pergaminho Nobre',
    'Chuva de Luz Encantada',
  ],
  'infantil-pop': [
    'Painéis LED Neon',
    'Moldura Polaroid Neon',
    'Ingresso VIP Pass',
    'Partículas de Notas Musicais',
  ],
  'infantil-aventura-blocos': [
    'Cubos Tridimensionais Pixel',
    'Moldura Voxel Art',
    'Card Pedra Cúbica',
    'Partículas de Poeira Voxel',
  ],
  'infantil-dinossauros': [
    'Ovos em Ninhos de Galhos',
    'Placa Suspensa de Madeira',
    'Trilha do Mapa & Pegadas',
    'Botão Prancha de Madeira',
  ],
  'infantil-delicado': [
    'Estrelas & Nuvens Pastéis',
    'Moldura Nuvem Macia',
    'Botão Almofadinha Soft',
    'Partículas de Brilho Suave',
  ],
  'romantico': [
    'Medalhões com Rosas',
    'Moldura Floral Delicada',
    'Lacre de Cera Tradicional',
    'Chuva de Pétalas Flutuantes',
  ],
  'elegante': [
    'Minimal Dourado Nobre',
    'Moldura Luxo Banhada a Ouro',
    'Envelope de Gala Selado',
    'Poeira Dourada Reluzente',
  ],
  'religioso': [
    'Arcos & Cartelas Serenas',
    'Moldura Sacra Arredondada',
    'Ramos de Oliveira & Paz',
    'Penas de Paz Flutuantes',
  ],
  'floral': [
    'Guirlanda de Lavanda & Folhas',
    'Moldura Folhagens Botânicas',
    'Linho Rústico & Kraft',
    'Botões de Lavanda e Folhas',
  ],
  'minimalista': [
    'Tipografia Pura Editorial',
    'Moldura Respiro Geométrico',
    'Espaços em Branco Generosos',
    'Poeira Sutil Minimal',
  ],
  'festivo': [
    'Contagem Explosiva de Confetes',
    'Moldura Brilho de Festa',
    'Cortina de Luzes Suspensas',
    'Chuva de Confetes Coloridos',
  ],
};

export function ThemesComparisonClient({
  baseEvent,
  demoGuests,
  themes,
}: ThemesComparisonClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [envelopeOpened, setEnvelopeOpened] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(themes[5]?.id || themes[0]?.id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtragem de temas
  const filteredThemes = useMemo(() => {
    if (activeCategory === 'all') return themes;
    if (activeCategory === 'personagens') {
      return themes.filter((t) => t.category === 'personagens');
    }
    return themes.filter((t) => t.category === activeCategory);
  }, [themes, activeCategory]);

  const activeFocusTheme = useMemo(() => {
    return themes.find((t) => t.id === selectedThemeId) || themes[0];
  }, [themes, selectedThemeId]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignorar erro de clipboard
    }
  };

  const createThemedEvent = (theme: AuthorialThemeDefinition): EventDetailWithMedia => {
    return {
      ...baseEvent,
      theme_key: theme.id,
      cover_url: theme.defaultHeroImage || baseEvent.cover_url,
      theme_config: {
        ...baseEvent.theme_config,
        ...theme.config,
        theme_key: theme.id,
        themeId: theme.id,
        themeName: theme.name,
        heroBadge: theme.heroBadge,
        countdownStyle: theme.countdownStyle,
        photoStyle: theme.photoFrameStyle,
        buttonStyle: theme.buttonStyle,
        cardMaterial: theme.cardMaterial,
        openingStyle: theme.openingStyle,
        particlePreset: theme.particlePreset,
      },
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      {/* Barra de Topo / Header com navegação e status de integridade */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/convites"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Voltar para Eventos e Convites"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Laboratório Visual
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Feito de Nós</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Comparador dos 13 Temas Autorais</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  13 / 13 Prontos
                </span>
              </h1>
            </div>
          </div>

          {/* Controles Globais de Simulação */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Alternador de Envelope Aberto / Fechado */}
            <button
              type="button"
              onClick={() => setEnvelopeOpened(!envelopeOpened)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                envelopeOpened
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Alternar entre ver a capa de abertura ou o conteúdo interno do convite"
            >
              {envelopeOpened ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{envelopeOpened ? 'Envelope Aberto' : 'Capa Fechada'}</span>
            </button>

            {/* Alternador de Movimento Reduzido */}
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                reducedMotion
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Reduzir partículas e animações contínuas"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{reducedMotion ? 'Movimento Reduzido' : 'Animações Plenas'}</span>
            </button>

            {/* Alternador de Modo de Exibição */}
            <div className="bg-slate-800/90 p-0.5 rounded-xl border border-slate-700 flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grade 13x</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('focus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'focus'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Foco Individual</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'matrix'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Matriz Técnica</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner Informativo sobre Garantia Autoral e Padrão de Qualidade */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Coleção Completa dos 13 Temas Exclusivos & Autorais</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  Zero Cópias de Franquias
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Cada um dos 13 temas possui <strong>cenário de fundo, moldura de foto, selo de abertura, contagem regressiva temática, textura de card, botão de ação, partículas e rodapé ilustrado próprios</strong>. Todos aplicados sobre o mesmo evento de teste (<code className="text-amber-300 bg-amber-950/40 px-1 py-0.5 rounded text-[11px]">matheus-akira-1-ano</code>) para auditoria rigorosa de consistência.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <Link
              href="/convite/matheus-akira-1-ano"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
            >
              <span>Ver Convite Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/admin/convites/e0000000-0000-4000-8000-000000000001/editar`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs"
            >
              <span>Abrir no Editor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Barra de Filtros por Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-thin">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Filtrar:
          </span>
          {[
            { id: 'all', label: `Todos (${themes.length})` },
            { id: 'personagens', label: 'Infantis & Personagens (5)' },
            { id: 'infantil', label: 'Bebê & Delicado (1)' },
            { id: 'romantico', label: 'Romântico (1)' },
            { id: 'classico', label: 'Clássico & Nobre (2)' },
            { id: 'botanico', label: 'Botânico (1)' },
            { id: 'moderno', label: 'Minimalista (1)' },
            { id: 'celebracao', label: 'Celebração (1)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as CategoryFilter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODO 1: GRADE COMPLETA (13 SIMULADORES LADO A LADO) */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredThemes.map((theme, index) => {
              const themedEvent = createThemedEvent(theme);
              const badges = DISTINCTIVE_BADGES[theme.id] || [];

              return (
                <div
                  key={theme.id}
                  className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col transition-all hover:border-amber-500/40"
                >
                  {/* Cabeçalho do Card de Tema */}
                  <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {theme.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {theme.tagline}
                      </p>
                    </div>

                    {/* Amostras de Cores do Tema */}
                    <div className="flex items-center gap-1 shrink-0 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.previewColors.primary }}
                        title={`Cor Primária: ${theme.previewColors.primary}`}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.previewColors.accent }}
                        title={`Cor Destaque: ${theme.previewColors.accent}`}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.previewColors.background }}
                        title={`Cor Fundo: ${theme.previewColors.background}`}
                      />
                    </div>
                  </div>

                  {/* Pills de Elementos Exclusivos */}
                  <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex flex-wrap gap-1.5">
                    {badges.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Mockup do Simulador Mobile */}
                  <div className="p-3 bg-slate-950/70 flex justify-center">
                    <div className="relative w-[340px] h-[520px] rounded-[32px] overflow-hidden border-[6px] border-slate-800 shadow-2xl bg-black flex flex-col">
                      {/* Notch simulado */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                      </div>

                      {/* Viewport de simulação com rolagem real */}
                      <div className="flex-1 overflow-y-auto scrollbar-thin relative bg-white">
                        <InvitationPublicClientView
                          event={themedEvent}
                          guest={demoGuests[0]}
                          guestbookMessages={DEMO_GUESTBOOK_MESSAGES}
                          initialEnvelopeOpened={envelopeOpened}
                          isSimulator={true}
                          simulatorReducedMotion={reducedMotion}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rodapé de Ações do Card */}
                  <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleCopyId(theme.id)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Copiar ID do Tema"
                    >
                      {copiedId === theme.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="font-mono text-[11px]">{theme.id}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedThemeId(theme.id);
                          setViewMode('focus');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1"
                        title="Inspecionar em foco"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Foco</span>
                      </button>
                      <Link
                        href={`/admin/convites/e0000000-0000-4000-8000-000000000001/editar?theme_key=${theme.id}`}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold transition-colors border border-amber-500/30"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: FOCO INDIVIDUAL & AUDITORIA DETALHADA */}
      {/* ========================================================================= */}
      {viewMode === 'focus' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Seletor rápido de tema */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-6 flex items-center gap-2 overflow-x-auto scrollbar-thin">
            {themes.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedThemeId(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedThemeId === t.id
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center bg-black/20">
                  {idx + 1}
                </span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Layout de Foco: Painel Técnico à Esquerda + Simulador Grande à Direita */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Painel de Especificações Técnicas do Tema Selecionado */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                      Tema {themes.findIndex((t) => t.id === activeFocusTheme.id) + 1} de 13
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      {activeFocusTheme.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {activeFocusTheme.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {activeFocusTheme.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: activeFocusTheme.previewColors.primary }}
                        title="Cor Primária"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: activeFocusTheme.previewColors.accent }}
                        title="Cor Destaque"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white/20"
                        style={{ backgroundColor: activeFocusTheme.previewColors.background }}
                        title="Cor Fundo"
                      />
                    </div>
                  </div>
                </div>

                {/* Tabela de Componentes e Estilos */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Identidade &amp; Componentes Exclusivos:
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Contagem Regressiva:</span>
                      <span className="font-semibold text-white mt-0.5 block">
                        <code>{activeFocusTheme.countdownStyle}</code>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Moldura da Foto:</span>
                      <span className="font-semibold text-white mt-0.5 block">
                        <code>{activeFocusTheme.photoFrameStyle}</code>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Botão de RSVP:</span>
                      <span className="font-semibold text-white mt-0.5 block">
                        <code>{activeFocusTheme.buttonStyle}</code>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Material dos Cards:</span>
                      <span className="font-semibold text-white mt-0.5 block">
                        <code>{activeFocusTheme.cardMaterial}</code>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Estilo de Abertura:</span>
                      <span className="font-semibold text-white mt-0.5 block">
                        <code>{activeFocusTheme.openingStyle}</code>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">Preset de Partículas:</span>
                      <span className="font-semibold text-white mt-0.5 block">
                        <code>{activeFocusTheme.particlePreset}</code>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arquivos de Assets Vetoriais Carregados */}
                <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Assets Vetoriais Dedicados (SVG):
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px]">
                      <span className="text-slate-400">Capa de Abertura:</span>
                      <span className="text-amber-300">{activeFocusTheme.assets.openingCoverSvg}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px]">
                      <span className="text-slate-400">Forma da Contagem:</span>
                      <span className="text-amber-300">{activeFocusTheme.assets.countdownShapeSvg}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px]">
                      <span className="text-slate-400">Divisor Temático:</span>
                      <span className="text-amber-300">{activeFocusTheme.assets.dividerSvg}</span>
                    </div>
                  </div>
                </div>

                {/* Rodapé e Mensagem Cenográfica */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Mensagem Cenográfica de Rodapé:
                  </span>
                  <blockquote className="mt-2 pl-3 border-l-2 border-amber-500 italic text-sm text-slate-300">
                    &ldquo;{activeFocusTheme.scenery.footerMessage}&rdquo;
                  </blockquote>
                  {activeFocusTheme.scenery.footerThemeNote && (
                    <p className="text-xs text-slate-400 mt-1 pl-3">
                      {activeFocusTheme.scenery.footerThemeNote}
                    </p>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3">
                  <Link
                    href={`/admin/convites/e0000000-0000-4000-8000-000000000001/editar?theme_key=${activeFocusTheme.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-center text-xs transition-colors shadow-sm"
                  >
                    Editar Convite Demo com Este Tema
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleCopyId(activeFocusTheme.id)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === activeFocusTheme.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>Copiar ID</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulador Mobile de Foco (Altura Completa) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[390px] h-[720px] rounded-[44px] overflow-hidden border-[8px] border-slate-800 shadow-2xl bg-black flex flex-col">
                {/* Notch com câmera frontal */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-40 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>

                {/* Viewport Interativo */}
                <div className="flex-1 overflow-y-auto scrollbar-thin relative bg-white">
                  <InvitationPublicClientView
                    event={createThemedEvent(activeFocusTheme)}
                    guest={demoGuests[0]}
                    guestbookMessages={DEMO_GUESTBOOK_MESSAGES}
                    initialEnvelopeOpened={envelopeOpened}
                    isSimulator={true}
                    simulatorReducedMotion={reducedMotion}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 3: MATRIZ TÉCNICA COMPARATIVA (TABELA DESIGN SYSTEM) */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Matriz Técnica dos 13 Temas Autorais
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Especificação comparativa completa de estilos, componentes e assets vetoriais.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 text-amber-400 border border-slate-800">
                13 Variantes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Tema</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Contagem</th>
                    <th className="py-3 px-4">Moldura</th>
                    <th className="py-3 px-4">Botão</th>
                    <th className="py-3 px-4">Material Card</th>
                    <th className="py-3 px-4">Partículas</th>
                    <th className="py-3 px-4">Abertura</th>
                    <th className="py-3 px-4 text-center">Cores</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {themes.map((t, i) => (
                    <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-amber-400 font-bold">{i + 1}</td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {t.name}
                        <span className="block font-mono text-[10px] text-slate-500 font-normal">
                          {t.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-amber-300/90">
                        {t.countdownStyle}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {t.photoFrameStyle}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {t.buttonStyle}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {t.cardMaterial}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {t.particlePreset}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                        {t.openingStyle}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.previewColors.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.previewColors.accent }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.previewColors.background }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
