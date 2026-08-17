'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PessoaForm from '@/components/PessoaForm';
import { CreatePessoaDTO } from '@/lib/types/pessoa';

export default function NovaPessoaPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreatePessoaDTO) => {
    const response = await fetch('/api/pessoas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details ? Object.values(error.details).join(', ') : error.message);
    }

    // Redirect to list page
    router.push('/pessoas');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/pessoas" className="text-blue-600 hover:text-blue-800">
            ← Voltar para lista
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Pessoa</h1>
          <PessoaForm onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
