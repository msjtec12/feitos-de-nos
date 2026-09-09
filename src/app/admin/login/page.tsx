'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { supabase } from '@/lib/supabase/client';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setErrorMsg('E-mail ou senha incorretos.');
        setIsLoading(false);
        return;
      }

      // Valida perfil administrativo
      const { data: profile, error: profileErr } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', data.user.id)
        .eq('active', true)
        .maybeSingle();

      if (profile) {
        router.push('/admin');
        router.refresh();
        return;
      }

      // Fallback: verificação via endpoint do servidor
      const checkRes = await fetch('/api/admin/check-session');
      if (checkRes.ok) {
        router.push('/admin');
        router.refresh();
        return;
      }

      // Se não for admin ativo
      await supabase.auth.signOut();
      setErrorMsg('Acesso restrito. Este usuário não possui perfil de administrador ativo.');
      setIsLoading(false);
    } catch (err) {
      console.error('Erro no login:', err);
      setErrorMsg('Erro de conexão ao tentar autenticar. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#D9A4A0]/40">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#713C48]/10 text-[#713C48] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C96E5A]" />
          <span>Acesso Administrativo Interno</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/90 border border-[#713C48]/20 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#713C48] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C96E5A]" />
                <span>E-mail do Administrador</span>
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@feitodenos.com.br"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] placeholder-[#302B2D]/40 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#713C48] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C96E5A]" />
                <span>Senha de Acesso</span>
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF8F0] border border-[#713C48]/20 text-xs sm:text-sm text-[#302B2D] placeholder-[#302B2D]/40 focus:outline-none focus:ring-2 focus:ring-[#713C48]"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#713C48] text-[#FFF8F0] font-semibold text-sm hover:bg-[#5a2e39] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando no painel...</span>
                </>
              ) : (
                <>
                  <span>Acessar Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] text-[#302B2D]/60">
              Sistema interno exclusivo da marca Feito de Nós.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
