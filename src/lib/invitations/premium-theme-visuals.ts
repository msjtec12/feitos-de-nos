export interface VisualSlot {
  top: string;
  height: string;
  insetX?: string;
  gap?: string;
  sizeClamp?: string;
}

export interface PremiumThemeVisual {
  background: string;
  primary: string;
  accent: string;
  buttonText: string;
  plaqueText: string;
  topBadge: VisualSlot;
  headline: VisualSlot;
  photo: { left: string; top: string; width: string; height: string; radius: string };
  countdownTitle: VisualSlot;
  countdownPods: VisualSlot;
  infoPlaques: VisualSlot;
  mapBanner: VisualSlot;
  rsvpButton: VisualSlot;
  openingLabel: string;
  openingMessage: string;
}

const defaultVisual = (
  folder: string,
  overrides: Partial<PremiumThemeVisual>
): PremiumThemeVisual => ({
  background: `/invitations/themes/${folder}/${folder}-premium-background.webp`,
  primary: '#3f3028',
  accent: '#8a4b2d',
  buttonText: '#ffffff',
  plaqueText: '#3f3028',
  topBadge: { top: '2.5%', height: '5.6%', insetX: '18%' },
  headline: { top: '8.8%', height: '12.2%', insetX: '11%' },
  photo: { left: '21.5%', top: '21.8%', width: '57%', height: '25.4%', radius: '12%' },
  countdownTitle: { top: '50.8%', height: '3.2%', insetX: '14%' },
  countdownPods: { top: '54.6%', height: '9.8%', insetX: '11%', gap: '2.5%' },
  infoPlaques: { top: '67.2%', height: '8.4%', insetX: '11.5%', gap: '4%' },
  mapBanner: { top: '77.0%', height: '4.4%', insetX: '16%' },
  rsvpButton: { top: '84.4%', height: '6.4%', insetX: '19%' },
  openingLabel: 'Convite especial',
  openingMessage: 'Uma experiência espera por você',
  ...overrides,
});

export const PREMIUM_THEME_VISUALS: Record<string, PremiumThemeVisual> = {
  // 1. Dinossauros & Safari
  dinosaurs: defaultVisual('dinosaurs', {
    background: '/invitations/themes/dinosaurs/safari-premium-background.webp',
    primary: '#166534',
    accent: '#c2410c',
    plaqueText: '#4a2d14',
    buttonText: '#ffffff',
    topBadge: { top: '2.5%', height: '5.6%', insetX: '18%' },
    headline: { top: '8.8%', height: '12.2%', insetX: '11%' },
    photo: { left: '21.5%', top: '21.8%', width: '57.0%', height: '25.4%', radius: '13%' },
    countdownTitle: { top: '50.8%', height: '3.2%', insetX: '14%' },
    countdownPods: { top: '54.6%', height: '9.8%', insetX: '11%', gap: '2.5%' },
    infoPlaques: { top: '67.2%', height: '8.4%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '77.0%', height: '4.4%', insetX: '16%' },
    rsvpButton: { top: '84.4%', height: '6.4%', insetX: '19%' },
    openingLabel: 'Convite de expedição',
    openingMessage: 'Uma aventura espera por você',
  }),

  // 2. Monstrinhos Elementais
  elemental: defaultVisual('elemental', {
    primary: '#166534',
    accent: '#c2410c',
    plaqueText: '#5b351f',
    buttonText: '#ffffff',
    topBadge: { top: '2.2%', height: '5.5%', insetX: '18%' },
    headline: { top: '8.5%', height: '12.0%', insetX: '11%' },
    photo: { left: '21.5%', top: '21.8%', width: '57.0%', height: '25.4%', radius: '14%' },
    countdownTitle: { top: '50.5%', height: '3.2%', insetX: '14%' },
    countdownPods: { top: '54.2%', height: '10.0%', insetX: '11%', gap: '2.5%' },
    infoPlaques: { top: '66.8%', height: '8.4%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '76.8%', height: '4.4%', insetX: '16%' },
    rsvpButton: { top: '84.2%', height: '6.4%', insetX: '19%' },
    openingLabel: 'Jornada dos elementos',
    openingMessage: 'Quatro forças, uma grande celebração',
  }),

  // 3. Super-Heróis
  heroes: defaultVisual('heroes', {
    primary: '#102a56',
    accent: '#b91c1c',
    plaqueText: '#102a56',
    buttonText: '#ffffff',
    topBadge: { top: '2.5%', height: '6.0%', insetX: '20%' },
    headline: { top: '11.5%', height: '11.5%', insetX: '14%' },
    photo: { left: '24.2%', top: '24.8%', width: '51.6%', height: '23.6%', radius: '4%' },
    countdownTitle: { top: '49.8%', height: '3.2%', insetX: '14%' },
    countdownPods: { top: '53.6%', height: '9.8%', insetX: '11.5%', gap: '2.5%' },
    infoPlaques: { top: '65.2%', height: '8.0%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '75.2%', height: '4.6%', insetX: '16%' },
    rsvpButton: { top: '84.0%', height: '6.4%', insetX: '18%' },
    openingLabel: 'Missão especial',
    openingMessage: 'Todo grande herói começa uma aventura',
  }),

  // 4. Pop & Música (Ajustado perfeitamente aos elementos neon)
  pop: defaultVisual('pop', {
    primary: '#581c87',
    accent: '#db2777',
    plaqueText: '#581c87',
    buttonText: '#ffffff',
    topBadge: { top: '3.0%', height: '3.0%', insetX: '22%' },
    headline: { top: '6.2%', height: '6.8%', insetX: '16%', sizeClamp: 'clamp(1.05rem,4.6vw,2.3rem)' },
    photo: { left: '25.5%', top: '15.2%', width: '49.0%', height: '23.8%', radius: '2%' },
    countdownTitle: { top: '47.8%', height: '4.2%', insetX: '20%' },
    countdownPods: { top: '54.2%', height: '9.8%', insetX: '10.5%', gap: '2.5%' },
    infoPlaques: { top: '66.0%', height: '8.2%', insetX: '11.0%', gap: '4%' },
    mapBanner: { top: '77.2%', height: '5.6%', insetX: '14%' },
    rsvpButton: { top: '87.2%', height: '6.6%', insetX: '18%' },
    openingLabel: 'Show exclusivo',
    openingMessage: 'O palco está pronto para você',
  }),

  // 5. Mundo dos Blocos
  blocks: defaultVisual('blocks', {
    primary: '#166534',
    accent: '#b45309',
    plaqueText: '#5b351f',
    buttonText: '#ffffff',
    topBadge: { top: '2.0%', height: '5.6%', insetX: '18%' },
    headline: { top: '8.8%', height: '11.8%', insetX: '12%' },
    photo: { left: '21.5%', top: '21.8%', width: '57.0%', height: '25.0%', radius: '4%' },
    countdownTitle: { top: '49.8%', height: '3.2%', insetX: '14%' },
    countdownPods: { top: '54.0%', height: '9.6%', insetX: '11.5%', gap: '2.5%' },
    infoPlaques: { top: '65.2%', height: '8.2%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '75.2%', height: '4.6%', insetX: '16%' },
    rsvpButton: { top: '83.8%', height: '6.4%', insetX: '19%' },
    openingLabel: 'Novo mundo desbloqueado',
    openingMessage: 'Construa memórias nesta aventura',
  }),

  // 6. Bebê Delicado / Chá de Bebê
  baby: defaultVisual('baby', {
    primary: '#3f5f85',
    accent: '#b8892f',
    plaqueText: '#3f5f85',
    buttonText: '#ffffff',
    topBadge: { top: '2.5%', height: '5.2%', insetX: '20%' },
    headline: { top: '8.6%', height: '8.6%', insetX: '15%' },
    photo: { left: '22.0%', top: '18.0%', width: '56.0%', height: '27.5%', radius: '28%' },
    countdownTitle: { top: '48.5%', height: '4.4%', insetX: '18%' },
    countdownPods: { top: '55.8%', height: '9.5%', insetX: '11.0%', gap: '2.5%' },
    infoPlaques: { top: '67.0%', height: '8.2%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '76.8%', height: '4.4%', insetX: '16%' },
    rsvpButton: { top: '84.4%', height: '6.4%', insetX: '20%' },
    openingLabel: 'Um sonho delicado',
    openingMessage: 'Uma celebração escrita nas estrelas',
  }),

  // 7. Reino Encantado / Princesas
  enchanted: defaultVisual('enchanted', {
    primary: '#7f1d4e',
    accent: '#b7791f',
    plaqueText: '#7f1d4e',
    buttonText: '#ffffff',
    topBadge: { top: '2.5%', height: '5.8%', insetX: '18%' },
    headline: { top: '9.5%', height: '11.5%', insetX: '12%' },
    photo: { left: '23.2%', top: '22.4%', width: '53.6%', height: '25.6%', radius: '44% 44% 6% 6%' },
    countdownTitle: { top: '49.6%', height: '3.0%', insetX: '14%' },
    countdownPods: { top: '53.4%', height: '9.6%', insetX: '11.0%', gap: '2.5%' },
    infoPlaques: { top: '64.8%', height: '8.0%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '74.8%', height: '4.6%', insetX: '16%' },
    rsvpButton: { top: '83.2%', height: '6.4%', insetX: '19%' },
    openingLabel: 'Era uma vez',
    openingMessage: 'Um momento digno de conto de fadas',
  }),

  // 8. Romântico & Casamento
  romantic: defaultVisual('romantic', {
    primary: '#713c48',
    accent: '#a15c6e',
    plaqueText: '#713c48',
    buttonText: '#ffffff',
    topBadge: { top: '2.5%', height: '5.8%', insetX: '18%' },
    headline: { top: '9.5%', height: '10.5%', insetX: '12%' },
    photo: { left: '21.0%', top: '20.5%', width: '58.0%', height: '26.0%', radius: '45% 45% 6% 6%' },
    countdownTitle: { top: '49.5%', height: '3.0%', insetX: '14%' },
    countdownPods: { top: '53.4%', height: '9.6%', insetX: '11.5%', gap: '2.5%' },
    infoPlaques: { top: '64.8%', height: '8.0%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '74.8%', height: '4.6%', insetX: '16%' },
    rsvpButton: { top: '83.6%', height: '6.4%', insetX: '19%' },
    openingLabel: 'Com todo o nosso amor',
    openingMessage: 'Uma história feita para ser celebrada',
  }),

  // 9. Elegante Nobre
  elegant: defaultVisual('elegant', {
    primary: '#1c1917',
    accent: '#9a6b21',
    plaqueText: '#1c1917',
    buttonText: '#ffffff',
    topBadge: { top: '2.5%', height: '6.0%', insetX: '18%' },
    headline: { top: '9.8%', height: '10.0%', insetX: '12%' },
    photo: { left: '19.8%', top: '20.8%', width: '60.4%', height: '25.4%', radius: '3%' },
    countdownTitle: { top: '48.8%', height: '3.0%', insetX: '14%' },
    countdownPods: { top: '52.8%', height: '9.8%', insetX: '11.0%', gap: '2.5%' },
    infoPlaques: { top: '65.0%', height: '8.2%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '76.2%', height: '4.4%', insetX: '15%' },
    rsvpButton: { top: '84.4%', height: '6.4%', insetX: '19%' },
    openingLabel: 'Celebração especial',
    openingMessage: 'Elegância em cada detalhe',
  }),

  // 10. Sagrado & Religioso
  sacred: defaultVisual('sacred', {
    primary: '#166534',
    accent: '#a97822',
    plaqueText: '#4b3b20',
    buttonText: '#ffffff',
    topBadge: { top: '2.2%', height: '5.6%', insetX: '18%' },
    headline: { top: '9.0%', height: '11.0%', insetX: '12%' },
    photo: { left: '21.5%', top: '20.6%', width: '57.0%', height: '26.4%', radius: '46% 46% 4% 4%' },
    countdownTitle: { top: '49.0%', height: '3.0%', insetX: '14%' },
    countdownPods: { top: '52.6%', height: '9.8%', insetX: '11.5%', gap: '2.5%' },
    infoPlaques: { top: '64.8%', height: '8.0%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '74.6%', height: '6.0%', insetX: '14%' },
    rsvpButton: { top: '84.8%', height: '6.2%', insetX: '19%' },
    openingLabel: 'Celebração de fé',
    openingMessage: 'Um momento de luz e bênçãos',
  }),

  // 11. Botânico & Lavanda
  botanical: defaultVisual('botanical', {
    primary: '#365314',
    accent: '#6d3c76',
    plaqueText: '#365314',
    buttonText: '#ffffff',
    topBadge: { top: '2.2%', height: '5.6%', insetX: '18%' },
    headline: { top: '9.0%', height: '11.0%', insetX: '12%' },
    photo: { left: '21.5%', top: '21.0%', width: '57.0%', height: '25.6%', radius: '14%' },
    countdownTitle: { top: '48.8%', height: '3.0%', insetX: '14%' },
    countdownPods: { top: '52.6%', height: '9.8%', insetX: '11.5%', gap: '2.5%' },
    infoPlaques: { top: '64.6%', height: '8.2%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '74.6%', height: '6.0%', insetX: '15%' },
    rsvpButton: { top: '84.6%', height: '6.2%', insetX: '19%' },
    openingLabel: 'Entre flores e afetos',
    openingMessage: 'A natureza prepara um dia inesquecível',
  }),

  // 12. Minimalista & Editorial
  minimal: defaultVisual('minimal', {
    primary: '#1c1917',
    accent: '#9a4e2f',
    plaqueText: '#1c1917',
    buttonText: '#ffffff',
    topBadge: { top: '2.4%', height: '5.4%', insetX: '18%' },
    headline: { top: '9.0%', height: '10.5%', insetX: '12%' },
    photo: { left: '20.5%', top: '20.5%', width: '59.0%', height: '26.0%', radius: '16%' },
    countdownTitle: { top: '48.6%', height: '3.0%', insetX: '14%' },
    countdownPods: { top: '52.4%', height: '10.0%', insetX: '11.0%', gap: '2.5%' },
    infoPlaques: { top: '64.8%', height: '8.2%', insetX: '11.5%', gap: '4%' },
    mapBanner: { top: '75.0%', height: '5.2%', insetX: '14%' },
    rsvpButton: { top: '84.5%', height: '6.2%', insetX: '19%' },
    openingLabel: 'Edição especial',
    openingMessage: 'O essencial transforma o momento',
  }),

  // 13. Celebração & Brilho
  celebration: defaultVisual('celebration', {
    primary: '#4c1d65',
    accent: '#a97822',
    plaqueText: '#4c1d65',
    buttonText: '#ffffff',
    topBadge: { top: '3.0%', height: '3.0%', insetX: '22%' },
    headline: { top: '6.2%', height: '6.8%', insetX: '16%', sizeClamp: 'clamp(1.05rem,4.6vw,2.3rem)' },
    photo: { left: '25.5%', top: '15.2%', width: '49.0%', height: '23.8%', radius: '2%' },
    countdownTitle: { top: '47.8%', height: '4.2%', insetX: '20%' },
    countdownPods: { top: '54.2%', height: '9.8%', insetX: '10.5%', gap: '2.5%' },
    infoPlaques: { top: '66.0%', height: '8.2%', insetX: '11.0%', gap: '4%' },
    mapBanner: { top: '77.2%', height: '5.6%', insetX: '14%' },
    rsvpButton: { top: '87.2%', height: '6.6%', insetX: '18%' },
    openingLabel: 'Noite de celebração',
    openingMessage: 'As luzes se acendem para este momento',
  }),
};

export function getPremiumThemeVisual(keyOrFolder: string): PremiumThemeVisual {
  const normalized = (keyOrFolder || '').toLowerCase().trim();

  if (PREMIUM_THEME_VISUALS[normalized]) {
    return PREMIUM_THEME_VISUALS[normalized];
  }

  const idToFolder: Record<string, string> = {
    'infantil-monstrinhos-elementais': 'elemental',
    'infantil-super-herois': 'heroes',
    'infantil-herois-originais': 'heroes',
    'infantil-reino-encantado': 'enchanted',
    'infantil-pop': 'pop',
    'infantil-mundo-dos-blocos': 'blocks',
    'infantil-aventura-blocos': 'blocks',
    'infantil-dinossauros': 'dinosaurs',
    'infantil-dinossauros-safari': 'dinosaurs',
    'infantil-delicado': 'baby',
    'infantil-cha-de-bebe': 'baby',
    'romantico': 'romantic',
    'casamento-romantico': 'romantic',
    'elegante': 'elegant',
    'casamento-classico': 'elegant',
    'religioso': 'sacred',
    'religioso-batizado': 'sacred',
    'floral': 'botanical',
    'festa-jardim-botanico': 'botanical',
    'minimalista': 'minimal',
    'adulto-moderno-minimalista': 'minimal',
    'festivo': 'celebration',
    'adulto-balada-neon': 'celebration',
  };

  const folder = idToFolder[normalized];
  if (folder && PREMIUM_THEME_VISUALS[folder]) {
    return PREMIUM_THEME_VISUALS[folder];
  }

  return PREMIUM_THEME_VISUALS.dinosaurs;
}
