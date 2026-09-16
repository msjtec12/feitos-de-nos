import type { AuthorialThemeDefinition } from '@/data/invitation-themes';

const cardClasses: Record<string, string> = {
  'carved-parchment': 'rounded-[28px] border-2 border-amber-900/20 bg-[#fffaf0]/95 shadow-[0_18px_50px_rgba(69,43,20,.12)]',
  'comic-panel': 'rounded-xl border-[3px] border-slate-950 bg-white shadow-[7px_7px_0_#1e3a8a]',
  'royal-scroll': 'rounded-[32px] border-2 border-amber-300/80 bg-gradient-to-br from-white via-pink-50 to-amber-50 shadow-[0_18px_45px_rgba(190,24,93,.14)]',
  'neon-laminate': 'rounded-[24px] border-2 border-pink-400 bg-[#21133d]/95 text-white shadow-[0_0_28px_rgba(236,72,153,.28)]',
  'pixel-stone': 'rounded-none border-[3px] border-emerald-950 bg-emerald-50 shadow-[7px_7px_0_#15803d]',
  'baby-cloud': 'rounded-[36px] border-2 border-sky-200/80 bg-white/90 shadow-[0_18px_45px_rgba(59,130,246,.12)]',
  'pressed-paper': 'rounded-[30px] border border-rose-200 bg-[#fffaf7]/95 shadow-[0_18px_45px_rgba(159,18,57,.10)]',
  'ivory-gilded': 'rounded-sm border border-amber-600/50 bg-[#fffdf5]/95 shadow-[0_20px_55px_rgba(28,25,23,.16)] ring-1 ring-amber-600/15',
  'luminous-serene': 'rounded-[28px] border border-emerald-200 bg-white/90 shadow-[0_18px_50px_rgba(6,95,70,.10)]',
  'kraft-linen': 'rounded-[26px] border border-emerald-800/20 bg-[#fbf8ef]/95 shadow-[0_18px_45px_rgba(6,78,59,.11)]',
  'clean-editorial': 'rounded-none border border-zinc-300 bg-white/95 shadow-[0_12px_35px_rgba(0,0,0,.06)]',
  'party-sparkle': 'rounded-[28px] border-2 border-amber-300 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white shadow-[0_0_34px_rgba(147,51,234,.28)]',
};

const buttonClasses: Record<string, string> = {
  'wood-plank': 'rounded-2xl border-2 border-amber-950/50 bg-gradient-to-b from-[#c96f2c] to-[#8b451f] text-white shadow-[0_6px_0_#5a2f11,0_12px_24px_rgba(90,47,17,.22)]',
  'elemental-insignia': 'rounded-full border-2 border-amber-200 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white shadow-[0_10px_28px_rgba(220,38,38,.25)]',
  'comic-button': 'rounded-lg border-[3px] border-slate-950 bg-red-600 text-white shadow-[5px_5px_0_#1e3a8a]',
  'royal-gold': 'rounded-full border-2 border-amber-300 bg-gradient-to-r from-pink-700 to-fuchsia-700 text-white shadow-[0_10px_25px_rgba(190,24,93,.22)]',
  'neon-ticket': 'rounded-xl border-2 border-pink-400 bg-purple-950 text-pink-100 shadow-[0_0_20px_rgba(236,72,153,.45)]',
  'pixel-retro': 'rounded-none border-[3px] border-emerald-950 bg-emerald-700 text-white shadow-[5px_5px_0_#052e16]',
  'baby-pillow': 'rounded-full border-2 border-sky-200 bg-gradient-to-r from-sky-500 to-indigo-400 text-white shadow-[0_10px_25px_rgba(59,130,246,.20)]',
  'romantic-satin': 'rounded-full border border-rose-200 bg-gradient-to-r from-rose-700 to-rose-500 text-white shadow-[0_10px_28px_rgba(159,18,57,.20)]',
  'luxury-classic': 'rounded-sm border border-amber-400 bg-stone-950 text-amber-100 shadow-[0_12px_30px_rgba(28,25,23,.25)]',
  'sacred-gentle': 'rounded-full border border-emerald-200 bg-emerald-800 text-white shadow-[0_10px_24px_rgba(6,95,70,.18)]',
  'botanical-leaf': 'rounded-full border border-emerald-700 bg-emerald-800 text-white shadow-[0_10px_25px_rgba(6,78,59,.20)]',
  'editorial-pure': 'rounded-none border border-black bg-black text-white shadow-none',
  'party-glow': 'rounded-full border-2 border-amber-300 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-orange-500 text-white shadow-[0_0_24px_rgba(217,70,239,.38)]',
};

const photoFrameClasses: Record<string, string> = {
  'organic-jungle': 'rounded-[42px] border-[5px] border-[#c48243] bg-[#fffaf0] p-1.5 shadow-[0_22px_60px_rgba(69,43,20,.24)] ring-4 ring-emerald-800/15',
  'elemental-quad': 'rounded-[30px] border-[4px] border-amber-400 bg-amber-50 p-1.5 shadow-[0_22px_55px_rgba(180,83,9,.24)] ring-2 ring-red-500/60',
  'comic-action': 'rounded-xl border-[4px] border-slate-950 bg-yellow-100 p-1 shadow-[8px_8px_0_#dc2626]',
  'royal-arch': 'rounded-t-[150px] rounded-b-[28px] border-[4px] border-amber-300 bg-pink-50 p-1.5 shadow-[0_22px_55px_rgba(190,24,93,.20)]',
  'polaroid-neon': 'rounded-lg border-[4px] border-pink-400 bg-purple-950 p-2 pb-10 shadow-[0_0_30px_rgba(236,72,153,.45)]',
  'pixel-block': 'rounded-none border-[4px] border-emerald-950 bg-emerald-100 p-1 shadow-[8px_8px_0_#15803d]',
  'dreamy-cloud': 'rounded-[48px] border-[4px] border-sky-200 bg-white p-2 shadow-[0_22px_55px_rgba(59,130,246,.16)]',
  'floral-wreath': 'rounded-[44%] border-[4px] border-rose-300 bg-rose-50 p-2 shadow-[0_22px_55px_rgba(159,18,57,.16)] ring-2 ring-rose-200',
  'luxury-gold': 'rounded-sm border-2 border-amber-500 bg-stone-950 p-2 shadow-[0_24px_60px_rgba(28,25,23,.30)] ring-1 ring-amber-300/60',
  'sacred-arch': 'rounded-t-[145px] rounded-b-[24px] border-[3px] border-emerald-300 bg-emerald-50 p-1.5 shadow-[0_22px_55px_rgba(6,95,70,.16)]',
  'botanical-frame': 'rounded-[38%] border-[4px] border-emerald-700/60 bg-[#fbf8ef] p-2 shadow-[0_22px_55px_rgba(6,78,59,.16)] ring-2 ring-purple-300',
  'editorial-minimal': 'rounded-none border border-black bg-white p-0 shadow-[12px_12px_0_rgba(0,0,0,.08)]',
  'party-glow': 'rounded-[32px] border-[4px] border-amber-300 bg-violet-950 p-1.5 shadow-[0_0_36px_rgba(217,70,239,.40)]',
};

export function getThemeCardClass(theme: AuthorialThemeDefinition, spacing = 'p-5 sm:p-7') {
  return `${cardClasses[theme.cardMaterial] || cardClasses['clean-editorial']} ${spacing}`;
}

export function getThemeButtonClass(theme: AuthorialThemeDefinition) {
  return buttonClasses[theme.buttonStyle] || buttonClasses['editorial-pure'];
}

export function getThemePhotoFrameClass(theme: AuthorialThemeDefinition) {
  return photoFrameClasses[theme.photoFrameStyle] || photoFrameClasses['editorial-minimal'];
}

const galleryFrameClasses: Record<string, string> = {
  'organic-jungle': 'rounded-[24px] border-[3px] border-[#c48243] shadow-[0_12px_28px_rgba(69,43,20,.18)]',
  'elemental-quad': 'rounded-2xl border-[3px] border-amber-400 ring-1 ring-red-400 shadow-lg',
  'comic-action': 'rounded-lg border-[3px] border-slate-950 shadow-[5px_5px_0_#dc2626]',
  'royal-arch': 'rounded-t-[70px] rounded-b-2xl border-[3px] border-amber-300 shadow-lg',
  'polaroid-neon': 'rounded-md border-[3px] border-pink-400 shadow-[0_0_20px_rgba(236,72,153,.38)]',
  'pixel-block': 'rounded-none border-[3px] border-emerald-950 shadow-[5px_5px_0_#15803d]',
  'dreamy-cloud': 'rounded-[30px] border-[3px] border-sky-200 shadow-lg',
  'floral-wreath': 'rounded-[32px] border-[3px] border-rose-300 shadow-lg',
  'luxury-gold': 'rounded-sm border-2 border-amber-500 shadow-xl',
  'sacred-arch': 'rounded-t-[64px] rounded-b-xl border-2 border-emerald-300 shadow-lg',
  'botanical-frame': 'rounded-[28px] border-[3px] border-emerald-700/60 shadow-lg',
  'editorial-minimal': 'rounded-none border border-black shadow-[7px_7px_0_rgba(0,0,0,.08)]',
  'party-glow': 'rounded-2xl border-[3px] border-amber-300 shadow-[0_0_22px_rgba(217,70,239,.38)]',
};

export function getThemeGalleryFrameClass(theme: AuthorialThemeDefinition) {
  return galleryFrameClasses[theme.photoFrameStyle] || galleryFrameClasses['editorial-minimal'];
}

export function getThemeHeadingStyle(theme: AuthorialThemeDefinition): React.CSSProperties {
  return {
    color: theme.config.primaryColor || theme.previewColors.primary,
    fontFamily: theme.config.headingFont,
  };
}

export function getThemeBodyStyle(theme: AuthorialThemeDefinition): React.CSSProperties {
  return {
    fontFamily: theme.config.bodyFont,
  };
}
