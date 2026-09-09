import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSessionAndProfile, getDashboardMetrics } from '@/lib/supabase/admin-queries';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/admin/PaymentStatusBadge';
import { formatCurrency } from '@/lib/order-utils';
import {
  ShoppingBag,
  Clock,
  Palette,
  CheckCircle2,
  Truck,
  DollarSign,
  Sparkles,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  User,
  Heart,
  Calendar,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const { user, profile } = await getAdminSessionAndProfile();

  if (!user || !profile) {
    redirect('/admin/login');
  }

  const metrics = await getDashboardMetrics();

  const metricCards = [
    {
      title: 'Novos Pedidos',
      value: metrics.newOrders,
      icon: ShoppingBag,
      colorClass: 'bg-blue-50 text-blue-800 border-blue-200',
      iconClass: 'text-blue-600',
      href: '/admin/pedidos?status=new',
    },
    {
      title: 'Aguardando Conteúdo',
      value: metrics.awaitingContent,
      icon: Clock,
      colorClass: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      iconClass: 'text-yellow-600',
      href: '/admin/pedidos?status=awaiting_content',
    },
    {
      title: 'Em Criação & Design',
      value: metrics.inCreation,
      icon: Palette,
      colorClass: 'bg-purple-50 text-purple-800 border-purple-200',
      iconClass: 'text-purple-600',
      href: '/admin/pedidos?status=creating',
    },
    {
      title: 'Aguardando Aprovação',
      value: metrics.awaitingApproval,
      icon: AlertTriangle,
      colorClass: 'bg-orange-50 text-orange-800 border-orange-200',
      iconClass: 'text-orange-600',
      href: '/admin/pedidos?status=awaiting_approval',
    },
    {
      title: 'Em Produção Física',
      value: metrics.inProduction,
      icon: Truck,
      colorClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      iconClass: 'text-cyan-600',
      href: '/admin/pedidos?status=in_production',
    },
    {
      title: 'Concluídos',
      value: metrics.completed,
      icon: CheckCircle2,
      colorClass: 'bg-green-50 text-green-800 border-green-200',
      iconClass: 'text-green-600',
      href: '/admin/pedidos?status=completed',
    },
    {
      title: 'Receita Confirmada',
      value: formatCurrency(metrics.totalRevenueCents / 100),
      icon: DollarSign,
      colorClass: 'bg-[#713C48]/10 text-[#713C48] border-[#713C48]/20',
      iconClass: 'text-[#713C48]',
      isCurrency: true,
    },
    {
      title: 'Páginas Publicadas',
      value: metrics.activeGiftPagesCount,
      icon: Sparkles,
      colorClass: 'bg-[#C96E5A]/10 text-[#C96E5A] border-[#C96E5A]/20',
      iconClass: 'text-[#C96E5A]',
      href: '/admin/paginas',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#713C48]/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C96E5A]">
            Visão Geral
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#713C48] mt-0.5">
            Olá, {profile.name}
          </h1>
          <p className="text-sm text-[#302B2D]/70 mt-1">
            Acompanhe as encomendas e páginas interativas da Feito de Nós em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pedidos/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#713C48] text-[#FFF8F0] text-xs sm:text-sm font-semibold hover:bg-[#5a2e39] transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-[#D9A4A0]" />
            <span>Criar Pedido Manual</span>
          </Link>

          <Link
            href="/admin/paginas"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#713C48]/20 text-[#713C48] text-xs sm:text-sm font-semibold hover:bg-[#FFF8F0] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#C96E5A]" />
            <span>Ver Experiências</span>
          </Link>
        </div>
      </div>

      {/* Uncontacted Orders Warning Alert */}
      {metrics.uncontactedNewOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                {metrics.uncontactedNewOrders.length} pedido(s) novo(s) aguardando contato há mais de 24h
              </h4>
              <p className="text-xs text-amber-800">
                Inicie o contato no WhatsApp para orientar o envio de fotos e áudios com carinho.
              </p>
            </div>
          </div>
          <Link
            href="/admin/pedidos?status=new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors flex-shrink-0"
          >
            <span>Ver Pedidos Pendentes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          const content = (
            <div
              className={`p-5 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${card.colorClass} ${
                card.href ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{card.title}</span>
                <div className="p-2 rounded-xl bg-white/80 shadow-inner">
                  <Icon className={`w-4 h-4 ${card.iconClass}`} />
                </div>
              </div>
              <div className="mt-3">
                <span className="font-serif text-2xl sm:text-3xl font-bold">
                  {card.value}
                </span>
              </div>
            </div>
          );

          return card.href ? (
            <Link key={idx} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={idx}>{content}</div>
          );
        })}
      </div>

      {/* Recent Orders List */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl text-[#713C48]">Pedidos Recentes</h3>
            <p className="text-xs text-[#302B2D]/70">Últimas encomendas registradas no sistema.</p>
          </div>

          <Link
            href="/admin/pedidos"
            className="text-xs font-semibold text-[#713C48] hover:underline flex items-center gap-1"
          >
            <span>Ver Todos os Pedidos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics.recentOrders.length === 0 ? (
          <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl p-12 text-center space-y-4">
            <ShoppingBag className="w-10 h-10 text-[#C96E5A] mx-auto opacity-60" />
            <div className="space-y-1">
              <h4 className="font-serif text-xl text-[#713C48]">Nenhum pedido cadastrado ainda</h4>
              <p className="text-xs sm:text-sm text-[#302B2D]/70 max-w-md mx-auto">
                Quando os clientes preencherem o formulário no site ou você cadastrar manualmente, eles aparecerão aqui.
              </p>
            </div>
            <Link
              href="/admin/pedidos/novo"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#713C48] text-[#FFF8F0] text-xs font-semibold hover:bg-[#5a2e39] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Primeiro Pedido</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 border border-[#713C48]/15 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#713C48]/10 bg-[#FFF8F0]/80 text-[#713C48] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Código</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Presenteado</th>
                    <th className="py-3.5 px-4">Formato</th>
                    <th className="py-3.5 px-4">Valor</th>
                    <th className="py-3.5 px-4">Pagamento</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#713C48]/10 text-[#302B2D]">
                  {metrics.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FFF8F0]/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#713C48]">
                        {order.code}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold block">{order.customer_name}</span>
                        <span className="text-[11px] text-[#302B2D]/60">{order.customer_whatsapp}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium block">{order.recipient_name}</span>
                        <span className="text-[11px] text-[#C96E5A]">{order.recipient_relationship}</span>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        {order.product_type === 'digital'
                          ? 'História Digital'
                          : order.product_type === 'talking_card'
                          ? 'Cartão que Fala'
                          : 'Presente Interativo'}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#713C48]">
                        {formatCurrency(order.total_cents / 100)}
                      </td>
                      <td className="py-4 px-4">
                        <PaymentStatusBadge status={order.payment_status} size="sm" />
                      </td>
                      <td className="py-4 px-4">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#713C48] hover:text-[#C96E5A] transition-colors"
                        >
                          <span>Gerenciar</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
