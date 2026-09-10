"use client";

import React, { useState } from "react";
import { GiftExperience } from "@/types/gift";
import { GiftOpening } from "@/components/opening/GiftOpening";
import { GiftHero } from "@/components/hero/GiftHero";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Timeline } from "@/components/timeline/Timeline";
import { ContributorMessages } from "@/components/contributors/ContributorMessages";
import { MemoryGallery } from "@/components/gallery/MemoryGallery";
import { ClosingMessage } from "@/components/closing/ClosingMessage";
import { BrandFooter } from "@/components/brand/BrandFooter";
import { BackgroundKnotArt } from "@/components/brand/BrandSymbol";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";

interface PresenteClientViewProps {
  gift: GiftExperience;
  initialOpen?: boolean;
  isMobileSimulator?: boolean;
}

export function PresenteClientView({
  gift,
  initialOpen = false,
  isMobileSimulator = false,
}: PresenteClientViewProps) {
  const [isGiftOpened, setIsGiftOpened] = useState(initialOpen);

  const handleOpenGift = () => {
    setIsGiftOpened(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-graphite selection:bg-brand-rose selection:text-brand-graphite overflow-x-hidden">
      {/* Arte de Linha Contínua/Fio Afetivo no Fundo (como no mockup da marca) */}
      <BackgroundKnotArt className="top-40 -left-20" />
      <BackgroundKnotArt className="top-[900px] -right-24 rotate-180" />
      <BackgroundKnotArt className="top-[1800px] -left-20" />

      {/* Tela de Abertura do Presente (Envelope/Caixa Afetiva) */}
      <GiftOpening
        isOpen={isGiftOpened}
        onOpen={handleOpenGift}
        headline={gift.openingText.headline}
        description={gift.openingText.description}
        buttonLabel={gift.openingText.buttonLabel}
        recipientName={gift.recipient.name}
      />

      {/* Conteúdo Principal do Presente Revelado */}
      <main
        className={`relative z-10 transition-opacity duration-700 ${
          isGiftOpened ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isGiftOpened}
      >
        {/* 1. Apresentação Principal (Hero com Polaroid e Fita Adesiva) */}
        <GiftHero recipient={gift.recipient} />

        {/* 2. Mensagem de Voz Principal (Waveform Player Idêntico ao Mockup) */}
        {gift.primaryAudio && (
          <section className="px-4 sm:px-6 max-w-xl mx-auto w-full mb-8">
            <AudioPlayer
              audio={gift.primaryAudio}
              title={gift.primaryAudio.title}
              author={gift.primaryAudio.recordedBy}
              variant="primary"
            />
          </section>
        )}

        {/* 3. Linha do Tempo dos 12 Meses */}
        <Timeline
          moments={gift.timelineMoments}
          forceMobileCarousel={isMobileSimulator}
        />

        {/* 4. Vozes de Quem Ama (Pais, Avós, Padrinhos) */}
        <ContributorMessages
          messages={gift.contributorMessages}
          forceSingleColumn={isMobileSimulator}
        />

        {/* 5. Galeria de Memórias */}
        <MemoryGallery items={gift.galleryItems} />

        {/* 6. Mensagem Final e Compartilhamento */}
        <ClosingMessage
          headline={gift.closing.headline}
          message={gift.closing.message}
          signature={gift.closing.signature}
        />

        {/* Atalhos de PWA e Cartão Físico com QR Code */}
        <div className="max-w-md mx-auto px-4">
          <PWAInstallPrompt slug={gift.slug} />
        </div>

        {/* 7. Rodapé Discreto da Marca */}
        <BrandFooter />
      </main>
    </div>
  );
}
