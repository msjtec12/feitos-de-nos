import { NextResponse } from "next/server";
import {
  editableOrder,
  fail,
  partnerDb,
  PartnerError,
  sameOrigin,
} from "@/lib/partners/server";
import { contentSchema, isAllowedMedia, PRODUCTS } from "@/lib/partners/model";
export const dynamic = "force-dynamic";
export async function POST(
  req: Request,
  { params }: { params: { token: string } },
) {
  try {
    sameOrigin(req);
    if (Number(req.headers.get("content-length") || 0) > 3300000)
      throw new PartnerError("Envie um arquivo de até 3 MB.", 413);
    const { order } = await editableOrder(params.token);
    const form = await req.formData(),
      file = form.get("file"),
      slot = String(form.get("slot"));
    const audio = slot === "audio";
    if (!(file instanceof File) || file.size === 0 || file.size > 3145728)
      throw new PartnerError("Envie um arquivo de até 3 MB.");
    if (
      audio
        ? order.product !== "gift"
        : !/^[0-4]$/.test(slot) ||
          Number(slot) >= PRODUCTS[order.product].photos
    )
      throw new PartnerError("Limite de mídia excedido.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (
      (audio
        ? !file.type.startsWith("audio/")
        : !file.type.startsWith("image/")) ||
      !isAllowedMedia(bytes, file.type)
    )
      throw new PartnerError(
        "Use JPG, PNG, WebP ou áudio MP3, M4A, OGG ou WAV.",
      );
    const version=1-(contentSchema.parse(order.content).mediaVersions[slot] || 0);
    const db = partnerDb(),
      path = `${order.id}/${slot}-${version}`;
    const { error } = await db.storage
      .from("partner-media")
      .upload(path, bytes, {
        upsert: true,
        contentType: file.type,
        cacheControl: "0",
      });
    if (error) throw error;
    const { data } = await db.storage
      .from("partner-media")
      .createSignedUrl(path, 900);
    return NextResponse.json({ slot, version, url: data?.signedUrl });
  } catch (e) {
    return fail(e);
  }
}
