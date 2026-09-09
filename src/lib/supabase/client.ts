import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://jrltijehfgehqjzopgkc.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybHRpamVoZmdlaHFqem9wZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NjYzMTAsImV4cCI6MjEwNDU0MjMxMH0.sYtpBVCtiRaXtDOE-RENSaSaWehqm3bLwuPB9P-EanA';

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseBrowserClient();
