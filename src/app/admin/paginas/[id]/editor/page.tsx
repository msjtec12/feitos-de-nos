import { redirect } from 'next/navigation';

export default function RedirectToEditarAlias({ params }: { params: { id: string } }) {
  redirect(`/admin/paginas/${params.id}/editar`);
}
