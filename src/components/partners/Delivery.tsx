"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Copy, Download, Printer } from "lucide-react";
import { copy, errorText } from "./client";
export function Delivery({
  token,
  title,
  expiresAt,
  storeName,
}: {
  token: string;
  title: string;
  expiresAt: string | null;
  storeName: string;
}) {
  const [url, setUrl] = useState(""),
    [qr, setQr] = useState(""),
    [message, setMessage] = useState("");
  useEffect(() => {
    let cancelled = false;
    const link = `${location.origin}/feito/${token}`;
    setUrl(link);
    import("qrcode")
      .then((q) =>
        q.toDataURL(link, {
          width: 600,
          margin: 2,
          errorCorrectionLevel: "M",
          color: { dark: "#713c48", light: "#ffffff" },
        }),
      )
      .then((image) => {
        if (!cancelled) setQr(image);
      })
      .catch(() => {
        if (!cancelled)
          setMessage(
            "Não foi possível gerar o QR. Recarregue para tentar novamente.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [token]);
  return (
    <section className="partner-card mt-6">
      <h2 className="partner-heading">Pronto para entregar</h2>
      <p className="partner-small mt-3">
        Compartilhe este link público. O QR leva à mesma página e não permite
        editar o conteúdo.
      </p>
      <label className="partner-field mt-5">
        Link para compartilhar
        <input readOnly value={url} onFocus={(e) => e.target.select()} />
      </label>
      <div className="partner-actions mt-4">
        <button
          className="partner-btn secondary"
          onClick={() =>
            void copy(url)
              .then(() => setMessage("Link público copiado."))
              .catch((e) => setMessage(errorText(e)))
          }
        >
          <Copy size={15} /> Copiar link
        </button>
        {qr ? (
          <a
            download="feito-de-nos-qr.png"
            href={qr}
            className="partner-btn secondary"
          >
            <Download size={15} /> Baixar QR
          </a>
        ) : null}
        <button
          className="partner-btn secondary"
          disabled={!qr}
          onClick={() => window.print()}
        >
          <Printer size={15} /> Imprimir cartão
        </button>
      </div>
      <div className="partner-print-card">
        <p className="text-xs uppercase tracking-widest">
          Um carinho para guardar
        </p>
        <p className="font-serif text-3xl text-[#713c48] mt-4">{title}</p>
        {qr ? (
          <Image unoptimized width={600} height={600} src={qr} alt="QR code para abrir a página pública" />
        ) : (
          <p className="my-8" role="status">
            Gerando QR…
          </p>
        )}
        <p className="text-xs">Aponte a câmera e descubra.</p>
        <p className="partner-small mt-3">{storeName} · Feito de Nós</p>
        {expiresAt ? (
          <p className="text-[10px] mt-3">
            Disponível até {new Date(expiresAt).toLocaleDateString("pt-BR")}
          </p>
        ) : null}
      </div>
      {message ? (
        <p className="partner-small" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
