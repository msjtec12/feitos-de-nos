import { GiftExperience } from "@/types/gift";
import { matheusAkiraGiftData } from "@/data/matheus-demo";
import { createSupabaseAdminClient, createSupabaseServerClient } from "./server";
import { mapContentToGiftExperience } from "@/lib/gift-mapper";
import { GiftContentData, GiftThemeData } from "@/types/gift-experience";

/**
 * Busca uma experiência de presente completa por slug, id ou token no Supabase.
 */
export async function getGiftBySlug(slug: string): Promise<GiftExperience | null> {
  try {
    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanSlug);

    // 1. Busca na tabela principal gift_pages (por token, id, content->>'slug' ou título)
    let page: any = null;

    try {
      const supabase = createSupabaseServerClient();
      if (isUuid) {
        const { data } = await supabase
          .from('gift_pages')
          .select('*')
          .or(`id.eq.${cleanSlug},public_token.eq.${cleanSlug}`)
          .is('archived_at', null)
          .maybeSingle();
        page = data;
      }

      if (!page) {
        const { data } = await supabase
          .from('gift_pages')
          .select('*')
          .is('archived_at', null)
          .contains('content', { slug: cleanSlug })
          .maybeSingle();
        page = data;
      }

      if (!page) {
        const { data } = await supabase
          .from('gift_pages')
          .select('*')
          .is('archived_at', null)
          .ilike('title', cleanSlug)
          .maybeSingle();
        page = data;
      }
    } catch {
      // fallback
    }

    if (!page) {
      try {
        const adminClient = createSupabaseAdminClient();
        if (isUuid) {
          const { data } = await adminClient
            .from('gift_pages')
            .select('*')
            .or(`id.eq.${cleanSlug},public_token.eq.${cleanSlug}`)
            .is('archived_at', null)
            .maybeSingle();
          page = data;
        }

        if (!page) {
          const { data } = await adminClient
            .from('gift_pages')
            .select('*')
            .is('archived_at', null)
            .contains('content', { slug: cleanSlug })
            .maybeSingle();
          page = data;
        }

        if (!page) {
          const { data } = await adminClient
            .from('gift_pages')
            .select('*')
            .is('archived_at', null)
            .ilike('title', cleanSlug)
            .maybeSingle();
          page = data;
        }
      } catch {
        //
      }
    }

    if (page && page.content) {
      return mapContentToGiftExperience(
        page.content as GiftContentData,
        page.theme as GiftThemeData
      );
    }

    // 2. Busca na tabela legada gifts
    const adminClient = createSupabaseAdminClient();
    const { data: giftRecord, error: giftError } = await adminClient
      .from("gifts")
      .select("*")
      .eq("slug", cleanSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (giftError || !giftRecord) {
      // Fallback gracioso para dados locais de demonstração
      if (cleanSlug === "matheus-akira" || cleanSlug === "demo") {
        return matheusAkiraGiftData;
      }
      return null;
    }

    // 2. Busca os momentos da linha do tempo
    const { data: timelineData } = await adminClient
      .from("timeline_moments")
      .select("*")
      .eq("gift_id", giftRecord.id)
      .order("month_number", { ascending: true });

    // 3. Busca as mensagens de contribuidores
    const { data: contributorsData } = await adminClient
      .from("contributor_messages")
      .select("*")
      .eq("gift_id", giftRecord.id)
      .order("display_order", { ascending: true });

    // 4. Busca os itens da galeria de fotos
    const { data: galleryData } = await adminClient
      .from("gallery_items")
      .select("*")
      .eq("gift_id", giftRecord.id)
      .order("display_order", { ascending: true });

    // Helper para verificar se a mídia é um arquivo real (não placeholder /demo/)
    const isRealMedia = (url?: string | null) => Boolean(url && !url.startsWith("/demo/"));

    // 5. Mapeia para o modelo de domínio GiftExperience
    const giftExperience: GiftExperience = {
      slug: giftRecord.slug,
      openingText: {
        headline: giftRecord.opening_headline || "Uma história foi feita para você.",
        description: giftRecord.opening_description || "Ela reúne momentos, vozes e pessoas que fizeram parte do seu primeiro ano.",
        buttonLabel: giftRecord.opening_button_label || "Abrir meu presente",
      },
      recipient: {
        name: giftRecord.recipient_name,
        subtitle: giftRecord.recipient_subtitle || "Meu primeiro ano",
        tagline: giftRecord.recipient_tagline || "365 dias de amor",
        featuredImage: {
          id: "hero-photo",
          url: giftRecord.hero_image_url || "/demo/images/hero-matheus.jpg",
          altText: giftRecord.hero_image_alt || "Foto de destaque",
          caption: "Foto principal de capa do primeiro ano",
          aspectRatio: "portrait",
          isAvailable: isRealMedia(giftRecord.hero_image_url),
        },
        introQuote: giftRecord.intro_quote,
      },
      primaryAudio: giftRecord.primary_audio_url
        ? {
            id: "primary-voice",
            title: giftRecord.primary_audio_title || "Mensagem dos pais",
            audioUrl: giftRecord.primary_audio_url,
            recordedBy: giftRecord.primary_audio_recorded_by || "Papai e Mamãe",
            durationSeconds: giftRecord.primary_audio_duration_seconds || 98,
            isAvailable: isRealMedia(giftRecord.primary_audio_url),
          }
        : undefined,
      timelineMoments: (timelineData && timelineData.length > 0)
        ? timelineData.map((m: any) => ({
            monthNumber: m.month_number,
            title: m.title,
            subtitle: m.subtitle || `Mês ${m.month_number}`,
            caption: m.caption,
            image: {
              id: `month-${m.month_number}`,
              url: m.image_url || `/demo/images/month-${String(m.month_number).padStart(2, "0")}.jpg`,
              altText: m.image_alt || `Registro do ${m.title}`,
              caption: m.caption,
              aspectRatio: "square",
              isAvailable: isRealMedia(m.image_url),
            },
          }))
        : matheusAkiraGiftData.timelineMoments,
      contributorMessages: (contributorsData && contributorsData.length > 0)
        ? contributorsData.map((c: any) => ({
            id: c.id,
            authorName: c.author_name,
            relation: c.relation,
            avatarImage: c.avatar_url
              ? {
                  id: `avatar-${c.id}`,
                  url: c.avatar_url,
                  altText: `Foto de ${c.author_name}`,
                  isAvailable: isRealMedia(c.avatar_url),
                }
              : undefined,
            writtenMessage: c.written_message,
            audio: c.audio_url
              ? {
                  id: `audio-${c.id}`,
                  title: c.audio_title || `Mensagem de ${c.author_name}`,
                  audioUrl: c.audio_url,
                  durationSeconds: c.audio_duration_seconds || 60,
                  isAvailable: isRealMedia(c.audio_url),
                }
              : undefined,
          }))
        : matheusAkiraGiftData.contributorMessages,
      galleryItems: (galleryData && galleryData.length > 0)
        ? galleryData.map((g: any, index: number) => ({
            id: g.id || `gal-${index + 1}`,
            url: g.image_url || `/demo/images/gallery-${String(index + 1).padStart(2, "0")}.jpg`,
            altText: g.alt_text || "Memória do 1º ano",
            caption: g.caption || undefined,
            aspectRatio: (g.aspect_ratio as "square" | "portrait" | "landscape") || "square",
            isAvailable: isRealMedia(g.image_url),
          }))
        : matheusAkiraGiftData.galleryItems,
      closing: {
        headline: giftRecord.closing_headline || "Esta é apenas a primeira parte da sua história.",
        message: giftRecord.closing_message || "Que você cresça cercado pelas vozes, lembranças e pessoas que fizeram do seu primeiro ano um tempo inesquecível.",
        signature: giftRecord.closing_signature || "Com todo o nosso amor.",
      },
      brand: {
        brandName: "Feito de Nós",
        slogan: "Histórias que viram presente.",
        logoUrl: "/brand/logo-feito-de-nos.png",
        symbolUrl: "/brand/simbolo-feito-de-nos.png",
      },
    };

    return giftExperience;
  } catch (err) {
    console.error("Erro ao buscar dados do Supabase:", err);
    if (slug === "matheus-akira") {
      return matheusAkiraGiftData;
    }
    return null;
  }
}
