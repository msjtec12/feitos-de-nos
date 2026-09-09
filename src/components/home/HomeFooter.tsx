'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Heart } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer className="bg-[#302B2D] text-[#FFF8F0] pt-16 pb-12 border-t border-[#713C48]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#FFF8F0]/10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              {/* Force white/creme tone or standard logo */}
              <div className="bg-[#FFF8F0] p-2 rounded-xl inline-block">
                <BrandLogo size="md" />
              </div>
            </Link>
            <p className="text-xs text-[#FFF8F0]/70 leading-relaxed">
              Presentes afetivos interativos criados com fotos, mensagens e vozes de pessoas especiais.
            </p>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A4A0]">Navegação</p>
            <ul className="space-y-2 text-sm text-[#FFF8F0]/80">
              <li>
                <Link href="/" className="hover:text-[#FFF8F0] transition-colors">Início</Link>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-[#FFF8F0] transition-colors">Como Funciona</a>
              </li>
              <li>
                <a href="#colecoes" className="hover:text-[#FFF8F0] transition-colors">Coleções</a>
              </li>
              <li>
                <a href="#formatos" className="hover:text-[#FFF8F0] transition-colors">Opções & Valores</a>
              </li>
              <li>
                <a href="#duvidas" className="hover:text-[#FFF8F0] transition-colors">Dúvidas Frequentes</a>
              </li>
            </ul>
          </div>

          {/* Demonstrations */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A4A0]">Exemplos</p>
            <ul className="space-y-2 text-sm text-[#FFF8F0]/80">
              <li>
                <Link href="/presente/matheus-akira" className="hover:text-[#FFF8F0] transition-colors">
                  Demonstração Digital (Matheus Akira)
                </Link>
              </li>
              <li>
                <Link href="/presente/matheus-akira/cartao" className="hover:text-[#FFF8F0] transition-colors">
                  Demonstração Cartão Físico
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Order */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A4A0]">Institucional</p>
            <ul className="space-y-2 text-sm text-[#FFF8F0]/80">
              <li>
                <Link href="/pedido" className="text-[#C96E5A] hover:text-[#D9A4A0] font-semibold transition-colors">
                  Criar Pedido Agora →
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-[#FFF8F0] transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-[#FFF8F0] transition-colors">
                  Termos do Pedido
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF8F0]/60 gap-4">
          <p>© {new Date().getFullYear()} Feito de Nós. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Criado com</span>
            <Heart className="w-3.5 h-3.5 text-[#C96E5A] fill-current" />
            <span>para guardar o que não se esquece.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
