'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pessoa } from '@/lib/types/pessoa';
import ConfirmDialog from '@/components/ConfirmDialog';

interface PessoaDetailPageProps {
  params: {
    id: string;
  };
}

export default function PessoaDetailPage({ params }: PessoaDetailPageProps) {
  const router = useRouter();
  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/pessoas/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Erro ao deletar pessoa');
        setDeleting(false);
        return;
      }

      setDeleteConfirm(false);
      router.push('/pessoas');
    } catch (err) {
      setError('Erro ao deletar pessoa');
      setDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '-';
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

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
        <Link href="/pessoas" className="text-blue-600 hover:text-blue-800 mb-4 block">
          ← Voltar para lista
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{pessoa.nome}</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg text-gray-900">{pessoa.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <p className="mt-1 text-lg text-gray-900">{formatPhone(pessoa.telefone)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <p className="mt-1 text-lg text-gray-900">{formatDate(pessoa.dataNascimento)}</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Criado em: {new Date(pessoa.createdAt).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">
                Atualizado em: {new Date(pessoa.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/pessoas/${pessoa.id}/editar`}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Editar
            </Link>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar ${pessoa.nome}? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(false)}
          isLoading={deleting}
          confirmText="Deletar"
          cancelText="Cancelar"
          isDangerous
        />
      )}
    </main>
  );
}
