"use client";

import React, { useState, useMemo } from "react";
import { GiftExperience } from "@/types/gift";
import { GiftOpening } from "@/components/opening/GiftOpening";
import { GiftHero } from "@/components/hero/GiftHero";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { GiftSoundtrackSlot } from "@/components/music/GiftSoundtrackSlot";
import { Timeline } from "@/components/timeline/Timeline";
import { ContributorMessages } from "@/components/contributors/ContributorMessages";
import { MemoryGallery } from "@/components/gallery/MemoryGallery";
import { ClosingMessage } from "@/components/closing/ClosingMessage";
import { DownloadMemoriesSection } from "@/components/download/DownloadMemoriesSection";
import { BrandFooter } from "@/components/brand/BrandFooter";
import { BackgroundKnotArt } from "@/components/brand/BrandSymbol";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { GalleryModal, LightboxPhotoItem } from "@/components/gallery/GalleryModal";
import { getThemeCssVariables } from "@/lib/theme-utils";

interface PresenteClientViewProps {
  gift: GiftExperience;
  initialOpen?: boolean;
  isMobileSimulator?: boolean;
}

export function PresenteClientView({ gift, initialOpen = false, isMobileSimulator = false }: PresenteClientViewProps) {
  const [isGiftOpened, setIsGiftOpened] = useState(initialOpen);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    items: LightboxPhotoItem[];
    currentIndex: number;
  }>({ isOpen: false, items: [], currentIndex: 0 });

  const timelinePhotos: LightboxPhotoItem[] = useMemo(() => {
    return gift.timelineMoments
      .filter((m) => Boolean(m.image?.url && m.image.url.trim() !== ""))
      .map((m) => ({
        id: m.image.id || `timeline-${m.monthNumber}`,
        url: m.image.url,
        title: m.title,
        caption: m.caption || m.image.caption,
        badge: `${m.title}`,
      }));
  }, [gift.timelineMoments]);

  const handleOpenCoverPhoto = () => {
    if (!gift.recipient.featuredImage?.url) return;
    setLightboxState({
      isOpen: true,
      items: [{
        id: "cover-photo",
        url: gift.recipient.featuredImage.url,
        title: gift.recipient.name,
        caption: gift.recipient.subtitle || gift.recipient.introQuote,
        badge: "Foto de Capa",
      }],
      currentIndex: 0,
    });
  };

  const handleOpenTimelinePhoto = (momentIndex: number) => {
    const clickedMoment = gift.timelineMoments[momentIndex];
    if (!clickedMoment?.image?.url) return;
    const targetIdx = timelinePhotos.findIndex((p) => p.url === clickedMoment.image.url);
    setLightboxState({ isOpen: true, items: timelinePhotos, currentIndex: targetIdx >= 0 ? targetIdx : 0 });
  };

  const dynamicStyles = getThemeCssVariables(gift.theme);

  return (
    <div style={dynamicStyles} className="relative min-h-screen selection:bg-brand-rose selection:text-brand-graphite overflow-x-hidden transition-colors duration-500">
      <BackgroundKnotArt className="top-40 -left-20" />
      <BackgroundKnotArt className="top-[900px] -right-24 rotate-180" />
      <BackgroundKnotArt className="top-[1800px] -left-20" />

      <GiftOpening
        isOpen={isGiftOpened}
        onOpen={() => setIsGiftOpened(true)}
        headline={gift.openingText.headline}
        description={gift.openingText.description}
        buttonLabel={gift.openingText.buttonLabel}
        recipientName={gift.recipient.name}
      />

      <main className={`relative z-10 transition-opacity duration-700 ${isGiftOpened ? "opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden={!isGiftOpened}>
        <GiftHero recipient={gift.recipient} onOpenPhoto={handleOpenCoverPhoto} />

        {gift.primaryAudio && (
          <section className="px-4 sm:px-6 max-w-xl mx-auto w-full mb-8">
            <AudioPlayer audio={gift.primaryAudio} title={gift.primaryAudio.title} author={gift.primaryAudio.recordedBy} variant="primary" />
          </section>
        )}

        <GiftSoundtrackSlot gift={gift} />

        <Timeline
          moments={gift.timelineMoments}
          forceMobileCarousel={isMobileSimulator}
          onOpenPhoto={handleOpenTimelinePhoto}
          copy={gift.sectionCopy?.timeline}
        />

        <ContributorMessages
          messages={gift.contributorMessages}
          forceSingleColumn={isMobileSimulator}
          copy={gift.sectionCopy?.messages}
        />

        <MemoryGallery
          items={gift.galleryItems}
          isInsideSimulator={isMobileSimulator}
          copy={gift.sectionCopy?.gallery}
        />

        <ClosingMessage headline={gift.closing.headline} message={gift.closing.message} signature={gift.closing.signature} />
        <DownloadMemoriesSection gift={gift} />

        <div className="max-w-md mx-auto px-4">
          <PWAInstallPrompt slug={gift.slug} />
        </div>
        <BrandFooter />
      </main>

      <GalleryModal
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        onNavigate={(newIdx) => setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))}
        isInsideSimulator={isMobileSimulator}
      />
    </div>
  );
}
