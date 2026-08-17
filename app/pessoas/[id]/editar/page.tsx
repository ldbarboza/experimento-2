'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pessoa } from '@/lib/types/pessoa';
import PessoaForm from '@/components/PessoaForm';

interface EditarPessoaPageProps {
  params: {
    id: string;
  };
}

export default function EditarPessoaPage({ params }: EditarPessoaPageProps) {
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await fetch(`/api/pessoas/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Pessoa não encontrada');
          return;
        }

        setPessoa(data);
      } catch (err) {
        setError('Erro ao carregar pessoa');
      } finally {
        setLoading(false);
      }
    };

    fetchPessoa();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-center text-gray-600">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error || !pessoa) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/pessoas" className="text-blue-600 hover:text-blue-800 mb-4 block">
            ← Voltar para lista
          </Link>
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error || 'Pessoa não encontrada'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href={`/pessoas/${pessoa.id}`} className="text-blue-600 hover:text-blue-800">
            ← Voltar para detalhes
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Pessoa</h1>
        <PessoaForm pessoa={pessoa} isLoading={loading} />
      </div>
    </main>
  );
}
