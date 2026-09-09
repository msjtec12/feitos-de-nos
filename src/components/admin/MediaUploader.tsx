'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Image as ImageIcon, Mic, Film, AlertCircle } from 'lucide-react';

interface MediaUploaderProps {
  giftPageId?: string;
  sectionKey: string;
  mediaType: 'image' | 'audio' | 'video';
  currentUrl?: string;
  onUploaded: (url: string, path: string) => void;
  onRemove?: () => void;
  label?: string;
  helperText?: string;
}

export function MediaUploader({
  giftPageId = 'temp',
  sectionKey,
  mediaType,
  currentUrl,
  onUploaded,
  onRemove,
  label,
  helperText,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptMap = {
    image: 'image/jpeg,image/png,image/webp',
    audio: 'audio/mpeg,audio/mp4,audio/webm,audio/wav,audio/ogg',
    video: 'video/mp4,video/webm',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('giftPageId', giftPageId);
    formData.append('sectionKey', sectionKey);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'Falha ao enviar arquivo');
        setIsUploading(false);
        return;
      }

      onUploaded(result.signedUrl, result.storagePath);
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError('Erro de conexão durante o upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-[#713C48] block">{label}</label>}

      {currentUrl ? (
        <div className="relative rounded-2xl border border-[#713C48]/20 bg-[#FFF8F0] p-3 flex items-center gap-3">
          {mediaType === 'image' && (
            <img
              src={currentUrl}
              alt="Prévia"
              className="w-16 h-16 object-cover rounded-xl border border-black/10 flex-shrink-0 bg-white"
            />
          )}

          {mediaType === 'audio' && (
            <div className="w-12 h-12 rounded-xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6" />
            </div>
          )}

          {mediaType === 'video' && (
            <div className="w-12 h-12 rounded-xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0">
              <Film className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-[#302B2D] block truncate">
              Arquivo carregado com sucesso
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] text-[#C96E5A] hover:underline font-semibold mt-0.5"
            >
              Trocar arquivo
            </button>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
              title="Remover arquivo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-[#713C48]/25 hover:border-[#713C48] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-white/60 hover:bg-white flex flex-col items-center justify-center gap-2 ${
            isUploading ? 'opacity-60 cursor-wait' : ''
          }`}
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#713C48]">
              <Loader2 className="w-5 h-5 animate-spin text-[#C96E5A]" />
              <span>Enviando arquivo com segurança para o Storage...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#713C48]/10 text-[#713C48] flex items-center justify-center">
                {mediaType === 'image' && <ImageIcon className="w-5 h-5" />}
                {mediaType === 'audio' && <Mic className="w-5 h-5" />}
                {mediaType === 'video' && <Film className="w-5 h-5" />}
              </div>
              <p className="text-xs font-semibold text-[#713C48]">
                Clique para selecionar {mediaType === 'image' ? 'uma imagem' : mediaType === 'audio' ? 'um áudio' : 'um vídeo'}
              </p>
              <p className="text-[11px] text-[#302B2D]/60">
                {helperText ||
                  (mediaType === 'image'
                    ? 'JPG, PNG ou WebP até 10MB'
                    : mediaType === 'audio'
                    ? 'MP3, M4A ou WebM até 20MB'
                    : 'MP4 ou WebM até 50MB')}
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-700 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMap[mediaType]}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
