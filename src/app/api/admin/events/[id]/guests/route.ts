import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { MATHEUS_INVITATION_DEMO, MATHEUS_DEMO_GUESTS } from '@/data/matheus-invitation-demo';

function generateGuestToken(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Demo event support
    if (id === MATHEUS_INVITATION_DEMO.id) {
      return NextResponse.json({
        guests: MATHEUS_DEMO_GUESTS,
        stats: {
          total: MATHEUS_DEMO_GUESTS.length,
          confirmed: MATHEUS_DEMO_GUESTS.filter((g) => g.attendance_status === 'confirmed').length,
          declined: MATHEUS_DEMO_GUESTS.filter((g) => g.attendance_status === 'declined').length,
          pending: MATHEUS_DEMO_GUESTS.filter((g) => g.attendance_status === 'pending').length,
          companions: MATHEUS_DEMO_GUESTS.reduce((sum, g) => sum + g.companions_count, 0),
        },
      });
    }

    const adminClient = createSupabaseAdminClient();
    const { data: guests, error } = await adminClient
      .from('event_guests')
      .select('*')
      .eq('event_id', id)
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = guests || [];
    const stats = {
      total: list.length,
      confirmed: list.filter((g) => g.attendance_status === 'confirmed').length,
      declined: list.filter((g) => g.attendance_status === 'declined').length,
      pending: list.filter((g) => g.attendance_status === 'pending').length,
      companions: list
        .filter((g) => g.attendance_status === 'confirmed')
        .reduce((sum, g) => sum + (g.companions_count || 0), 0),
    };

    return NextResponse.json({ guests: list, stats });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

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
    const {
      name,
      phone,
      max_companions = 2,
      note,
      attendance_status = 'pending',
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nome do convidado é obrigatório' }, { status: 400 });
    }

    const token = generateGuestToken();
    const adminClient = createSupabaseAdminClient();

    const { data: newGuest, error } = await adminClient
      .from('event_guests')
      .insert({
        event_id: id,
        name: name.trim(),
        token,
        phone: phone || null,
        max_companions: Number(max_companions),
        attendance_status,
        companions_count: 0,
        note: note || null,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ guest: newGuest }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { guestId, ...updates } = body;

    if (!guestId) {
      return NextResponse.json({ error: 'guestId obrigatório' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const { data: updatedGuest, error } = await adminClient
      .from('event_guests')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guestId)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ guest: updatedGuest });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await getAdminSessionAndProfile();
    if (!profile) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
      return NextResponse.json({ error: 'guestId obrigatório' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const { error } = await adminClient
      .from('event_guests')
      .delete()
      .eq('id', guestId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
