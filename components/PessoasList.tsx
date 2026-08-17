'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pessoa, PaginatedResponse } from '@/lib/types/pessoa';
import ConfirmDialog from './ConfirmDialog';

interface PessoasListProps {
  initialPage?: number;
  initialSearch?: string;
}

export default function PessoasList({ initialPage = 1, initialSearch = '' }: PessoasListProps) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; nome: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPessoas = async (pageNum: number, searchQuery: string) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', '10');
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/pessoas?${params.toString()}`);
      const data: PaginatedResponse<Pessoa> = await response.json();

      if (!response.ok) {
        setError('Erro ao carregar pessoas');
        return;
      }

      setPessoas(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Erro ao carregar pessoas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas(page, search);
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/pessoas/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Erro ao deletar pessoa');
        setDeleting(false);
        return;
      }

      setDeleteConfirm(null);
      fetchPessoas(page, search);
    } catch (err) {
      setError('Erro ao deletar pessoa. Tente novamente.');
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
    // Format as (XX) XXXXX-XXXX if it has 11 digits
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <Link
          href="/pessoas/novo"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          + Nova Pessoa
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Carregando...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && pessoas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {search ? 'Nenhuma pessoa encontrada' : 'Nenhuma pessoa cadastrada'}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && pessoas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Data de Nascimento
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{pessoa.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{pessoa.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatPhone(pessoa.telefone)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(pessoa.dataNascimento)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/pessoas/${pessoa.id}`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/pessoas/${pessoa.id}/editar`}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm({ id: pessoa.id, nome: pessoa.nome })}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {(page - 1) * pagination.limit + 1} a{' '}
            {Math.min(page * pagination.limit, pagination.total)} de {pagination.total} pessoas
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-md ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar ${deleteConfirm.nome}? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={deleting}
          confirmText="Deletar"
          cancelText="Cancelar"
          isDangerous
        />
      )}
    </div>
  );
}
