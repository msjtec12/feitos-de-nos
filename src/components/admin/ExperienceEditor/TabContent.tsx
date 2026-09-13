'use client';

import React from 'react';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import { MediaUploader } from '../MediaUploader';
import { ThemePresetManager } from './ThemePresetManager';
import { User, Sparkles, Volume2, Info, Music2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseSpotifyUrl } from '@/lib/spotify';

interface TabContentProps {
  giftPageId: string;
  content: GiftContentData;
  theme: GiftThemeData;
  updateContent: (fields: Partial<GiftContentData>) => void;
  updateTheme: (fields: Partial<GiftThemeData>) => void;
}

export function TabContent({ giftPageId, content, theme, updateContent, updateTheme }: TabContentProps) {
  const recipient = content.recipient || {};
  const primaryAudio = content.primaryAudio || {
    id: 'primary-audio',
    title: 'Mensagem em Áudio',
    audioUrl: '',
    recordedBy: '',
  };
  const soundtrack = content.soundtrack || {
    enabled: false,
    provider: 'spotify' as const,
    url: '',
    title: 'Nossa música',
    message: '',
  };

  const updateRecipient = (fields: Partial<typeof recipient>) => {
    updateContent({ recipient: { ...recipient, ...fields } });
  };

  const updatePrimaryAudio = (fields: Partial<typeof primaryAudio>) => {
    updateContent({ primaryAudio: { ...primaryAudio, ...fields } });
  };

  const updateSoundtrack = (fields: Partial<typeof soundtrack>) => {
    updateContent({ soundtrack: { ...soundtrack, ...fields, provider: 'spotify' } });
  };

  const nameLength = (recipient.name || '').length;
  const subtitleLength = (recipient.subtitle || '').length;
  const taglineLength = (recipient.tagline || '').length;
  const quoteLength = (recipient.introQuote || '').length;
  const spotifyData = parseSpotifyUrl(soundtrack.url);
  const hasSpotifyValue = Boolean(soundtrack.url?.trim());
  const spotifyIsValid = !hasSpotifyValue || Boolean(spotifyData);

  return (
    <div className="space-y-6 animate-in fade-in">
      <ThemePresetManager
        content={content}
        theme={theme}
        updateContent={updateContent}
        updateTheme={updateTheme}
      />

      <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/15 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C96E5A] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#302B2D]/80 leading-relaxed">
          <strong className="text-[#713C48] block">Etapa 1 de 5: Conteúdo e identidade da experiência</strong>
          O tema inteligente fornece um ponto de partida, mas todos os textos continuam editáveis. Personalize os detalhes para que o presente pareça escrito para aquela pessoa — e não um modelo genérico.
        </div>
      </div>

      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <User className="w-4 h-4 text-[#C96E5A]" />
          <span>Informações do Homenageado</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#713C48]">Nome do Presenteado / “Para:” *</label>
              <span className={`text-[10px] ${nameLength > 50 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>{nameLength}/60</span>
            </div>
            <input
              type="text"
              maxLength={60}
              value={recipient.name || ''}
              onChange={(e) => updateRecipient({ name: e.target.value })}
              placeholder="Ex: Matheus Akira"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
            />
            <p className="text-[10px] text-stone-500 leading-relaxed">Este nome também aparece como “Para:” na lista de experiências, no simulador e no QR Code.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#713C48]">Subtítulo / Ocasião</label>
              <span className={`text-[10px] ${subtitleLength > 70 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>{subtitleLength}/80</span>
            </div>
            <input
              type="text"
              maxLength={80}
              value={recipient.subtitle || ''}
              onChange={(e) => updateRecipient({ subtitle: e.target.value })}
              placeholder="Ex: Meu Primeiro Ano, Nossa História, Uma Grande Conquista"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Frase de Destaque</label>
            <span className={`text-[10px] ${taglineLength > 110 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>{taglineLength}/120</span>
          </div>
          <input
            type="text"
            maxLength={120}
            value={recipient.tagline || ''}
            onChange={(e) => updateRecipient({ tagline: e.target.value })}
            placeholder="Uma frase curta que resuma o sentimento do presente"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#713C48]">Mensagem de Abertura</label>
            <span className={`text-[10px] ${quoteLength > 280 ? 'text-rose-600 font-bold' : 'text-stone-400'}`}>{quoteLength}/300</span>
          </div>
          <textarea
            rows={3}
            maxLength={300}
            value={recipient.introQuote || ''}
            onChange={(e) => updateRecipient({ introQuote: e.target.value })}
            placeholder="Uma frase que prepare a pessoa para abrir a história"
            className="w-full p-3 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white resize-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C96E5A]" />
          <span>Foto Principal de Capa</span>
        </h3>
        <MediaUploader
          giftPageId={giftPageId}
          sectionKey="cover"
          mediaType="image"
          currentUrl={recipient.featuredImage?.url}
          onUploaded={(url) => updateRecipient({
            featuredImage: {
              id: 'cover-photo',
              url,
              altText: `Foto de capa de ${recipient.name || 'presenteado'}`,
              aspectRatio: 'square',
              isAvailable: true,
            },
          })}
          onRemove={() => updateRecipient({
            featuredImage: { id: 'cover-photo', url: '', altText: '', isAvailable: false },
          })}
          helperText="Envie uma foto que represente bem a história (JPG, PNG ou WebP até 10MB)"
        />
      </div>

      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#C96E5A]" />
          <span>Mensagem em Áudio Principal (Opcional)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Título do Áudio</label>
            <input type="text" value={primaryAudio.title || ''} onChange={(e) => updatePrimaryAudio({ title: e.target.value })} placeholder="Ex: Uma mensagem para você" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Voz / Gravado por</label>
            <input type="text" value={primaryAudio.recordedBy || ''} onChange={(e) => updatePrimaryAudio({ recordedBy: e.target.value })} placeholder="Ex: Papai e Mamãe, Seus Amigos" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all" />
          </div>
        </div>

        <MediaUploader
          giftPageId={giftPageId}
          sectionKey="audio"
          mediaType="audio"
          currentUrl={primaryAudio.audioUrl}
          onUploaded={(url) => updatePrimaryAudio({ audioUrl: url, isAvailable: true })}
          onRemove={() => updatePrimaryAudio({ audioUrl: '', isAvailable: false })}
          helperText="Envie a gravação de voz (MP3, M4A ou WebM até 20MB)"
        />
      </div>

      <div className="bg-white border border-[#713C48]/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#713C48] flex items-center gap-2">
              <Music2 className="w-4 h-4 text-[#C96E5A]" />
              <span>Trilha Sonora do Presente</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">Adicione uma faixa, álbum ou playlist do Spotify para acompanhar a história.</p>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#713C48] cursor-pointer select-none">
            <input type="checkbox" checked={Boolean(soundtrack.enabled)} onChange={(e) => updateSoundtrack({ enabled: e.target.checked })} className="w-4 h-4 rounded border-[#713C48]/30 accent-[#713C48]" />
            Ativar
          </label>
        </div>

        <div className={`space-y-4 ${soundtrack.enabled ? '' : 'opacity-55'}`}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#713C48]">Link do Spotify</label>
            <input
              type="url"
              disabled={!soundtrack.enabled}
              value={soundtrack.url || ''}
              onChange={(e) => updateSoundtrack({ url: e.target.value })}
              placeholder="https://open.spotify.com/track/..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all disabled:cursor-not-allowed ${spotifyIsValid ? 'border-[#713C48]/20' : 'border-rose-400'}`}
            />
            {hasSpotifyValue && (
              <div className={`flex items-center gap-1.5 text-[10px] ${spotifyData ? 'text-emerald-700' : 'text-rose-600'}`}>
                {spotifyData ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                <span>{spotifyData ? `Link válido (${spotifyData.type}). O player aparecerá automaticamente.` : 'Use um link válido do Spotify.'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#713C48]">Título da seção</label>
              <input type="text" disabled={!soundtrack.enabled} maxLength={80} value={soundtrack.title || ''} onChange={(e) => updateSoundtrack({ title: e.target.value })} placeholder="Ex: Nossa música" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all disabled:cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#713C48]">Mensagem curta</label>
              <input type="text" disabled={!soundtrack.enabled} maxLength={160} value={soundtrack.message || ''} onChange={(e) => updateSoundtrack({ message: e.target.value })} placeholder="Uma frase que explique por que essa música é especial" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8F0]/50 border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] focus:outline-none focus:ring-2 focus:ring-[#713C48] focus:bg-white transition-all disabled:cursor-not-allowed" />
            </div>
          </div>

          {soundtrack.enabled && spotifyData && (
            <a href={spotifyData.canonicalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713C48] hover:text-[#C96E5A] transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Conferir no Spotify
            </a>
          )}

          <p className="text-[10px] text-stone-500 leading-relaxed">A reprodução começa somente quando o visitante toca no player, respeitando as regras de autoplay dos navegadores.</p>
        </div>
      </div>
    </div>
  );
}
