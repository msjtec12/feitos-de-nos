'use client';

import React from 'react';
import { EventDetailWithMedia, EventGuestRow, EventGuestbookMessageRow } from '@/types/invitation';
import { InvitationExperience, useInvitationTheme } from '../experience/InvitationExperience';
import { InvitationOpening } from '../experience/InvitationOpening';
import { GuestbookWall } from '../experience/GuestbookWall';
import { SurpriseMessage } from '../experience/SurpriseMessage';
import { InvitationGallery } from './InvitationGallery';
import { InvitationGiftRegistry } from './InvitationGiftRegistry';
import { InvitationFooter } from '../experience/InvitationFooter';
import { getInvitationTheme } from '@/data/invitation-themes';
import { ThemeSectionDivider } from '../experience/ThemeScenery';
import { DinosaurPremiumInvitation } from '../experience/DinosaurPremiumInvitation';
import { PremiumEditorialInvitation } from '../experience/PremiumEditorialInvitation';

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
  const { event, envelopeOpened, themeConfig, theme } = useInvitationTheme();

  return (
    <main className={!envelopeOpened ? 'hidden' : 'relative z-10 flex-1 pb-8'}>
      {theme.assetFolder === 'dinosaurs'
        ? <DinosaurPremiumInvitation />
        : <PremiumEditorialInvitation />}

      {event.opening_message && (
        <SurpriseMessage message={event.opening_message} themeConfig={themeConfig} />
      )}

      {event.media && event.media.length > 0 && (
        <><ThemeSectionDivider /><InvitationGallery /></>
      )}

      {event.gift_information && (
        <><ThemeSectionDivider /><InvitationGiftRegistry /></>
      )}

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
