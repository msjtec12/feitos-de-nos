'use client';

import React, { useState } from 'react';
import { GiftExperience } from '@/types/gift';
import {
  Download,
  FileArchive,
  Volume2,
  Image as ImageIcon,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import JSZip from 'jszip';

interface DownloadMemoriesSectionProps {
  gift: GiftExperience;
}

export function DownloadMemoriesSection({ gift }: DownloadMemoriesSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Helper para acionar download no navegador via link virtual
  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Gerar texto formatado com todas as mensagens
  const generateTextKeepsake = () => {
    const lines: string[] = [
      '====================================================',
      'FEITO DE NÓS — HISTÓRIAS QUE VIRAM PRESENTE',
      '====================================================',
      '',
      `Homenagem para: ${gift.recipient.name}`,
      `Subtítulo: ${gift.recipient.subtitle || ''}`,
      `Frase: "${gift.recipient.introQuote || ''}"`,
      '',
      '--- ABERTURA ---',
      gift.openingText.headline,
      gift.openingText.description,
      '',
    ];

    if (gift.timelineMoments && gift.timelineMoments.length > 0) {
      lines.push('--- LINHA DO TEMPO DAS MEMÓRIAS ---');
      gift.timelineMoments.forEach((moment, idx) => {
        lines.push(
          `• Momento ${idx + 1} (${moment.title || `Mês ${moment.monthNumber}`}): ${
            moment.caption || moment.subtitle || ''
          }`
        );
      });
      lines.push('');
    }

    if (gift.contributorMessages && gift.contributorMessages.length > 0) {
      lines.push('--- VOZES E MENSAGENS DE QUEM AMA ---');
      gift.contributorMessages.forEach((msg) => {
        lines.push(`• ${msg.authorName} (${msg.relation}):`);
        lines.push(`  "${msg.writtenMessage}"`);
        if (msg.audio?.audioUrl) {
          lines.push(`  [Contém áudio de voz gravado]`);
        }
        lines.push('');
      });
    }

    lines.push('--- MENSAGEM FINAL ---');
    lines.push(gift.closing.headline);
    lines.push(gift.closing.message);
    lines.push(gift.closing.signature);
    lines.push('');
    lines.push('====================================================');
    lines.push('AVISO DE HOSPEDAGEM:');
    lines.push('Esta página online permanece no ar por 6 meses.');
    lines.push('Guarde estes arquivos em seu computador ou celular');
    lines.push('para manter essas lembranças para sempre com você.');
    lines.push('====================================================');

    return lines.join('\n');
  };

  // Baixar arquivo de texto das mensagens individualmente
  const handleDownloadTextKeepsake = () => {
    const textContent = generateTextKeepsake();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    triggerBrowserDownload(blob, `mensagens-${gift.slug || 'feito-de-nos'}.txt`);
  };

  // Baixar pacote completo em ZIP
  const handleDownloadCompleteZip = async () => {
    setIsDownloading(true);
    setDownloadProgress('Preparando memórias...');
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();

      // 1. Adicionar arquivo de texto
      zip.file('mensagens-e-dedicatorias.txt', generateTextKeepsake());

      // 2. Pasta de Fotos
      const photosFolder = zip.folder('fotos');
      const photoUrls: { name: string; url: string }[] = [];

      if (gift.recipient.featuredImage?.url) {
        photoUrls.push({ name: '00-foto-capa.jpg', url: gift.recipient.featuredImage.url });
      }

      (gift.timelineMoments || []).forEach((m, idx) => {
        if (m.image?.url) {
          const paddedIdx = String(idx + 1).padStart(2, '0');
          photoUrls.push({ name: `timeline-${paddedIdx}-${m.title || 'marco'}.jpg`, url: m.image.url });
        }
      });

      (gift.galleryItems || []).forEach((g, idx) => {
        if (g.url) {
          const paddedIdx = String(idx + 1).padStart(2, '0');
          photoUrls.push({ name: `galeria-${paddedIdx}.jpg`, url: g.url });
        }
      });

      if (photosFolder && photoUrls.length > 0) {
        for (let i = 0; i < photoUrls.length; i++) {
          const item = photoUrls[i];
          setDownloadProgress(`Baixando fotos (${i + 1}/${photoUrls.length})...`);
          try {
            const res = await fetch(item.url);
            if (res.ok) {
              const blob = await res.blob();
              photosFolder.file(item.name, blob);
            }
          } catch {
            // Continua se falhar uma imagem individual
          }
        }
      }

      // 3. Pasta de Áudios
      const audiosFolder = zip.folder('audios');
      if (audiosFolder) {
        if (gift.primaryAudio?.audioUrl) {
          setDownloadProgress('Baixando áudio principal...');
          try {
            const res = await fetch(gift.primaryAudio.audioUrl);
            if (res.ok) {
              const blob = await res.blob();
              audiosFolder.file('01-mensagem-de-voz-principal.mp3', blob);
            }
          } catch {
            // Continua se falhar
          }
        }

        const contributorAudios = (gift.contributorMessages || []).filter((c) => Boolean(c.audio?.audioUrl));
        for (let i = 0; i < contributorAudios.length; i++) {
          const c = contributorAudios[i];
          if (c.audio?.audioUrl) {
            setDownloadProgress(`Baixando áudio de ${c.authorName}...`);
            try {
              const res = await fetch(c.audio.audioUrl);
              if (res.ok) {
                const blob = await res.blob();
                audiosFolder.file(`audio-${i + 2}-${c.authorName}.mp3`, blob);
              }
            } catch {
              // Continua se falhar
            }
          }
        }
      }

      // 4. Gerar arquivo ZIP
      setDownloadProgress('Compactando arquivos para você...');
      const content = await zip.generateAsync({ type: 'blob' });
      triggerBrowserDownload(content, `memorias-${gift.slug || 'feito-de-nos'}.zip`);

      setDownloadSuccess(true);
    } catch (err) {
      console.error('Erro ao gerar pacote de download:', err);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(null);
    }
  };

  const totalPhotosCount =
    (gift.recipient.featuredImage?.url ? 1 : 0) +
    (gift.timelineMoments || []).filter((m) => Boolean(m.image?.url)).length +
    (gift.galleryItems || []).filter((g) => Boolean(g.url)).length;

  const totalAudiosCount =
    (gift.primaryAudio?.audioUrl ? 1 : 0) +
    (gift.contributorMessages || []).filter((c) => Boolean(c.audio?.audioUrl)).length;

  return (
    <section className="py-12 px-4 sm:px-6 max-w-2xl mx-auto w-full" aria-label="Baixar e guardar memórias">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-[#713C48]/20 shadow-xl space-y-6 text-[#302B2D]">
        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#713C48] text-[#FFF8F0] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Download className="w-6 h-6 text-[#D9A4A0]" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C96E5A]">
              Guardar para Sempre
            </span>
            <h3 className="font-serif text-2xl text-[#713C48] leading-tight">
              Baixe todas as fotos, mensagens e áudios
            </h3>
            <p className="text-xs text-[#302B2D]/80 leading-relaxed">
              Salve este presente em alta qualidade no seu computador ou celular para ter todas as lembranças sempre com você.
            </p>
          </div>
        </div>

        {/* 6-Month Validity Notice Card */}
        <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#C96E5A]/30 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#C96E5A] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#302B2D]/85 leading-relaxed space-y-1">
            <strong className="text-[#713C48] block font-semibold">
              📅 Aviso Importante: Esta página online fica no ar por 6 meses.
            </strong>
            <p className="text-[11px] text-[#302B2D]/75">
              Aproveite para realizar o download completo das fotos em alta resolução, arquivos de áudio de voz e cartas escritas para mantê-los salvos permanentemente em seus dispositivos.
            </p>
          </div>
        </div>

        {/* Main ZIP Download Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleDownloadCompleteZip}
            disabled={isDownloading}
            className="w-full py-4 px-6 rounded-2xl bg-[#713C48] text-[#FFF8F0] hover:bg-[#592F39] transition-all font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#D9A4A0]" />
                <span>{downloadProgress || 'Gerando pacote...'}</span>
              </>
            ) : (
              <>
                <FileArchive className="w-5 h-5 text-[#D9A4A0]" />
                <span>Baixar Pacote Completo de Memórias (.ZIP)</span>
              </>
            )}
          </button>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Download concluído! Seus arquivos foram salvos com sucesso.</span>
            </div>
          )}

          {/* Individual items summary & download shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 bg-[#FFF8F0]/60 rounded-xl border border-[#713C48]/10 text-center">
              <ImageIcon className="w-4 h-4 text-[#C96E5A] mx-auto mb-1" />
              <span className="text-xs font-bold text-[#713C48] block">{totalPhotosCount} fotos</span>
              <span className="text-[10px] text-[#302B2D]/60">Alta resolução</span>
            </div>

            <div className="p-3 bg-[#FFF8F0]/60 rounded-xl border border-[#713C48]/10 text-center">
              <Volume2 className="w-4 h-4 text-[#C96E5A] mx-auto mb-1" />
              <span className="text-xs font-bold text-[#713C48] block">{totalAudiosCount} áudio(s)</span>
              <span className="text-[10px] text-[#302B2D]/60">Vozes reais</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadTextKeepsake}
              className="p-3 bg-[#FFF8F0]/60 hover:bg-[#FFF8F0] rounded-xl border border-[#713C48]/10 text-center transition-colors group cursor-pointer"
              title="Baixar somente o arquivo de texto com as cartas"
            >
              <FileText className="w-4 h-4 text-[#C96E5A] mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#713C48] block">Baixar Cartas</span>
              <span className="text-[10px] text-[#302B2D]/60">Arquivo .TXT</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
