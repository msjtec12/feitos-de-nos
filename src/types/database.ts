export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = 'owner' | 'editor';

export type OrderStatus =
  | 'new'
  | 'contact_started'
  | 'awaiting_content'
  | 'content_received'
  | 'creating'
  | 'awaiting_approval'
  | 'approved'
  | 'in_production'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'deposit_paid'
  | 'paid'
  | 'refunded';

export type ProductType =
  | 'digital'
  | 'talking_card'
  | 'interactive_gift';

export type GiftPageStatus =
  | 'draft'
  | 'awaiting_approval'
  | 'published'
  | 'unpublished'
  | 'archived';

export interface AdminProfile {
  id: string;
  name: string;
  role: AdminRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  code: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  customer_city: string;
  customer_state: string;
  customer_zipcode: string | null;
  customer_street: string | null;
  customer_number: string | null;
  customer_complement: string | null;
  customer_neighborhood: string | null;
  recipient_name: string;
  recipient_relationship: string;
  occasion_type: string;
  occasion_date: string | null;
  requested_title: string;
  main_phrase: string | null;
  collection_type: string;
  product_type: ProductType;
  visual_style: string;
  requested_contents: string[];
  price_cents: number;
  freight_cents: number;
  total_cents: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  internal_notes: string | null;
  consent_at: string;
  privacy_policy_version: string;
  source: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface OrderStatusHistoryRow {
  id: string;
  order_id: string;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  admin_id: string | null;
  note: string | null;
  created_at: string;
}

export interface GiftPageRow {
  id: string;
  order_id: string | null;
  title: string;
  recipient_name: string;
  template_type: string;
  status: GiftPageStatus;
  public_token: string;
  content: Record<string, any>;
  theme: Record<string, any>;
  published_at: string | null;
  reveal_at: string | null;
  archived_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaAssetRow {
  id: string;
  gift_page_id: string;
  media_type: 'image' | 'audio' | 'video';
  section_key: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  archived_at: string | null;
}

export interface ActivityLogRow {
  id: string;
  admin_id: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, any>;
  ip_address: string | null;
  created_at: string;
}
