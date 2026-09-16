export type CountdownStyle =
  | 'dino-eggs'
  | 'elemental-crystals'
  | 'comic-badges'
  | 'royal-medallions'
  | 'music-panels'
  | 'pixel-cubes'
  | 'dreamy-stars'
  | 'rose-medallions'
  | 'gold-minimal'
  | 'sacred-cards'
  | 'botanical-wreath'
  | 'editorial-type'
  | 'celebration-burst';

export type PhotoFrameStyle =
  | 'organic-jungle'
  | 'elemental-quad'
  | 'comic-action'
  | 'royal-arch'
  | 'polaroid-neon'
  | 'pixel-block'
  | 'dreamy-cloud'
  | 'floral-wreath'
  | 'luxury-gold'
  | 'sacred-arch'
  | 'botanical-frame'
  | 'editorial-minimal'
  | 'party-glow'
  // retrocompatibilidade com valores legados
  | 'polaroid'
  | 'rounded'
  | 'arch'
  | 'classic'
  | 'pixel'
  | 'gold-border';

export type ButtonCornerStyle =
  | 'wood-plank'
  | 'elemental-insignia'
  | 'comic-button'
  | 'royal-gold'
  | 'neon-ticket'
  | 'pixel-retro'
  | 'baby-pillow'
  | 'romantic-satin'
  | 'luxury-classic'
  | 'sacred-gentle'
  | 'botanical-leaf'
  | 'editorial-pure'
  | 'party-glow'
  // retrocompatibilidade com valores legados
  | 'pill'
  | 'rounded'
  | 'smooth'
  | 'retro-pixel'
  | 'gold-glow';

export type CardMaterial =
  | 'carved-parchment'
  | 'comic-panel'
  | 'royal-scroll'
  | 'neon-laminate'
  | 'pixel-stone'
  | 'baby-cloud'
  | 'pressed-paper'
  | 'ivory-gilded'
  | 'luminous-serene'
  | 'kraft-linen'
  | 'clean-editorial'
  | 'party-sparkle';

export type OpeningStyle =
  | 'explorer-crate'
  | 'comic-book'
  | 'storybook'
  | 'stage-curtain'
  | 'pixel-portal'
  | 'elemental-card'
  | 'memory-box'
  | 'wax-seal-letter'
  | 'luxury-envelope'
  | 'ceremonial-book'
  | 'botanical-letter'
  | 'editorial-cover'
  | 'celebration-curtain'
  // retrocompatibilidade com valores legados
  | 'envelope'
  | 'card'
  | 'curtain'
  | 'gift-box'
  | 'simple';

export type ParticlePreset =
  | 'leaves'
  | 'elemental'
  | 'comic-stars'
  | 'sparkles'
  | 'notes'
  | 'pixel-dust'
  | 'stars'
  | 'petals'
  | 'gold-dust'
  | 'peace-feathers'
  | 'lavender-buds'
  | 'minimal-dust'
  | 'party-confetti'
  // retrocompatibilidade
  | 'confetti'
  | 'bubbles'
  | 'none';

export interface ThemeAssetsDefinition {
  assetFolder: string;
  openingCoverSvg: string;
  countdownShapeSvg: string;
  dividerSvg: string;
  bannerOrSignSvg?: string;
  buttonSvg?: string;
  backgroundPatternCss?: string;
}

export interface ThemeVisualIdentity {
  id: string;
  canonicalKey: string;
  name: string;
  category: 'infantil' | 'personagens' | 'romantico' | 'classico' | 'botanico' | 'moderno' | 'celebracao';
  tagline: string;
  heroBadge: string;
  description: string;
  defaultHeroImage: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    cardBg: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingClass: string;
    bodyClass: string;
    accentFontClass: string;
  };
  components: {
    countdownStyle: CountdownStyle;
    photoFrameStyle: PhotoFrameStyle;
    buttonStyle: ButtonCornerStyle;
    cardMaterial: CardMaterial;
    openingStyle: OpeningStyle;
    particlePreset: ParticlePreset;
    confirmationEffect: string;
  };
  assets: ThemeAssetsDefinition;
  scenery: {
    backgroundStyle: React.CSSProperties;
    ambientGlowColor: string;
    footerMessage: string;
    footerThemeNote?: string;
  };
}
