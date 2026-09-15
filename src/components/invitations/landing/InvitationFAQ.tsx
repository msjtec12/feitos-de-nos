'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Os convidados precisam baixar algum aplicativo para ver o convite?',
    answer:
      'Não! O convite é uma página web ultra leve e responsiva. Ao clicar no link enviado por WhatsApp ou redes sociais, ele abre instantaneamente no navegador padrão do smartphone de qualquer convidado (iPhone ou Android).',
  },
  {
    question: 'Como funciona a confirmação de presença (RSVP)?',
    answer:
      'No plano Interativo e no Evento Completo, há um módulo integrado de RSVP na própria página. O convidado preenche seu nome, confirma presença ou ausência, indica número de acompanhantes e restrições alimentares. Todas as informações caem em tempo real no seu painel.',
  },
  {
    question: 'Existe taxa sobre o dinheiro arrecadado via Pix de presentes?',
    answer:
      'Zero taxa! Você informa a sua chave Pix bancária pessoal ou o link da sua lista de presentes externa. O convidado copia a chave ou acessa o link e transfere diretamente para você, sem nenhuma retenção.',
  },
  {
    question: 'O que é o QR Code e o check-in do plano Evento Completo?',
    answer:
      'No plano Evento Completo, você pode cadastrar sua lista de convidados e gerar links ou QR Codes individuais para cada família. Na entrada do evento, o recepcionista pode usar nosso leitor de check-in pelo celular para validar a entrada com um simples toque.',
  },
  {
    question: 'Quanto tempo o convite permanece online?',
    answer:
      'O tempo de permanência varia conforme o plano: 30 dias para o Essencial, 90 dias para o Interativo e 180 dias para o Evento Completo, garantindo que o convite fique disponível antes e após a data da festa.',
  },
  {
    question: 'Se houver alteração de horário ou local, posso atualizar o convite?',
    answer:
      'Sim! Como o convite é um link digital inteligente, qualquer atualização de endereço, horário ou aviso importante reflete imediatamente para todos que acessarem o link, sem necessidade de reenviar arquivos.',
  },
];

export function InvitationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#FAF3EC] border-t border-[#713C48]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#713C48] bg-[#713C48]/10 px-3.5 py-1 rounded-full">
            Tire Suas Dúvidas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-4 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Tudo o que você precisa saber sobre os Convites Feito de Nós.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FFF8F0] rounded-2xl border border-[#713C48]/15 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48]"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg font-bold text-[#713C48]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C96E5A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#302B2D]/80 leading-relaxed border-t border-[#713C48]/5 pt-4">
                    {faq.answer}
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
