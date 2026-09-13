import { NextRequest, NextResponse } from 'next/server';
import {
  createGiftPageFromOrder,
  getAdminSessionAndProfile,
  saveGiftPage,
} from '@/lib/supabase/admin-queries';
import { GiftContentData, GiftThemeData } from '@/types/gift-experience';
import {
  applyThemePresetToContent,
  getGiftThemePreset,
  themeFromPreset,
} from '@/data/theme-presets';
import { STYLE_OPTIONS } from '@/data/home-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;
    const result = await createGiftPageFromOrder(id, user?.id);

    if (!result.success || !result.giftPage) {
      return NextResponse.json({ error: result.error || 'Erro ao criar página' }, { status: 400 });
    }

    const preset = getGiftThemePreset(result.giftPage.template_type);
    if (!preset) {
      return NextResponse.json({ success: true, giftPage: result.giftPage });
    }

    const originalContent = result.giftPage.content as unknown as GiftContentData;
    const originalTheme = result.giftPage.theme as unknown as GiftThemeData;
    const themedContent = applyThemePresetToContent(originalContent, preset);

    // Mantém o título e eventuais palavras escritas pelo cliente no pedido.
    // O preset completa a experiência sem apagar personalizações já fornecidas.
    if (originalContent.openingText?.headline?.trim()) {
      themedContent.openingText.headline = originalContent.openingText.headline;
    }

    const customDescription = originalContent.openingText?.description?.trim();
    if (customDescription && customDescription !== 'Histórias que viram presente.') {
      themedContent.openingText.description = customDescription;
    }

    const customIntro = originalContent.recipient?.introQuote?.trim();
    if (customIntro && customIntro !== 'Histórias que viram presente.') {
      themedContent.recipient.introQuote = customIntro;
    }

    // A ocasião controla linguagem/estrutura; a escolha visual feita pelo cliente prevalece.
    const selectedStyle = STYLE_OPTIONS.find((style) => style.id === originalTheme?.styleId);
    const themedVisual: Partial<GiftThemeData> = selectedStyle
      ? {
          ...themeFromPreset(preset),
          styleId: selectedStyle.id,
          primaryColor: selectedStyle.primaryColor,
          secondaryColor: selectedStyle.secondaryColor,
          accentColor: selectedStyle.accentColor,
          backgroundColor: selectedStyle.backgroundColor,
          surfaceColor: selectedStyle.surfaceColor,
          textColor: selectedStyle.textColor,
          mutedColor: selectedStyle.mutedColor,
          borderColor: selectedStyle.borderColor,
        }
      : themeFromPreset(preset);

    const saveResult = await saveGiftPage(
      result.giftPage.id,
      {
        content: themedContent,
        theme: themedVisual,
        template_type: preset.id,
      },
      user?.id
    );

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || 'Página criada, mas não foi possível aplicar o tema selecionado.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      giftPage: {
        ...result.giftPage,
        template_type: preset.id,
        content: themedContent,
        theme: themedVisual,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro interno ao criar página de presente' },
      { status: 500 }
    );
  }
}
