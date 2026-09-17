import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      if (mediaUrl && mediaUrl.startsWith('/api/media/events/')) {
        const pathInStorage = mediaUrl.replace('/api/media/', '');
        await adminClient.storage.from('gift-media').remove([pathInStorage]);
      }
    } catch (storageDelErr) {
      console.warn('Erro ao remover arquivo físico do Supabase Storage:', storageDelErr);
    }

    try {
      revalidatePath(`/app/convite/${id}`);
      revalidatePath(`/convite/${id}`);
    } catch {}

    return NextResponse.json({ success: true, message: 'Foto excluída com sucesso' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
