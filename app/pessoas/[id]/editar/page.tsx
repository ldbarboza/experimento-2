'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PessoaForm from '@/components/PessoaForm';
import { Pessoa, UpdatePessoaDTO } from '@/lib/types/pessoa';

export default function EditarPessoaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await fetch(`/api/pessoas/${params.id}`);
        if (!response.ok) {
          throw new Error('Pessoa não encontrada');
        }
        const data = await response.json();
        setPessoa(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pessoa');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPessoa();
  }, [params.id]);

  const handleSubmit = async (data: UpdatePessoaDTO) => {
    const response = await fetch(`/api/pessoas/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details ? Object.values(error.details).join(', ') : error.message);
    }

    // Redirect to detail page
    router.push(`/pessoas/${params.id}`);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">Carregando...</div>
        </div>
      </main>
    );
  }

  if (error || !pessoa) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/pessoas" className="text-blue-600 hover:text-blue-800">
              ← Voltar para lista
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Pessoa não encontrada'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href={`/pessoas/${params.id}`} className="text-blue-600 hover:text-blue-800">
            ← Voltar para detalhes
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Pessoa</h1>
          <PessoaForm initialData={pessoa} onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
