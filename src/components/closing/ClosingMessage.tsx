"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { DecorativeKnotDivider } from "../brand/BrandSymbol";
import { ShareButton } from "../share/ShareButton";

interface ClosingMessageProps {
  headline?: string;
  message?: string;
  signature?: string;
}

export function ClosingMessage({
  headline = "Esta é apenas a primeira parte da sua história.",
  message = "Que você cresça cercado pelas vozes, lembranças e pessoas que fizeram do seu primeiro ano um tempo inesquecível.",
  signature = "Com todo o nosso amor.",
}: ClosingMessageProps) {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto w-full text-center" aria-labelledby="closing-heading">
      {/* Linha decorativa inspirada no símbolo de nós/laços */}
      <DecorativeKnotDivider className="mb-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="space-y-6"
      >
        {/* Título Final */}
        <h2
          id="closing-heading"
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-wine tracking-tight leading-tight max-w-xl mx-auto"
        >
          {headline}
        </h2>

        {/* Texto Emocional */}
        <p className="text-brand-graphite/85 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto font-normal">
          {message}
        </p>

        {/* Assinatura com Afeto */}
        <div className="pt-4 pb-6">
          <p className="font-serif italic text-xl sm:text-2xl text-brand-terracotta flex items-center justify-center gap-2">
            <span>{signature}</span>
            <Heart className="w-5 h-5 fill-brand-rose text-brand-terracotta inline-block" />
          </p>
        </div>

        {/* Botão de Compartilhamento Integrado */}
        <div className="pt-2">
          <ShareButton />
        </div>
      </motion.div>
    </section>
  );
}
