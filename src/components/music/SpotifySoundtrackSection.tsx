'use client';

import React from 'react';
import { GiftExperience } from '@/types/gift';
import { SpotifySoundtrack } from './SpotifySoundtrack';

export function SpotifySoundtrackSection({ gift }: { gift: GiftExperience }) {
  if (!gift.soundtrack?.enabled) return null;
  return <SpotifySoundtrack soundtrack={gift.soundtrack} />;
}
