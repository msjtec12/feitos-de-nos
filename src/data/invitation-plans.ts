import { InvitationPlanConfig, InvitationPlanId } from '@/types/invitation';

export const INVITATION_PRICES_CENTS: Record<InvitationPlanId, number> = {
  essencial: 5990,
  interativo: 9990,
  completo: 19990,
};

export const INVITATION_PLANS: Record<InvitationPlanId, InvitationPlanConfig> = {
  essencial: {
    id: 'essencial',
    name: 'Convite Essencial',
    tagline: 'Delicado, prático e objetivo para informar com elegância',
    priceCents: 5990,
    formattedPrice: 'R$ 59,90',
    maxPhotos: 1,
    retentionDays: 30,
    description: 'Página personalizada perfeita para celebrações intimistas que precisam de clareza e bom gosto.',
    features: [
      'Página personalizada com link exclusivo',
      'Nome e informações completas do evento',
      'Uma fotografia principal em destaque',
      'Contagem regressiva dinâmica em tempo real',
      'Data e horário detalhados',
      'Localização do evento com endereço completo',
      'Botão interativo para abrir o local no mapa (Google Maps e Waze)',
      'Botão "Adicionar à agenda" (Google Agenda, Apple e Outlook)',
      'Confirmação de presença facilitada via WhatsApp direto',
      'Um tema visual à escolha com tipografia afetiva',
      'Uma rodada de alterações inclusa',
      'Página disponível online por até 30 dias após o evento',
    ],
    highlights: [
      '1 foto principal',
      'Botão de mapa e GPS',
      'Adicionar à agenda',
      'Online por 30 dias',
    ],
  },
  interativo: {
    id: 'interativo',
    name: 'Convite Interativo',
    tagline: 'A experiência completa com confirmação de presença integrada',
    priceCents: 9990,
    formattedPrice: 'R$ 99,90',
    badge: 'Mais escolhido',
    popular: true,
    maxPhotos: 5,
    retentionDays: 90,
    description: 'Nossa opção favorita para casamentos, festas de 1 ano, 15 anos e eventos marcantes.',
    features: [
      'Todos os recursos do Convite Essencial',
      'Galeria de fotos (até 5 fotos do casal, aniversariante ou família)',
      'Confirmação de presença (RSVP) integrada diretamente na página',
      'Controle de número de acompanhantes por confirmação',
      'Painel de confirmações em tempo real para os anfitriões',
      'Lista de presentes sugerida, Pix ou orientações gerais',
      'Recado carinhoso e emocionante dos anfitriões',
      'Duas rodadas de alterações inclusas',
      'QR Code em alta definição para impressão em cartões e lembrancinhas',
      'Página disponível online por até 90 dias após o evento',
    ],
    highlights: [
      'Até 5 fotos na galeria',
      'RSVP integrado na página',
      'Lista de presentes ou Pix',
      'QR Code para impressão',
      'Online por 90 dias',
    ],
  },
  completo: {
    id: 'completo',
    name: 'Evento Completo',
    tagline: 'Gestão VIP com convites individuais e check-in no dia',
    priceCents: 19990,
    formattedPrice: 'R$ 199,90',
    badge: 'VIP & Completo',
    maxPhotos: 15,
    retentionDays: 180,
    description: 'A solução definitiva para anfitriões que exigem controle absoluto de convidados e segurança na recepção.',
    features: [
      'Todos os recursos do Convite Interativo',
      'Galeria estendida de memórias com até 15 fotos em alta resolução',
      'Tema visual exclusivo com personalização minuciosa de paleta e detalhes',
      'Cadastro individual de convidados com link e token secreto por família/pessoa',
      'Limite personalizado de acompanhantes definido por convidado',
      'QR Code individual exclusivo por convidado',
      'Leitor de check-in móvel no dia do evento (controle de portaria sem filas)',
      'Coleta de preferências ou restrições alimentares',
      'Livro de recados digital moderado para os convidados deixarem mensagens',
      'Exportação completa da lista de convidados em CSV/Excel',
      'Página disponível online por até 180 dias após o evento',
    ],
    highlights: [
      'Até 15 fotos em alta definição',
      'Links individuais por convidado',
      'Check-in na portaria com QR Code',
      'Livro de recados dos convidados',
      'Exportação da lista em CSV',
      'Online por 180 dias',
    ],
  },
};

export const INVITATION_PLANS_LIST: InvitationPlanConfig[] = [
  INVITATION_PLANS.essencial,
  INVITATION_PLANS.interativo,
  INVITATION_PLANS.completo,
];

export function getPlanConfig(planId: InvitationPlanId): InvitationPlanConfig {
  return INVITATION_PLANS[planId] || INVITATION_PLANS.interativo;
}

export function formatPriceBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export const formatCentsToReais = formatPriceBRL;
