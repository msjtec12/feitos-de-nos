"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Wallet, Copy, ExternalLink, LogOut } from "lucide-react";
import {
  PartnerOrder,
  PartnerProfile,
  Product,
  PRODUCTS,
  statusLabel,
  WalletEntry,
  money,
} from "@/lib/partners/model";
import { api, brPhone, copy, errorText } from "./client";
import { supabase } from "@/lib/supabase/client";
type Data = {
  profile: PartnerProfile;
  orders: PartnerOrder[];
  entries: WalletEntry[];
};
const entryNames = {
  credit: "Recarga confirmada",
  reserve: "Reserva para pedido",
  capture: "Publicação cobrada",
  release: "Reserva liberada",
};
export function PartnerDashboard() {
  const [data, setData] = useState<Data | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [showNew, setShowNew] = useState(false),
    [product, setProduct] = useState<Product>("gift"),
    [label, setLabel] = useState(""),
    [requestId, setRequestId] = useState(""),
    [editLink, setEditLink] = useState(""),
    [needsProfile, setNeedsProfile] = useState(false);
  async function refresh() {
    try {
      const d = await api<Data>("/api/partners");
      setData(d);
      setError("");
    } catch (e) {
      if (errorText(e) === "Complete o cadastro da loja.")
        setNeedsProfile(true);
      else setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  async function action(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await action(async () => {
      const result = await api<{ editPath: string }>("/api/partners/orders", {
        id: requestId,
        product,
        customer_label: label,
      });
      setEditLink(location.origin + result.editPath);
      setShowNew(false);
      setNotice(
        "Pedido criado. Envie o link privado abaixo somente ao cliente responsável.",
      );
      await refresh();
    });
  }
  async function linkFor(o: PartnerOrder, rotate = false) {
    await action(async () => {
      if (
        rotate &&
        !confirm(
          "Substituir o link privado? O link anterior deixará de funcionar.",
        )
      )
        return;
      const result = await api<{ editPath: string }>(
        `/api/partners/orders/${o.id}`,
        rotate ? { action: "rotate" } : undefined,
      );
      setEditLink(location.origin + result.editPath);
      setNotice(
        rotate
          ? "Novo link criado. O link anterior foi revogado."
          : "Link privado de preenchimento. Envie apenas ao cliente responsável.",
      );
    });
  }
  if (loading) return <p role="status">Carregando sua loja…</p>;
  if (needsProfile)
    return (
      <section className="partner-card max-w-lg mx-auto">
        <h1 className="partner-heading">Complete o cadastro da loja</h1>
        <form
          className="partner-fields mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            void action(async () => {
              await api("/api/partners/register", {
                store_name: f.get("store_name"),
                phone: brPhone(String(f.get("phone"))),
              });
              setNeedsProfile(false);
              await refresh();
            });
          }}
        >
          <label className="partner-field">
            Nome da loja
            <input name="store_name" required minLength={2} maxLength={100} />
          </label>
          <label className="partner-field">
            WhatsApp com DDD
            <input name="phone" type="tel" required />
          </label>
          <label className="text-sm flex gap-2">
            <input type="checkbox" required />
            Li e aceito as{" "}
            <Link className="partner-link" href="/parceiros/condicoes">
              condições do piloto
            </Link>
            .
          </label>
          <button className="partner-btn" disabled={busy}>
            Solicitar aprovação
          </button>
          {error ? (
            <p role="alert" className="partner-notice error">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    );
  if (!data)
    return (
      <div className="partner-notice error" role="alert">
        {error}
        <button
          className="partner-btn secondary ml-3"
          onClick={() => void refresh()}
        >
          Tentar novamente
        </button>
      </div>
    );
  const p = data.profile,
    available = p.balance_cents - p.reserved_cents,
    active = p.status === "active";
  const support = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
    /\D/g,
    "",
  );
  return (
    <>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="partner-kicker">Painel da loja</p>
          <h1 className="partner-title">{p.store_name}</h1>
          <span className={`partner-badge ${p.status} mt-4`}>
            {statusLabel[p.status]}
          </span>
        </div>
        <button
          className="partner-btn secondary"
          onClick={() =>
            void action(async () => {
              await supabase.auth.signOut();
              location.assign("/parceiros/acesso");
            })
          }
        >
          <LogOut size={15} /> Sair
        </button>
      </div>
      {!active ? (
        <div className="partner-notice mt-6">
          {p.status === "pending"
            ? "Recebemos seu cadastro. A criação de pedidos será liberada após a aprovação da loja."
            : "A loja está suspensa. Entre em contato com o atendimento. Você ainda pode cancelar rascunhos para liberar reservas."}
        </div>
      ) : null}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <div className="partner-card">
          <p className="partner-small flex gap-2">
            <Wallet size={16} /> Disponível para novos pedidos
          </p>
          <p className="partner-metric mt-3">{money(available)}</p>
        </div>
        <div className="partner-card">
          <p className="partner-small">Reservado em rascunhos</p>
          <p className="partner-metric mt-3">{money(p.reserved_cents)}</p>
        </div>
        <div className="partner-card">
          <p className="partner-small">Adicionar saldo</p>
          {support ? (
            <a
              className="partner-link block mt-4 text-sm"
              href={`https://wa.me/${support}?text=${encodeURIComponent(`Olá! Quero recarregar o saldo da loja ${p.store_name} (${p.slug}).`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Solicitar recarga pelo WhatsApp ↗
            </a>
          ) : (
            <p className="partner-small mt-3">
              Solicite a recarga pelo mesmo contato que ativou sua parceria.
            </p>
          )}
          <p className="partner-small mt-2">
            O saldo entra após a confirmação do pagamento.
          </p>
        </div>
      </div>
      {error ? (
        <div className="partner-notice error mt-5" role="alert">
          {error}
        </div>
      ) : null}
      {notice ? (
        <p className="partner-notice mt-5" role="status">
          {notice}
        </p>
      ) : null}
      {editLink ? (
        <div className="partner-card mt-5">
          <label className="partner-field">
            Link privado de preenchimento
            <input
              value={editLink}
              readOnly
              onFocus={(e) => e.target.select()}
            />
          </label>
          <div className="partner-actions mt-3">
            <button
              className="partner-btn secondary"
              onClick={() =>
                void action(async () => {
                  await copy(editLink);
                  setNotice("Link privado copiado.");
                })
              }
            >
              <Copy size={15} />
              Copiar link
            </button>
            <a
              href={editLink}
              target="_blank"
              rel="noreferrer"
              className="partner-link text-sm"
            >
              Abrir preenchimento ↗
            </a>
            <button
              className="partner-small underline"
              onClick={() => setEditLink("")}
            >
              Ocultar
            </button>
          </div>
        </div>
      ) : null}
      <div className="partner-actions justify-between mt-10 mb-5">
        <h2 className="partner-heading">Seus pedidos</h2>
        <div className="partner-actions">
          {active ? (
            <Link
              className="partner-btn secondary"
              href={`/loja/${p.slug}`}
              target="_blank"
            >
              <ExternalLink size={15} /> Catálogo da loja
            </Link>
          ) : null}
          <button
            className="partner-btn"
            disabled={!active || busy}
            onClick={() => {
              setShowNew(!showNew);
              setRequestId(crypto.randomUUID());
              setLabel("");
            }}
          >
            <Plus size={16} /> Novo pedido
          </button>
        </div>
      </div>
      {showNew ? (
        <form onSubmit={create} className="partner-card partner-fields mb-6">
          <div className="partner-grid">
            <label className="partner-field">
              Produto
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value as Product)}
              >
                {Object.entries(PRODUCTS).map(([key, v]) => (
                  <option key={key} value={key}>
                    {v.name} · {money(v.price)}
                  </option>
                ))}
              </select>
            </label>
            <label className="partner-field">
              Nome ou identificação do cliente
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                minLength={2}
                maxLength={100}
                placeholder="Ex.: Ana · aniversário da mãe"
              />
            </label>
          </div>
          <p className="partner-small">
            Ao criar, {money(PRODUCTS[product].price)} ficam reservados. Seu
            cliente só publica depois de revisar e confirmar o conteúdo.
          </p>
          <div className="partner-actions">
            <button
              className="partner-btn"
              disabled={busy || available < PRODUCTS[product].price}
            >
              {busy ? "Criando…" : "Criar e reservar saldo"}
            </button>
            <button
              type="button"
              className="partner-btn secondary"
              onClick={() => setShowNew(false)}
            >
              Voltar
            </button>
            {available < PRODUCTS[product].price ? (
              <p className="text-sm text-rose-800">
                Saldo insuficiente. Solicite uma recarga.
              </p>
            ) : null}
          </div>
        </form>
      ) : null}
      {!data.orders.length ? (
        <div className="partner-card text-center py-12">
          <h3 className="partner-heading">A primeira história começa aqui.</h3>
          <p className="partner-small mt-3">
            Após ativar sua loja e carregar saldo, crie seu primeiro pedido.
          </p>
        </div>
      ) : (
        <div className="partner-card partner-table-wrap">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Cliente / produto</th>
                <th>Situação</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{o.customer_label}</strong>
                    <p className="partner-small">{PRODUCTS[o.product].name}</p>
                  </td>
                  <td>
                    <span className={`partner-badge ${o.status}`}>
                      {statusLabel[o.status]}
                    </span>
                    {o.expires_at ? (
                      <p className="partner-small mt-1">
                        Até {new Date(o.expires_at).toLocaleDateString("pt-BR")}
                      </p>
                    ) : null}
                  </td>
                  <td>{money(o.price_cents)}</td>
                  <td>
                    <div className="partner-actions">
                      {o.status !== "cancelled" ? (
                        <>
                          <button
                            disabled={busy || !active}
                            className="partner-link text-xs"
                            onClick={() => void linkFor(o)}
                          >
                            Preencher / enviar
                          </button>
                          <button
                            disabled={busy || !active}
                            className="partner-small underline"
                            onClick={() => void linkFor(o, true)}
                          >
                            Substituir link
                          </button>
                        </>
                      ) : null}
                      {o.status === "draft" ? (
                        <button
                          disabled={busy}
                          className="text-xs text-rose-800 underline"
                          onClick={() =>
                            void action(async () => {
                              if (
                                !confirm(
                                  `Cancelar o pedido de ${o.customer_label} e liberar ${money(o.price_cents)}?`,
                                )
                              )
                                return;
                              await api(`/api/partners/orders/${o.id}`, {
                                action: "cancel",
                              });
                              setEditLink("");
                              await refresh();
                              setNotice(
                                "Rascunho cancelado e reserva liberada.",
                              );
                            })
                          }
                        >
                          Cancelar
                        </button>
                      ) : o.status === "published" ? (
                        <Link
                          href={`/feito/${o.public_token}`}
                          target="_blank"
                          className="partner-link text-xs"
                        >
                          Ver publicação ↗
                        </Link>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="partner-small mt-3">Últimos 200 pedidos.</p>
        </div>
      )}
      <h2 className="partner-heading mt-10 mb-5">Movimentações do saldo</h2>
      <div className="partner-card partner-table-wrap">
        {!data.entries.length ? (
          <p className="partner-small">Nenhuma movimentação ainda.</p>
        ) : (
          <table className="partner-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Movimentação</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((e) => (
                <tr key={e.id}>
                  <td>{new Date(e.created_at).toLocaleString("pt-BR")}</td>
                  <td>{entryNames[e.kind]}</td>
                  <td>{money(e.amount_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="partner-small mt-3">
          Últimas 100 movimentações. Reservas não são uma segunda cobrança.
        </p>
      </div>
    </>
  );
}
