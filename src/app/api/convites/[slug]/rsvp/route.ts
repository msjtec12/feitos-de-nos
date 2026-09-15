import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { MATHEUS_DEMO_SLUG } from '@/data/matheus-invitation-demo';
import { z } from 'zod';

const rsvpSchema = z.object({
  token: z.string().nullable().optional(),
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  phone: z.string().trim().max(30).nullable().optional(),
  attendance: z.enum(['confirmed', 'declined']),
  companionsCount: z.number().int().min(0).max(10).default(0),
  dietaryRestrictions: z.string().trim().max(200).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
});

function generateGuestToken(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const normalizedSlug = slug.trim().toLowerCase();

    const body = await req.json();
    const parseResult = rsvpSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => e.message).join(', ');
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const data = parseResult.data;

    // Se for o slug de demonstração oficial, aceita com sucesso imediato
    if (normalizedSlug === MATHEUS_DEMO_SLUG) {
      return NextResponse.json({
        success: true,
        isDemo: true,
        message: 'Confirmação registrada com sucesso (modo demonstração)!',
      });
    }

    const adminClient = createSupabaseAdminClient();

    // 1. Busca o evento
    const { data: event, error: eventError } = await adminClient
      .from('events')
      .select('id, rsvp_deadline')
      .eq('slug', normalizedSlug)
      .is('archived_at', null)
      .maybeSingle();

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: 'Evento não encontrado.' },
        { status: 404 }
      );
    }

    // Checa prazo limite
    if (event.rsvp_deadline) {
      const deadline = new Date(event.rsvp_deadline).getTime();
      if (Date.now() > deadline) {
        return NextResponse.json(
          { success: false, error: 'O prazo para confirmação de presença já encerrou.' },
          { status: 400 }
        );
      }
    }

    // 2. Se houver token de convidado pré-cadastrado
    if (data.token) {
      const { data: existingGuest, error: guestError } = await adminClient
        .from('event_guests')
        .select('*')
        .eq('event_id', event.id)
        .eq('token', data.token)
        .maybeSingle();

      if (!guestError && existingGuest) {
        // Atualiza convidado existente
        const { error: updateError } = await adminClient
          .from('event_guests')
          .update({
            attendance_status: data.attendance,
            companions_count: data.attendance === 'confirmed' ? data.companionsCount : 0,
            dietary_restrictions: data.dietaryRestrictions || null,
            note: data.note || null,
            phone: data.phone || existingGuest.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingGuest.id);

        if (updateError) {
          console.error('Error updating guest RSVP:', updateError);
          return NextResponse.json(
            { success: false, error: 'Falha ao atualizar confirmação.' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, guestId: existingGuest.id });
      }
    }

    // 3. Convidado novo (RSVP público sem token prévio)
    const token = generateGuestToken();
    const { data: newGuest, error: insertError } = await adminClient
      .from('event_guests')
      .insert({
        event_id: event.id,
        name: data.name,
        token,
        phone: data.phone || null,
        max_companions: 5,
        attendance_status: data.attendance,
        companions_count: data.attendance === 'confirmed' ? data.companionsCount : 0,
        dietary_restrictions: data.dietaryRestrictions || null,
        note: data.note || null,
      })
      .select('id, token')
      .single();

    if (insertError || !newGuest) {
      console.error('Error creating guest RSVP:', insertError);
      return NextResponse.json(
        { success: false, error: 'Falha ao registrar presença.' },
        { status: 500 }
      );
    }

    // Se deixou mensagem de carinho, também registra no mural de recados
    if (data.note) {
      await adminClient.from('event_guestbook_messages').insert({
        event_id: event.id,
        guest_name: data.name,
        message: data.note,
        moderation_status: 'approved',
      });
    }

    return NextResponse.json({
      success: true,
      guestId: newGuest.id,
      token: newGuest.token,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno do servidor';
    console.error('Error in RSVP route:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
