import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  body,
  editToken,
  fail,
  owner,
  partner,
  partnerDb,
  PartnerError,
  sameOrigin,
  verifiedUser,
} from "@/lib/partners/server";
import { PartnerOrder } from "@/lib/partners/model";

export const dynamic = "force-dynamic";
const profileSchema = z.object({
  store_name: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^55\d{10,11}$/),
});
const uuid = z.string().uuid();
type Context = { params: { path?: string[] } };
export async function GET(req: Request, { params }: Context) {
  try {
    const path = params.path || [];
    if (path[0] === "admin") {
      await owner();
      const db = partnerDb();
      const [profiles, orders, entries] = await Promise.all([
        db
          .from("partner_profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
        db
          .from("partner_orders")
          .select(
            "id,partner_id,product,customer_label,status,price_cents,created_at",
          )
          .order("created_at", { ascending: false })
          .limit(100),
        db
          .from("partner_wallet_entries")
          .select("*")
          .eq("kind", "credit")
          .order("created_at", { ascending: false })
          .limit(100),
      ]);
      if (profiles.error || orders.error || entries.error)
        throw profiles.error || orders.error || entries.error;
      return NextResponse.json(
        { profiles: profiles.data, orders: orders.data, entries: entries.data },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const p = await partner();
    if (path[0] === "orders" && path[1]) {
      const id = uuid.parse(path[1]);
      const { data, error } = await partnerDb()
        .from("partner_orders")
        .select("*")
        .eq("id", id)
        .eq("partner_id", p.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new PartnerError("Pedido não encontrado.", 404);
      if (data.status === "cancelled")
        throw new PartnerError("Pedido cancelado.", 410);
      return NextResponse.json(
        {
          editPath: `/personalizar/${editToken(data)}`,
          publicPath:
            data.status === "published" ? `/feito/${data.public_token}` : null,
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const db = partnerDb();
    const [orders, entries] = await Promise.all([
      db
        .from("partner_orders")
        .select(
          "id,product,customer_label,status,price_cents,public_token,created_at,expires_at",
        )
        .eq("partner_id", p.id)
        .order("created_at", { ascending: false })
        .limit(200),
      db
        .from("partner_wallet_entries")
        .select("id,kind,amount_cents,reference,created_at")
        .eq("partner_id", p.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    if (orders.error || entries.error) throw orders.error || entries.error;
    return NextResponse.json(
      { profile: p, orders: orders.data, entries: entries.data },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request, { params }: Context) {
  try {
    sameOrigin(req);
    const path = params.path || [],
      input = await body(req);
    if (path[0] === "register") {
      const user = await verifiedUser(),
        values = profileSchema.parse(input),
        db = partnerDb();
      const { data: existing, error: lookupError } = await db
        .from("partner_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) return NextResponse.json({ ok: true });
      const stem =
        values.store_name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 50) || "loja";
      const { error } = await db
        .from("partner_profiles")
        .insert({
          id: user.id,
          ...values,
          slug: `${stem}-${randomUUID().slice(0, 8)}`,
          status: "pending",
        });
      if (error) throw error;
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    if (path[0] === "admin") {
      const admin = await owner();
      const id = uuid.parse(input.partner_id),
        db = partnerDb();
      if (input.action === "credit") {
        const v = z
          .object({
            amount: z.number().int().min(100).max(100000),
            reference: z.string().trim().min(6).max(120),
            confirmed: z.literal(true),
          })
          .parse(input);
        const { error } = await db.rpc("partner_credit", {
          p_partner_id: id,
          p_amount: v.amount,
          p_reference: v.reference,
          p_admin_id: admin.id,
        });
        if (error) throw error;
      } else if (input.action === "status") {
        const status = z.enum(["active", "suspended"]).parse(input.status);
        const { data, error } = await db
          .from("partner_profiles")
          .update({ status, reviewed_by: admin.id })
          .eq("id", id)
          .select("id")
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new PartnerError("Loja não encontrada.", 404);
      } else throw new PartnerError("Ação inválida.");
      return NextResponse.json({ ok: true });
    }
    const p = await partner();
    if (path[0] === "orders" && !path[1]) {
      const v = z
        .object({
          id: uuid,
          product: z.enum(["gift", "invitation"]),
          customer_label: z.string().trim().min(2).max(100),
        })
        .parse(input);
      const { data, error } = await partnerDb().rpc("partner_create_order", {
        p_partner_id: p.id,
        p_id: v.id,
        p_product: v.product,
        p_customer: v.customer_label,
      }).single<PartnerOrder>();
      if (error) throw error;
      const o = data as PartnerOrder;
      return NextResponse.json(
        { id: o.id, editPath: `/personalizar/${editToken(o)}` },
        { status: 201 },
      );
    }
    if (path[0] === "orders" && path[1]) {
      const id = uuid.parse(path[1]),
        action = z.enum(["cancel", "rotate"]).parse(input.action);
      const { data, error } = await partnerDb().rpc("partner_order_action", {
        p_partner_id: p.id,
        p_id: id,
        p_action: action,
      }).single<PartnerOrder>();
      if (error) throw error;
      return NextResponse.json({
        ok: true,
        ...(action === "rotate"
          ? { editPath: `/personalizar/${editToken(data)}` }
          : {}),
      });
    }
    throw new PartnerError("Rota não encontrada.", 404);
  } catch (e) {
    return fail(e);
  }
}
