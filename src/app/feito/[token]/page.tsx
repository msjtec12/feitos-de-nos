import { notFound } from "next/navigation";
import { PartnerShell } from "@/components/partners/PartnerShell";
import { Experience } from "@/components/partners/Experience";
import { Delivery } from "@/components/partners/Delivery";
import { contentSchema } from "@/lib/partners/model";
import { partnerDb, mediaUrls } from "@/lib/partners/server";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Uma história feita de nós",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Page({ params }: { params: { token: string } }) {
  if (!/^[a-f0-9-]{36}$/.test(params.token)) notFound();
  const db = partnerDb();
  const { data: o, error } = await db
    .from("partner_orders")
    .select("*")
    .eq("public_token", params.token)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  if (!o) notFound();
  const [{ data: p }, urls] = await Promise.all([
    db
      .from("partner_profiles")
      .select("store_name")
      .eq("id", o.partner_id)
      .single(),
    mediaUrls(o),
  ]);
  const content = contentSchema.parse(o.content),
    storeName = p?.store_name || "Feito de Nós";
  return (
    <PartnerShell>
      <Experience
        content={content}
        product={o.product}
        urls={urls}
        storeName={storeName}
      />
      <details className="mt-6">
        <summary className="partner-link text-center cursor-pointer text-sm">
          Compartilhar ou imprimir o QR
        </summary>
        <Delivery
          token={o.public_token}
          title={content.title}
          expiresAt={o.expires_at}
          storeName={storeName}
        />
      </details>
      <p className="partner-small text-center mt-6">
        Disponível até {new Date(o.expires_at).toLocaleDateString("pt-BR")}.
      </p>
    </PartnerShell>
  );
}
