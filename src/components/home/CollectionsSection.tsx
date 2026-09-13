'use client';

import React from 'react';
import Link from 'next/link';
import { OCCASIONS } from '@/data/home-data';
import { Baby, Heart, Users, Sparkles, ArrowRight, Gift, Award, Cross, TreePine } from 'lucide-react';

const COLLECTION_ICONS: Record<string, React.ElementType> = {
  'primeiro-ano': Baby,
  'amor-casal': Heart,
  'dia-das-maes': Heart,
  'dia-dos-pais': Users,
  aniversario: Gift,
  'casamento-bodas': Heart,
  formatura: Award,
  amizade: Users,
  religioso: Cross,
  'cha-de-bebe': Baby,
  natal: TreePine,
  memorial: Heart,
};

export function CollectionsSection() {
  const orderedCollections = [...OCCASIONS].sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)));

  return (
    <section id="colecoes" className="py-20 bg-white/40 border-t border-[#713C48]/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C96E5A]">
            Uma experiência diferente para cada história
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Encontre o tema do seu presente
          </h2>
          <p className="text-base sm:text-lg text-[#302B2D]/80 leading-relaxed">
            Cada coleção possui linguagem, estrutura, paleta e sugestões próprias. Você começa com um tema pensado para a ocasião e personaliza os detalhes para a pessoa que vai receber.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orderedCollections.map((col) => {
            const Icon = COLLECTION_ICONS[col.id] || Sparkles;
            return (
              <article
                key={col.id}
                className="bg-[#FFF8F0] rounded-3xl p-6 border border-[#713C48]/15 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D9A4A0]/15 rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center group-hover:bg-[#713C48] group-hover:text-[#FFF8F0] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    {col.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C96E5A]/12 text-[#A8503E] border border-[#C96E5A]/15">
                        {col.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C96E5A]">
                      {col.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl text-[#713C48] mt-1">{col.title}</h3>
                  </div>

                  <p className="text-sm text-[#302B2D]/78 leading-relaxed">{col.description}</p>

                  {col.structureHighlights && (
                    <div className="flex flex-wrap gap-1.5">
                      {col.structureHighlights.map((item) => (
                        <span key={item} className="px-2 py-1 rounded-full bg-white/75 border border-[#713C48]/10 text-[10px] text-[#713C48]/80 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-[#713C48]/10 relative z-10">
                  <Link
                    href={`/pedido?colecao=${col.id}${col.recommendedFormat ? `&formato=${col.recommendedFormat}` : ''}`}
                    className="inline-flex items-center justify-between w-full text-sm font-semibold text-[#713C48] group-hover:text-[#5a2e39] py-1"
                  >
                    <span>Criar presente neste tema</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-center text-xs text-[#302B2D]/55 mt-8 max-w-2xl mx-auto">
          Não encontrou exatamente a ocasião? Escolha a coleção mais próxima da história. Textos, cores e seções podem ser personalizados durante a criação.
        </p>
      </div>
    </section>
  );
}
