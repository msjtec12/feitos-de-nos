'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { supabase } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  PlusCircle,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  adminName?: string;
  adminRole?: string;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  adminName = 'Administrador',
  adminRole = 'owner',
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Todos os Pedidos',
      href: '/admin/pedidos',
      icon: ShoppingBag,
      exact: false,
    },
    {
      label: 'Novo Pedido',
      href: '/admin/pedidos/novo',
      icon: PlusCircle,
      exact: true,
    },
    {
      label: 'Páginas & Experiências',
      href: '/admin/paginas',
      icon: Sparkles,
      exact: false,
    },
  ];

  return (
    <aside className="w-64 bg-[#FFF8F0] border-r border-[#713C48]/15 h-full flex flex-col justify-between p-4 selection:bg-[#D9A4A0]/40">
      <div className="space-y-6">
        {/* Brand Logo & Admin Badge */}
        <div className="pt-2 px-2 space-y-2">
          <Link href="/admin" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#713C48] rounded-xl">
            <BrandLogo size="md" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#713C48]/10 text-[#713C48] text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C96E5A]" />
            <span>Painel Interno</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#713C48] text-[#FFF8F0] shadow-sm'
                    : 'text-[#302B2D]/80 hover:bg-[#713C48]/10 hover:text-[#713C48]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A4A0]' : 'text-[#C96E5A]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-[#713C48]/10 space-y-3">
        <div className="px-2">
          <p className="text-xs font-bold text-[#713C48] truncate">{adminName}</p>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C96E5A]">
            {adminRole === 'owner' ? 'Proprietário' : 'Editor'}
          </span>
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#302B2D]/70 hover:bg-[#713C48]/5 hover:text-[#713C48] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Site Público
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
