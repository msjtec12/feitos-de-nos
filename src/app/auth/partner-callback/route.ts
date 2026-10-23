import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function GET(req: Request) {
  const url = new URL(req.url),
    code = url.searchParams.get("code");
  if (code) {
    const { error } =
      await createSupabaseServerClient().auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(url.searchParams.get('recuperar')==='1'?'/parceiros/redefinir':"/parceiros/acesso?confirmado=1", url),
      );
  }
  return NextResponse.redirect(
    new URL("/parceiros/acesso?erro=confirmacao", url),
  );
}
