'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Sparkles, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';

export default function AppConviteIndexPage() {
  const router = useRouter();
  const [eventSlug, setEventSlug] = useState('');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventSlug.trim()) return;
    const clean = eventSlug.trim().replace(/^.*\/convite\//, '').replace(/^\//, '');
    router.push(`/app/convite/${clean}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4 selection:bg-[#D9A4A0]/40 text-[#302B2D]">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#713C48]/15 shadow-xl space-y-6 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1">
          <BrandLogo size="md" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C96E5A] mt-1">
            App do Anfitrião
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-[#713C48]">
            Gerenciar Meu Convite
          </h1>
          <p className="text-xs text-[#302B2D]/70 leading-relaxed">
            Edite fotos, acompanhe confirmações de presença e faça o check-in na portaria da sua festa.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAccess} className="space-y-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link ou Código do Convite
            </label>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#713C48] focus-within:bg-white transition-all">
              <span className="text-xs text-slate-400 font-mono select-none">/convite/</span>
              <input
                type="text"
                value={eventSlug}
                onChange={(e) => setEventSlug(e.target.value)}
                placeholder="matheus-akira-1-ano"
                className="w-full bg-transparent text-xs sm:text-sm font-mono outline-none text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!eventSlug.trim()}
            className="w-full py-3 rounded-2xl bg-[#713C48] hover:bg-[#5a2e39] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>Acessar Painel do Convite</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Shortcut */}
        <div className="pt-2 border-t border-slate-100">
          <Link
            href="/app/convite/matheus-akira-1-ano"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 text-xs font-semibold transition-colors border border-purple-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Acessar Demonstração (Matheus Akira)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
