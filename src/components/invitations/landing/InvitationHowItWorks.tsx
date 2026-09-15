'use client';

import React from 'react';
import { ClipboardList, Palette, CheckCircle2, SendHorizontal } from 'lucide-react';

const STEPS = [
  {
    stepNumber: '01',
    icon: ClipboardList,
    title: 'Preencha os detalhes',
    description:
      'Escolha o plano, informe data, local, homenageado, chave Pix ou lista de presentes em nosso formulário de pedido.',
  },
  {
    stepNumber: '02',
    icon: Palette,
    title: 'Criação exclusiva',
    description:
      'Nossa equipe aplica a paleta autoral escolhida, formata as fotos, configura a rota de mapas e o calendário com carinho.',
  },
  {
    stepNumber: '03',
    icon: CheckCircle2,
    title: 'Revisão no seu celular',
    description:
      'Você recebe um link de prévia para abrir no seu smartphone, checar cada detalhe e solicitar ajustes caso necessário.',
  },
  {
    stepNumber: '04',
    icon: SendHorizontal,
    title: 'Envie e acompanhe o RSVP',
    description:
      'Compartilhe a página no WhatsApp da família e amigos e veja as confirmações de presença chegando em tempo real!',
  },
];

export function InvitationHowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-[#FFF8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C96E5A] bg-[#C96E5A]/10 px-3.5 py-1 rounded-full">
            Passo a Passo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-4 mb-4">
            Como funciona a criação do seu convite
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Do primeiro clique até a confirmação dos seus convidados, o processo é simples, rápido e transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF3EC] rounded-3xl p-7 border border-[#713C48]/10 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-extrabold text-[#713C48]/25">
                      {step.stepNumber}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#713C48]/10 text-[#713C48] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl text-[#713C48] font-bold mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#302B2D]/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
