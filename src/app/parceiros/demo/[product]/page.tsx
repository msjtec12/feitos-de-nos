import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerShell } from "@/components/partners/PartnerShell";
import { Experience } from "@/components/partners/Experience";
import { emptyContent } from "@/lib/partners/model";
export default function Page({ params }: { params: { product: string } }) {
  if (params.product !== "gift" && params.product !== "invitation") notFound();
  const gift = params.product === "gift";
  const content = {
    ...emptyContent,
    title: gift ? "Mãe, meu lugar favorito." : "Vamos celebrar a Sofia!",
    subtitle: gift
      ? "Todo amor que cabe em uma história."
      : "Um novo ano, muitas histórias para contar.",
    message: gift
      ? "Tem carinho que mora nos detalhes. No café passado, no abraço demorado, nas palavras certas quando eu mais preciso.\n\nEste presente é só um jeito de dizer o que vale todos os dias: obrigada por ser meu lugar seguro. Te amo!"
      : "O melhor da festa é ter por perto quem faz parte da nossa história. Venha compartilhar uma tarde de abraços, bolo e boas lembranças.",
    signature: gift ? "Com amor, Ana" : "Esperamos você com carinho!",
    theme: gift ? ("rose" as const) : ("botanical" as const),
    eventAt: "2027-06-12T18:00:00.000Z",
    venue: "Jardim das Histórias",
    address: "Local ilustrativo · São Paulo, SP",
  };
  return (
    <PartnerShell>
      <div className="partner-notice mb-6">
        Exemplo demonstrativo com nomes e dados fictícios.{" "}
        <Link className="partner-link" href="/parceiros/acesso?cadastro=1">
          Quero oferecer na minha loja →
        </Link>
      </div>
      <Experience
        content={content}
        product={params.product}
        storeName="Sua loja"
        preview
      />
    </PartnerShell>
  );
}
