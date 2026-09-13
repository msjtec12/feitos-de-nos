"use client";

import React from "react";
import { Mic } from "lucide-react";
import { ContributorMessage } from "@/types/gift";
import { SectionCopyBlock } from "@/types/theme";
import { ContributorCard } from "./ContributorCard";

interface ContributorMessagesProps {
  messages: ContributorMessage[];
  forceSingleColumn?: boolean;
  copy?: SectionCopyBlock;
}

const DEFAULT_COPY: SectionCopyBlock = {
  eyebrow: 'Mensagens Especiais',
  title: 'Palavras de quem faz parte desta história',
  description: 'Mensagens, lembranças e vozes de pessoas especiais reunidas em um só lugar.',
};

export function ContributorMessages({ messages, forceSingleColumn = false, copy = DEFAULT_COPY }: ContributorMessagesProps) {
  if (!messages || messages.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full" aria-labelledby="contributors-heading">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-wine/10 text-brand-wine text-xs font-semibold tracking-wider uppercase mb-3">
          <Mic className="w-3.5 h-3.5 text-brand-terracotta" />
          <span>{copy.eyebrow}</span>
        </div>
        <h2 id="contributors-heading" className="font-serif text-3xl sm:text-4xl text-brand-wine tracking-tight">
          {copy.title}
        </h2>
        <p className="text-sm sm:text-base text-brand-graphite/70 mt-2">{copy.description}</p>
      </div>

      <div className={`grid gap-6 ${forceSingleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        {messages.map((message, index) => (
          <ContributorCard key={message.id} message={message} index={index} />
        ))}
      </div>
    </section>
  );
}
