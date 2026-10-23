import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isLoginPage = pathname === '/admin/login';
  const isPartnerPage = pathname.startsWith('/parceiros/painel');
  const isPartnerApi = pathname.startsWith('/api/partners');

  if ((!isAdminPage && !isAdminApi && !isPartnerPage && !isPartnerApi) || isLoginPage) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isAdminApi || isPartnerApi) {
      return NextResponse.json(
        { error: 'Configuração do Supabase indisponível' },
        { status: 503 }
      );
    }

    return NextResponse.redirect(new URL(isPartnerPage ? '/parceiros/acesso' : '/admin/login', request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isAdminApi || isPartnerApi) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const loginUrl = new URL(isPartnerPage ? '/parceiros/acesso' : '/admin/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPartnerPage || isPartnerApi) return response;

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('id')
    .eq('id', user.id)
    .eq('active', true)
    .maybeSingle();

  if (!profile) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Acesso administrativo negado' }, { status: 403 });
    }

    return NextResponse.redirect(new URL('/admin/login?error=forbidden', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/parceiros/painel/:path*', '/api/partners/:path*'],
};
