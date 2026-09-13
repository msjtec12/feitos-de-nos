export type OccasionId =
  | 'primeiro-ano'
  | 'amor-casal'
  | 'dia-das-maes'
  | 'dia-dos-pais'
  | 'aniversario'
  | 'casamento-bodas'
  | 'formatura'
  | 'amizade'
  | 'memorial'
  | 'religioso'
  | 'natal'
  | 'cha-de-bebe'
  // IDs legados preservados para pedidos já existentes.
  | 'nossa-historia'
  | 'vozes'
  | 'especial';

export type FormatId = 'digital' | 'cartao' | 'interativo';

export type StyleCategory =
  | 'classicos'
  | 'infantil'
  | 'romantico'
  | 'familia'
  | 'celebracoes'
  | 'natureza'
  | 'serenos'
  | 'sazonal';

export type StyleId =
  | 'afetuoso'
  | 'delicado'
  | 'elegante'
  | 'infantil-suave'
  | 'azul-sereno'
  | 'lavanda-bebe'
  | 'terracota-boho'
  | 'cerejeira-marsala'
  | 'noite-estrelada'
  | 'verde-botanico'
  | 'eucalipto-alecrim'
  | 'sol-girassol'
  | 'rose-champagne'
  | 'floral-mae'
  | 'classico-pai'
  | 'casamento-champagne'
  | 'infantil-encantado'
  | 'memorial-sereno'
  | 'fe-dourada'
  | 'natal-elegante'
  | 'personalizado'
  | (string & {});

export interface OccasionOption {
  id: OccasionId;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  popular?: boolean;
  suggestedStyle: StyleId;
  recommendedFormat?: FormatId;
  structureHighlights?: string[];
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
  category?: StyleCategory;
  description: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  mutedColor?: string;
  borderColor?: string;
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
