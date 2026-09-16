'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventDetailWithMedia, EventGuestRow, EventThemeConfig } from '@/types/invitation';
import { AuthorialThemeDefinition, getInvitationTheme, mergeInvitationThemeConfig } from '@/data/invitation-themes';
import { ThemeParticles } from './ThemeParticles';
import { MusicController } from './MusicController';
import { MotionPreferenceControl } from './MotionPreferenceControl';
import { MailOpen } from 'lucide-react';
import { ThemeScenery } from './ThemeScenery';

interface InvitationThemeContextType {
  theme: AuthorialThemeDefinition;
  themeConfig: EventThemeConfig;
  event: EventDetailWithMedia;
  guest?: EventGuestRow | null;
  envelopeOpened: boolean;
  reducedMotion: boolean;
  isSimulator: boolean;
  setEnvelopeOpened: (opened: boolean) => void;
  handleOpenInvitation: (withAudioGesture: boolean) => void;
}

const InvitationThemeContext = createContext<InvitationThemeContextType | null>(null);

export function useInvitationTheme() {
  const ctx = useContext(InvitationThemeContext);
  if (!ctx) {
    throw new Error('useInvitationTheme deve ser utilizado dentro de um <InvitationExperience>');
  }
  return ctx;
}

export function useOptionalInvitationTheme() {
  return useContext(InvitationThemeContext);
}

interface InvitationExperienceProps {
  theme?: AuthorialThemeDefinition;
  event: EventDetailWithMedia;
  guest?: EventGuestRow | null;
  initialEnvelopeOpened?: boolean;
  isSimulator?: boolean;
  simulatorReducedMotion?: boolean;
  children: React.ReactNode;
}

export function InvitationExperience({
  theme: providedTheme,
  event,
  guest,
  initialEnvelopeOpened = false,
  isSimulator = false,
  simulatorReducedMotion = false,
  children,
}: InvitationExperienceProps) {
  const invitationRootRef = React.useRef<HTMLDivElement>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(initialEnvelopeOpened);
  const [audioGestureTriggered, setAudioGestureTriggered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Sincronizar estado da abertura quando controlado externamente pelo simulador
  useEffect(() => {
    setEnvelopeOpened(initialEnvelopeOpened);
  }, [initialEnvelopeOpened]);

  const effectiveReducedMotion = isSimulator ? Boolean(simulatorReducedMotion) : reducedMotion;

  // Resolver tema canônico a partir das configurações do evento
  const rawThemeKey =
    event.theme_key ||
    event.theme_config?.theme_key ||
    event.theme_config?.themeId ||
    event.theme_config?.slug ||
    event.event_type ||
    'infantil-monstrinhos-elementais';

  const activeTheme = providedTheme || getInvitationTheme(rawThemeKey);

  const themeConfig: EventThemeConfig = mergeInvitationThemeConfig(activeTheme, event.theme_config);

  const handleOpenInvitation = (withAudioGesture: boolean) => {
    setEnvelopeOpened(true);
    if (withAudioGesture) {
      setAudioGestureTriggered(true);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const resolvedMusicUrl = event.music_url || themeConfig.musicTrackUrl || null;
  const primaryColor = themeConfig.primaryColor || activeTheme.previewColors.primary;
  const accentColor = themeConfig.accentColor || activeTheme.previewColors.accent;
  const backgroundColor = themeConfig.backgroundColor || activeTheme.previewColors.background;
  const textColor = themeConfig.textColor || '#1C1917';

  return (
    <InvitationThemeContext.Provider
      value={{
        theme: activeTheme,
        themeConfig,
        event,
        guest,
        envelopeOpened,
        reducedMotion: effectiveReducedMotion,
        isSimulator,
        setEnvelopeOpened,
        handleOpenInvitation,
      }}
    >
      <div
        ref={invitationRootRef}
        className={`invitation-experience-root relative flex flex-col font-sans selection:bg-[#D9A4A0]/40 transition-colors duration-500 ${
          !envelopeOpened
            ? isSimulator
              ? 'h-full max-h-full overflow-hidden'
              : 'h-screen max-h-screen overflow-hidden'
            : 'min-h-screen overflow-x-hidden'
        } ${effectiveReducedMotion ? 'reduced-motion' : ''}`}
        data-invitation-theme={activeTheme.id}
        style={{
          '--invitation-primary': primaryColor,
          '--invitation-accent': accentColor,
          '--invitation-background': backgroundColor,
          '--invitation-text': textColor,
          color: textColor,
          fontFamily: themeConfig.bodyFont || activeTheme.config.bodyFont,
          ...activeTheme.scenery.backgroundStyle,
        } as React.CSSProperties}
      >
        <ThemeScenery />
        {/* Partículas Temáticas Ambientais exclusivas por tema */}
        <ThemeParticles themeConfig={themeConfig} reducedMotion={effectiveReducedMotion} />

        {/* Controle de Redução de Movimento (apenas na página pública) */}
        {!isSimulator && (
          <MotionPreferenceControl
            reducedMotion={effectiveReducedMotion}
            onToggle={() => setReducedMotion(!reducedMotion)}
            accentColor={accentColor}
          />
        )}

        {/* Trilha Sonora do Evento */}
        <MusicController
          musicUrl={resolvedMusicUrl}
          autoPlayTriggered={audioGestureTriggered}
          themeConfig={themeConfig}
        />

        {/* Botão Flutuante para Rever Abertura */}
        {envelopeOpened && (
          <button
            type="button"
            onClick={() => setEnvelopeOpened(false)}
            className={
              isSimulator
                ? 'absolute bottom-3 left-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-[#302B2D] backdrop-blur-md shadow-md border border-black/10 transition-all hover:scale-105 active:scale-95'
                : 'absolute bottom-5 left-5 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-white/95 text-[#302B2D] backdrop-blur-md shadow-lg border border-black/10 transition-all hover:scale-105 active:scale-95 hover:bg-white'
            }
            title="Ver animação de abertura novamente"
          >
            <MailOpen className={isSimulator ? 'w-3 h-3 text-red-500' : 'w-3.5 h-3.5 text-red-500'} />
            <span>Rever Abertura</span>
          </button>
        )}

        {/* Conteúdo dinâmico da experiência */}
        {children}
      </div>
    </InvitationThemeContext.Provider>
  );
}
