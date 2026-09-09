'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  Check,
  Loader2,
  Image as ImageIcon,
  Mic,
  Film,
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react';

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
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount or URL change
  useEffect(() => {
    return () => {
      if (localPreviewUrl && localPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  // Reset states if currentUrl changes from parent
  useEffect(() => {
    setImageLoadError(false);
    if (!currentUrl && !isUploading) {
      setLocalPreviewUrl(null);
      setImageLoaded(false);
    }
  }, [currentUrl, isUploading]);

  const acceptMap = {
    image: 'image/jpeg,image/png,image/webp',
    audio: 'audio/mpeg,audio/mp4,audio/webm,audio/wav,audio/ogg,audio/x-m4a',
    video: 'video/mp4,video/webm',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create immediate local preview for instant visual feedback
    const blobUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(blobUrl);
    setImageLoadError(false);
    setImageLoaded(false);
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

  const activeUrl = localPreviewUrl || currentUrl;

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleRetryLoad = () => {
    setImageLoadError(false);
    setImageLoaded(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-[#713C48] block">{label}</label>}

      {activeUrl && !imageLoadError ? (
        <div className="relative rounded-2xl border border-[#713C48]/20 bg-[#FFF8F0] p-3 flex items-center gap-3 transition-all">
          {mediaType === 'image' && (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-black/10 flex-shrink-0 bg-stone-100 flex items-center justify-center">
              <img
                src={activeUrl}
                alt="Prévia da imagem"
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  imageLoaded ? 'opacity-100' : 'opacity-80'
                }`}
                onLoad={() => {
                  setImageLoaded(true);
                  setImageLoadError(false);
                }}
                onError={() => {
                  setImageLoadError(true);
                  setImageLoaded(false);
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                </div>
              )}
            </div>
          )}

          {mediaType === 'audio' && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={togglePlayAudio}
                className="w-12 h-12 rounded-xl bg-[#713C48] text-[#FFF8F0] hover:bg-[#5a2e39] flex items-center justify-center shadow-sm transition-colors"
                title={isPlayingAudio ? 'Pausar' : 'Reproduzir áudio'}
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <audio
                ref={audioRef}
                src={activeUrl}
                onEnded={() => setIsPlayingAudio(false)}
                onPause={() => setIsPlayingAudio(false)}
                onError={() => setImageLoadError(true)}
                className="hidden"
              />
            </div>
          )}

          {mediaType === 'video' && (
            <div className="w-12 h-12 rounded-xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0">
              <Film className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {isUploading ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#713C48]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C96E5A]" />
                  <span>Enviando para o Storage...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {mediaType === 'image'
                      ? 'Imagem carregada'
                      : mediaType === 'audio'
                      ? 'Áudio pronto para reproduzir'
                      : 'Vídeo carregado'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[11px] text-[#C96E5A] hover:underline font-semibold disabled:opacity-50"
              >
                Trocar arquivo
              </button>
            </div>
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={() => {
                setLocalPreviewUrl(null);
                setImageLoaded(false);
                setImageLoadError(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlayingAudio(false);
                }
                onRemove();
              }}
              disabled={isUploading}
              className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-40"
              title="Remover arquivo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : activeUrl && imageLoadError ? (
        /* Broken Image / Fallback UI */
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-rose-900 truncate">
                Não foi possível carregar {mediaType === 'image' ? 'a imagem' : 'o áudio'}
              </p>
              <p className="text-[11px] text-rose-700/80">O link pode ter expirado ou o arquivo foi removido.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleRetryLoad}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-white/80 border border-stone-200 transition-colors"
              title="Tentar recarregar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-[#713C48] text-white text-[11px] font-semibold hover:bg-[#5a2e39] transition-colors"
            >
              Trocar
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => {
                  setLocalPreviewUrl(null);
                  setImageLoadError(false);
                  onRemove();
                }}
                className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors"
                title="Remover"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-[#713C48]/25 hover:border-[#713C48] rounded-2xl p-5 text-center cursor-pointer transition-all bg-white/60 hover:bg-white flex flex-col items-center justify-center gap-2 ${
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
                Clique para selecionar{' '}
                {mediaType === 'image' ? 'uma imagem' : mediaType === 'audio' ? 'um áudio' : 'um vídeo'}
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
