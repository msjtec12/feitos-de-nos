'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { AdminSidebar } from './AdminSidebar';
import { Menu, X, ShieldCheck } from 'lucide-react';

interface AdminNavbarProps {
  adminName?: string;
  adminRole?: string;
}

export function AdminNavbar({ adminName, adminRole }: AdminNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#713C48]/15 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <BrandLogo size="sm" />
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-[#713C48] hover:bg-[#713C48]/10"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu lateral'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <AdminSidebar
              adminName={adminName}
              adminRole={adminRole}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
