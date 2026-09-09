import { z } from 'zod';

export const ORDER_PRICES_CENTS: Record<string, number> = {
  digital: 5990,
  cartao: 9990,
  talking_card: 9990,
  interativo: 19990,
  interactive_gift: 19990,
};

export const publicOrderSchema = z.object({
  occasion: z.enum(['primeiro-ano', 'nossa-historia', 'vozes', 'especial']),
  format: z.enum(['digital', 'cartao', 'interativo']),
  recipientName: z.string().trim().min(2, 'Nome do presenteado deve ter ao menos 2 caracteres').max(80),
  recipientRelationship: z.string().trim().min(2, 'Informe o vínculo ou grau de parentesco').max(50),
  recipientDate: z.string().trim().max(50).optional().default(''),
  giftTitle: z.string().trim().min(2, 'Informe um título para o presente').max(100),
  openingMessage: z.string().trim().max(300).optional().default(''),
  contentTypes: z.object({
    photos: z.boolean().default(true),
    messages: z.boolean().default(true),
    audios: z.boolean().default(true),
    video: z.boolean().default(false),
    music: z.boolean().default(false),
    contributors: z.boolean().default(false),
  }),
  style: z.enum(['afetuoso', 'delicado', 'elegante', 'infantil-suave']),
  customerName: z.string().trim().min(3, 'Nome completo deve ter ao menos 3 caracteres').max(80),
  customerPhone: z.string().trim().min(10, 'WhatsApp deve ter ao menos 10 dígitos').max(20),
  customerEmail: z.string().trim().email('E-mail inválido').max(100),
  customerCity: z.string().trim().min(2, 'Informe a cidade').max(60),
  customerState: z.string().trim().min(2).max(2),
  customerCep: z.string().trim().max(10).optional().default(''),
  customerStreet: z.string().trim().max(120).optional().default(''),
  customerNumber: z.string().trim().max(20).optional().default(''),
  customerComplement: z.string().trim().max(60).optional().default(''),
  customerNeighborhood: z.string().trim().max(60).optional().default(''),
  notes: z.string().trim().max(500).optional().default(''),
  acceptedTerms: z.literal(true),
  honeypot: z.string().max(0, 'Tentativa de submissão inválida').optional().default(''),
});

export type PublicOrderInput = z.infer<typeof publicOrderSchema>;

export const adminOrderUpdateSchema = z.object({
  status: z.enum([
    'new',
    'contact_started',
    'awaiting_content',
    'content_received',
    'creating',
    'awaiting_approval',
    'approved',
    'in_production',
    'shipped',
    'completed',
    'cancelled',
  ]).optional(),
  payment_status: z.enum(['pending', 'deposit_paid', 'paid', 'refunded']).optional(),
  freight_cents: z.number().int().min(0).optional(),
  internal_notes: z.string().max(2000).optional(),
  customer_notes: z.string().max(2000).optional(),
  status_note: z.string().max(500).optional(),
});

export type AdminOrderUpdateInput = z.infer<typeof adminOrderUpdateSchema>;

export const adminGiftPageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  recipient_name: z.string().trim().min(2).max(80),
  template_type: z.string().trim().min(2).max(50).default('primeiro-ano'),
  status: z.enum(['draft', 'awaiting_approval', 'published', 'unpublished', 'archived']),
  reveal_at: z.string().nullable().optional(),
  content: z.record(z.string(), z.any()),
  theme: z.record(z.string(), z.any()),
});

export type AdminGiftPageInput = z.infer<typeof adminGiftPageSchema>;
