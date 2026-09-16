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
    <main className={!envelopeOpened ? 'hidden' : 'flex-1 pb-16 relative z-10 pt-2'}>
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

      {/* Conteúdo Principal do Convite */}
      <InvitationContentSection guestbookMessages={guestbookMessages} />

      {/* Rodapé Ilustrado com Cenário e Divisores Exclusivos por Tema */}
      <InvitationFooter themeKey={themePreset.id} />
    </InvitationExperience>
  );
}
