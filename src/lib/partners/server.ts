import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  contentSchema,
  mediaName,
  PartnerOrder,
  PartnerProfile,
  validateContent,
} from "./model";

export class PartnerError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function partnerDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new PartnerError(
      "Serviço temporariamente indisponível. Tente novamente mais tarde.",
      503,
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function verifiedUser() {
  const {
    data: { user },
    error,
  } = await createSupabaseServerClient().auth.getUser();
  if (error || !user)
    throw new PartnerError("Entre na sua conta para continuar.", 401);
  return user;
}
export async function owner() {
  const user = await verifiedUser();
  const { data, error } = await partnerDb()
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .eq("active", true)
    .eq("role", "owner")
    .maybeSingle();
  if (error || !data)
    throw new PartnerError(
      "Apenas o proprietário pode administrar parceiros.",
      403,
    );
  return user;
}
export async function partner() {
  const user = await verifiedUser();
  const { data, error } = await partnerDb()
    .from("partner_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new PartnerError("Complete o cadastro da loja.", 404);
  return data as PartnerProfile;
}
export function editToken(o: Pick<PartnerOrder, "id" | "edit_version">) {
  const key =
    process.env.PARTNER_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new PartnerError("Serviço indisponível.", 503);
  const signature = createHmac("sha256", key)
    .update(`partner-edit:v1:${o.id}:${o.edit_version}`)
    .digest("hex");
  return `${o.id}.${signature}`;
}
export async function editableOrder(token: string) {
  if (!/^[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(token))
    throw new PartnerError("Link de preenchimento inválido.", 404);
  const { data, error } = await partnerDb()
    .from("partner_orders")
    .select("*")
    .eq("id", token.split(".")[0])
    .maybeSingle();
  if (error || !data)
    throw new PartnerError("Link de preenchimento inválido.", 404);
  const expected = editToken(data);
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(token)))
    throw new PartnerError(
      "Este link foi substituído. Solicite um novo link à loja.",
      404,
    );
  if (
    data.status === "cancelled" ||
    (data.expires_at && Date.parse(data.expires_at) <= Date.now())
  )
    throw new PartnerError("Este pedido está encerrado.", 410);
  const { data: store } = await partnerDb()
    .from("partner_profiles")
    .select("store_name,status")
    .eq("id", data.partner_id)
    .single();
  if (store?.status !== "active")
    throw new PartnerError(
      "A loja está indisponível. Entre em contato com ela.",
      403,
    );
  return { order: data as PartnerOrder, storeName: store.store_name as string };
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const expected = new URL(req.url).origin;
  // Browsers always send Origin for POST. Reject cross-site and missing origins.
  if (!origin || origin !== expected)
    throw new PartnerError("Origem da solicitação não autorizada.", 403);
}
export async function body(req: Request) {
  if (Number(req.headers.get("content-length") || 0) > 25000)
    throw new PartnerError("Conteúdo muito grande.", 413);
  const raw = await req.text();
  if (raw.length > 25000) throw new PartnerError("Conteúdo muito grande.", 413);
  try {
    return JSON.parse(raw);
  } catch {
    throw new PartnerError("Dados inválidos.");
  }
}
const messages: Record<string, string> = {
  LINK_REVOKED: "O link foi substituído pela loja. Solicite o novo link.",
  INSUFFICIENT_BALANCE: "Saldo insuficiente. Solicite uma recarga.",
  PARTNER_INACTIVE: "A loja precisa estar ativa.",
  REVISION_CONFLICT:
    "O pedido foi alterado em outra janela. Recarregue antes de continuar.",
  ORDER_CLOSED: "Pedido encerrado.",
  ALREADY_PUBLISHED: "Um pedido publicado não pode ser cancelado.",
  REFERENCE_CONFLICT: "Esta referência de pagamento já foi usada.",
  ORDER_CONFLICT: "Este pedido já existe com outros dados.",
  INVALID_EVENT_DATE: "Confira a data do evento.",
  INCOMPLETE_CONTENT: "Complete o conteúdo antes de publicar.",
  NOT_FOUND: "Pedido não encontrado.",
};
export function fail(error: unknown) {
  if (error instanceof PartnerError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  const code =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message)
      : "";
  if (code in messages)
    return NextResponse.json({ error: messages[code] }, { status: 409 });
  if (typeof error === "object" && error !== null && "issues" in error)
    return NextResponse.json(
      { error: "Confira os campos preenchidos." },
      { status: 400 },
    );
  console.error("Partner request failed", {
    code:
      typeof error === "object" && error !== null && "code" in error
        ? error.code
        : "unknown",
  });
  return NextResponse.json(
    { error: "Não foi possível concluir. Tente novamente." },
    { status: 500 },
  );
}
export function checkedContent(
  input: unknown,
  order: PartnerOrder,
  publish = false,
) {
  try {
    const c = validateContent(
      input,
      order.product,
      publish || order.status === "published",
      order.status === "published" && order.published_at
        ? Date.parse(order.published_at) - 1000
        : Date.now(),
    );
    if (
      order.status === "published" &&
      order.product === "invitation" &&
      c.eventAt !== order.content.eventAt
    )
      throw new Error("A data não pode mudar após a publicação.");
    return c;
  } catch (e) {
    throw new PartnerError(
      e instanceof Error ? e.message : "Conteúdo inválido.",
    );
  }
}
export async function mediaUrls(order: PartnerOrder) {
  const content = contentSchema.parse(order.content);
  const slots = [
    ...content.photoSlots.map(String),
    ...(content.audio ? ["audio"] : []),
  ];
  const pairs = await Promise.all(
    slots.map(async (slot) => {
      const { data } = await partnerDb()
        .storage.from("partner-media")
        .createSignedUrl(`${order.id}/${mediaName(slot,content)}`, 900);
      return [slot, data?.signedUrl || ""] as const;
    }),
  );
  return Object.fromEntries(pairs);
}

export async function removeOrderMedia(orderId:string, slots:string[]) {
  const safeSlots=slots.filter(slot=>/^(?:[0-4]|audio)$/.test(slot));
  if(!safeSlots.length)return;
  const paths=safeSlots.flatMap(slot=>[`${orderId}/${slot}-0`,`${orderId}/${slot}-1`]);
  const {error}=await partnerDb().storage.from('partner-media').remove(paths);
  // The financial/content mutation has already committed. Never report it as failed
  // because an independent storage cleanup failed; keep it available for maintenance.
  if(error)console.error('Partner media cleanup failed',{orderId,code:error.name});
}
export function customerView(
  o: PartnerOrder,
  storeName: string,
  urls: Record<string, string>,
) {
  return {
    product: o.product,
    content: contentSchema.parse(o.content),
    revision: o.revision,
    status: o.status,
    publicToken: o.status === "published" ? o.public_token : null,
    expiresAt: o.expires_at,
    storeName,
    urls,
  };
}
