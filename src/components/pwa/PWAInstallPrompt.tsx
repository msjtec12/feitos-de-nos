"use client";

import React, { useEffect, useState } from "react";
import { Download, QrCode, Smartphone } from "lucide-react";
import Link from "next/link";

interface PWAInstallPromptProps {
  slug: string;
}

export function PWAInstallPrompt({ slug }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 my-6 text-xs text-brand-wine/90">
      {/* Botão de Instalação PWA (se disponível no navegador) */}
      {canInstall && (
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-rose/20 hover:bg-brand-rose/35 text-brand-wine font-medium border border-brand-rose/40 transition-colors shadow-xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-brand-terracotta" />
          <span>Salvar como aplicativo na tela de início</span>
        </button>
      )}

      {/* Link para visualização do Cartão Físico e QR Code */}
      <Link
        href={`/presente/${slug}/cartao`}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-brand-cream text-brand-wine font-medium border border-brand-rose/40 transition-colors shadow-xs"
      >
        <QrCode className="w-3.5 h-3.5 text-brand-terracotta" />
        <span>Ver Cartão Físico e QR Code</span>
      </Link>
    </div>
  );
}
