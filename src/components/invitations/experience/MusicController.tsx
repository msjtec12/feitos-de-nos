'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { EventThemeConfig } from '@/types/invitation';

interface MusicControllerProps {
  musicUrl?: string | null;
  autoPlayTriggered?: boolean;
  themeConfig: EventThemeConfig;
}

export function MusicController({
  musicUrl,
  autoPlayTriggered = false,
  themeConfig,
}: MusicControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const primaryColor = themeConfig.primaryColor || '#713C48';
  const accentColor = themeConfig.accentColor || '#C96E5A';

  // Attempt play only after explicit user gesture (e.g. opening envelope or tapping play)
  useEffect(() => {
    if (!musicUrl) return;

    if (autoPlayTriggered && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy prevented playback until another gesture
          setIsPlaying(false);
        });
    }
  }, [autoPlayTriggered, musicUrl]);

  if (!musicUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio play error:', err));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
        {/* Play/Pause Pill Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-[#302B2D] backdrop-blur-md shadow-lg border border-black/10 transition-all hover:scale-105 active:scale-95"
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música de fundo'}
        >
          {/* Animated vinyl/disc or music icon */}
          <div
            className={'w-6 h-6 rounded-full flex items-center justify-center transition-transform ' + (isPlaying ? 'animate-spin' : '')}
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor,
              animationDuration: '4s',
            }}
          >
            {isPlaying ? <Disc className="w-4 h-4" /> : <Music className="w-3.5 h-3.5" />}
          </div>

          <span className="text-xs font-semibold tracking-wide">
            {isPlaying ? 'Música ativa' : 'Tocar trilha'}
          </span>

          {/* Quick Mute Toggle */}
          {isPlaying && (
            <span
              onClick={toggleMute}
              className="p-1 rounded-full hover:bg-black/5 text-[#302B2D]/70 hover:text-[#302B2D] transition-colors"
              title={isMuted ? 'Desmutar' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" style={{ color: accentColor }} />
              )}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
