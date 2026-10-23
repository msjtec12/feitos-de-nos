import { NextResponse } from "next/server";
import { mediaName, PartnerOrder } from '@/lib/partners/model';
import {
  body,
  checkedContent,
  customerView,
  editableOrder,
  fail,
  mediaUrls,
  removeOrderMedia,
  partnerDb,
  PartnerError,
  sameOrigin,
} from "@/lib/partners/server";
export const dynamic = "force-dynamic";
type Context = { params: { token: string } };
export async function GET(_req: Request, { params }: Context) {
  try {
    const { order, storeName } = await editableOrder(params.token);
    return NextResponse.json(
      customerView(order, storeName, await mediaUrls(order)),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request, { params }: Context) {
  try {
    sameOrigin(req);
    const { order, storeName } = await editableOrder(params.token),
      input = await body(req);
    if (
      !["save", "publish"].includes(input.action) ||
      !Number.isInteger(input.revision)
    )
      throw new PartnerError("Ação inválida.");
    const content = checkedContent(
      input.action === "publish" ? order.content : input.content,
      order,
      input.action === "publish" && order.status !== "published",
    );
    if (input.action === "publish" || order.status==='published') {
      const paths = [
        ...content.photoSlots.map(String),
        ...(content.audio ? ["audio"] : []),
      ].map(slot=>mediaName(slot,content));
      if (paths.length) {
        const { data, error } = await partnerDb()
          .storage.from("partner-media")
          .list(order.id, { limit: 20 });
        if (
          error ||
          paths.some((path) => !data?.some((item) => item.name === path))
        )
          throw new PartnerError(
            "Aguarde o envio de todas as mídias antes de publicar.",
          );
      }
    }
    const { data, error } = await partnerDb().rpc("partner_order_action", {
      p_partner_id: order.partner_id,
      p_id: order.id,
      p_action: input.action,
      p_content: content,
      p_revision: input.revision,
      p_edit_version: order.edit_version,
    }).single<PartnerOrder>();
    if (error) throw error;
    if(input.action==='save') {
      const previous=order.content;
      const removed=(previous.photoSlots||[]).filter(slot=>!content.photoSlots.includes(slot)).map(String);
      if(previous.audio&&!content.audio)removed.push('audio');
      await removeOrderMedia(order.id,removed);
    }
    return NextResponse.json(
      customerView(data, storeName, await mediaUrls(data)),
    );
  } catch (e) {
    return fail(e);
  }
}
