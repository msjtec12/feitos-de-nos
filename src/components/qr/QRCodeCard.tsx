"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, Copy, Check, ArrowLeft, Music2 } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "../brand/BrandLogo";
import { parseSpotifyUrl } from "@/lib/spotify";

interface QRCodeCardProps {
  slug: string;
  recipientName: string;
  tagline?: string;
  spotifyUrl?: string;
  soundtrackTitle?: string;
}

export function QRCodeCard({
  slug,
  recipientName,
  tagline = "Meu primeiro ano",
  spotifyUrl,
  soundtrackTitle = "Nossa música",
}: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [spotifyQrDataUrl, setSpotifyQrDataUrl] = useState<string>("");
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const spotify = parseSpotifyUrl(spotifyUrl);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://feitodenos.com.br";
    const fullUrl = `${origin}/presente/${slug}`;
    setTargetUrl(fullUrl);

    QRCode.toDataURL(fullUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#302B2D", light: "#FFFFFF" },
      errorCorrectionLevel: "H",
    })
      .then(setQrDataUrl)
      .catch((err) => console.error("Erro ao gerar QR Code:", err));
  }, [slug]);

  useEffect(() => {
    const parsed = parseSpotifyUrl(spotifyUrl);
    if (!parsed) {
      setSpotifyQrDataUrl("");
      return;
    }

    QRCode.toDataURL(parsed.canonicalUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#302B2D", light: "#FFFFFF" },
      errorCorrectionLevel: "H",
    })
      .then(setSpotifyQrDataUrl)
      .catch((err) => console.error("Erro ao gerar QR da música:", err));
  }, [spotifyUrl]);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="min-h-screen bg-brand-cream/80 py-8 px-4 sm:px-6 flex flex-col items-center justify-center print:bg-white print:p-0">
      <div className="max-w-md w-full mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/presente/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-wine hover:text-brand-wine-dark transition-colors px-3 py-1.5 rounded-full bg-white border border-brand-rose/30 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o presente</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-full bg-white border border-brand-rose/30 text-brand-wine hover:bg-brand-cream transition-colors shadow-xs"
            title="Copiar link"
            aria-label="Copiar link do presente"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-wine text-white text-xs font-semibold shadow-xs hover:bg-brand-wine-dark transition-all"
            aria-label="Imprimir Cartão Físico"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Cartão</span>
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[480px] bg-[#FFF8F0] border border-brand-rose/40 rounded-3xl p-8 sm:p-10 shadow-lg print:shadow-none print:border print:rounded-2xl print:max-w-[400px] overflow-hidden">
        <div className="absolute top-2 right-2 opacity-25 pointer-events-none" aria-hidden="true">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            <path
              d="M140 20C100 40 60 20 40 60C20 100 80 130 110 160"
              stroke="#C96E5A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="md" showSlogan={true} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4 bg-white/90 p-5 rounded-2xl border border-brand-rose/30 shadow-xs">
          <div className="text-left flex-1 min-w-0">
            <span className="text-[11px] uppercase tracking-widest text-brand-terracotta font-semibold block mb-1">
              Presente Especial
            </span>
            <h2 className="font-serif text-2xl text-brand-wine tracking-tight">{recipientName}</h2>
            <p className="font-serif italic text-sm text-brand-terracotta mt-0.5">{tagline}</p>
            <p className="text-xs text-brand-graphite/70 mt-3 leading-relaxed">
              Aponte a câmera do seu celular para o QR Code ao lado para ouvir vozes, ver momentos inesquecíveis e abrir toda a experiência.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="p-2.5 bg-white rounded-xl border-2 border-brand-rose/40 shadow-xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code para o presente de ${recipientName}`}
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <div className="w-32 h-32 bg-brand-cream animate-pulse flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-brand-rose" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-mono text-brand-graphite/50 mt-1 uppercase tracking-wider">
              Abrir presente
            </span>
          </div>
        </div>

        {spotify && spotifyQrDataUrl && (
          <div className="mt-4 bg-white/90 rounded-2xl border border-brand-rose/30 p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-brand-wine text-white flex items-center justify-center shrink-0">
              <Music2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-brand-terracotta font-semibold">
                Trilha sonora
              </span>
              <p className="font-serif text-sm font-bold text-brand-wine truncate">
                {soundtrackTitle || "Nossa música"}
              </p>
              <p className="text-[10px] text-brand-graphite/60 mt-0.5">
                Escaneie para ouvir diretamente no Spotify.
              </p>
            </div>
            <div className="p-1.5 bg-white rounded-lg border border-brand-rose/30 shrink-0">
              <img
                src={spotifyQrDataUrl}
                alt="QR Code para abrir a música no Spotify"
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>
        )}

        <div className="text-center mt-6 pt-4 border-t border-brand-rose/20">
          <p className="font-serif text-xs text-brand-wine/80">Feito de Nós • Histórias que viram presente.</p>
          <p className="text-[10px] font-mono text-brand-graphite/40 mt-1">{targetUrl}</p>
        </div>
      </div>

      <div className="max-w-md w-full text-center mt-6 text-xs text-brand-graphite/60 print:hidden">
        <p>
          Dica: Você pode imprimir este cartão em papel couchê ou linho 240g para incluir na caixa ou placa física personalizada.
        </p>
        {qrDataUrl && (
          <div className="mt-3">
            <a
              href={qrDataUrl}
              download={`qrcode-${slug}.png`}
              className="inline-flex items-center gap-1.5 text-xs text-brand-wine font-medium underline hover:text-brand-terracotta transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar QR Code do presente (.PNG)</span>
            </a>
          </div>
        )}
        {spotifyQrDataUrl && (
          <div className="mt-2">
            <a
              href={spotifyQrDataUrl}
              download={`qrcode-musica-${slug}.png`}
              className="inline-flex items-center gap-1.5 text-xs text-brand-wine font-medium underline hover:text-brand-terracotta transition-colors"
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Baixar QR Code da música (.PNG)</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
