export interface PremiumThemeVisual {
  background: string;
  primary: string;
  accent: string;
  buttonText: string;
  plaqueText: string;
  photo: { left: string; top: string; width: string; height: string; radius: string };
  headlineTop: string;
  countdownTop: string;
  infoTop: string;
  routeTop: string;
  buttonTop: string;
  openingLabel: string;
  openingMessage: string;
}

const visual = (
  folder: string,
  overrides: Partial<PremiumThemeVisual>
): PremiumThemeVisual => ({
  background: `/invitations/themes/${folder}/${folder}-premium-background.webp`,
  primary: '#3f3028',
  accent: '#8a4b2d',
  buttonText: '#ffffff',
  plaqueText: '#3f3028',
  photo: { left: '21.5%', top: '21.8%', width: '57%', height: '25.4%', radius: '12%' },
  headlineTop: '50.8%',
  countdownTop: '54.6%',
  infoTop: '67.2%',
  routeTop: '77.0%',
  buttonTop: '84.4%',
  openingLabel: 'Convite especial',
  openingMessage: 'Uma experiência espera por você',
  ...overrides,
});

export const PREMIUM_THEME_VISUALS: Record<string, PremiumThemeVisual> = {
  elemental: visual('elemental', {
    primary: '#166534', accent: '#c2410c', plaqueText: '#5b351f',
    photo: { left: '21.5%', top: '21.8%', width: '57%', height: '25.4%', radius: '13%' },
    openingLabel: 'Jornada dos elementos',
    openingMessage: 'Quatro forças, uma grande celebração',
  }),
  heroes: visual('heroes', {
    primary: '#102a56', accent: '#b91c1c', plaqueText: '#102a56',
    photo: { left: '21.8%', top: '22.0%', width: '56.4%', height: '25.0%', radius: '6%' },
    openingLabel: 'Missão especial', openingMessage: 'Todo grande herói começa uma aventura',
  }),
  enchanted: visual('enchanted', {
    primary: '#7f1d4e', accent: '#b7791f', plaqueText: '#7f1d4e',
    photo: { left: '22%', top: '22.2%', width: '56%', height: '25.2%', radius: '45% 45% 10% 10%' },
    openingLabel: 'Era uma vez', openingMessage: 'Um momento digno de conto de fadas',
  }),
  pop: visual('pop', {
    primary: '#581c87', accent: '#db2777', plaqueText: '#581c87',
    photo: { left: '22%', top: '21.8%', width: '56%', height: '25.4%', radius: '4%' },
    openingLabel: 'Acesso especial', openingMessage: 'O palco está pronto para você',
  }),
  blocks: visual('blocks', {
    primary: '#166534', accent: '#b45309', plaqueText: '#5b351f',
    photo: { left: '21.8%', top: '22.0%', width: '56.4%', height: '25.2%', radius: '4%' },
    openingLabel: 'Novo mundo desbloqueado', openingMessage: 'Construa memórias nesta aventura',
  }),
  baby: visual('baby', {
    primary: '#3f5f85', accent: '#b8892f', plaqueText: '#3f5f85', buttonText: '#ffffff',
    photo: { left: '21.5%', top: '21.6%', width: '57%', height: '25.4%', radius: '45%' },
    openingLabel: 'Um sonho delicado', openingMessage: 'Uma celebração escrita nas estrelas',
  }),
  romantic: visual('romantic', {
    primary: '#713c48', accent: '#a15c6e', plaqueText: '#713c48',
    photo: { left: '22%', top: '21.8%', width: '56%', height: '25.4%', radius: '44% 44% 9% 9%' },
    openingLabel: 'Com todo o nosso amor', openingMessage: 'Uma história feita para ser celebrada',
  }),
  elegant: visual('elegant', {
    primary: '#1c1917', accent: '#9a6b21', plaqueText: '#1c1917',
    photo: { left: '21%', top: '22.0%', width: '58%', height: '25.2%', radius: '4%' },
    openingLabel: 'Celebração especial', openingMessage: 'Elegância em cada detalhe',
  }),
  sacred: visual('sacred', {
    primary: '#166534', accent: '#a97822', plaqueText: '#4b3b20',
    photo: { left: '22%', top: '21.8%', width: '56%', height: '25.4%', radius: '48% 48% 8% 8%' },
    openingLabel: 'Celebração de fé', openingMessage: 'Um momento de luz e bênçãos',
  }),
  botanical: visual('botanical', {
    primary: '#365314', accent: '#6d3c76', plaqueText: '#365314',
    photo: { left: '21.8%', top: '21.8%', width: '56.4%', height: '25.4%', radius: '12%' },
    openingLabel: 'Entre flores e afetos', openingMessage: 'A natureza prepara um dia inesquecível',
  }),
  minimal: visual('minimal', {
    primary: '#1c1917', accent: '#9a4e2f', plaqueText: '#1c1917',
    photo: { left: '21%', top: '21.6%', width: '58%', height: '25.6%', radius: '12%' },
    openingLabel: 'Edição especial', openingMessage: 'O essencial transforma o momento',
  }),
  celebration: visual('celebration', {
    primary: '#4c1d65', accent: '#a97822', plaqueText: '#4c1d65',
    photo: { left: '21.8%', top: '21.8%', width: '56.4%', height: '25.4%', radius: '14%' },
    openingLabel: 'Noite de celebração', openingMessage: 'As luzes se acendem para este momento',
  }),
};

export function getPremiumThemeVisual(folder: string): PremiumThemeVisual | null {
  if (folder === 'dinosaurs') {
    return visual('dinosaurs', {
      background: '/invitations/themes/dinosaurs/safari-premium-background.webp',
      primary: '#166534', accent: '#c2410c', plaqueText: '#4a2d14',
      openingLabel: 'Convite de expedição', openingMessage: 'Uma aventura espera por você',
    });
  }
  return PREMIUM_THEME_VISUALS[folder] || null;
}
