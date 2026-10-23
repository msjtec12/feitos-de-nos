"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  PartnerContent,
  Product,
  PRODUCTS,
  THEMES,
} from "@/lib/partners/model";
import { api, brPhone, errorText } from "./client";
import { Experience } from "./Experience";
import { Delivery } from "./Delivery";
type View = {
  product: Product;
  content: PartnerContent;
  revision: number;
  status: string;
  publicToken: string | null;
  expiresAt: string | null;
  storeName: string;
  urls: Record<string, string>;
};
export function CustomerEditor({ token }: { token: string }) {
  const [view, setView] = useState<View | null>(null),
    [content, setContent] = useState<PartnerContent | null>(null),
    [step, setStep] = useState(1),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [dirty, setDirty] = useState(false),
    [eventLocal, setEventLocal] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const base = `/api/personalizar/${token}`;
  useEffect(() => {
    let ignore = false;
    api<View>(base)
      .then((v) => {
        if (ignore) return;
        setView(v);
        setContent(v.content);
        if (v.content.eventAt)
          setEventLocal(
            new Date(Date.parse(v.content.eventAt) - 3 * 3600000)
              .toISOString()
              .slice(0, 16),
          );
      })
      .catch((e) => {
        if (!ignore) setError(errorText(e));
      });
    return () => {
      ignore = true;
    };
  }, [base]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function field<K extends keyof PartnerContent>(
    key: K,
    value: PartnerContent[K],
  ) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
    setDirty(true);
    setNotice("");
  }
  async function run(fn: () => Promise<void>) {
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
  async function save() {
    if (!view || !content) return;
    const v = await api<View>(base, {
      action: "save",
      content,
      revision: view.revision,
    });
    setView(v);
    setContent(v.content);
    setDirty(false);
    setNotice("Alterações salvas.");
    return v;
  }
  async function upload(slot: string, file?: File) {
    if (!file || !view) return;
    await run(async () => {
      if (file.size > 3145728)
        throw new Error("Cada arquivo deve ter até 3 MB.");
      const f = new FormData();
      f.set("file", file);
      f.set("slot", slot);
      const response = await fetch(`${base}/media`, {
        method: "POST",
        body: f,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setView((v) =>
        v ? { ...v, urls: { ...v.urls, [slot]: result.url } } : v,
      );
      setContent((c) =>
        c
          ? slot === "audio"
            ? { ...c, audio: true, mediaVersions:{...c.mediaVersions,[slot]:result.version} }
            : {
                ...c,
              mediaVersions:{...c.mediaVersions,[slot]:result.version},
                photoSlots: Array.from(
                  new Set([...c.photoSlots, Number(slot)]),
                ).sort(),
              }
          : c,
      );
      setDirty(true);
      setNotice("Arquivo enviado. Salve para incluir no pedido.");
    });
  }
  if (!view || !content)
    return (
      <div
        className={error ? "partner-notice error" : "partner-notice"}
        role={error ? "alert" : "status"}
      >
        {error || "Abrindo seu pedido…"}
      </div>
    );
  const published = view.status === "published";
  return (
    <>
      <p className="partner-kicker">
        {view.storeName} · {PRODUCTS[view.product].name}
      </p>
      <h1 className="partner-title">Sua história, do seu jeito.</h1>
      <p className="partner-subtitle">
        Escolha o estilo, acrescente suas memórias e confira tudo antes de
        publicar. Este link é privado: guarde-o apenas com quem pode editar o
        pedido.
      </p>
      {published ? (
        <div className="partner-notice mt-5">
          Seu pedido já está publicado. Correções salvas atualizam a página
          pública sem nova cobrança.{" "}
          {view.expiresAt
            ? `Disponível até ${new Date(view.expiresAt).toLocaleDateString("pt-BR")}.`
            : ""}
        </div>
      ) : null}
      <div className="partner-steps" aria-label="Etapas de preenchimento">
        {[
          "1. Mensagem e estilo",
          "2. Fotos e detalhes",
          "3. Revisão e entrega",
        ].map((s, i) => (
          <span
            key={s}
            className={step === i + 1 ? "current" : ""}
            aria-current={step === i + 1 ? "step" : undefined}
          >
            {s}
          </span>
        ))}
      </div>
      {error ? (
        <p className="partner-notice error mb-5" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="partner-notice mb-5" role="status">
          {notice}
        </p>
      ) : null}
      <fieldset disabled={busy}>
        {step === 1 ? (
          <div className="partner-card partner-fields">
            <label className="partner-field">
              Título
              <input
                value={content.title}
                onChange={(e) => field("title", e.target.value)}
                maxLength={100}
                placeholder={
                  view.product === "gift"
                    ? "Para a melhor mãe do mundo"
                    : "O aniversário da Sofia"
                }
              />
            </label>
            <label className="partner-field">
              Subtítulo (opcional)
              <input
                value={content.subtitle}
                onChange={(e) => field("subtitle", e.target.value)}
                maxLength={140}
                placeholder="Uma frase que torna esse momento especial"
              />
            </label>
            <label className="partner-field">
              Mensagem
              <textarea
                value={content.message}
                onChange={(e) => field("message", e.target.value)}
                maxLength={3000}
                rows={6}
                placeholder="Escreva com suas palavras…"
              />
            </label>
            <label className="partner-field">
              Assinatura (opcional)
              <input
                value={content.signature}
                onChange={(e) => field("signature", e.target.value)}
                maxLength={100}
                placeholder="Com carinho, Ana"
              />
            </label>
            <fieldset>
              <legend className="text-sm font-semibold mb-3">
                Escolha o estilo
              </legend>
              <div className="partner-actions">
                {Object.entries(THEMES).map(([key, t]) => (
                  <label
                    key={key}
                    className="partner-btn secondary"
                    style={{
                      background: content.theme === key ? t.bg : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={key}
                      checked={content.theme === key}
                      onChange={() =>
                        field("theme", key as PartnerContent["theme"])
                      }
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="partner-card partner-fields">
            <div>
              <h2>
                {view.product === "gift"
                  ? "Memórias que merecem ficar"
                  : "A foto do convite"}
              </h2>
              <p className="partner-small mt-3">
                Até {PRODUCTS[view.product].photos} foto(s), JPG, PNG ou WebP.
                Cada arquivo: até 3 MB. Fotos e áudio são opcionais.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: PRODUCTS[view.product].photos }, (_, i) => (
                <div
                  key={i}
                  className="border border-[#713c4826] rounded-xl p-3"
                >
                  {content.photoSlots.includes(i) && view.urls[String(i)] ? (
                    <Image unoptimized width={1200} height={900}
                      className="h-32 w-full object-cover rounded-lg mb-3"
                      src={view.urls[String(i)]}
                      alt={`Foto ${i + 1}`}
                    />
                  ) : (
                    <div className="h-20 flex items-center justify-center text-xs text-[#665e62]">
                      Foto {i + 1}
                    </div>
                  )}
                  <label className="partner-field text-xs">
                    {content.photoSlots.includes(i)
                      ? "Substituir foto"
                      : "Enviar foto"}
                    <input
                      ref={(el) => {
                        fileRefs.current[String(i)] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={busy}
                      onChange={(e) =>
                        void upload(String(i), e.target.files?.[0])
                      }
                    />
                  </label>
                  {content.photoSlots.includes(i) ? (
                    <button
                      className="text-xs underline mt-2"
                      disabled={busy}
                      onClick={() =>
                        field(
                          "photoSlots",
                          content.photoSlots.filter((s) => s !== i),
                        )
                      }
                    >
                      Remover do conteúdo
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {view.product === "gift" ? (
              <div>
                <label className="partner-field">
                  Uma mensagem de voz (opcional)
                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp4,audio/ogg,audio/wav"
                    disabled={busy}
                    onChange={(e) => void upload("audio", e.target.files?.[0])}
                  />
                </label>
                <p className="partner-small mt-2">
                  MP3, M4A, OGG ou WAV de até 3 MB.
                </p>
                {content.audio && view.urls.audio ? (
                  <>
                    <audio
                      controls
                      src={view.urls.audio}
                      className="max-w-full mt-3"
                    />
                    <button
                      className="text-xs underline mt-3"
                      onClick={() => field("audio", false)}
                    >
                      Remover áudio do conteúdo
                    </button>
                  </>
                ) : null}
              </div>
            ) : (
              <>
                <label className="partner-field">
                  Data e hora do evento · horário de Brasília
                  <input
                    type="datetime-local"
                    value={eventLocal}
                    disabled={published}
                    onChange={(e) => {
                      setEventLocal(e.target.value);
                      field(
                        "eventAt",
                        e.target.value
                          ? new Date(`${e.target.value}:00-03:00`).toISOString()
                          : "",
                      );
                    }}
                  />
                </label>
                <label className="partner-field">
                  Nome do local
                  <input
                    value={content.venue}
                    maxLength={120}
                    onChange={(e) => field("venue", e.target.value)}
                    placeholder="Salão Jardim"
                  />
                </label>
                <label className="partner-field">
                  Endereço completo
                  <input
                    value={content.address}
                    maxLength={250}
                    onChange={(e) => field("address", e.target.value)}
                    placeholder="Rua, número, bairro, cidade e estado"
                  />
                </label>
                <label className="partner-field">
                  WhatsApp para receber confirmações
                  <input
                    type="tel"
                    value={content.rsvpPhone}
                    onChange={(e) =>
                      field("rsvpPhone", e.target.value.replace(/\D/g, ""))
                    }
                    onBlur={() =>
                      field(
                        "rsvpPhone",
                        content.rsvpPhone ? brPhone(content.rsvpPhone) : "",
                      )
                    }
                    placeholder="5511999999999"
                    maxLength={13}
                  />
                </label>
                <p className="partner-small">
                  O convidado envia a confirmação diretamente a esse número. Não
                  há lista de presenças neste plano. A data fica fixa depois de
                  publicar.
                </p>
              </>
            )}
          </div>
        ) : null}
        {step === 3 ? (
          <>
            <p className="partner-small mb-4">
              Prévia · confira nomes, mensagem e detalhes. Os botões externos
              ficam disponíveis na página publicada.
            </p>
            <Experience
              product={view.product}
              content={content}
              urls={view.urls}
              storeName={view.storeName}
              preview
            />
            <label className="flex items-start gap-3 text-sm leading-6 my-6">
              <input
                type="checkbox"
                checked={content.consent}
                onChange={(e) => field("consent", e.target.checked)}
                className="mt-1"
              />
              <span>
                Revisei o conteúdo e tenho autorização para usar as fotos, a voz
                e as informações. Entendo que qualquer pessoa com o link público
                poderá acessar a página.
              </span>
            </label>
            {!published ? (
              <div className="partner-notice mb-5">
                Ao publicar, o pedido da loja será concluído e o saldo reservado
                será consumido. Você não informa dados de pagamento aqui. Prazo
                de acesso: {PRODUCTS[view.product].retention.toLowerCase()}.
              </div>
            ) : null}
            {published && view.publicToken ? (
              <Delivery
                token={view.publicToken}
                title={content.title}
                storeName={view.storeName}
                expiresAt={view.expiresAt}
              />
            ) : null}
          </>
        ) : null}
        <div className="partner-actions justify-between mt-6">
          <button
            className="partner-btn secondary"
            disabled={busy || step === 1}
            onClick={() => setStep((s) => s - 1)}
          >
            Voltar
          </button>
          <div className="partner-actions">
            <button
              className="partner-btn secondary"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await save();
                })
              }
            >
              {busy ? "Aguarde…" : "Salvar alterações"}
            </button>
            {step < 3 ? (
              <button
                className="partner-btn"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await save();
                    setStep((s) => s + 1);
                  })
                }
              >
                Salvar e continuar
              </button>
            ) : !published ? (
              <button
                className="partner-btn"
                disabled={busy || !content.consent}
                onClick={() =>
                  void run(async () => {
                    const saved = await save();
                    if (!saved) return;
                    const v = await api<View>(base, {
                      action: "publish",
                      revision: saved.revision,
                    });
                    setView(v);
                    setContent(v.content);
                    setDirty(false);
                    setNotice(
                      "Publicado! Seu link e seu QR estão prontos abaixo.",
                    );
                  })
                }
              >
                Confirmar e publicar
              </button>
            ) : null}
          </div>
        </div>
      </fieldset>
      {dirty ? (
        <p className="partner-small text-right mt-3">
          Você tem alterações não salvas.
        </p>
      ) : null}
    </>
  );
}
