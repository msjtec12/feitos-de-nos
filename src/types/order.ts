export type OccasionId = 'primeiro-ano' | 'nossa-historia' | 'vozes' | 'especial';

export type FormatId = 'digital' | 'cartao' | 'interativo';

export type StyleId = 'afetuoso' | 'delicado' | 'elegante' | 'infantil-suave';

export interface OccasionOption {
  id: OccasionId;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  suggestedStyle: StyleId;
}

export interface FormatOption {
  id: FormatId;
  title: string;
  price: number;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
  isPhysical: boolean;
}

export interface StyleOption {
  id: StyleId;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgPreview: string;
}

export interface OrderContentTypes {
  photos: boolean;
  messages: boolean;
  audios: boolean;
  video: boolean;
  music: boolean;
  contributors: boolean;
}

export interface OrderFormData {
  // Etapa 1: Ocasião
  occasion: OccasionId;
  customOccasion?: string;

  // Etapa 2: Formato
  format: FormatId;

  // Etapa 3: Presenteado
  recipientName: string;
  recipientRelationship: string;
  recipientDate: string;
  giftTitle: string;
  openingMessage?: string;

  // Etapa 4: Conteúdos
  contentTypes: OrderContentTypes;

  // Etapa 5: Estilo
  style: StyleId;

  // Etapa 6: Dados do Comprador
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerState: string;
  customerCep?: string;
  customerStreet?: string;
  customerNumber?: string;
  customerComplement?: string;
  customerNeighborhood?: string;
  notes?: string;
  acceptedTerms: boolean;
}

export interface PreparedOrder {
  code: string;
  createdAt: string;
  data: OrderFormData;
  totalPrice: number;
  formattedTotal: string;
}
