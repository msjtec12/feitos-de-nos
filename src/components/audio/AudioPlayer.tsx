"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Clock, VolumeX } from "lucide-react";
import { AudioMessage } from "@/types/gift";
import { formatTime } from "@/lib/utils";

interface AudioPlayerProps {
  audio?: AudioMessage;
  title?: string;
  author?: string;
  className?: string;
  variant?: "primary" | "compact";
}

// Alturas base para as 28 barras de onda sonora do player visual
const WAVEFORM_BARS = [
  25, 40, 65, 30, 85, 50, 95, 70, 45, 80, 100, 60, 40, 75,
  90, 55, 35, 70, 85, 45, 90, 65, 30, 50, 80, 40, 60, 30
];

export function AudioPlayer({
  audio,
  title,
  author,
  className = "",
  variant = "primary",
}: AudioPlayerProps) {
  const isAvailable = audio?.isAvailable ?? false;
  const audioSrc = isAvailable ? audio?.audioUrl : undefined;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audio?.durationSeconds || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);

  const displayTitle = title || audio?.title || "Mensagem dos pais";
  const displayAuthor = author || audio?.recordedBy;

  // Sincronização do elemento de áudio apenas quando disponível
  useEffect(() => {
    if (!isAvailable || !audioSrc) return;

    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audioElement.duration && !isNaN(audioElement.duration)) {
        setDuration(audioElement.duration);
      }
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("ended", handleEnded);
    audioElement.addEventListener("waiting", handleWaiting);
    audioElement.addEventListener("playing", handlePlaying);
    audioElement.addEventListener("error", handleError);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.removeEventListener("waiting", handleWaiting);
      audioElement.removeEventListener("playing", handlePlaying);
      audioElement.removeEventListener("error", handleError);
    };
  }, [isAvailable, audioSrc]);

  const togglePlayPause = () => {
    if (!isAvailable || !audioRef.current || !audioSrc || hasError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setHasError(true);
          setIsLoading(false);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAvailable || !audioRef.current || !waveformContainerRef.current || !duration || hasError || !audioSrc) return;

    const rect = waveformContainerRef.current.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newProgress = clickPosition / rect.width;
    const newTime = newProgress * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAvailable || !audioRef.current || hasError || !audioSrc) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const newTime = Math.min((audioRef.current.currentTime || 0) + 5, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const newTime = Math.max((audioRef.current.currentTime || 0) - 5, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentBarIndex = Math.floor((progressPercent / 100) * WAVEFORM_BARS.length);

  // 1. ESTADO ELEGANTE QUANDO O ÁUDIO NÃO EXISTE / INDISPONÍVEL
  if (!isAvailable || hasError) {
    return (
      <div
        className={`rounded-3xl p-4 sm:p-5 bg-white/90 border border-brand-rose/30 shadow-xs flex flex-col justify-between gap-3 ${className}`}
        role="region"
        aria-label={`Player de áudio: ${displayTitle} (Indisponível)`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-1">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-brand-wine truncate">
              {displayTitle}
            </h3>
            <p className="text-xs text-brand-terracotta font-medium mt-0.5">
              O áudio será adicionado em breve.
            </p>
          </div>

          <div className="text-xs font-mono text-brand-graphite/40 flex items-center gap-1 shrink-0">
            <Mic className="w-3.5 h-3.5 text-brand-rose" />
            <span>Gravação em breve</span>
          </div>
        </div>

        {/* Barra de Ondas Sonora Estática e Botão Desabilitado */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="flex-1 h-11 flex items-center justify-between gap-[2px] sm:gap-[3px] px-2 py-1 bg-brand-cream/60 rounded-2xl opacity-40 select-none cursor-not-allowed"
            aria-hidden="true"
          >
            {WAVEFORM_BARS.map((heightPercent, index) => {
              const barHeight = Math.max(6, (heightPercent / 100) * 30);
              return (
                <div
                  key={index}
                  className="w-[3px] sm:w-[4px] rounded-full bg-brand-rose/60"
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>

          {/* Botão de Reprodução Desabilitado */}
          <button
            type="button"
            disabled
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-brand-wine/25 text-white/80 flex items-center justify-center shrink-0 cursor-not-allowed shadow-none"
            aria-label={`Reprodução indisponível: ${displayTitle} (O áudio será adicionado em breve)`}
            title="O áudio será adicionado em breve"
          >
            <Play className="w-5 h-5 fill-white/80 ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. PLAYER COMPLETO ATIVO QUANDO O ÁUDIO EXISTE
  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 bg-white border border-brand-rose/30 shadow-xs hover:shadow-md transition-all duration-300 ${className}`}
      role="region"
      aria-label={`Player de áudio: ${displayTitle}`}
    >
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        className="hidden"
        aria-hidden="true"
        onError={() => setHasError(true)}
      />

      {/* Cabeçalho do Player */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-brand-wine truncate">
            {displayTitle}
          </h3>
          {displayAuthor && (
            <p className="text-xs text-brand-graphite/60 truncate">
              {displayAuthor}
            </p>
          )}
        </div>

        <div className="text-xs font-mono text-brand-graphite/60 flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 text-brand-terracotta" />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>

      {/* Área Central: Visualizador de Ondas Sonoras + Botão Circular Vinho */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Visualizador de Ondas Sonoras Interativo (Waveform Scrubber) */}
        <div
          ref={waveformContainerRef}
          onClick={handleSeek}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label={`Progresso da gravação: ${displayTitle}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
          className="flex-1 h-12 flex items-center justify-between gap-[2px] sm:gap-[3px] px-2 py-1 bg-brand-cream/60 rounded-2xl cursor-pointer hover:bg-brand-rose/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-wine group select-none"
        >
          {WAVEFORM_BARS.map((heightPercent, index) => {
            const isPlayed = index <= currentBarIndex;
            const barHeight = Math.max(6, (heightPercent / 100) * 34);

            return (
              <div
                key={index}
                className={`w-[3px] sm:w-[4px] rounded-full transition-all duration-150 ${
                  isPlayed
                    ? "bg-brand-wine"
                    : "bg-brand-rose/40 group-hover:bg-brand-rose/60"
                } ${isPlaying && isPlayed ? "animate-pulse" : ""}`}
                style={{
                  height: `${barHeight}px`,
                }}
              />
            );
          })}
        </div>

        {/* Botão Circular Vinho (#713C48) com Ícone Branco */}
        <button
          type="button"
          onClick={togglePlayPause}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-wine text-white hover:bg-brand-wine-dark flex items-center justify-center shrink-0 shadow-md transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-wine/30 cursor-pointer"
          aria-label={isPlaying ? `Pausar áudio: ${displayTitle}` : `Reproduzir áudio: ${displayTitle}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
