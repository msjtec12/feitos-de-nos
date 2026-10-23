"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { api, brPhone, errorText } from "./client";
export function PartnerAccess({ signup = false }: { signup?: boolean }) {
  const [mode, setMode] = useState(signup),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const form = new FormData(e.currentTarget),
      email = String(form.get("email")),
      password = String(form.get("password"));
    try {
      if (mode) {
        const store_name = String(form.get("store_name")).trim(),
          phone = brPhone(String(form.get("phone")));
        if (!/^55\d{10,11}$/.test(phone))
          throw new Error("Informe um WhatsApp brasileiro com DDD.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { partner_store_name: store_name, partner_phone: phone },
            emailRedirectTo: `${location.origin}/auth/partner-callback`,
          },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage(
            "Confira seu e-mail para confirmar o cadastro. Depois, entre com sua senha para concluir a solicitação da loja.",
          );
          return;
        }
        await api("/api/partners/register", { store_name, phone });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error)
          throw new Error(
            "Não foi possível entrar. Confira e-mail, senha e a confirmação do cadastro.",
          );
        const store_name = data.user?.user_metadata.partner_store_name,
          phone = data.user?.user_metadata.partner_phone;
        if (store_name && phone)
          await api("/api/partners/register", { store_name, phone });
      }
      location.assign("/parceiros/painel");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="max-w-lg mx-auto">
      <p className="partner-kicker">Sua loja, mais possibilidades</p>
      <h1 className="partner-title">
        {mode ? "Vamos começar?" : "Bem-vindo de volta."}
      </h1>
      <p className="partner-subtitle">
        {mode
          ? "Solicite sua participação no piloto. Após a aprovação, você poderá carregar saldo e criar pedidos."
          : "Entre para acompanhar seus pedidos, seu saldo e seus clientes."}
      </p>
      <form onSubmit={submit} className="partner-card partner-fields mt-8">
        {mode ? (
          <>
            <label className="partner-field">
              Nome da loja
              <input
                name="store_name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="organization"
              />
            </label>
            <label className="partner-field">
              WhatsApp da loja com DDD
              <input
                name="phone"
                type="tel"
                required
                maxLength={20}
                placeholder="(11) 99999-9999"
                autoComplete="tel"
              />
            </label>
          </>
        ) : null}
        <label className="partner-field">
          E-mail
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="partner-field">
          Senha{mode ? " (mínimo 8 caracteres)" : ""}
          <input
            name="password"
            type="password"
            minLength={mode ? 8 : undefined}
            required
            autoComplete={mode ? "new-password" : "current-password"}
          />
        </label>
        {mode ? (
          <label className="flex gap-3 text-xs leading-6">
            <input type="checkbox" required />
            <span>
              Li as{" "}
              <Link
                className="partner-link"
                href="/parceiros/condicoes"
                target="_blank"
              >
                condições do piloto
              </Link>{" "}
              e a{" "}
              <Link
                className="partner-link"
                href="/privacidade"
                target="_blank"
              >
                política de privacidade
              </Link>
              .
            </span>
          </label>
        ) : null}
        {error ? (
          <p className="partner-notice error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="partner-notice" role="status">
            {message}
          </p>
        ) : null}
        <button disabled={busy} className="partner-btn">
          {busy ? "Aguarde…" : mode ? "Solicitar cadastro" : "Entrar"}
        </button>
        {!mode ? <button type="button" disabled={busy} className="partner-link text-sm" onClick={async e=>{
          const emailInput=e.currentTarget.form?.elements.namedItem('email') as HTMLInputElement;
          if(!emailInput.reportValidity())return;
          setBusy(true);setError('');setMessage('');
          try{const {error}=await supabase.auth.resetPasswordForEmail(emailInput.value,{redirectTo:`${location.origin}/auth/partner-callback?recuperar=1`});if(error)throw error;setMessage('Se houver uma conta para este e-mail, você receberá o link para redefinir sua senha.');}catch(e){setError(errorText(e));}finally{setBusy(false);}
        }}>Esqueci minha senha</button>:null}
        <button
          type="button"
          className="partner-link text-sm"
          onClick={() => {
            setMode(!mode);
            setError("");
            setMessage("");
          }}
        >
          {mode ? "Já tenho cadastro" : "Quero cadastrar minha loja"}
        </button>
      </form>
    </div>
  );
}
