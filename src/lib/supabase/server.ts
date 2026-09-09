import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const DEFAULT_SUPABASE_URL = 'https://jrltijehfgehqjzopgkc.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybHRpamVoZmdlaHFqem9wZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NjYzMTAsImV4cCI6MjEwNDU0MjMxMH0.sYtpBVCtiRaXtDOE-RENSaSaWehqm3bLwuPB9P-EanA';

/**
 * Cria cliente Supabase autenticado no contexto do servidor (App Router)
 * Gerencia automaticamente cookies de sessão do usuário
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Cria cliente administrativo seguro com SERVICE_ROLE_KEY
 * Utilizado EXCLUSIVAMENTE em rotas de backend (Route Handlers / Server Actions)
 * NUNCA importar em Client Components
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
