'use client';

import React from 'react';
import Link from 'next/link';
import { INVITATION_EVENT_TYPES } from '@/data/invitation-event-types';
import {
  Cake,
  Baby,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Heart,
  Gem,
  Crown,
  Award,
  GraduationCap,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Cake,
  Baby,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Heart,
  Gem,
  Crown,
  Award,
  GraduationCap,
  CalendarCheck,
};

export function InvitationEventTypes() {
  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C96E5A] bg-[#C96E5A]/10 px-3.5 py-1 rounded-full">
            Para Todas as Ocasiões
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-4 mb-4">
            Cada celebração tem a sua essência
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Seja o primeiro aninho, o dia do sim ou uma grande conquista de formatura, nossos temas autorais se adaptam com requinte ao seu momento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INVITATION_EVENT_TYPES.map((type) => {
            const Icon = ICON_MAP[type.iconName] || Sparkles;
            return (
              <div
                key={type.id}
                className="bg-[#FAF3EC] rounded-2xl p-6 border border-[#713C48]/10 hover:border-[#713C48]/30 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C96E5A] bg-[#C96E5A]/10 px-2.5 py-0.5 rounded-full">
                      {type.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-[#713C48] font-bold">
                    {type.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#302B2D]/75 leading-relaxed">
                    {type.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#713C48]/10">
                  <Link
                    href={`/pedido/convite?tipo=${type.id}`}
                    className="text-xs font-semibold text-[#713C48] group-hover:text-[#C96E5A] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Criar convite para esta ocasião</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
