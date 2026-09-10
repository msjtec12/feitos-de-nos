import { redirect } from 'next/navigation';

export default function RedirectToEditar({ params }: { params: { id: string } }) {
  redirect(`/admin/paginas/${params.id}/editar`);
}
