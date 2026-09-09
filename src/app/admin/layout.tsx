import React from 'react';
import type { Metadata } from 'next';
import { getAdminSessionAndProfile } from '@/lib/supabase/admin-queries';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export const metadata: Metadata = {
  title: 'Painel Administrativo | Feito de Nós',
  description: 'Gestão de pedidos, clientes e publicação de experiências da marca Feito de Nós.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getAdminSessionAndProfile();

  // Se não estiver autenticado como admin ativo, renderiza apenas o children (ex: tela de login)
  if (!user || !profile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col md:flex-row font-sans selection:bg-[#D9A4A0]/40 text-[#302B2D]">
      {/* Mobile Topbar */}
      <AdminNavbar adminName={profile.name} adminRole={profile.role} />

      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 flex-shrink-0">
        <AdminSidebar adminName={profile.name} adminRole={profile.role} />
      </div>

      {/* Main Admin Content Container */}
      <main className="flex-1 overflow-x-hidden min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
