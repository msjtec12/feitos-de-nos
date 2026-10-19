'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CalendarPlus,
  Clock3,
  Gem,
  MapPin,
  Navigation,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { EventGuestbookMessageRow } from '@/types/invitation';
import { useInvitationTheme } from './InvitationExperience';
import { InvitationGallery } from '../public/InvitationGallery';
import { InvitationGiftRegistry } from '../public/InvitationGiftRegistry';
import { GuestbookWall } from './GuestbookWall';
import { RsvpExperience } from './RsvpExperience';

interface PremiumInvitationJourneyProps {
  guestbookMessages?: EventGuestbookMessageRow[];
}

function getCalendarUrl(
  title: string,
  eventDate: Date,
  description: string,
  location: string
) {
  const format = (value: Date) => value.toISOString().replace(/-|:|\.\d{3}/g, '');
  const end = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${format(eventDate)}/${format(end)}`,
    details: description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function StorySection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reducedMotion } = useInvitationTheme();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`invitation-story-section ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="invitation-story-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function PremiumInvitationJourney({ guestbookMessages = [] }: PremiumInvitationJourneyProps) {
  const { event, theme, themeConfig } = useInvitationTheme();
  const [revealProgress, setRevealProgress] = useState(0);
  const date = useMemo(() => new Date(event.event_date), [event.event_date]);
  const mapsUrl = event.maps_url || (event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : '#');
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const displayName = event.honoree_name || event.title;
  const showReveal = themeConfig.showDateReveal !== false;
  const showSchedule = themeConfig.showSchedule !== false;
  const palette = (themeConfig.dressCodeColors?.length
    ? themeConfig.dressCodeColors
    : [themeConfig.primaryColor, themeConfig.accentColor, themeConfig.backgroundColor]
  ).filter(Boolean).slice(0, 5) as string[];
  const defaultSchedule = [
    { time: formattedTime, label: 'Boas-vindas', description: 'Chegada dos convidados e recepção.' },
    { time: new Date(date.getTime() + 30 * 60_000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), label: 'Celebração', description: 'O momento principal da nossa história.' },
    { time: new Date(date.getTime() + 90 * 60_000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), label: 'Brinde & festa', description: 'Memórias, música e muita alegria.' },
  ];
  const schedule = themeConfig.scheduleItems?.length ? themeConfig.scheduleItems : defaultSchedule;
  const calendarUrl = getCalendarUrl(
    event.title,
    date,
    event.opening_message || event.headline || `Celebração de ${displayName}`,
    event.address || event.venue_name || ''
  );

  return (
    <div
      id="invitation-story"
      className="invitation-story"
      data-story-theme={theme.assetFolder}
      style={{
        '--story-primary': themeConfig.primaryColor,
        '--story-accent': themeConfig.accentColor,
        '--story-surface': themeConfig.surfaceColor || '#ffffff',
        '--story-text': themeConfig.textColor,
      } as React.CSSProperties}
    >
      <div className="invitation-story-rail" aria-hidden="true"><span /></div>

      {event.opening_message && (
        <StorySection className="invitation-story-welcome">
          <div className="invitation-story-ornament"><Sparkles aria-hidden="true" /></div>
          <SectionHeading eyebrow="Uma mensagem especial" title={`Esperamos você, ${displayName}`} />
          <blockquote>“{event.opening_message}”</blockquote>
          <p className="invitation-story-signature">Com carinho, {event.host_names}</p>
        </StorySection>
      )}

      {showReveal && (
        <StorySection className="invitation-date-reveal" delay={0.05}>
          <SectionHeading
            eyebrow={themeConfig.revealEyebrow || 'Reserve esta data'}
            title="Um momento para guardar"
            text="Deslize delicadamente para revelar quando nos encontraremos."
          />
          <div className="invitation-reveal-card">
            <div className="invitation-reveal-content">
              <CalendarDays aria-hidden="true" />
              <strong>{formattedDate}</strong>
              <span>às {formattedTime}</span>
            </div>
            <div
              className="invitation-reveal-cover"
              style={{ opacity: Math.max(0, 1 - revealProgress / 78), pointerEvents: revealProgress >= 78 ? 'none' : 'auto' }}
              aria-hidden={revealProgress >= 78}
            >
              <Gem aria-hidden="true" />
              <span>{revealProgress >= 78 ? 'Data revelada' : 'Deslize para revelar'}</span>
            </div>
            <label className="invitation-reveal-slider">
              <span className="sr-only">Deslize para revelar a data</span>
              <input
                type="range"
                min="0"
                max="100"
                value={revealProgress}
                onChange={(event) => setRevealProgress(Number(event.target.value))}
                aria-valuetext={revealProgress >= 78 ? 'Data revelada' : `${revealProgress}% revelado`}
              />
            </label>
          </div>
        </StorySection>
      )}

      <StorySection className="invitation-details-story" delay={0.08}>
        <SectionHeading eyebrow="Onde a história acontece" title="Data & local" />
        <div className="invitation-detail-grid">
          <article>
            <CalendarDays aria-hidden="true" />
            <span>Quando</span>
            <strong>{formattedDate}</strong>
            <p><Clock3 aria-hidden="true" /> {formattedTime}</p>
          </article>
          <article>
            <MapPin aria-hidden="true" />
            <span>Onde</span>
            <strong>{event.venue_name || 'Local da celebração'}</strong>
            <p>{event.address || 'Endereço a confirmar'}</p>
          </article>
        </div>
        <div className="invitation-story-actions">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"><Navigation aria-hidden="true" /> Abrir mapa</a>
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer"><CalendarPlus aria-hidden="true" /> Salvar na agenda</a>
        </div>
      </StorySection>

      {showSchedule && schedule.length > 0 && (
        <StorySection className="invitation-schedule-story" delay={0.1}>
          <SectionHeading eyebrow="Para viver cada instante" title="Programação" />
          <div className="invitation-schedule-list">
            {schedule.map((item, index) => (
              <article key={`${item.time}-${item.label}-${index}`}>
                <time>{item.time}</time>
                <i aria-hidden="true" />
                <div><strong>{item.label}</strong>{item.description && <p>{item.description}</p>}</div>
              </article>
            ))}
          </div>
        </StorySection>
      )}

      {event.dress_code && (
        <StorySection className="invitation-dress-story" delay={0.1}>
          <div className="invitation-story-ornament"><Shirt aria-hidden="true" /></div>
          <SectionHeading eyebrow="Inspiração para celebrar" title="Dress code" text={event.dress_code} />
          <div className="invitation-dress-palette" aria-label="Paleta sugerida">
            {palette.map((color, index) => (
              <span key={`${color}-${index}`} style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        </StorySection>
      )}

      {event.media?.length > 0 && (
        <StorySection className="invitation-embedded-section" delay={0.08}>
          <InvitationGallery />
        </StorySection>
      )}

      {event.gift_information && (
        <StorySection className="invitation-embedded-section" delay={0.08}>
          <InvitationGiftRegistry />
        </StorySection>
      )}

      {event.plan === 'completo' && (
        <StorySection className="invitation-embedded-section" delay={0.08}>
          <GuestbookWall messages={guestbookMessages} />
        </StorySection>
      )}

      <StorySection className="invitation-rsvp-story" delay={0.1}>
        <SectionHeading
          eyebrow="Sua presença faz parte"
          title="Vamos celebrar juntos?"
          text="Confirme em poucos segundos para que possamos preparar tudo com carinho."
        />
        <RsvpExperience />
      </StorySection>
    </div>
  );
}
