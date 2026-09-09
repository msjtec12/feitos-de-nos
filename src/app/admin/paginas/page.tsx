import { Metadata } from 'next';
import { getGiftPagesList } from '@/lib/supabase/admin-queries';
import GiftPagesClientList from './GiftPagesClientList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Páginas de Presentes | Feito de Nós Admin',
};

interface PagesProps {
  searchParams: {
    search?: string;
    status?: string;
    page?: string;
  };
}

export default async function GiftPagesPage({ searchParams }: PagesProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const { pages, totalCount, totalPages, pageSize } = await getGiftPagesList({
    search: searchParams.search,
    status: searchParams.status,
    page,
    pageSize: 15,
  });

  return (
    <GiftPagesClientList
      pages={pages}
      totalCount={totalCount}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      currentSearch={searchParams.search}
      currentStatus={searchParams.status}
    />
  );
}
