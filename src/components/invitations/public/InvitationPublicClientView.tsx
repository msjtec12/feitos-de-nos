'use client';

import React from 'react';
import { EventDetailWithMedia, EventGuestRow, EventGuestbookMessageRow } from '@/types/invitation';
import { InvitationExperience, useInvitationTheme } from '../experience/InvitationExperience';
import { InvitationOpening } from '../experience/InvitationOpening';
import { InvitationHero } from '../experience/InvitationHero';
import { InteractiveCountdown } from '../experience/InteractiveCountdown';
import { EventLocationCard } from '../experience/EventLocationCard';
import { RsvpExperience } from '../experience/RsvpExperience';
import { GuestbookWall } from '../experience/GuestbookWall';
import { SurpriseMessage } from '../experience/SurpriseMessage';
import { InvitationGallery } from './InvitationGallery';
import { InvitationGiftRegistry } from './InvitationGiftRegistry';
import { InvitationFooter } from '../experience/InvitationFooter';
import { getInvitationTheme } from '@/data/invitation-themes';
import { ThemeSectionDivider } from '../experience/ThemeScenery';

interface InvitationPublicClientViewProps {
  event: EventDetailWithMedia;
  guest?: EventGuestRow | null;
  guestbookMessages?: EventGuestbookMessageRow[];
  initialEnvelopeOpened?: boolean;
  isSimulator?: boolean;
  simulatorReducedMotion?: boolean;
}

function InvitationContentSection({
  guestbookMessages = [],
}: {
  guestbookMessages?: EventGuestbookMessageRow[];
}) {
  const { event, guest, envelopeOpened, themeConfig } = useInvitationTheme();

  return (
    <main className={!envelopeOpened ? 'hidden' : 'relative z-10 flex-1 pb-8 pt-2'}>
      {/* 1. Hero do Convite (Cenário, Moldura da Foto e Título com Tipografia Temática) */}
      <InvitationHero />

      <ThemeSectionDivider />

      {/* 2. Contagem Regressiva Interativa Adaptada aos 13 Estilos */}
      <InteractiveCountdown />

      <ThemeSectionDivider />

      {/* 3. Cards de Data, Horário, Local e Rota do Mapa de Expedição */}
      <EventLocationCard />

      {/* 4. Mensagem Surpresa Secreta se cadastrada */}
      {event.opening_message && (
        <SurpriseMessage
          message={event.opening_message}
          themeConfig={themeConfig}
        />
      )}

      {/* 5. Galeria de Fotos */}
      {event.media && event.media.length > 0 && (
        <><ThemeSectionDivider /><InvitationGallery /></>
      )}

      {/* 6. Módulo de Presentes e Chave Pix */}
      {event.gift_information && (
        <><ThemeSectionDivider /><InvitationGiftRegistry /></>
      )}

      {/* 7. Confirmação de Presença (RSVP) com Botão Temático */}
      <ThemeSectionDivider />
      <RsvpExperience />

      {/* 8. Mural de Recados (Incluso no plano 'completo') */}
      {event.plan === 'completo' && (
        <><ThemeSectionDivider /><GuestbookWall messages={guestbookMessages} /></>
      )}
    </main>
  );
}

function InvitationOpenedCanvas({
  guestbookMessages,
  themeKey,
}: {
  guestbookMessages: EventGuestbookMessageRow[];
  themeKey: string;
}) {
  const { envelopeOpened } = useInvitationTheme();

  if (!envelopeOpened) return null;

  return (
    <div className="invitation-premium-stage relative z-10 px-2 py-5 sm:px-5 sm:py-10">
      <div className="invitation-premium-shell relative mx-auto w-full max-w-[820px] overflow-hidden">
        <div className="invitation-premium-inner relative z-10">
          <InvitationContentSection guestbookMessages={guestbookMessages} />
          <InvitationFooter themeKey={themeKey} />
        </div>
      </div>
    </div>
  );
}

export function InvitationPublicClientView({
  event,
  guest,
  guestbookMessages = [],
  initialEnvelopeOpened = false,
  isSimulator = false,
  simulatorReducedMotion = false,
}: InvitationPublicClientViewProps) {
  // Normalizar tema canônico garantindo identificador oficial
  const rawThemeKey =
    event.theme_key ||
    event.theme_config?.theme_key ||
    event.theme_config?.themeId ||
    event.theme_config?.slug ||
    event.event_type ||
    'infantil-monstrinhos-elementais';

  const themePreset = getInvitationTheme(rawThemeKey);

  return (
    <InvitationExperience
      theme={themePreset}
      event={event}
      guest={guest}
      initialEnvelopeOpened={initialEnvelopeOpened}
      isSimulator={isSimulator}
      simulatorReducedMotion={simulatorReducedMotion}
    >
      {/* Tela de Abertura Interativa com estilo próprio por tema */}
      <InvitationOpening />

      {/* Composição contínua do convite: capa, conteúdo e rodapé no mesmo cenário */}
      <InvitationOpenedCanvas
        guestbookMessages={guestbookMessages}
        themeKey={themePreset.id}
      />
    </InvitationExperience>
  );
}
