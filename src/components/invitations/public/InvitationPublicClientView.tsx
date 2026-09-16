'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventDetailWithMedia, EventGuestRow, EventGuestbookMessageRow, EventThemeConfig } from '@/types/invitation';
import { InvitationOpening } from '../experience/InvitationOpening';
import { ThemeParticles } from '../experience/ThemeParticles';
import { MusicController } from '../experience/MusicController';
import { MotionPreferenceControl } from '../experience/MotionPreferenceControl';
import { InteractiveCountdown } from '../experience/InteractiveCountdown';
import { EventLocationCard } from '../experience/EventLocationCard';
import { RsvpExperience } from '../experience/RsvpExperience';
import { GuestbookWall } from '../experience/GuestbookWall';
import { SurpriseMessage } from '../experience/SurpriseMessage';
import { InvitationHeader } from './InvitationHeader';
import { InvitationGallery } from './InvitationGallery';
import { InvitationGiftRegistry } from './InvitationGiftRegistry';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Sparkles, MailOpen } from 'lucide-react';
import { getInvitationTheme } from '@/data/invitation-themes';

interface InvitationPublicClientViewProps {
  event: EventDetailWithMedia;
  guest?: EventGuestRow | null;
  guestbookMessages?: EventGuestbookMessageRow[];
  initialEnvelopeOpened?: boolean;
  isSimulator?: boolean;
  simulatorReducedMotion?: boolean;
}

export function InvitationPublicClientView({
  event,
  guest,
  guestbookMessages = [],
  initialEnvelopeOpened = false,
  isSimulator = false,
  simulatorReducedMotion = false,
}: InvitationPublicClientViewProps) {
  const invitationRootRef = React.useRef<HTMLDivElement>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(initialEnvelopeOpened);
  const [audioGestureTriggered, setAudioGestureTriggered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Sync envelopeOpened when simulator toggles
  React.useEffect(() => {
    setEnvelopeOpened(initialEnvelopeOpened);
  }, [initialEnvelopeOpened]);

  const effectiveReducedMotion = isSimulator ? Boolean(simulatorReducedMotion) : reducedMotion;

  // Normalize theme config to guarantee canonical theme_key, themeId and full preset values
  const rawConfig = event.theme_config || {
    primaryColor: '#713C48',
    accentColor: '#C96E5A',
    backgroundColor: '#FFF8F0',
    surfaceColor: '#FFFFFF',
    textColor: '#302B2D',
  };

  const canonicalKey =
    rawConfig.theme_key ||
    event.theme_key ||
    rawConfig.themeId ||
    rawConfig.slug ||
    event.event_type ||
    'infantil-monstrinhos-elementais';

  const themePreset = getInvitationTheme(canonicalKey);

  const themeConfig: EventThemeConfig = {
    ...themePreset.config,
    ...rawConfig,
    theme_key: themePreset.id,
    themeId: themePreset.id,
    slug: themePreset.id,
    heroBadge: rawConfig.heroBadge || themePreset.heroBadge,
  };

  const themeIdentifier = themePreset.id.toLowerCase();
  const backgroundColor = themeConfig.backgroundColor || '#FFF8F0';
  const textColor = themeConfig.textColor || '#302B2D';

  const isHero = themeIdentifier.includes('heroi') || themeIdentifier.includes('super');
  const isBlocos = themeIdentifier.includes('bloco') || themeIdentifier.includes('pixel');
  const isPop = themeIdentifier.includes('pop') || themeIdentifier.includes('musica');

  // Scroll to top whenever envelope is closed or reopened so card is immediately at the top
  React.useEffect(() => {
    if (!envelopeOpened && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [envelopeOpened]);

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

  // Background pattern for hero/blocos themes
  let bgPatternStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
  };

  if (isHero) {
    bgPatternStyle.backgroundImage = 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 15%, transparent 16%)';
    bgPatternStyle.backgroundSize = '18px 18px';
  } else if (isBlocos) {
    bgPatternStyle.backgroundImage = 'linear-gradient(90deg, rgba(21, 128, 61, 0.05) 1px, transparent 1px), linear-gradient(rgba(21, 128, 61, 0.05) 1px, transparent 1px)';
    bgPatternStyle.backgroundSize = '24px 24px';
  }

  return (
    <div
      ref={invitationRootRef}
      className={`invitation-experience-root relative flex flex-col font-sans selection:bg-[#D9A4A0]/40 transition-colors duration-500 ${
        !envelopeOpened
          ? isSimulator
            ? 'h-full max-h-full overflow-hidden'
            : 'h-screen max-h-screen overflow-hidden'
          : 'min-h-screen overflow-x-hidden'
      } ${effectiveReducedMotion ? 'reduced-motion' : ''}`}
      data-invitation-theme={themeConfig.themeId || themeConfig.slug || 'infantil-monstrinhos-elementais'}
      style={{
        '--invitation-primary': themeConfig.primaryColor || '#713C48',
        '--invitation-accent': themeConfig.accentColor || '#C96E5A',
        '--invitation-background': backgroundColor,
        ...bgPatternStyle,
      } as React.CSSProperties}
    >
      {/* Background Ambient Particles (estritamente absolutas e contidas na raiz do convite) */}
      <ThemeParticles themeConfig={themeConfig} reducedMotion={effectiveReducedMotion} />

      {/* Reduced Motion Toggle Control (apenas na página pública; no simulador é controlado na barra de ferramentas) */}
      {!isSimulator && (
        <MotionPreferenceControl
          reducedMotion={effectiveReducedMotion}
          onToggle={() => setReducedMotion(!reducedMotion)}
          accentColor={themeConfig.accentColor}
        />
      )}

      {/* Soundtrack Controller */}
      <MusicController
        musicUrl={resolvedMusicUrl}
        autoPlayTriggered={audioGestureTriggered}
        themeConfig={themeConfig}
      />

      {/* Re-Open Envelope Button (Contido estritamente de forma absoluta dentro da experiência do convite) */}
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

      {/* Interactive Opening Screen (Envelope, Gift Box, Curtain, etc.) */}
      {!envelopeOpened && (
        <InvitationOpening
          title={event.title}
          honoreeName={event.honoree_name}
          hostNames={event.host_names}
          guestName={guest?.name}
          themeConfig={themeConfig}
          hasMusic={Boolean(resolvedMusicUrl)}
          slug={event.slug}
          onOpen={handleOpenInvitation}
        />
      )}

      {/* Main Public Invitation Content (hidden while envelope is closed to avoid 3000px height pushing card down) */}
      <main className={!envelopeOpened ? 'hidden' : 'flex-1 pb-16 relative z-10 pt-4'}>
        {/* Hero Header with Honoree & Main Cover Artwork */}
        <InvitationHeader
          title={event.title}
          honoreeName={event.honoree_name}
          hostNames={event.host_names}
          headline={event.headline}
          coverUrl={event.cover_url}
          eventDate={event.event_date}
          themeConfig={themeConfig}
          isEditor={isSimulator}
        />

        {/* Interactive Flip Countdown Timer */}
        <div className="px-4 pb-4">
          <InteractiveCountdown
            eventDate={event.event_date}
            themeConfig={themeConfig}
            honoreeName={event.honoree_name}
          />
        </div>

        {/* When, Where, Maps & Calendar Card */}
        <EventLocationCard
          title={event.title}
          eventDate={event.event_date}
          venueName={event.venue_name}
          address={event.address}
          mapsUrl={event.maps_url}
          dressCode={event.dress_code}
          openingMessage={event.opening_message}
          themeConfig={themeConfig}
        />

        {/* Secret Surprise Message (if available) */}
        {event.opening_message && (
          <SurpriseMessage
            message={event.opening_message}
            themeConfig={themeConfig}
          />
        )}

        {/* Photo Gallery with Touch Swipe and Lightbox */}
        {event.media && event.media.length > 0 && (
          <InvitationGallery
            media={event.media}
            themeConfig={themeConfig}
          />
        )}

        {/* Gift Registry / PIX Information */}
        <InvitationGiftRegistry
          giftInformation={event.gift_information}
          themeConfig={themeConfig}
        />

        {/* Interactive RSVP Experience */}
        <RsvpExperience
          event={event}
          guest={guest}
          themeConfig={themeConfig}
        />

        {/* Guestbook Wall (Included on 'completo' plan) */}
        {event.plan === 'completo' && (
          <GuestbookWall
            eventId={event.id}
            slug={event.slug}
            messages={guestbookMessages}
            themeConfig={themeConfig}
          />
        )}
      </main>

      {/* Brand Footer */}
      <footer className="py-8 text-center border-t border-black/5 space-y-3 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Feito de Nós"
        >
          <BrandLogo size="sm" />
        </Link>
        <p className="text-[11px] text-[#302B2D]/60">
          Momentos especiais começam com um convite inesquecível.
        </p>
        <div>
          <Link
            href="/convites"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713C48] hover:text-[#C96E5A] bg-white/70 px-3 py-1 rounded-full border border-black/5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Crie um convite interativo para o seu evento</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
