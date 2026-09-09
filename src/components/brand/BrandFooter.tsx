import React from "react";
import { BrandSymbol } from "./BrandSymbol";

export function BrandFooter() {
  return (
    <footer className="w-full py-12 px-6 border-t border-brand-rose/20 bg-brand-cream/50 mt-16 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center gap-3">
        <BrandSymbol size={22} className="text-brand-terracotta/80" />
        
        <div className="space-y-1">
          <p className="font-serif text-lg text-brand-wine">
            Feito de Nós
          </p>
          <p className="text-xs uppercase tracking-widest text-brand-terracotta font-medium">
            Histórias que viram presente.
          </p>
        </div>

        <p className="text-xs text-brand-graphite/60 max-w-xs mt-2 leading-relaxed">
          Esta página foi criada especialmente para guardar momentos importantes.
        </p>

        {/* Nota técnica de privacidade e segurança */}
        <div className="mt-4 pt-4 border-t border-brand-rose/15 w-full">
          <p className="text-[11px] text-brand-graphite/40 font-mono">
            Experiência privada • Acesso via QR Code exclusivo
          </p>
        </div>
      </div>
    </footer>
  );
}
