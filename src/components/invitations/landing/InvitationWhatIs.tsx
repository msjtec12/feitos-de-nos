'use client';

import React from 'react';
import { XCircle, CheckCircle2, Calendar, MapPin, Users, HeartHandshake } from 'lucide-react';

export function InvitationWhatIs() {
  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C96E5A] bg-[#C96E5A]/10 px-3.5 py-1 rounded-full">
            A Nova Maneira de Convidar
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-4 mb-4">
            Por que um convite interativo?
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Convites tradicionais em imagem ou PDF geram dúvidas, esquecimentos e dezenas de mensagens desorganizadas no WhatsApp. O convite interativo resolve tudo em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* O convite antigo (PDF estático / imagem) */}
          <div className="bg-[#FAF3EC] rounded-3xl p-8 sm:p-10 border border-[#713C48]/10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold mb-6">
                <span>Como era antes</span>
              </div>
              <h3 className="font-serif text-2xl text-[#713C48] mb-4">
                PDFs ou imagens estáticas
              </h3>
              <p className="text-[#302B2D]/75 text-sm sm:text-base mb-6">
                Um arquivo pesado enviado no WhatsApp que logo se perde no rolo da câmera do convidado.
              </p>

              <ul className="space-y-4 text-sm text-[#302B2D]/80">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Convidados esquecem a data por não sincronizar com a agenda</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>No dia da festa, dezenas de mensagens pedindo o endereço e a localização</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Confirmações manuais perdidas em conversas avulsas, sem controle do buffet</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Sem interação, sem contagem regressiva e sem emoção</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#713C48]/10 text-xs text-[#302B2D]/60 italic">
              Resultado: estresse para o anfitrião e convidados desorientados.
            </div>
          </div>

          {/* O Convite Feito de Nós */}
          <div className="bg-[#FFF8F0] rounded-3xl p-8 sm:p-10 border-2 border-[#C96E5A] shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C96E5A]/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6">
                <span>Com Feito de Nós</span>
              </div>
              <h3 className="font-serif text-2xl text-[#713C48] mb-4">
                Experiência Digital Interativa
              </h3>
              <p className="text-[#302B2D]/85 text-sm sm:text-base mb-6">
                Uma página charmosa, rápida e exclusiva que abre no navegador de qualquer celular sem baixar nada.
              </p>

              <ul className="space-y-4 text-sm text-[#302B2D]/85">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Adicionar à Agenda com 1 toque:</strong> Google Agenda e Apple Calendar com lembrete automático.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Rota direta:</strong> Convidado clica e abre diretamente no Waze ou Google Maps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>RSVP com contagem exata:</strong> Painel em tempo real de confirmados, acompanhantes e restrições.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Lista de presentes / Pix:</strong> Sem taxas abusivas, direto para você.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#713C48]/10 text-xs text-[#713C48] font-semibold">
              Resultado: elegância, organização impecável e encanto do primeiro instante.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
