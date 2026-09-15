import { z } from 'zod';

export const invitationEventTypeSchema = z.enum([
  'aniversario-infantil',
  'cha-de-bebe',
  'cha-revelacao',
  'batizado',
  'primeira-comunhao',
  'casamento',
  'noivado',
  '15-anos',
  'bodas',
  'formatura',
  'outro',
]);

export const invitationPlanIdSchema = z.enum([
  'essencial',
  'interativo',
  'completo',
]);

export const publicInvitationOrderSchema = z.object({
  eventType: invitationEventTypeSchema,
  plan: invitationPlanIdSchema,
  themeId: z.string().trim().min(1, 'Selecione um estilo visual para o convite'),

  // Detalhes do Evento
  title: z.string().trim().min(2, 'Informe o título do evento').max(100),
  honoreeName: z.string().trim().max(80).optional().default(''),
  hostNames: z.string().trim().min(2, 'Informe quem está convidando (ex: Pais, Noivos, Formando)').max(100),
  eventDate: z.string().trim().min(10, 'Informe a data do evento'),
  eventTime: z.string().trim().min(3, 'Informe o horário do evento').max(20),
  venueName: z.string().trim().max(100).optional().default(''),
  address: z.string().trim().min(3, 'Informe o endereço ou local da celebração').max(200),
  dressCode: z.string().trim().max(100).optional().default(''),
  giftInformation: z.string().trim().max(300).optional().default(''),
  openingMessage: z.string().trim().max(400).optional().default(''),

  // Dados do Contratante / Comprador
  customerName: z.string().trim().min(3, 'Nome completo deve ter ao menos 3 caracteres').max(80),
  customerPhone: z.string().trim().min(10, 'WhatsApp deve ter ao menos 10 dígitos com DDD').max(20),
  customerEmail: z.string().trim().email('E-mail inválido').max(100),
  customerCity: z.string().trim().min(2, 'Informe a cidade').max(60),
  customerState: z.string().trim().min(2, 'UF inválida').max(2),
  notes: z.string().trim().max(500).optional().default(''),

  // Confirmações e Proteção
  acceptedTerms: z.literal(true),
  honeypot: z.string().max(0, 'Tentativa de submissão inválida').optional().default(''),
});

export type PublicInvitationOrderInput = z.infer<typeof publicInvitationOrderSchema>;
