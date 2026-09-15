'use client';

import React from 'react';
import {
  CalendarClock,
  MapPin,
  Users,
  Image as ImageIcon,
  Sparkles,
  QrCode,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';

const FEATURES = [
  {
    icon: CalendarClock,
    title: 'Adicionar à Agenda',
    description: 'Sincronização imediata com Google Agenda, Apple Calendar e Outlook com lembrete no dia da festa.',
  },
  {
    icon: MapPin,
    title: 'Waze & Google Maps',
    description: 'Seus convidados clicam e a rota abre automaticamente no app de navegação preferido.',
  },
  {
    icon: Users,
    title: 'Confirmação RSVP Completa',
    description: 'Saiba com precisão quem vai, o número de acompanhantes e restrições alimentares dos seus convidados.',
  },
  {
    icon: Sparkles,
    title: 'Abertura Mágica de Envelope',
    description: 'Animação elegante de abertura que causa impacto e transmite o clima da festa logo na primeira tela.',
  },
  {
    icon: ImageIcon,
    title: 'Galeria Afetiva com Lightbox',
    description: 'Compartilhe momentos marcantes com fotos em alta resolução, carrossel e visualização em tela cheia.',
  },
  {
    icon: HeartHandshake,
    title: 'Lista de Presentes & Pix',
    description: 'Informações claras sobre presentes ou chave Pix para cofrinho, sem taxa percentual de intermediários.',
  },
  {
    icon: QrCode,
    title: 'QR Code & Check-in no Dia',
    description: 'No plano Evento Completo, cada família recebe link/token único com QR Code para controle ágil na recepção.',
  },
  {
    icon: CheckCircle,
    title: 'Totalmente Responsivo',
    description: 'Desenhado pensado no mobile: navegação ultra suave em qualquer modelo de iPhone ou Android.',
  },
];

export function InvitationFeatures() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF3EC] border-y border-[#713C48]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#713C48] bg-[#713C48]/10 px-3.5 py-1 rounded-full">
            Tudo o que seu evento precisa
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-4 mb-4">
            Recursos pensados para encantar e organizar
          </h2>
          <p className="text-[#302B2D]/80 text-base sm:text-lg leading-relaxed">
            Elimine as dúvidas dos convidados e tenha previsibilidade total para a contratação de buffet, lembrancinhas e mesas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFF8F0] rounded-2xl p-6 border border-[#713C48]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#C96E5A]/10 text-[#C96E5A] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg text-[#713C48] font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#302B2D]/75 leading-relaxed">
                    {feature.description}
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
