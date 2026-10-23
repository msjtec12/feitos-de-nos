"use client";
import { useEffect, useState } from "react";
import {
  PartnerOrder,
  PartnerProfile,
  WalletEntry,
  money,
  statusLabel,
  PRODUCTS,
} from "@/lib/partners/model";
import { api, errorText } from "./client";
import "./partners.css";
type Data = {
  profiles: PartnerProfile[];
  orders: PartnerOrder[];
  entries: (WalletEntry & { partner_id: string })[];
};
export function PartnerAdmin() {
  const [data, setData] = useState<Data | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState("");
  async function refresh() {
    setData(await api<Data>("/api/partners/admin"));
  }
  useEffect(() => {
    void refresh().catch((e) => setError(errorText(e)));
  }, []);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  const stores = new Map(data?.profiles.map((p) => [p.id, p.store_name]));
  return (
    <div className="partner-app p-4 md:p-8">
      <p className="partner-kicker">Operação do piloto</p>
      <h1 className="partner-title">Lojas parceiras</h1>
      <p className="partner-subtitle">
        Aprove cadastros, confirme recargas recebidas e acompanhe os pedidos.
        Apenas o proprietário pode operar esta área.
      </p>
      {error ? (
        <p className="partner-notice error my-5" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="partner-notice my-5" role="status">
          {notice}
        </p>
      ) : null}
      {!data && !error ? (
        <p className="mt-6" role="status">
          Carregando parceiros…
        </p>
      ) : null}
      {data ? (
        <>
          <section className="partner-card mt-8 partner-table-wrap">
            <h2 className="mb-5">Cadastros · últimos 200</h2>
            {data.profiles.length ? (
              <table className="partner-table">
                <thead>
                  <tr>
                    <th>Loja</th>
                    <th>Status</th>
                    <th>Saldo / reservado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.profiles.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.store_name}</strong>
                        <p className="partner-small">{p.phone}</p>
                        <p className="partner-small">{p.slug}</p>
                      </td>
                      <td>
                        <span className={`partner-badge ${p.status}`}>
                          {statusLabel[p.status]}
                        </span>
                      </td>
                      <td>
                        {money(p.balance_cents)}
                        <p className="partner-small">
                          {money(p.reserved_cents)} reservado
                        </p>
                      </td>
                      <td>
                        <div className="partner-actions">
                          <button
                            className="partner-btn secondary"
                            disabled={busy}
                            onClick={() =>
                              void run(async () => {
                                const status =
                                  p.status === "active"
                                    ? "suspended"
                                    : "active";
                                if (
                                  !confirm(
                                    `${status === "active" ? "Ativar" : "Suspender"} a loja ${p.store_name}?`,
                                  )
                                )
                                  return;
                                await api("/api/partners/admin", {
                                  action: "status",
                                  partner_id: p.id,
                                  status,
                                });
                                setNotice("Situação da loja atualizada.");
                              })
                            }
                          >
                            {p.status === "active"
                              ? "Suspender"
                              : "Aprovar / ativar"}
                          </button>
                          {p.status === "active" ? (
                            <button
                              className="partner-link text-xs"
                              onClick={() => setSelected(p.id)}
                            >
                              Adicionar crédito
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="partner-small">
                Nenhuma loja cadastrada. O cadastro público está em /parceiros.
              </p>
            )}
          </section>
          <form
            className="partner-card partner-fields mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget,
                f = new FormData(form);
              void run(async () => {
                const amount = Math.round(
                  Number(String(f.get("amount")).replace(",", ".")) * 100,
                );
                await api("/api/partners/admin", {
                  action: "credit",
                  partner_id: selected,
                  amount,
                  reference: String(f.get("reference")).trim(),
                  confirmed: f.get("confirmed") === "on",
                });
                form.reset();
                setNotice(
                  `Recarga de ${money(amount)} confirmada. Uma referência repetida não gera crédito duplicado.`,
                );
              });
            }}
          >
            <h2>Confirmar recarga recebida</h2>
            <p className="partner-small">
              Confira o recebimento no banco antes de creditar. Use o
              identificador único da transação bancária. Este formulário não
              processa o pagamento.
            </p>
            <div className="partner-grid">
              <label className="partner-field">
                Loja
                <select
                  required
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">Selecione uma loja ativa</option>
                  {data.profiles
                    .filter((p) => p.status === "active")
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.store_name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="partner-field">
                Valor recebido em reais
                <input
                  name="amount"
                  type="number"
                  required
                  min="1"
                  max="1000"
                  step="0.01"
                  placeholder="100,00"
                />
              </label>
            </div>
            <label className="partner-field">
              Referência única do pagamento
              <input
                name="reference"
                required
                minLength={6}
                maxLength={120}
                placeholder="Identificador da transação no banco"
                autoComplete="off"
              />
            </label>
            <label className="flex gap-3 text-sm">
              <input name="confirmed" type="checkbox" required />
              Conferi o pagamento recebido e os dados da loja.
            </label>
            <button className="partner-btn justify-self-start" disabled={busy}>
              {busy ? "Aguarde…" : "Confirmar crédito no saldo"}
            </button>
          </form>
          <section className="partner-card mt-8 partner-table-wrap">
            <h2 className="mb-5">Últimas 100 recargas</h2>
            {data.entries.length ? (
              <table className="partner-table">
                <thead>
                  <tr>
                    <th>Loja</th>
                    <th>Valor</th>
                    <th>Referência</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.entries.map((e) => (
                    <tr key={e.id}>
                      <td>{stores.get(e.partner_id) || e.partner_id}</td>
                      <td>{money(e.amount_cents)}</td>
                      <td className="break-all">{e.reference}</td>
                      <td>{new Date(e.created_at).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="partner-small">Nenhuma recarga confirmada.</p>
            )}
          </section>
          <section className="partner-card mt-8 partner-table-wrap">
            <h2 className="mb-5">Últimos 100 pedidos de parceiros</h2>
            {data.orders.length ? (
              <table className="partner-table">
                <thead>
                  <tr>
                    <th>Loja / cliente</th>
                    <th>Produto</th>
                    <th>Situação</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        {stores.get(o.partner_id) || o.partner_id}
                        <p className="partner-small">{o.customer_label}</p>
                      </td>
                      <td>{PRODUCTS[o.product].name}</td>
                      <td>{statusLabel[o.status]}</td>
                      <td>{money(o.price_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="partner-small">Nenhum pedido criado.</p>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
