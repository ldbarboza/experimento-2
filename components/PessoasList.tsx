'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pessoa, PaginatedResponse } from '@/lib/types/pessoa';

interface PessoasListProps {
  onDelete?: (id: string) => Promise<void>;
}

export default function PessoasList({ onDelete }: PessoasListProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPessoas = async (page: number = 1, searchQuery: string = '') => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/pessoas?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar pessoas');
      }

      const data: PaginatedResponse<Pessoa> = await response.json();
      setPessoas(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pessoas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas(1, search);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    fetchPessoas(1, value);
  };

  const handlePageChange = (newPage: number) => {
    fetchPessoas(newPage, search);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
      return;
    }

    setDeletingId(id);
    try {
      if (onDelete) {
        await onDelete(id);
      } else {
        const response = await fetch(`/api/pessoas/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erro ao deletar pessoa');
        }
      }

      // Refresh list
      fetchPessoas(pagination.page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar pessoa');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && pessoas.length === 0) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <Link
          href="/pessoas/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Nova Pessoa
        </Link>
      </div>

      {pessoas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? 'Nenhuma pessoa encontrada' : 'Nenhuma pessoa cadastrada'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Telefone</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa) => (
                  <tr key={pessoa.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{pessoa.nome}</td>
                    <td className="border border-gray-300 px-4 py-2">{pessoa.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {pessoa.telefone || '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <Link
                        href={`/pessoas/${pessoa.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/pessoas/${pessoa.id}/editar`}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(pessoa.id)}
                        disabled={deletingId === pessoa.id}
                        className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400"
                      >
                        {deletingId === pessoa.id ? 'Deletando...' : 'Deletar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600 text-center">
            Mostrando {pessoas.length} de {pagination.total} pessoas
          </div>
        </>
      )}
    </div>
  );
}
