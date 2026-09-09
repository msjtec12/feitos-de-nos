"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Heart, User } from "lucide-react";
import { ContributorMessage } from "@/types/gift";
import { AudioPlayer } from "../audio/AudioPlayer";

interface ContributorCardProps {
  message: ContributorMessage;
  index: number;
}

export function ContributorCard({ message, index }: ContributorCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="flex flex-col bg-white rounded-3xl p-6 sm:p-7 border border-brand-rose/30 shadow-sm hover:shadow-md transition-all duration-300 relative"
      aria-labelledby={`contributor-name-${message.id}`}
    >
      {/* Detalhe de aspas decorativas no fundo */}
      <div className="absolute top-4 right-6 opacity-10 pointer-events-none" aria-hidden="true">
        <Quote className="w-12 h-12 text-brand-wine" />
      </div>

      {/* Cabeçalho do Autor da Mensagem */}
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar ou Inicial com Paleta Afetiva */}
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-brand-rose/40 to-brand-cream border-2 border-brand-rose/50 flex items-center justify-center text-brand-wine font-serif font-bold text-lg shrink-0 shadow-xs">
          {message.authorName.charAt(0)}
        </div>

        <div className="min-w-0">
          <h3
            id={`contributor-name-${message.id}`}
            className="font-serif text-lg sm:text-xl text-brand-wine truncate"
          >
            {message.authorName}
          </h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-rose/15 text-brand-terracotta text-xs font-medium mt-0.5">
            <Heart className="w-3 h-3 fill-brand-terracotta" />
            <span>{message.relation}</span>
          </div>
        </div>
      </div>

      {/* Texto Escrito da Mensagem */}
      <div className="flex-1 my-2">
        <p className="text-brand-graphite/85 text-sm sm:text-base leading-relaxed font-normal">
          “{message.writtenMessage}”
        </p>
      </div>

      {/* Player de Áudio Dedicado (se houver áudio vinculado) */}
      {message.audio && (
        <div className="mt-5 pt-4 border-t border-brand-rose/20">
          <AudioPlayer
            audio={message.audio}
            title={message.audio.title}
            author={message.authorName}
            variant="compact"
          />
        </div>
      )}
    </motion.article>
  );
}
