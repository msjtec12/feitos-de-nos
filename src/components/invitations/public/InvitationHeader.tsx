'use client';

import React from 'react';
import { EventThemeConfig } from '@/types/invitation';
import { InvitationHero } from '../experience/InvitationHero';

interface InvitationHeaderProps {
  title: string;
  honoreeName?: string | null;
  hostNames: string;
  headline?: string | null;
  coverUrl?: string | null;
  eventDate: string;
  themeConfig: EventThemeConfig;
  isEditor?: boolean;
}

export function InvitationHeader(props: InvitationHeaderProps) {
  return <InvitationHero {...props} />;
}
