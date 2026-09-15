'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EventDetailWithMedia, EventGuestRow, EventGuestbookMessageRow } from '@/types/invitation';
import { InvitationEnvelopeOpening } from './InvitationEnvelopeOpening';
import { InvitationHeader } from './InvitationHeader';
import { InvitationDetails } from './InvitationDetails';
import { InvitationGallery } from './InvitationGallery';
import { InvitationGiftRegistry } from './InvitationGiftRegistry';
import { InvitationRSVPSection } from './InvitationRSVPSection';
import { InvitationGuestbook } from './InvitationGuestbook';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Heart, Sparkles } from 'lucide-react';

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

  const themeConfig = event.theme_config || {
    primaryColor: '#713C48',
    accentColor: '#C96E5A',
    backgroundColor: '#FFF8F0',
    surfaceColor: '#FFFFFF',
    textColor: '#302B2D',
  };

  const backgroundColor = themeConfig.backgroundColor || '#FFF8F0';

  return (
    <div
      className="min-h-screen relative flex flex-col font-sans selection:bg-[#D9A4A0]/40 transition-colors duration-500"
      style={{
        backgroundColor,
        color: themeConfig.textColor || '#302B2D',
      }}
    >
      {/* Envelope Opening Modal Overlay */}
      {!envelopeOpened && (
        <InvitationEnvelopeOpening
          title={event.title}
          honoreeName={event.honoree_name}
          hostNames={event.host_names}
          themeConfig={themeConfig}
          onOpen={() => setEnvelopeOpened(true)}
        />
      )}

      {/* Main Public Invitation Content */}
      <main className="flex-1 pb-16">
        <InvitationHeader
          title={event.title}
          honoreeName={event.honoree_name}
          hostNames={event.host_names}
          headline={event.headline}
          coverUrl={event.cover_url}
          eventDate={event.event_date}
          themeConfig={themeConfig}
        />

        <InvitationDetails
          title={event.title}
          eventDate={event.event_date}
          venueName={event.venue_name}
          address={event.address}
          mapsUrl={event.maps_url}
          dressCode={event.dress_code}
          openingMessage={event.opening_message}
          themeConfig={themeConfig}
        />

        {event.media && event.media.length > 0 && (
          <InvitationGallery
            media={event.media}
            themeConfig={themeConfig}
          />
        )}

        <InvitationGiftRegistry
          giftInformation={event.gift_information}
          themeConfig={themeConfig}
        />

        <InvitationRSVPSection
          event={event}
          guest={guest}
          themeConfig={themeConfig}
        />

        {event.plan === 'completo' && (
          <InvitationGuestbook
            eventId={event.id}
            slug={event.slug}
            messages={guestbookMessages}
            themeConfig={themeConfig}
          />
        )}
      </main>

      {/* Brand Footer */}
      <footer className="py-8 text-center border-t border-black/5 space-y-3">
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
