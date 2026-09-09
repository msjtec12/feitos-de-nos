import { createSupabaseServerClient, createSupabaseAdminClient } from './server';
import {
  AdminProfile,
  OrderRow,
  OrderStatus,
  PaymentStatus,
  ProductType,
  OrderStatusHistoryRow,
  GiftPageRow,
  ActivityLogRow,
} from '@/types/database';
import { DashboardMetrics, DEFAULT_PRODUCTION_CHECKLIST } from '@/types/admin';
import { DEFAULT_GIFT_CONTENT, DEFAULT_GIFT_THEME } from '@/types/gift-experience';

/**
 * Obtém a sessão do administrador atual e valida o registro em admin_profiles
 */
export async function getAdminSessionAndProfile(): Promise<{
  user: any | null;
  profile: AdminProfile | null;
}> {
  try {
    const supabase = createSupabaseServerClient();
    
    // Tenta obter o usuário autenticado via cookies (método oficial e seguro do @supabase/ssr)
    let user: any = null;
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userData?.user) {
      user = userData.user;
    } else {
      const { data: sessionData } = await supabase.auth.getSession();
      user = sessionData?.session?.user || null;
    }

    if (!user) {
      return { user: null, profile: null };
    }

    // Consulta admin_profile com o cliente administrativo (bypassa RLS)
    const adminClient = createSupabaseAdminClient();
    const { data: profile, error } = await adminClient
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .eq('active', true)
      .maybeSingle();

    if (error || !profile) {
      return { user, profile: null };
    }

    return { user, profile: profile as AdminProfile };
  } catch (err) {
    console.error('Erro ao verificar sessão administrativa:', err);
    return { user: null, profile: null };
  }
}

/**
 * Coleta métricas reais do dashboard administrativo
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const adminClient = createSupabaseAdminClient();

  const { data: ordersData, error } = await adminClient
    .from('orders')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  const orders: OrderRow[] = ordersData || [];

  const { count: giftPagesCount } = await adminClient
    .from('gift_pages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .is('archived_at', null);

  let totalRevenueCents = 0;
  let newOrders = 0;
  let awaitingContent = 0;
  let inCreation = 0;
  let awaitingApproval = 0;
  let inProduction = 0;
  let completed = 0;
  let pendingPaymentsCount = 0;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const uncontactedNewOrders: OrderRow[] = [];

  for (const o of orders) {
    if (o.status === 'new') {
      newOrders++;
      if (o.created_at < oneDayAgo) {
        uncontactedNewOrders.push(o);
      }
    } else if (o.status === 'awaiting_content') {
      awaitingContent++;
    } else if (o.status === 'creating') {
      inCreation++;
    } else if (o.status === 'awaiting_approval') {
      awaitingApproval++;
    } else if (o.status === 'in_production') {
      inProduction++;
    } else if (o.status === 'completed') {
      completed++;
    }

    if (o.payment_status === 'pending') {
      pendingPaymentsCount++;
    } else if (o.payment_status === 'paid' || o.payment_status === 'deposit_paid') {
      totalRevenueCents += o.total_cents;
    }
  }

  return {
    totalOrders: orders.length,
    newOrders,
    awaitingContent,
    inCreation,
    awaitingApproval,
    inProduction,
    completed,
    pendingPaymentsCount,
    totalRevenueCents,
    activeGiftPagesCount: giftPagesCount || 0,
    recentOrders: orders.slice(0, 8),
    uncontactedNewOrders,
  };
}

/**
 * Consulta lista de pedidos com busca, filtros, paginação e ordenação
 */
export async function getOrdersList(params: {
  search?: string;
  status?: OrderStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  productType?: ProductType | 'all';
  page?: number;
  pageSize?: number;
}): Promise<{
  orders: OrderRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const adminClient = createSupabaseAdminClient();
  const page = params.page || 1;
  const pageSize = params.pageSize || 15;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = adminClient
    .from('orders')
    .select('*', { count: 'exact' })
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }

  if (params.paymentStatus && params.paymentStatus !== 'all') {
    query = query.eq('payment_status', params.paymentStatus);
  }

  if (params.productType && params.productType !== 'all') {
    query = query.eq('product_type', params.productType);
  }

  if (params.search && params.search.trim()) {
    const term = params.search.trim();
    query = query.or(
      `code.ilike.%${term}%,customer_name.ilike.%${term}%,customer_whatsapp.ilike.%${term}%,recipient_name.ilike.%${term}%`
    );
  }

  const { data, count, error } = await query;
  const totalCount = count || 0;

  return {
    orders: (data as OrderRow[]) || [],
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
  };
}

/**
 * Obtém detalhes completos de um pedido pelo ID
 */
export async function getOrderById(id: string): Promise<{
  order: OrderRow | null;
  history: OrderStatusHistoryRow[];
  giftPage: GiftPageRow | null;
}> {
  const adminClient = createSupabaseAdminClient();

  const { data: order, error: orderError } = await adminClient
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    return { order: null, history: [], giftPage: null };
  }

  const { data: history } = await adminClient
    .from('order_status_history')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false });

  const { data: giftPage } = await adminClient
    .from('gift_pages')
    .select('*')
    .eq('order_id', id)
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    order: order as OrderRow,
    history: (history as OrderStatusHistoryRow[]) || [],
    giftPage: giftPage as GiftPageRow | null,
  };
}

/**
 * Atualiza o status de um pedido e registra no histórico de auditoria
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminId?: string,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const { data: currentOrder, error: fetchErr } = await adminClient
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (fetchErr || !currentOrder) {
    return { success: false, error: 'Pedido não encontrado' };
  }

  const prevStatus = currentOrder.status;

  const { error: updateErr } = await adminClient
    .from('orders')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (updateErr) {
    return { success: false, error: updateErr.message };
  }

  // Registrar histórico
  await adminClient.from('order_status_history').insert({
    order_id: orderId,
    previous_status: prevStatus,
    new_status: newStatus,
    admin_id: adminId || null,
    note: note || `Status alterado de "${prevStatus}" para "${newStatus}"`,
  });

  // Registrar log de atividade
  await logActivity(adminId || null, 'order_status_change', 'order', orderId, {
    previous_status: prevStatus,
    new_status: newStatus,
    note,
  });

  return { success: true };
}

/**
 * Atualiza status de pagamento, frete e notas internas
 */
export async function updateOrderPayment(
  orderId: string,
  paymentStatus: PaymentStatus,
  freightCents?: number,
  internalNotes?: string,
  adminId?: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const { data: currentOrder } = await adminClient
    .from('orders')
    .select('price_cents, freight_cents, total_cents')
    .eq('id', orderId)
    .single();

  const priceCents = currentOrder?.price_cents || 5990;
  const newFreight = freightCents !== undefined ? freightCents : currentOrder?.freight_cents || 0;
  const newTotal = priceCents + newFreight;

  const updates: any = {
    payment_status: paymentStatus,
    freight_cents: newFreight,
    total_cents: newTotal,
    updated_at: new Date().toISOString(),
  };

  if (internalNotes !== undefined) {
    updates.internal_notes = internalNotes;
  }

  const { error } = await adminClient
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity(adminId || null, 'order_payment_update', 'order', orderId, {
    payment_status: paymentStatus,
    freight_cents: newFreight,
    total_cents: newTotal,
  });

  return { success: true };
}

/**
 * Cria uma nova página de presente vinculada a um pedido
 */
export async function createGiftPageFromOrder(
  orderId: string,
  adminId?: string
): Promise<{ success: boolean; giftPage?: GiftPageRow; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const { data: order, error: orderErr } = await adminClient
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderErr || !order) {
    return { success: false, error: 'Pedido não encontrado' };
  }

  const initialContent = {
    ...DEFAULT_GIFT_CONTENT,
    slug: order.code.toLowerCase(),
    openingText: {
      headline: order.requested_title || 'Um Presente Feito de Nós',
      description: order.main_phrase || 'Histórias que viram presente.',
      buttonLabel: 'Abrir Presente',
    },
    recipient: {
      ...DEFAULT_GIFT_CONTENT.recipient,
      name: order.recipient_name,
      subtitle: order.collection_type === 'primeiro-ano' ? 'Meu Primeiro Ano' : order.requested_title,
      introQuote: order.main_phrase || 'Histórias que viram presente.',
    },
  };

  const initialTheme = {
    ...DEFAULT_GIFT_THEME,
    styleId: order.visual_style || 'afetuoso',
  };

  const { data: newPage, error: createErr } = await adminClient
    .from('gift_pages')
    .insert({
      order_id: orderId,
      title: order.requested_title,
      recipient_name: order.recipient_name,
      template_type: order.collection_type || 'primeiro-ano',
      status: 'draft',
      content: initialContent,
      theme: initialTheme,
      created_by: adminId || null,
      updated_by: adminId || null,
    })
    .select('*')
    .single();

  if (createErr) {
    return { success: false, error: createErr.message };
  }

  await logActivity(adminId || null, 'gift_page_created', 'gift_page', newPage.id, {
    order_id: orderId,
    title: order.requested_title,
  });

  return { success: true, giftPage: newPage as GiftPageRow };
}

/**
 * Salva as alterações de uma página de presente
 */
export async function saveGiftPage(
  id: string,
  fields: {
    title?: string;
    recipient_name?: string;
    template_type?: string;
    status?: any;
    content?: any;
    theme?: any;
    reveal_at?: string | null;
  },
  adminId?: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const updates: any = {
    ...fields,
    updated_by: adminId || null,
    updated_at: new Date().toISOString(),
  };

  if (fields.status === 'published') {
    updates.published_at = new Date().toISOString();
  }

  const { error } = await adminClient
    .from('gift_pages')
    .update(updates)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity(adminId || null, 'gift_page_updated', 'gift_page', id, {
    status: fields.status,
    title: fields.title,
  });

  return { success: true };
}

/**
 * Regenera o public_token de uma página de presente (revogando o link e QR Code anteriores)
 */
export async function regenerateGiftPageToken(
  giftPageId: string,
  adminId?: string
): Promise<{ success: boolean; newToken?: string; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const { data: updated, error } = await adminClient
    .from('gift_pages')
    .update({
      public_token: crypto.randomUUID(),
      updated_by: adminId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', giftPageId)
    .select('public_token')
    .single();

  if (error || !updated) {
    return { success: false, error: error?.message || 'Erro ao regenerar link' };
  }

  await logActivity(adminId || null, 'gift_page_token_regenerated', 'gift_page', giftPageId, {
    new_token: updated.public_token,
  });

  return { success: true, newToken: updated.public_token };
}

/**
 * Registra log de auditoria administrativa
 */
export async function logActivity(
  adminId: string | null,
  actionType: string,
  entityType: string,
  entityId?: string | null,
  details?: Record<string, any>
): Promise<void> {
  try {
    const adminClient = createSupabaseAdminClient();
    await adminClient.from('activity_logs').insert({
      admin_id: adminId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
    });
  } catch (err) {
    console.error('Falha ao gravar activity_log:', err);
  }
}

/**
 * Consulta lista de páginas de presente com busca e filtros
 */
export async function getGiftPagesList(params: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  pages: GiftPageRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const adminClient = createSupabaseAdminClient();
  const page = params.page || 1;
  const pageSize = params.pageSize || 15;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = adminClient
    .from('gift_pages')
    .select('*, orders(code, customer_name, customer_whatsapp)', { count: 'exact' })
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }

  if (params.search && params.search.trim()) {
    const term = params.search.trim();
    query = query.or(`title.ilike.%${term}%,recipient_name.ilike.%${term}%`);
  }

  const { data, count, error } = await query;
  const totalCount = count || 0;

  return {
    pages: (data as GiftPageRow[]) || [],
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
  };
}

/**
 * Obtém os detalhes completos de uma página de presente pelo ID
 */
export async function getGiftPageById(id: string): Promise<{
  giftPage: GiftPageRow | null;
  order: OrderRow | null;
}> {
  const adminClient = createSupabaseAdminClient();

  const { data: giftPage, error } = await adminClient
    .from('gift_pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !giftPage) {
    return { giftPage: null, order: null };
  }

  let order: OrderRow | null = null;
  if (giftPage.order_id) {
    const { data: orderData } = await adminClient
      .from('orders')
      .select('*')
      .eq('id', giftPage.order_id)
      .single();
    order = orderData as OrderRow | null;
  }

  return {
    giftPage: giftPage as GiftPageRow,
    order,
  };
}

/**
 * Cria uma página de presente avulsa / manual
 */
export async function createManualGiftPage(
  data: {
    title: string;
    recipient_name: string;
    template_type: string;
    order_id?: string | null;
  },
  adminId?: string
): Promise<{ success: boolean; giftPage?: GiftPageRow; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const initialContent = {
    ...DEFAULT_GIFT_CONTENT,
    slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    openingText: {
      headline: data.title,
      description: 'Um presente interativo criado especialmente para você.',
      buttonLabel: 'Abrir Presente',
    },
    recipient: {
      ...DEFAULT_GIFT_CONTENT.recipient,
      name: data.recipient_name,
      subtitle: data.template_type === 'primeiro-ano' ? 'Meu Primeiro Ano' : data.title,
      introQuote: 'Histórias que viram presente.',
    },
  };

  const initialTheme = {
    ...DEFAULT_GIFT_THEME,
    styleId: 'afetuoso',
  };

  const { data: newPage, error: createErr } = await adminClient
    .from('gift_pages')
    .insert({
      order_id: data.order_id || null,
      title: data.title,
      recipient_name: data.recipient_name,
      template_type: data.template_type || 'primeiro-ano',
      status: 'draft',
      content: initialContent,
      theme: initialTheme,
      created_by: adminId || null,
      updated_by: adminId || null,
    })
    .select('*')
    .single();

  if (createErr) {
    return { success: false, error: createErr.message };
  }

  await logActivity(adminId || null, 'gift_page_created_manually', 'gift_page', newPage.id, {
    title: data.title,
  });

  return { success: true, giftPage: newPage as GiftPageRow };
}

/**
 * Arquiva uma página de presente
 */
export async function archiveGiftPage(
  id: string,
  adminId?: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createSupabaseAdminClient();

  const { error } = await adminClient
    .from('gift_pages')
    .update({
      archived_at: new Date().toISOString(),
      updated_by: adminId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logActivity(adminId || null, 'gift_page_archived', 'gift_page', id);
  return { success: true };
}

