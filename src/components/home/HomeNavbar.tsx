'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Menu, X, Sparkles, Heart } from 'lucide-react';

export function HomeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/90 backdrop-blur-md border-b border-[#713C48]/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded-xl p-1"
          aria-label="Feito de Nós - Página Inicial"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#302B2D]/80">
          <a
            href="#como-funciona"
            className="hover:text-[#713C48] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded px-1"
          >
            Como Funciona
          </a>
          <a
            href="#colecoes"
            className="hover:text-[#713C48] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded px-1"
          >
            Coleções
          </a>
          <a
            href="#formatos"
            className="hover:text-[#713C48] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded px-1"
          >
            Opções & Valores
          </a>
          <a
            href="#duvidas"
            className="hover:text-[#713C48] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded px-1"
          >
            Dúvidas
          </a>
          <Link
            href="/presente/matheus-akira"
            className="text-[#C96E5A] hover:text-[#713C48] transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded px-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ver Exemplo Real</span>
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/pedido"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#713C48] text-[#FFF8F0] text-sm font-semibold hover:bg-[#5a2e39] transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#713C48]"
          >
            <Heart className="w-4 h-4 text-[#D9A4A0] fill-current" />
            <span>Criar meu presente</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#713C48] hover:bg-[#713C48]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48]"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#713C48]/10 bg-[#FFF8F0] px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium text-[#302B2D]">
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#713C48]/5 hover:text-[#713C48] transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#colecoes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#713C48]/5 hover:text-[#713C48] transition-colors"
            >
              Coleções
            </a>
            <a
              href="#formatos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#713C48]/5 hover:text-[#713C48] transition-colors"
            >
              Opções & Valores
            </a>
            <a
              href="#duvidas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#713C48]/5 hover:text-[#713C48] transition-colors"
            >
              Dúvidas Frequentes
            </a>
            <Link
              href="/presente/matheus-akira"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg text-[#C96E5A] hover:bg-[#C96E5A]/5 font-medium flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Exemplo Real (Matheus Akira)</span>
            </Link>
          </nav>

          <div className="pt-2">
            <Link
              href="/pedido"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#713C48] text-[#FFF8F0] font-semibold text-center hover:bg-[#5a2e39] transition-all shadow-md"
            >
              <Heart className="w-4 h-4 text-[#D9A4A0] fill-current" />
              <span>Criar meu presente</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
