import { OrderStatus, PaymentStatus, ProductType, GiftPageStatus, OrderRow, GiftPageRow } from './database';

export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  description: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusInfo> = {
  new: {
    status: 'new',
    label: 'Novo Pedido',
    description: 'Pedido recebido no site, aguardando início do atendimento.',
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    dotClass: 'bg-blue-500',
  },
  contact_started: {
    status: 'contact_started',
    label: 'Contato Iniciado',
    description: 'Mensagem enviada no WhatsApp para alinhamento.',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-800',
    dotClass: 'bg-amber-500',
  },
  awaiting_content: {
    status: 'awaiting_content',
    label: 'Aguardando Conteúdo',
    description: 'Aguardando o envio de fotos, mensagens e áudios.',
    bgClass: 'bg-yellow-50 border-yellow-200',
    textClass: 'text-yellow-800',
    dotClass: 'bg-yellow-500',
  },
  content_received: {
    status: 'content_received',
    label: 'Conteúdo Recebido',
    description: 'Todas as fotos e áudios foram recebidos e organizados.',
    bgClass: 'bg-indigo-50 border-indigo-200',
    textClass: 'text-indigo-800',
    dotClass: 'bg-indigo-500',
  },
  creating: {
    status: 'creating',
    label: 'Em Criação',
    description: 'A equipe está montando a página e o design.',
    bgClass: 'bg-purple-50 border-purple-200',
    textClass: 'text-purple-800',
    dotClass: 'bg-purple-500',
  },
  awaiting_approval: {
    status: 'awaiting_approval',
    label: 'Aguardando Aprovação',
    description: 'Prévia enviada ao cliente para validação.',
    bgClass: 'bg-orange-50 border-orange-200',
    textClass: 'text-orange-800',
    dotClass: 'bg-orange-500',
  },
  approved: {
    status: 'approved',
    label: 'Aprovado pelo Cliente',
    description: 'Cliente aprovou o conteúdo e a prévia final.',
    bgClass: 'bg-teal-50 border-teal-200',
    textClass: 'text-teal-800',
    dotClass: 'bg-teal-500',
  },
  in_production: {
    status: 'in_production',
    label: 'Em Produção Física',
    description: 'Cartão ou placa de acrílico em processo de confecção.',
    bgClass: 'bg-cyan-50 border-cyan-200',
    textClass: 'text-cyan-800',
    dotClass: 'bg-cyan-500',
  },
  shipped: {
    status: 'shipped',
    label: 'Enviado / Postado',
    description: 'Item físico despachado pelos Correios/transportadora.',
    bgClass: 'bg-sky-50 border-sky-200',
    textClass: 'text-sky-800',
    dotClass: 'bg-sky-500',
  },
  completed: {
    status: 'completed',
    label: 'Concluído / Entregue',
    description: 'Presente entregue e experiência ativada com sucesso.',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    dotClass: 'bg-green-500',
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelado',
    description: 'Pedido cancelado por solicitação ou desistência.',
    bgClass: 'bg-gray-100 border-gray-300',
    textClass: 'text-gray-700',
    dotClass: 'bg-gray-400',
  },
};

export interface PaymentStatusInfo {
  status: PaymentStatus;
  label: string;
  bgClass: string;
  textClass: string;
}

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, PaymentStatusInfo> = {
  pending: {
    status: 'pending',
    label: 'Pendente',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-800',
  },
  deposit_paid: {
    status: 'deposit_paid',
    label: 'Sinal Pago (50%)',
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
  },
  paid: {
    status: 'paid',
    label: 'Pago Integral',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
  },
  refunded: {
    status: 'refunded',
    label: 'Reembolsado',
    bgClass: 'bg-rose-50 border-rose-200',
    textClass: 'text-rose-800',
  },
};

export interface DashboardMetrics {
  totalOrders: number;
  newOrders: number;
  awaitingContent: number;
  inCreation: number;
  awaitingApproval: number;
  inProduction: number;
  completed: number;
  pendingPaymentsCount: number;
  totalRevenueCents: number;
  activeGiftPagesCount: number;
  recentOrders: OrderRow[];
  uncontactedNewOrders: OrderRow[];
}

export interface ProductionChecklistState {
  contentReceived: boolean;
  pageAssembled: boolean;
  clientApproved: boolean;
  acrylicArtApproved: boolean;
  paymentConfirmed: boolean;
  sentToProduction: boolean;
  qualityChecked: boolean;
  packagingPrepared: boolean;
  shipped: boolean;
  delivered: boolean;
}

export const DEFAULT_PRODUCTION_CHECKLIST: ProductionChecklistState = {
  contentReceived: false,
  pageAssembled: false,
  clientApproved: false,
  acrylicArtApproved: false,
  paymentConfirmed: false,
  sentToProduction: false,
  qualityChecked: false,
  packagingPrepared: false,
  shipped: false,
  delivered: false,
};
