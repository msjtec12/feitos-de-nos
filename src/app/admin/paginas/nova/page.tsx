'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewGiftPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [templateType, setTemplateType] = useState('primeiro-ano');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          recipient_name: recipientName,
          template_type: templateType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar página');

      router.push(`/admin/paginas/${data.giftPage.id}/editar`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar nova página');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      <div className="border-b border-[#713C48]/10 pb-6">
        <Link
          href="/admin/paginas"
          className="text-xs text-[#713C48] hover:underline flex items-center gap-1 font-medium"
        >
          ← Voltar para páginas
        </Link>
        <h1 className="text-3xl font-serif text-[#713C48] font-bold mt-2">
          Criar Nova Página de Presente
        </h1>
        <p className="text-sm text-[#2C2224]/70 mt-1">
          Crie uma experiência avulsa. Após criar, você poderá editar a linha do tempo, fotos e áudios.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-800">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[#713C48]/10 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Título Principal da Página *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Matheus Akira — Meu Primeiro Ano"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Nome do Presenteado *
          </label>
          <input
            type="text"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Ex: Matheus Akira"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Tema / Coleção
          </label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#713C48] focus:outline-none"
          >
            <option value="primeiro-ano">Meu Primeiro Ano</option>
            <option value="casamento">História a Dois / Casamento</option>
            <option value="aniversario">Aniversário Especial</option>
            <option value="homenagem-familia">Homenagem Familiar</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <Link
            href="/admin/paginas"
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#713C48] hover:bg-[#592F39] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Criando...' : 'Criar e Abrir Editor →'}
          </button>
        </div>
      </form>
    </div>
  );
}
