'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pessoa } from '@/lib/types/pessoa';

export default function PessoaDetailPage({ params }: { params: { id: string } }) {
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

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pessoas/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar pessoa');
      }

      router.push('/pessoas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar pessoa');
    }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{pessoa.nome}</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{pessoa.email}</p>
            </div>

            {pessoa.telefone && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <p className="mt-1 text-gray-900">{pessoa.telefone}</p>
              </div>
            )}

            {pessoa.dataNascimento && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <p className="mt-1 text-gray-900">{formatDate(pessoa.dataNascimento)}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Criado em</label>
              <p className="mt-1 text-gray-900">
                {new Date(pessoa.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Atualizado em</label>
              <p className="mt-1 text-gray-900">
                {new Date(pessoa.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/pessoas/${pessoa.id}/editar`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
