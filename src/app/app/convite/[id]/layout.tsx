import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHostEventByParam } from '@/lib/invitations/host-queries';
import { HostAppNavbar } from '@/components/app/HostAppNavbar';
import { HostAppBottomNav } from '@/components/app/HostAppBottomNav';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { event } = await getHostEventByParam(id);

  if (!event) {
    return {
      title: 'App do Anfitrião | Feito de Nós',
    };
  }

  return {
    title: `${event.title} • App do Anfitrião | Feito de Nós`,
    description: `Gerencie os detalhes, fotos, lista de convidados e check-in do evento ${event.title}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function HostAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { event } = await getHostEventByParam(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans selection:bg-[#D9A4A0]/40 text-[#302B2D]">
      {/* Top Navbar do App do Anfitrião */}
      <HostAppNavbar event={event} />

      {/* Conteúdo Principal */}
      <main className="flex-1 pb-16 md:pb-6">{children}</main>

      {/* Bottom Navigation Bar Mobile */}
      <HostAppBottomNav event={event} />
    </div>
  );
}
