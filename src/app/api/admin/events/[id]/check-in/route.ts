import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { MATHEUS_INVITATION_DEMO, MATHEUS_DEMO_GUESTS } from '@/data/matheus-invitation-demo';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { token, guestId, action = 'check_in' } = body;

    if (!token && !guestId) {
      return NextResponse.json({ error: 'Token ou guestId obrigatório' }, { status: 400 });
    }

    // Demo event support
    if (id === MATHEUS_INVITATION_DEMO.id) {
      const demoGuest = MATHEUS_DEMO_GUESTS.find(
        (g) => g.id === guestId || g.token.toLowerCase() === (token || '').toLowerCase()
      );
      if (demoGuest) {
        demoGuest.checked_in_at = action === 'undo' ? null : new Date().toISOString();
        return NextResponse.json({
          success: true,
          guest: demoGuest,
          message: action === 'undo' ? 'Check-in desfeito' : 'Check-in confirmado com sucesso!',
        });
      }
      return NextResponse.json({ error: 'Convidado não encontrado na lista demo' }, { status: 404 });
    }

    const adminClient = createSupabaseAdminClient();

    let query = adminClient
      .from('event_guests')
      .select('*')
      .eq('event_id', id);

    if (guestId) {
      query = query.eq('id', guestId);
    } else if (token) {
      query = query.eq('token', token.trim());
    }

    const { data: guest, error: findError } = await query.maybeSingle();

    if (findError || !guest) {
      return NextResponse.json({ error: 'Convidado não encontrado para este evento' }, { status: 404 });
    }

    const checkedInAt = action === 'undo' ? null : new Date().toISOString();

    const { data: updatedGuest, error: updateError } = await adminClient
      .from('event_guests')
      .update({
        checked_in_at: checkedInAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guest.id)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      guest: updatedGuest,
      message: action === 'undo' ? 'Check-in desfeito' : 'Check-in confirmado!',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
