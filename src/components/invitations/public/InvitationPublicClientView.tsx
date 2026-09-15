'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventDetailWithMedia, EventGuestRow, EventGuestbookMessageRow } from '@/types/invitation';
import { InvitationOpening } from '../experience/InvitationOpening';
import { ThemeParticles } from '../experience/ThemeParticles';
import { MusicController } from '../experience/MusicController';
import { MotionPreferenceControl } from '../experience/MotionPreferenceControl';
import { InteractiveCountdown } from '../experience/InteractiveCountdown';
import { EventLocationCard } from '../experience/EventLocationCard';
import { RsvpExperience } from '../experience/RsvpExperience';
import { GuestbookWall } from '../experience/GuestbookWall';
import { SurpriseMessage } from '../experience/SurpriseMessage';
import { ThemeDecorationBadge } from '../experience/ThemeDecorations';
import { InvitationHeader } from './InvitationHeader';
import { InvitationGallery } from './InvitationGallery';
import { InvitationGiftRegistry } from './InvitationGiftRegistry';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Sparkles } from 'lucide-react';

interface InvitationPublicClientViewProps {
  event: EventDetailWithMedia;
  guest?: EventGuestRow | null;
  guestbookMessages?: EventGuestbookMessageRow[];
  initialEnvelopeOpened?: boolean;
}

export function InvitationPublicClientView({
  event,
  guest,
  guestbookMessages = [],
  initialEnvelopeOpened = false,
}: InvitationPublicClientViewProps) {
  const [envelopeOpened, setEnvelopeOpened] = useState(initialEnvelopeOpened);
  const [audioGestureTriggered, setAudioGestureTriggered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const themeConfig = event.theme_config || {
    primaryColor: '#713C48',
    accentColor: '#C96E5A',
    backgroundColor: '#FFF8F0',
    surfaceColor: '#FFFFFF',
    textColor: '#302B2D',
  };

  const backgroundColor = themeConfig.backgroundColor || '#FFF8F0';
  const textColor = themeConfig.textColor || '#302B2D';

  const handleOpenInvitation = (withAudioGesture: boolean) => {
    setEnvelopeOpened(true);
    if (withAudioGesture) {
      setAudioGestureTriggered(true);
    }
  };

  const resolvedMusicUrl = event.music_url || themeConfig.musicTrackUrl || null;

  return (
    <div
      className="min-h-screen relative flex flex-col font-sans selection:bg-[#D9A4A0]/40 transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {/* Background Ambient Particles */}
      <ThemeParticles themeConfig={themeConfig} reducedMotion={reducedMotion} />

      {/* Reduced Motion Toggle Control */}
      <MotionPreferenceControl
        reducedMotion={reducedMotion}
        onToggle={() => setReducedMotion(!reducedMotion)}
        accentColor={themeConfig.accentColor}
      />

      {/* Floating Audio Soundtrack Controller (only triggers audio on/after user gesture) */}
      <MusicController
        musicUrl={resolvedMusicUrl}
        autoPlayTriggered={audioGestureTriggered}
        themeConfig={themeConfig}
      />

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

      {/* Main Public Invitation Content */}
      <main className="flex-1 pb-16 relative z-10">
        {/* Top Thematic Decoration Header */}
        <div className="pt-8 text-center">
          <ThemeDecorationBadge
            themeSlug={themeConfig.slug}
            primaryColor={themeConfig.primaryColor}
            accentColor={themeConfig.accentColor}
            className="w-12 h-12 mx-auto drop-shadow-xs"
          />
        </div>

        {/* Hero Header with Honoree & Main Cover */}
        <InvitationHeader
          title={event.title}
          honoreeName={event.honoree_name}
          hostNames={event.host_names}
          headline={event.headline}
          coverUrl={event.cover_url}
          eventDate={event.event_date}
          themeConfig={themeConfig}
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
