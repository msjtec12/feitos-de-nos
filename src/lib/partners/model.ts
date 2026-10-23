import { z } from "zod";

export const PRODUCTS = {
  gift: {
    name: "Homenagem com QR",
    price: 990,
    retail: 2990,
    photos: 5,
    retention: "12 meses após a publicação",
    description:
      "Uma mensagem, até 5 fotos e um áudio para acompanhar o presente.",
  },
  invitation: {
    name: "Convite Essencial",
    price: 2990,
    retail: 5990,
    photos: 1,
    retention: "Até 30 dias após o evento",
    description:
      "Convite com foto, data, endereço, mapa e confirmação pelo WhatsApp.",
  },
} as const;
export type Product = keyof typeof PRODUCTS;
export const THEMES = {
  rose: { name: "Afeto", color: "#713C48", bg: "#FFF8F0" },
  botanical: { name: "Botânico", color: "#365A46", bg: "#F3F6EE" },
  night: { name: "Celebração", color: "#423458", bg: "#F2EDF9" },
};
export const contentSchema = z.object({
  title: z.string().trim().max(100).default(""),
  subtitle: z.string().trim().max(140).default(""),
  message: z.string().trim().max(3000).default(""),
  signature: z.string().trim().max(100).default(""),
  theme: z.enum(["rose", "botanical", "night"]).default("rose"),
  photoSlots: z.array(z.number().int().min(0).max(4)).max(5).default([]),
  mediaVersions: z.record(z.string().regex(/^(?:[0-4]|audio)$/), z.number().int().min(0).max(1)).default({}),
  audio: z.boolean().default(false),
  eventAt: z.string().max(40).default(""),
  venue: z.string().trim().max(120).default(""),
  address: z.string().trim().max(250).default(""),
  rsvpPhone: z.string().max(13).default(""),
  consent: z.boolean().default(false),
});
export type PartnerContent = z.infer<typeof contentSchema>;
export const emptyContent = contentSchema.parse({});
export const mediaName = (slot:string, content:PartnerContent) => `${slot}-${content.mediaVersions[slot] || 0}`;
export type PartnerProfile = {
  id: string;
  store_name: string;
  slug: string;
  phone: string;
  status: "pending" | "active" | "suspended";
  balance_cents: number;
  reserved_cents: number;
  created_at: string;
};
export type PartnerOrder = {
  id: string;
  partner_id: string;
  product: Product;
  customer_label: string;
  price_cents: number;
  status: "draft" | "published" | "cancelled";
  content: PartnerContent;
  revision: number;
  edit_version: number;
  public_token: string;
  created_at: string;
  published_at: string | null;
  expires_at: string | null;
};
export type WalletEntry = {
  id: string;
  kind: "credit" | "reserve" | "capture" | "release";
  amount_cents: number;
  reference: string;
  created_at: string;
};
export const money = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const statusLabel = {
  draft: "Em preenchimento",
  published: "Publicado",
  cancelled: "Cancelado",
  pending: "Aguardando aprovação",
  active: "Ativa",
  suspended: "Suspensa",
};

export function validateContent(
  input: unknown,
  product: Product,
  publishing = false,
  now = Date.now(),
) {
  const c = contentSchema.parse(input);
  c.photoSlots = Array.from(new Set(c.photoSlots));
  if (
    c.photoSlots.length > PRODUCTS[product].photos ||
    (product === "invitation" && (c.audio || c.photoSlots.some((s) => s !== 0)))
  )
    throw new Error("Limite de mídia do produto excedido.");
  if (publishing) {
    if (c.title.length < 2 || c.message.length < 2)
      throw new Error("Preencha o título e a mensagem.");
    if (!c.consent)
      throw new Error("Confirme a autorização de uso do conteúdo.");
    if (product === "invitation") {
      const time = Date.parse(c.eventAt);
      if (!Number.isFinite(time) || time <= now || time > now + 730 * 86400000)
        throw new Error("Escolha uma data futura, em até 2 anos.");
      if (!c.venue || !c.address || !/^55\d{10,11}$/.test(c.rsvpPhone))
        throw new Error("Preencha local, endereço e WhatsApp com DDD.");
    }
  }
  return c;
}

export function isAllowedMedia(bytes: Uint8Array, mime: string) {
  const hex = (...n: number[]) => n.every((v, i) => bytes[i] === v);
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...Array.from(bytes.slice(start, end)));
  if (mime === "image/jpeg") return hex(255, 216, 255);
  if (mime === "image/png") return hex(137, 80, 78, 71, 13, 10, 26, 10);
  if (mime === "image/webp")
    return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (mime === "audio/mpeg")
    return (
      ascii(0, 3) === "ID3" || (bytes[0] === 255 && (bytes[1] & 224) === 224)
    );
  if (mime === "audio/mp4") return ascii(4, 8) === "ftyp";
  if (mime === "audio/ogg") return ascii(0, 4) === "OggS";
  if (mime === "audio/wav")
    return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WAVE";
  return false;
}
