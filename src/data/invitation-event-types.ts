import { InvitationEventType } from '@/types/invitation';

export interface EventTypeMetadata {
  id: InvitationEventType;
  title: string;
  badge: string;
  shortDescription: string;
  defaultOccasionType: string;
  recommendedThemeId: string;
  iconName: string;
}

export const INVITATION_EVENT_TYPES: EventTypeMetadata[] = [
  {
    id: 'aniversario-infantil',
    title: 'Aniversário Infantil',
    badge: 'Mais pedido',
    shortDescription: 'Celebre o crescimento do seu pequeno com fotos afetuosas, contagem regressiva e confirmação fácil.',
    defaultOccasionType: 'aniversario-infantil',
    recommendedThemeId: 'infantil-delicado',
    iconName: 'Cake',
  },
  {
    id: 'cha-de-bebe',
    title: 'Chá de Bebê / Fraldas',
    badge: 'Afetuoso',
    shortDescription: 'Receba o bebê que está a caminho com lista de sugestões de fraldas ou presentes e confirmação dos amigos.',
    defaultOccasionType: 'cha-de-bebe',
    recommendedThemeId: 'infantil-delicado',
    iconName: 'Baby',
  },
  {
    id: 'cha-revelacao',
    title: 'Chá Revelação',
    badge: 'Momento mágico',
    shortDescription: 'Crie expectativa para a grande descoberta com uma contagem regressiva emocionante.',
    defaultOccasionType: 'cha-revelacao',
    recommendedThemeId: 'infantil-delicado',
    iconName: 'Sparkles',
  },
  {
    id: 'batizado',
    title: 'Batizado & Apresentação',
    badge: 'Espiritual',
    shortDescription: 'Um convite sereno e solene para padrinhos, familiares e amigos celebrarem este sacramento.',
    defaultOccasionType: 'batizado',
    recommendedThemeId: 'religioso',
    iconName: 'HeartHandshake',
  },
  {
    id: 'primeira-comunhao',
    title: 'Primeira Comunhão',
    badge: 'Solene',
    shortDescription: 'Design limpo, reverente e elegante para marcar este passo de fé na família.',
    defaultOccasionType: 'primeira-comunhao',
    recommendedThemeId: 'religioso',
    iconName: 'BookOpen',
  },
  {
    id: 'casamento',
    title: 'Casamento',
    badge: 'Premium',
    shortDescription: 'História do casal, mapa interativo, código de vestimenta, lista de presentes/Pix e confirmação individual.',
    defaultOccasionType: 'casamento',
    recommendedThemeId: 'romantico',
    iconName: 'Heart',
  },
  {
    id: 'noivado',
    title: 'Noivado & Mini Wedding',
    badge: 'Íntimo',
    shortDescription: 'Encontros acolhedores e elegantes para celebrar o início de uma nova etapa a dois.',
    defaultOccasionType: 'noivado',
    recommendedThemeId: 'elegante',
    iconName: 'Gem',
  },
  {
    id: '15-anos',
    title: '15 Anos / Debutante',
    badge: 'Inesquecível',
    shortDescription: 'Galeria de fotos marcantes, contagem regressiva e mensagem especial aos convidados.',
    defaultOccasionType: '15-anos',
    recommendedThemeId: 'festivo',
    iconName: 'Crown',
  },
  {
    id: 'bodas',
    title: 'Bodas de Ouro, Prata & Afins',
    badge: 'Homenagem',
    shortDescription: 'Celebre décadas de união e histórias compartilhadas com elegância e carinho.',
    defaultOccasionType: 'bodas',
    recommendedThemeId: 'elegante',
    iconName: 'Award',
  },
  {
    id: 'formatura',
    title: 'Formatura',
    badge: 'Conquista',
    shortDescription: 'Convide quem vibrou com a sua trajetória acadêmica para comemorar esta vitória.',
    defaultOccasionType: 'formatura',
    recommendedThemeId: 'minimalista',
    iconName: 'GraduationCap',
  },
  {
    id: 'outro',
    title: 'Outros Momentos Especiais',
    badge: 'Personalizado',
    shortDescription: 'Reuniões familiares, comemorações de conquistas e eventos desenhados sob medida.',
    defaultOccasionType: 'outro',
    recommendedThemeId: 'minimalista',
    iconName: 'CalendarCheck',
  },
];

export function getEventTypeById(id: string): EventTypeMetadata {
  return (
    INVITATION_EVENT_TYPES.find((t) => t.id === id) ||
    INVITATION_EVENT_TYPES[INVITATION_EVENT_TYPES.length - 1]
  );
}
