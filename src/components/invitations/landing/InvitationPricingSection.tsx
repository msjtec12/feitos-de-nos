'use client';

import React from 'react';
import Link from 'next/link';
import { INVITATION_PLANS_LIST, formatCentsToReais } from '@/data/invitation-plans';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function InvitationPricingSection() {
  return (
    <section id="planos" className="py-16 md:py-24 bg-[#FAF3EC] border-y border-[#713C48]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C96E5A] bg-[#C96E5A]/10 px-3.5 py-1 rounded-full">
            Planos Transparentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-4 mb-4">
            Escolha a experiência ideal para seu evento
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Sem mensalidades recorrentes ou taxas surpresas. Pague uma única vez e tenha um convite impecável para a sua festa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {INVITATION_PLANS_LIST.map((plan) => {
            const isFeatured = plan.badge === 'Mais escolhido';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-[#FFF8F0] border-2 border-[#C96E5A] shadow-xl scale-[1.02] z-10'
                    : 'bg-[#FFF8F0] border border-[#713C48]/15 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[11px] uppercase tracking-wider font-extrabold px-3.5 py-1 rounded-full shadow-sm ${
                        isFeatured
                          ? 'bg-[#C96E5A] text-[#FFF8F0]'
                          : 'bg-[#713C48]/15 text-[#713C48]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-center pb-6 border-b border-[#713C48]/10">
                    <h3 className="font-serif text-2xl text-[#713C48] font-bold">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#302B2D]/70 mt-1 min-h-[32px] flex items-center justify-center">
                      {plan.tagline}
                    </p>

                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-sm font-medium text-[#302B2D]/60">R$</span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#713C48] tracking-tight">
                        {formatCentsToReais(plan.priceCents).replace('R$', '').trim()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#302B2D]/60 mt-1">
                      Pagamento único via Pix ou cartão
                    </p>

                    <div className="mt-3 inline-block bg-[#713C48]/5 text-[#713C48] text-xs font-semibold px-3 py-1 rounded-full">
                      Ativo por {plan.retentionDays} dias
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="py-6 space-y-3">
                    <p className="text-xs uppercase tracking-wider font-bold text-[#713C48]/80 mb-3">
                      O que está incluído:
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-[#302B2D]/85">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#C96E5A] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#713C48]/10">
                  <Link
                    href={`/pedido/convite?plano=${plan.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all shadow-sm ${
                      isFeatured
                        ? 'bg-[#C96E5A] text-[#FFF8F0] hover:bg-[#b05845] hover:shadow-md hover:scale-[1.02]'
                        : 'bg-[#713C48] text-[#FFF8F0] hover:bg-[#5a2e39] hover:shadow-md'
                    }`}
                  >
                    <span>Escolher Este Plano</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-[11px] text-center text-[#302B2D]/60 mt-2.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Revisão com nossa equipe antes da entrega</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
