'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS } from '@/data/home-data';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="duvidas" className="py-20 bg-[#FFF8F0] border-t border-[#713C48]/10 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C96E5A]">
            Tire Suas Dúvidas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48]">
            Perguntas Frequentes
          </h2>
          <p className="text-base text-[#302B2D]/80 leading-relaxed font-normal">
            Estamos prontos para ajudar você em cada detalhe. Se tiver qualquer outra dúvida, chame a gente no WhatsApp.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/70 border border-[#713C48]/15 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48]"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg text-[#713C48] font-medium">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#713C48]/10 text-[#713C48] flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#713C48] text-[#FFF8F0]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#302B2D]/80 leading-relaxed border-t border-[#713C48]/10">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
