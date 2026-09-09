import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';

export async function GET(request: NextRequest) {
  try {
    const { user, profile } = await getAdminSessionAndProfile();
    if (!user || !profile) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email },
      profile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
