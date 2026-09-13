import { NextRequest, NextResponse } from 'next/server';
import {
  saveGiftPage,
  regenerateGiftPageToken,
  archiveGiftPage,
  getAdminSessionAndProfile,
} from '@/lib/supabase/admin-queries';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // O nome exibido no conteúdo é a fonte de verdade do presenteado.
    // Mantemos gift_pages.recipient_name sincronizado para a lista administrativa,
    // QR Code, simulador e demais telas que usam a coluna diretamente.
    const contentRecipientName = body?.content?.recipient?.name;
    if (typeof contentRecipientName === 'string' && contentRecipientName.trim()) {
      body.recipient_name = contentRecipientName.trim();
    } else if (typeof body.recipient_name === 'string') {
      body.recipient_name = body.recipient_name.trim();
    }

    const result = await saveGiftPage(id, body, user?.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      recipientName: body.recipient_name || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao salvar página' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();

    if (body.action === 'regenerate_token') {
      const result = await regenerateGiftPageToken(id, user?.id);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, newToken: result.newToken });
    }

    if (body.action === 'archive') {
      const result = await archiveGiftPage(id, user?.id);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Ação desconhecida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao executar ação na página' },
      { status: 500 }
    );
  }
}
