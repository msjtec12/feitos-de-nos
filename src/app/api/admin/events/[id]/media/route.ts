import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get('id');
    const mediaUrl = searchParams.get('url');

    if (!mediaId && !mediaUrl) {
      return NextResponse.json(
        { error: 'ID ou URL da mídia obrigatório para exclusão' },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseAdminClient();

    let targetEventId = id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUUID) {
      const { data: eventData } = await adminClient
        .from('events')
        .select('id, slug')
        .eq('slug', id)
        .maybeSingle();
      if (eventData) {
        targetEventId = eventData.id;
      }
    }

    let deleteQuery = adminClient.from('event_media').delete().eq('event_id', targetEventId);

    if (mediaId && !mediaId.startsWith('media-')) {
      deleteQuery = deleteQuery.eq('id', mediaId);
    } else if (mediaUrl) {
      deleteQuery = deleteQuery.eq('url', mediaUrl);
    } else {
      return NextResponse.json({ success: true, message: 'Mídia temporária removida apenas da memória' });
    }

    const { error: deleteError } = await deleteQuery;

    if (deleteError) {
      console.error('Erro ao excluir registro de event_media:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    try {
      revalidatePath(`/admin/convites/${id}/editar`);
      const { data: ev } = await adminClient
        .from('events')
        .select('slug')
        .eq('id', targetEventId)
        .maybeSingle();
      if (ev?.slug) {
        revalidatePath(`/convite/${ev.slug}`);
      }
    } catch (e) {
      console.warn('Erro ao revalidar cache após deleção de mídia:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    console.error('Erro no endpoint DELETE de event_media:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
