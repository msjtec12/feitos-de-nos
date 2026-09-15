export type InvitationPlanId = 'essencial' | 'interativo' | 'completo';

export type InvitationEventType =
  | 'aniversario-infantil'
  | 'cha-de-bebe'
  | 'cha-revelacao'
  | 'batizado'
  | 'primeira-comunhao'
  | 'casamento'
  | 'noivado'
  | '15-anos'
  | 'bodas'
  | 'formatura'
  | 'outro';

export type EventStatus =
  | 'draft'
  | 'awaiting_content'
  | 'in_production'
  | 'awaiting_approval'
  | 'published'
  | 'completed'
  | 'expired'
  | 'unpublished'
  | 'archived';

export type GuestAttendanceStatus = 'pending' | 'confirmed' | 'declined';

export type PhotoFrameStyle = 'polaroid' | 'rounded' | 'arch' | 'classic';
export type ButtonCornerStyle = 'pill' | 'rounded' | 'smooth';

export interface EventThemeConfig {
  themeId?: string;
  themeName?: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor?: string;
  textColor: string;
  mutedColor?: string;
  headingFont?: string;
  bodyFont?: string;
  photoStyle?: PhotoFrameStyle;
  buttonStyle?: ButtonCornerStyle;
}

export interface EventRow {
  id: string;
  order_id: string | null;
  title: string;
  slug: string;
  event_type: InvitationEventType;
  plan: InvitationPlanId;
  host_names: string;
  honoree_name: string | null;
  headline: string | null;
  opening_message: string | null;
  event_date: string;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  maps_url: string | null;
  dress_code: string | null;
  gift_information: string | null;
  cover_url: string | null;
  theme_config: EventThemeConfig;
  rsvp_deadline: string | null;
  status: EventStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface EventMediaRow {
  id: string;
  event_id: string;
  media_type: 'image' | 'audio' | 'video';
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface EventGuestRow {
  id: string;
  event_id: string;
  name: string;
  token: string;
  phone: string | null;
  max_companions: number;
  attendance_status: GuestAttendanceStatus;
  companions_count: number;
  dietary_restrictions: string | null;
  note: string | null;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventGuestbookMessageRow {
  id: string;
  event_id: string;
  guest_name: string;
  message: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface InvitationPlanConfig {
  id: InvitationPlanId;
  name: string;
  tagline: string;
  priceCents: number;
  formattedPrice: string;
  badge?: string;
  popular?: boolean;
  maxPhotos: number;
  retentionDays: number;
  description: string;
  features: string[];
  highlights: string[];
}

export interface EventStats {
  totalGuests: number;
  confirmedGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  confirmedCompanions: number;
}

export interface EventDetailWithMedia extends EventRow {
  media: EventMediaRow[];
  stats?: EventStats;
}

export interface PublicInvitationData {
  event: EventRow;
  media: EventMediaRow[];
  guestbook: EventGuestbookMessageRow[];
  isExpired: boolean;
  daysRemaining: number | null;
}

export interface PublicGuestData {
  guest: Pick<
    EventGuestRow,
    'id' | 'name' | 'token' | 'max_companions' | 'attendance_status' | 'companions_count' | 'dietary_restrictions' | 'note'
  >;
  event: Pick<EventRow, 'id' | 'title' | 'slug' | 'plan' | 'event_date' | 'timezone' | 'rsvp_deadline' | 'status'>;
  isDeadlinePassed: boolean;
}
