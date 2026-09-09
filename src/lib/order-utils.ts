import { OrderFormData, PreparedOrder, FormatId } from '@/types/order';
import { OCCASIONS, GIFT_FORMATS, STYLE_OPTIONS } from '@/data/home-data';

const ORDER_DRAFT_KEY = 'feito_de_nos_order_draft';
const PREPARED_ORDER_KEY = 'feito_de_nos_prepared_order';

export function generateOrderCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `FN-${yy}${mm}${dd}-${randomPart}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function getFormatPrice(formatId: FormatId): number {
  const format = GIFT_FORMATS.find((f) => f.id === formatId);
  return format ? format.price : 59.90;
}

export interface CepAddressResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean | string;
}

export async function fetchCepAddress(cep: string): Promise<CepAddressResult | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!res.ok) return null;
    const data: CepAddressResult = await res.json();
    if (data.erro === true || data.erro === 'true') {
      return null;
    }
    return data;
  } catch (err) {
    console.error('Erro ao consultar CEP:', err);
    return null;
  }
}

export function buildWhatsAppMessage(order: PreparedOrder): string {
  const occasion = OCCASIONS.find((o) => o.id === order.data.occasion)?.title || order.data.occasion;
  const format = GIFT_FORMATS.find((f) => f.id === order.data.format)?.title || order.data.format;
  const style = STYLE_OPTIONS.find((s) => s.id === order.data.style)?.name || order.data.style;

  const contentList: string[] = [];
  if (order.data.contentTypes.photos) contentList.push('Fotos');
  if (order.data.contentTypes.messages) contentList.push('Mensagens');
  if (order.data.contentTypes.audios) contentList.push('Áudios');
  if (order.data.contentTypes.video) contentList.push('Vídeo');
  if (order.data.contentTypes.music) contentList.push('Música');
  if (order.data.contentTypes.contributors) contentList.push('Colaboradores');
  const contentsStr = contentList.length > 0 ? contentList.join(', ') : 'Não informado';

  let locationLine = order.data.customerState
    ? `${order.data.customerCity}/${order.data.customerState.toUpperCase()}`
    : order.data.customerCity;

  if (order.data.customerCep) {
    const addressParts: string[] = [];
    if (order.data.customerStreet) {
      let street = order.data.customerStreet;
      if (order.data.customerNumber) street += `, nº ${order.data.customerNumber}`;
      if (order.data.customerComplement) street += ` (${order.data.customerComplement})`;
      addressParts.push(street);
    }
    if (order.data.customerNeighborhood) addressParts.push(order.data.customerNeighborhood);
    addressParts.push(locationLine);
    addressParts.push(`CEP: ${order.data.customerCep}`);
    locationLine = addressParts.join(' - ');
  }

  return `Olá! Quero criar um presente Feito de Nós.

Pedido: ${order.code}
Coleção: ${occasion}
Formato: ${format}
Presenteado: ${order.data.recipientName} (${order.data.recipientRelationship})
Ocasião / Data: ${order.data.recipientDate || 'A definir'}
Estilo: ${style}
Conteúdos: ${contentsStr}
Valor: ${order.formattedTotal}

Meu nome: ${order.data.customerName}
Endereço / Cidade: ${locationLine}

Gostaria de receber as orientações para enviar as fotos, mensagens e áudios.`;
}

export function buildWhatsAppUrl(message: string, customPhone?: string): string {
  const phone =
    customPhone ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '5511999999999';
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function saveOrderDraft(data: OrderFormData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDER_DRAFT_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar rascunho do pedido no localStorage:', err);
  }
}

export function loadOrderDraft(): OrderFormData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ORDER_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Erro ao carregar rascunho do pedido:', err);
    return null;
  }
}

export function clearOrderDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ORDER_DRAFT_KEY);
  } catch (err) {
    console.error('Erro ao limpar rascunho:', err);
  }
}

export function savePreparedOrder(order: PreparedOrder): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREPARED_ORDER_KEY, JSON.stringify(order));
  } catch (err) {
    console.error('Erro ao salvar pedido preparado:', err);
  }
}

export function loadPreparedOrder(): PreparedOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREPARED_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Erro ao carregar pedido preparado:', err);
    return null;
  }
}
