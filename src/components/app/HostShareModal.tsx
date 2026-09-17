'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  MessageCircle,
  Share2,
  ExternalLink,
  QrCode,
  Download,
} from 'lucide-react';
import { EventRow } from '@/types/invitation';
import { buildWhatsAppUrl } from '@/lib/order-utils';

interface HostShareModalProps {
  event: EventRow;
  isOpen: boolean;
  onClose: () => void;
}

export function HostShareModal({ event, isOpen, onClose }: HostShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicUrl = `${origin}/convite/${event.slug}`;

  const shareText = `Olá! Você é nosso convidado especial para o evento: *${event.title}*! 🎉\n\nAbra seu convite digital interativo aqui:\n${publicUrl}`;
  const whatsappUrl = buildWhatsAppUrl(shareText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Convite especial: ${event.title}`,
          url: publicUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  // Simple QR code via quickcharts or google charts API
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    publicUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#713C48]/15 space-y-5 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#713C48]">
                Compartilhar Convite
              </h3>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                /convite/{event.slug}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Enviar pelo WhatsApp</span>
        </a>

        {/* Copy Link Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Link do Convite:</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="bg-transparent text-xs text-slate-700 font-mono flex-1 outline-none truncate select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#713C48] hover:bg-[#713C48] hover:text-white transition-all shrink-0 flex items-center gap-1 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Mobile Share Sheet if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4 text-[#C96E5A]" />
            <span>Mais opções de compartilhamento...</span>
          </button>
        )}

        {/* QR Code Section */}
        <div className="pt-3 border-t border-slate-100 flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-[#713C48]" />
            <span>QR Code para impressão ou recepção</span>
          </span>
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeImgUrl}
              alt="QR Code do Convite"
              className="w-36 h-36 object-contain mx-auto"
              loading="lazy"
            />
          </div>
          <a
            href={qrCodeImgUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`qrcode-${event.slug}.png`}
            className="text-[11px] font-semibold text-[#713C48] hover:underline inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Baixar imagem do QR Code</span>
          </a>
        </div>
      </div>
    </div>
  );
}
