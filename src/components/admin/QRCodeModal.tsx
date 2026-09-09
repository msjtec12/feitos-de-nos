'use client';

import React, { useState, useEffect } from 'react';
import { generateQRCodeDataUrl, generateQRCodeSvg, getGiftPagePublicUrl } from '@/lib/qr-code';
import { BrandLogo } from '@/components/brand/BrandLogo';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  X,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface QRCodeModalProps {
  publicToken: string;
  recipientName: string;
  giftTitle: string;
  onClose: () => void;
  onRegenerateToken?: () => Promise<string | null>;
}

export function QRCodeModal({
  publicToken,
  recipientName,
  giftTitle,
  onClose,
  onRegenerateToken,
}: QRCodeModalProps) {
  const [currentToken, setCurrentToken] = useState(publicToken);
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const publicUrl = getGiftPagePublicUrl(currentToken);

  useEffect(() => {
    async function loadQR() {
      const png = await generateQRCodeDataUrl(publicUrl, { width: 800, margin: 2 });
      const svg = await generateQRCodeSvg(publicUrl, { margin: 2 });
      setPngDataUrl(png);
      setSvgString(svg);
    }
    loadQR();
  }, [publicUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPng = () => {
    if (!pngDataUrl) return;
    const a = document.createElement('a');
    a.href = pngDataUrl;
    a.download = `qrcode-feito-de-nos-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-feito-de-nos-${recipientName.toLowerCase().replace(/\s+/g, '-')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmRegenerate = async () => {
    if (!onRegenerateToken) return;
    setIsRegenerating(true);
    const newToken = await onRegenerateToken();
    setIsRegenerating(false);
    setShowRegenerateConfirm(false);
    if (newToken) {
      setCurrentToken(newToken);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFF8F0] border-2 border-[#713C48]/20 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#713C48] hover:bg-[#713C48]/10 transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#713C48]/10 text-[#713C48] text-[11px] font-semibold">
            <QrCode className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>QR Code da Experiência</span>
          </div>
          <h2 className="font-serif text-2xl text-[#713C48]">{recipientName}</h2>
          <p className="text-xs text-[#302B2D]/70">{giftTitle}</p>
        </div>

        {/* Printable Card Area */}
        <div
          id="printable-card"
          className="bg-white border border-[#713C48]/20 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm"
        >
          <div className="flex justify-center">
            <BrandLogo size="md" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-xl text-[#713C48]">{giftTitle}</h3>
            <p className="text-xs text-[#C96E5A] font-semibold uppercase tracking-wider">
              Para {recipientName}
            </p>
          </div>

          {/* QR Image Display */}
          <div className="flex justify-center py-2">
            {pngDataUrl ? (
              <img
                src={pngDataUrl}
                alt={`QR Code para ${recipientName}`}
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl border border-[#713C48]/10 p-2 bg-[#FFF8F0]"
              />
            ) : (
              <div className="w-48 h-48 rounded-2xl bg-[#FFF8F0] flex items-center justify-center text-xs text-[#713C48]">
                Gerando QR Code...
              </div>
            )}
          </div>

          <div className="space-y-1 text-xs text-[#302B2D]/75">
            <p className="font-medium">Escaneie com a câmera do celular para abrir seu presente</p>
            <p className="font-mono text-[10px] text-[#302B2D]/50 break-all">{publicUrl}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG HD</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSvg}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/30 text-xs font-semibold hover:bg-[#713C48]/5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C96E5A]" />
              <span>SVG Vetor</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/30 text-xs font-semibold hover:bg-[#713C48]/5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#C96E5A]" />
              <span>Imprimir</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/30 text-xs font-semibold hover:bg-[#713C48]/5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#713C48]/10 text-xs">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#713C48] hover:underline font-semibold flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Testar Link da Experiência</span>
            </a>

            {onRegenerateToken && (
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(true)}
                className="text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerar / Invalidar Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Regenerate Warning Confirmation Dialog */}
        {showRegenerateConfirm && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-start gap-2.5 text-rose-900 text-xs leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Atenção ao regenerar o link:</strong>
                O QR Code e o link anteriores deixarão de funcionar imediatamente. Um novo token aleatório será gerado para esta página.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#302B2D]/70 hover:bg-black/5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRegenerate}
                disabled={isRegenerating}
                className="px-4 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition-colors disabled:opacity-50"
              >
                {isRegenerating ? 'Regenerando...' : 'Confirmar e Regenerar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
