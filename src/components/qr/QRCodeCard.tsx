"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "../brand/BrandLogo";
import { BrandSymbol, BackgroundKnotArt } from "../brand/BrandSymbol";

interface QRCodeCardProps {
  slug: string;
  recipientName: string;
  tagline?: string;
}

export function QRCodeCard({
  slug,
  recipientName,
  tagline = "Meu primeiro ano",
}: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://feitodenos.com.br";
    const fullUrl = `${origin}/presente/${slug}`;
    setTargetUrl(fullUrl);

    QRCode.toDataURL(fullUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#302B2D",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Erro ao gerar QR Code:", err);
      });
  }, [slug]);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream/80 py-8 px-4 sm:px-6 flex flex-col items-center justify-center print:bg-white print:p-0">
      {/* Botões de controle de tela (ocultos na impressão) */}
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

      {/* Cartão Físico Estilizado (Idêntico ao da papelaria oficial da foto de referência) */}
      <div className="relative w-full max-w-[480px] bg-[#FFF8F0] border border-brand-rose/40 rounded-3xl p-8 sm:p-10 shadow-lg print:shadow-none print:border print:rounded-2xl print:max-w-[400px] overflow-hidden">
        {/* Linhas curvas afetivas no fundo do cartão */}
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

        {/* Topo do Cartão com Logo Oficial */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="md" showSlogan={true} />
        </div>

        {/* Conteúdo Central: Nome do Destinatário & QR Code Oficial */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4 bg-white/90 p-5 rounded-2xl border border-brand-rose/30 shadow-xs">
          <div className="text-left flex-1 min-w-0">
            <span className="text-[11px] uppercase tracking-widest text-brand-terracotta font-semibold block mb-1">
              Presente Especial
            </span>
            <h2 className="font-serif text-2xl text-brand-wine tracking-tight">
              {recipientName}
            </h2>
            <p className="font-serif italic text-sm text-brand-terracotta mt-0.5">
              {tagline}
            </p>
            <p className="text-xs text-brand-graphite/70 mt-3 leading-relaxed">
              Aponte a câmera do seu celular para o QR Code ao lado para ouvir vozes e ver momentos inesquecíveis.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="p-2.5 bg-white rounded-xl border-2 border-brand-rose/40 shadow-xs">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={`QR Code para o presente do ${recipientName}`}
                  className="w-32 h-32 object-contain"
                />
              ) : (
                <div className="w-32 h-32 bg-brand-cream animate-pulse flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-brand-rose" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-mono text-brand-graphite/50 mt-1 uppercase tracking-wider">
              Escanear QR Code
            </span>
          </div>
        </div>

        {/* Rodapé do Cartão */}
        <div className="text-center mt-6 pt-4 border-t border-brand-rose/20">
          <p className="font-serif text-xs text-brand-wine/80">
            Feito de Nós • Histórias que viram presente.
          </p>
          <p className="text-[10px] font-mono text-brand-graphite/40 mt-1">
            {targetUrl}
          </p>
        </div>
      </div>

      {/* Instruções de impressão (visíveis apenas na tela) */}
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
              <span>Baixar arquivo de imagem do QR Code (.PNG em alta resolução)</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
