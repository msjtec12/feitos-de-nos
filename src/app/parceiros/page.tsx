import Link from "next/link";
import { Heart, QrCode, Store, ArrowRight, Check } from "lucide-react";
import { PartnerShell } from "@/components/partners/PartnerShell";
import { PRODUCTS, money } from "@/lib/partners/model";
export const metadata = {
  title: "Parceiros | Feito de Nós",
  description:
    "Venda homenagens e convites digitais na sua loja, com preenchimento pelo cliente e entrega por QR code.",
  robots: { index: true, follow: true },
};
export default function Page() {
  return (
    <PartnerShell wide>
      <section className="partner-hero">
        <div>
          <p className="partner-kicker">Feito de Nós · Programa de parceiros</p>
          <h1 className="partner-title">
            Seu presente.
            <br />
            Uma história a mais.
          </h1>
          <p className="partner-subtitle">
            Transforme fotos, mensagens e convites em um novo serviço da sua
            loja. Você vende, o cliente personaliza e o carinho chega por um
            link ou QR code.
          </p>
          <div className="partner-actions mt-8">
            <Link className="partner-btn" href="/parceiros/acesso?cadastro=1">
              Cadastrar minha loja <ArrowRight size={16} />
            </Link>
            <Link className="partner-link" href="/parceiros/demo/gift">
              Ver experiência
            </Link>
          </div>
          <p className="partner-small mt-5">
            Piloto sem mensalidade · Saldo pré-pago · Cadastro sujeito à
            aprovação
          </p>
        </div>
        <div className="partner-hero-art">
          <div>
            <Heart size={32} className="mx-auto mb-6 text-[#975242]" />
            <p className="partner-kicker">Um detalhe que fica</p>
            <p className="font-serif text-4xl text-[#713C48]">
              Para guardar
              <br />
              pertinho do coração.
            </p>
            <p className="partner-small my-6">
              Uma história digital acompanhando
              <br />
              um presente escolhido com carinho.
            </p>
            <QrCode className="mx-auto text-[#713C48]" size={64} />
            <p className="partner-small mt-4">Mensagem · Fotos · Voz</p>
          </div>
        </div>
      </section>
      <section id="produtos">
        <div className="flex justify-between items-end gap-4 mb-6">
          <h2 className="partner-heading">Duas formas de surpreender</h2>
          <span className="partner-small">Condições do piloto</span>
        </div>
        <div className="partner-grid">
          {Object.entries(PRODUCTS).map(([key, p]) => (
            <article className="partner-card" key={key}>
              <span className="partner-badge">
                {key === "gift"
                  ? "Para acompanhar o presente"
                  : "Para reunir quem importa"}
              </span>
              <h2 className="mt-5">{p.name}</h2>
              <p className="partner-small mt-3">{p.description}</p>
              <p className="mt-6">
                <strong className="partner-metric">{money(p.price)}</strong>{" "}
                <span className="partner-small">
                  por publicação para a loja
                </span>
              </p>
              <p className="partner-small mt-2">
                Venda sugerida: {money(p.retail)}. Você define seu preço.
              </p>
              <ul className="space-y-3 my-6 text-sm">
                {[
                  "Modelos prontos e personalização pelo cliente",
                  "Link público e cartão com QR para imprimir",
                  p.retention,
                ].map((t) => (
                  <li className="flex gap-2 items-center" key={t}>
                    <Check size={16} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                className="partner-btn secondary"
                href={`/parceiros/demo/${key}`}
              >
                Experimentar exemplo
              </Link>
            </article>
          ))}
        </div>
        <p className="partner-small mt-4">
          Diferença entre preço sugerido e custo não é lucro líquido: considere
          seus impostos, atendimento e demais despesas.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="partner-heading mb-6">
          Da venda à entrega, em quatro passos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            [
              "01",
              "Ative a loja",
              "Cadastre sua loja e aguarde nossa aprovação.",
            ],
            [
              "02",
              "Carregue seu saldo",
              "Combine a recarga pelo atendimento. O crédito entra após a confirmação do pagamento.",
            ],
            [
              "03",
              "Crie o pedido",
              "Escolha o produto e envie o link privado de preenchimento ao cliente.",
            ],
            [
              "04",
              "Entregue a emoção",
              "O cliente revisa e publica. O link público e o QR ficam prontos para compartilhar.",
            ],
          ].map(([n, t, d]) => (
            <div className="partner-card" key={n}>
              <p className="partner-kicker">{n}</p>
              <h3 className="font-semibold mb-3">{t}</h3>
              <p className="partner-small">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="partner-notice mt-10">
        <Store className="inline mr-2" size={18} />O valor fica reservado
        enquanto o pedido é preenchido. A cobrança acontece uma única vez na
        publicação. Cancelar um rascunho libera a reserva; corrigir um pedido
        publicado não gera nova cobrança.
      </section>
      <section className="text-center mt-16">
        <h2 className="partner-heading">Um novo serviço no seu balcão.</h2>
        <p className="partner-subtitle mx-auto">
          Comece com os modelos do piloto e acompanhe pedidos e saldo em um só
          lugar.
        </p>
        <Link className="partner-btn mt-6" href="/parceiros/acesso?cadastro=1">
          Quero ser parceiro
        </Link>
      </section>
    </PartnerShell>
  );
}
