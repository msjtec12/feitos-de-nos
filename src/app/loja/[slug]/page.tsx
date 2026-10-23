import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerShell } from "@/components/partners/PartnerShell";
import { PRODUCTS } from "@/lib/partners/model";
import { partnerDb } from "@/lib/partners/server";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: { slug: string } }) {
  if (!/^[a-z0-9-]{3,80}$/.test(params.slug)) notFound();
  const { data: p, error } = await partnerDb()
    .from("partner_profiles")
    .select("store_name,phone")
    .eq("slug", params.slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  if (!p) notFound();
  return (
    <PartnerShell>
      <p className="partner-kicker">Presentes que contam histórias</p>
      <h1 className="partner-title">{p.store_name}</h1>
      <p className="partner-subtitle">
        Um presente pode carregar muito mais. Descubra nossas homenagens e
        convites digitais, feitos com suas palavras e suas memórias.
      </p>
      <div className="partner-grid mt-10">
        {Object.entries(PRODUCTS).map(([key, item]) => (
          <article className="partner-card" key={key}>
            <h2>{item.name}</h2>
            <p className="partner-small mt-4">{item.description}</p>
            <p className="partner-small mt-3">
              Link para compartilhar e cartão com QR para imprimir. Acesso:{" "}
              {item.retention.toLowerCase()}.
            </p>
            <div className="partner-actions mt-6">
              <a
                className="partner-btn"
                href={`https://wa.me/${p.phone}?text=${encodeURIComponent(`Olá! Gostaria de pedir ${item.name}. Como funciona e qual o valor?`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Consultar e pedir
              </a>
              <Link
                className="partner-link text-sm"
                href={`/parceiros/demo/${key}`}
              >
                Ver exemplo
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="partner-small mt-6">
        Valores e pagamento são combinados diretamente com {p.store_name}. Após
        a compra, você recebe seu link privado para personalizar.
      </p>
    </PartnerShell>
  );
}
