'use client';

import React from 'react';
import Link from 'next/link';
import { GIFT_FORMATS } from '@/data/home-data';
import { formatCurrency } from '@/lib/order-utils';
import { Check, Sparkles, Heart } from 'lucide-react';

export function GiftOptionsSection() {
  return (
    <section id="formatos" className="py-20 bg-[#FFF8F0] border-t border-[#713C48]/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C96E5A]">
            Formatos & Valores Transparentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Escolha como emocionar
          </h2>
          <p className="text-base sm:text-lg text-[#302B2D]/80 leading-relaxed font-normal">
            Todos os formatos incluem a experiência interativa exclusiva com fotos, mensagens, áudios e acesso vitalício.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {GIFT_FORMATS.map((fmt) => {
            const isPopular = fmt.popular;
            return (
              <div
                key={fmt.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  isPopular
                    ? 'bg-[#FFF8F0] border-2 border-[#713C48] shadow-xl scale-[1.02] z-10'
                    : 'bg-white/60 border border-[#713C48]/15 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#713C48] text-[#FFF8F0] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A4A0]" />
                    <span>{fmt.badge || 'Mais Escolhido'}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    {!isPopular && fmt.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C96E5A]/10 text-[#C96E5A] mb-2">
                        {fmt.badge}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl text-[#713C48]">
                      {fmt.title}
                    </h3>
                    <p className="text-xs text-[#302B2D]/75 mt-1 min-h-[32px]">
                      {fmt.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 pb-4 border-b border-[#713C48]/10">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#713C48]">
                        {formatCurrency(fmt.price)}
                      </span>
                      <span className="text-xs text-[#302B2D]/60 ml-1">pagamento único</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 text-sm text-[#302B2D]/85">
                    {fmt.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="text-xs sm:text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6">
                  <Link
                    href={`/pedido?formato=${fmt.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-sm transition-all shadow-sm ${
                      isPopular
                        ? 'bg-[#713C48] text-[#FFF8F0] hover:bg-[#5a2e39] hover:shadow-md'
                        : 'bg-[#FFF8F0] text-[#713C48] border border-[#713C48]/30 hover:bg-[#713C48] hover:text-[#FFF8F0]'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current opacity-80" />
                    <span>Escolher este formato</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
