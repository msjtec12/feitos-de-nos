import { NextRequest, NextResponse } from 'next/server';
import {
  regenerateGiftPageToken,
  archiveGiftPage,
  getAdminSessionAndProfile,
  logActivity,
} from '@/lib/supabase/admin-queries';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

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

    // O nome dentro do conteúdo é a fonte de verdade da experiência.
    // Isso corrige páginas antigas em que gift_pages.recipient_name ficou
    // diferente do nome exibido no cartão/presente.
    const contentRecipientName = body?.content?.recipient?.name;
    const normalizedRecipientName =
      typeof contentRecipientName === 'string' && contentRecipientName.trim()
        ? contentRecipientName.trim()
        : typeof body.recipient_name === 'string' && body.recipient_name.trim()
          ? body.recipient_name.trim()
          : undefined;

    // Nunca repassamos o body inteiro para o banco. Além de evitar campos
    // inesperados, isso mantém compatibilidade com páginas criadas antes
    // das versões atuais do editor.
    const updates: Record<string, unknown> = {
      updated_by: user?.id || null,
      updated_at: new Date().toISOString(),
    };

    if (typeof body.title === 'string') updates.title = body.title.trim();
    if (normalizedRecipientName) updates.recipient_name = normalizedRecipientName;
    if (typeof body.template_type === 'string') updates.template_type = body.template_type;
    if (typeof body.status === 'string') updates.status = body.status;
    if ('reveal_at' in body) updates.reveal_at = body.reveal_at || null;
    if (body.content && typeof body.content === 'object') updates.content = body.content;
    if (body.theme && typeof body.theme === 'object') updates.theme = body.theme;

    if (body.status === 'published') {
      updates.published_at = new Date().toISOString();
    }

    // A rota já validou a sessão e o perfil administrativo acima. Usamos o
    // cliente server-side privilegiado para a gravação final e exigimos o
    // retorno da linha atualizada. Assim, o editor não pode mais exibir
    // "salvo" quando um UPDATE afetou zero linhas por RLS/sessão.
    const adminClient = createSupabaseAdminClient();
    const { data: savedPage, error } = await adminClient
      .from('gift_pages')
      .update(updates)
      .eq('id', id)
      .select('id, title, recipient_name, status, reveal_at, content, theme, updated_at')
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: `Não foi possível salvar a experiência: ${error.message}` },
        { status: 400 }
      );
    }

    if (!savedPage) {
      return NextResponse.json(
        { error: 'A experiência não foi encontrada ou nenhuma linha foi atualizada. Recarregue a página e tente novamente.' },
        { status: 404 }
      );
    }

    await logActivity(user?.id || null, 'gift_page_updated', 'gift_page', id, {
      status: savedPage.status,
      title: savedPage.title,
      source: 'experience_editor_verified_save',
    });

    return NextResponse.json({
      success: true,
      recipientName: savedPage.recipient_name || null,
      giftPage: savedPage,
    });
  } catch (err: any) {
    console.error('Erro ao salvar página de presente:', err);
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
