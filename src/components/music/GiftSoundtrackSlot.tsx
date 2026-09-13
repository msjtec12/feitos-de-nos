'use client';

import React from 'react';
import { GiftExperience } from '@/types/gift';
import { SpotifySoundtrack } from './SpotifySoundtrack';

export function GiftSoundtrackSlot({ gift }: { gift: GiftExperience }) {
  if (!gift.soundtrack?.enabled) return null;
  return <SpotifySoundtrack soundtrack={gift.soundtrack} />;
}
