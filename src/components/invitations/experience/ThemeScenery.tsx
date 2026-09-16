'use client';

import React from 'react';
import Image from 'next/image';
import { useInvitationTheme } from './InvitationExperience';

const cleanBadgeLabels: Record<string, string> = {
  elemental: 'Aventura dos quatro elementos',
  heroes: 'Convocação para uma grande missão',
  enchanted: 'Um convite do reino encantado',
  pop: 'Convite VIP • palco principal',
  blocks: 'Uma nova missão foi desbloqueada',
  dinosaurs: 'Expedição de 1 ano',
  baby: 'Um dia muito especial',
  romantic: 'Uma celebração escrita pelo amor',
  elegant: 'Celebração nobre',
  sacred: 'Um momento de fé e bênçãos',
  botanical: 'Celebração entre flores e afetos',
  minimal: 'Edição exclusiva',
  celebration: 'Uma festa inesquecível',
};

function Motif({ folder, className = 'h-16 w-16' }: { folder: string; className?: string }) {
  const common = { className: `${className} overflow-visible`, viewBox: '0 0 100 100', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };

  switch (folder) {
    case 'dinosaurs':
      return <svg {...common}><path d="M10 92C28 62 28 24 48 6c2 26 20 30 42 34-20 8-34 22-41 52H10Z" fill="currentColor" opacity=".9"/><path d="M33 83c18-20 36-29 58-30-18 13-29 26-35 40" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/></svg>;
    case 'elemental':
      return <svg {...common}><path d="M51 5c5 24 28 31 28 57 0 19-13 32-29 32S21 81 21 62c0-22 21-32 30-57Z" fill="currentColor" opacity=".9"/><path d="M50 38c2 13 14 17 14 29 0 9-6 16-14 16s-14-7-14-16c0-11 10-17 14-29Z" fill="white" opacity=".72"/></svg>;
    case 'heroes':
      return <svg {...common}><path d="m50 4 10 27 29-15-15 29 22 9-28 10 13 28-29-15-13 19-4-24L6 83l18-25L4 45l29-4L50 4Z" fill="currentColor"/><path d="M31 53h38" stroke="white" strokeWidth="8" strokeLinecap="round"/></svg>;
    case 'enchanted':
      return <svg {...common}><path d="M16 87V43h15V25l19-20 19 20v18h15v44H16Z" fill="currentColor" opacity=".9"/><path d="M43 87V64c0-10 14-10 14 0v23" fill="white" opacity=".8"/><path d="m50 16 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1 4-8Z" fill="white"/></svg>;
    case 'pop':
      return <svg {...common}><path d="M35 75V19l45-10v51" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/><ellipse cx="22" cy="76" rx="18" ry="13" fill="currentColor"/><ellipse cx="68" cy="61" rx="18" ry="13" fill="currentColor"/></svg>;
    case 'blocks':
      return <svg {...common}><path d="m50 4 42 22v48L50 96 8 74V26L50 4Z" fill="currentColor"/><path d="m8 26 42 23 42-23M50 49v47" stroke="white" strokeWidth="5" opacity=".65"/></svg>;
    case 'baby':
      return <svg {...common}><path d="M70 79c-29 3-50-17-47-44 2-15 12-27 26-32-5 10-5 21 1 31 8 14 25 20 42 15-4 16-11 27-22 30Z" fill="currentColor"/><path d="m72 15 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1 4-9Z" fill="currentColor" opacity=".55"/></svg>;
    case 'romantic':
      return <svg {...common}><path d="M50 89S10 65 10 35C10 12 39 7 50 27 61 7 90 12 90 35c0 30-40 54-40 54Z" fill="currentColor"/><path d="M21 70c20-3 35-18 42-42" stroke="white" strokeWidth="4" opacity=".55"/></svg>;
    case 'elegant':
      return <svg {...common}><path d="M50 5 61 38 95 50 61 61 50 95 39 61 5 50l34-12L50 5Z" fill="currentColor"/><circle cx="50" cy="50" r="11" fill="white" opacity=".75"/></svg>;
    case 'sacred':
      return <svg {...common}><path d="M50 92V14M25 38h50" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/><path d="M18 79c7-20 17-30 32-31M82 79c-7-20-17-30-32-31" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".55"/></svg>;
    case 'botanical':
      return <svg {...common}><path d="M18 92C31 67 45 43 77 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/><ellipse cx="35" cy="65" rx="13" ry="7" fill="currentColor" transform="rotate(30 35 65)"/><ellipse cx="54" cy="43" rx="13" ry="7" fill="currentColor" transform="rotate(-35 54 43)"/><circle cx="75" cy="15" r="8" fill="currentColor" opacity=".65"/></svg>;
    case 'minimal':
      return <svg {...common}><circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="2"/><path d="M12 50h76M50 12v76" stroke="currentColor" strokeWidth="1"/><circle cx="50" cy="50" r="5" fill="currentColor"/></svg>;
    default:
      return <svg {...common}><path d="m50 3 9 31 31-9-22 24 25 18-32-5-3 33-13-30-29 16 20-26L8 41l33-2L50 3Z" fill="currentColor"/></svg>;
  }
}

export function ThemeScenery() {
  const { theme } = useInvitationTheme();
  const color = theme.config.accentColor || theme.previewColors.accent;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-56 opacity-70" style={{ background: `radial-gradient(ellipse at top, ${color}22 0%, transparent 68%)` }} />
      <div className="absolute -left-6 top-20 rotate-[-18deg] opacity-20" style={{ color }}><Motif folder={theme.assetFolder} className="h-28 w-28" /></div>
      <div className="absolute -right-8 top-[24rem] rotate-[18deg] opacity-15" style={{ color }}><Motif folder={theme.assetFolder} className="h-32 w-32" /></div>
      <div className="absolute left-2 top-[54rem] rotate-[-10deg] opacity-10" style={{ color }}><Motif folder={theme.assetFolder} className="h-24 w-24" /></div>
      <div className="absolute right-4 top-[84rem] rotate-[12deg] opacity-10" style={{ color }}><Motif folder={theme.assetFolder} className="h-20 w-20" /></div>
    </div>
  );
}

export function ThemeMotif({ className }: { className?: string }) {
  const { theme } = useInvitationTheme();
  return <Motif folder={theme.assetFolder} className={className} />;
}

export function ThemeHeroBadge() {
  const { theme } = useInvitationTheme();
  const label = cleanBadgeLabels[theme.assetFolder] || theme.name;

  if (theme.assetFolder === 'dinosaurs' && theme.assets.bannerOrSignSvg) {
    return (
      <div className="relative mx-auto h-[78px] w-full max-w-[340px]">
        <Image src={theme.assets.bannerOrSignSvg} alt="" fill priority className="object-contain drop-shadow-md" />
        <span className="absolute inset-0 flex items-center justify-center pt-4 text-[11px] font-black uppercase tracking-[.13em] text-[#3b1e08] sm:text-xs">{label}</span>
      </div>
    );
  }

  return (
    <div className="invitation-theme-badge inline-flex max-w-[92%] items-center gap-2 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.14em] shadow-sm">
      <ThemeMotif className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

export function ThemeSectionDivider() {
  const { theme } = useInvitationTheme();
  return (
    <div className="relative z-10 mx-auto h-8 w-full max-w-[260px] px-6 opacity-80" aria-hidden="true">
      <Image src={theme.assets.dividerSvg} alt="" fill className="object-contain" />
    </div>
  );
}

