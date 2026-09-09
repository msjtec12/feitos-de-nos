"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { BrandLogo } from "../brand/BrandLogo";
import { BrandSymbol } from "../brand/BrandSymbol";

interface GiftOpeningProps {
  isOpen: boolean;
  onOpen: () => void;
  headline?: string;
  description?: string;
  buttonLabel?: string;
  recipientName?: string;
}

export function GiftOpening({
  isOpen,
  onOpen,
  headline = "Uma história foi feita para você.",
  description = "Ela reúne momentos, vozes e pessoas que fizeram parte do seu primeiro ano.",
  buttonLabel = "Abrir meu presente",
  recipientName = "Matheus Akira",
}: GiftOpeningProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -25,
            scale: 0.98,
            filter: "blur(6px)",
            transition: { duration: 0.75, ease: [0.32, 0.72, 0, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-brand-cream overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Abertura do presente afetivo Feito de Nós"
        >
          {/* Elementos visuais de fundo inspirados na caixa de presente com fita vinho */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Brilho quente suave */}
            <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full bg-brand-rose/20 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 w-80 h-80 rounded-full bg-brand-terracotta/15 blur-3xl" />
            
            {/* Moldura de cartão afetivo com bordas delicadas */}
            <div className="absolute inset-4 sm:inset-8 border border-brand-rose/35 rounded-3xl pointer-events-none" />

            {/* Fita decorativa vinho translúcida vertical no fundo */}
            <div className="hidden sm:block absolute left-12 top-0 bottom-0 w-8 bg-brand-wine/5 border-x border-brand-wine/10" />
          </div>

          {/* Topo: Logo Oficial Transparente */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative z-10 pt-2"
          >
            <BrandLogo size="md" showSlogan={true} />
          </motion.header>

          {/* Centro: Cartão de Apresentação e Laço Emocional */}
          <motion.main
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-sm sm:max-w-md w-full my-auto text-center flex flex-col items-center py-4 px-2"
          >
            {/* Ícone com o Símbolo Oficial do Coração e Ondas Sonoras */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-brand-rose/50 flex items-center justify-center shadow-md">
                <BrandSymbol size={44} />
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute -inset-1.5 rounded-full border border-brand-terracotta/40 pointer-events-none"
              />
            </div>

            {/* Badge de Destinatário */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-rose/25 text-brand-wine text-xs font-semibold tracking-wider uppercase mb-4 border border-brand-rose/40">
              <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
              <span>Para {recipientName}</span>
            </div>

            {/* Título Principal */}
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-wine leading-tight mb-3 tracking-tight">
              {headline}
            </h1>

            {/* Subtítulo Afetivo */}
            <p className="text-brand-graphite/80 text-base sm:text-lg leading-relaxed max-w-xs sm:max-w-sm mb-8 font-normal">
              {description}
            </p>

            {/* Botão de Abertura Principal em Vinho (#713C48) */}
            <motion.button
              type="button"
              onClick={onOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-wine text-white font-medium text-base sm:text-lg shadow-lg hover:bg-brand-wine-dark transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-wine/30 cursor-pointer"
              aria-label="Abrir o presente e ver as memórias"
            >
              <span>{buttonLabel}</span>
              <Heart className="w-4 h-4 fill-brand-rose text-brand-rose group-hover:scale-110 transition-transform duration-300" />
            </motion.button>
          </motion.main>

          {/* Rodapé da tela de abertura */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10 pb-2 text-center"
          >
            <p className="text-xs text-brand-graphite/50 tracking-wider uppercase font-medium">
              Toque para abrir a história
            </p>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
