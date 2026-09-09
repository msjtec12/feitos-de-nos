'use client';

import React from 'react';
import Link from 'next/link';
import { OCCASIONS } from '@/data/home-data';
import { Baby, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';

const COLLECTION_ICONS: Record<string, React.ElementType> = {
  'primeiro-ano': Baby,
  'nossa-historia': Heart,
  vozes: Users,
  especial: Sparkles,
};

export function CollectionsSection() {
  return (
    <section id="colecoes" className="py-20 bg-white/40 border-t border-[#713C48]/10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C96E5A]">
            Para Cada Momento Marcante
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Coleções Feito de Nós
          </h2>
          <p className="text-base sm:text-lg text-[#302B2D]/80 leading-relaxed font-normal">
            Formatos personalizados com design exclusivo, pensados para eternizar emoções de forma única e inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OCCASIONS.map((col) => {
            const Icon = COLLECTION_ICONS[col.id] || Sparkles;
            return (
              <div
                key={col.id}
                className="bg-[#FFF8F0] rounded-3xl p-8 border border-[#713C48]/15 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D9A4A0]/15 rounded-full blur-2xl group-hover:scale-125 transition-transform -z-0" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center group-hover:bg-[#713C48] group-hover:text-[#FFF8F0] transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    {col.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C96E5A]/15 text-[#C96E5A]">
                        {col.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C96E5A]">
                      {col.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl text-[#713C48] mt-1">
                      {col.title}
                    </h3>
                  </div>

                  <p className="text-sm text-[#302B2D]/80 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#713C48]/10 relative z-10">
                  <Link
                    href={`/pedido?colecao=${col.id}`}
                    className="inline-flex items-center justify-between w-full text-sm font-semibold text-[#713C48] group-hover:text-[#5a2e39] py-2"
                  >
                    <span>Configurar esta coleção</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
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
