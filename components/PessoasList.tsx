'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pessoa, PaginatedResponse } from '@/lib/types/pessoa';
import { formatDateBR } from '@/lib/utils/date';
import styles from '@/styles/list.module.css';

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
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPessoas = async (page: number = 1, searchQuery: string = '') => {
    setIsLoading(true);
    setError(null);

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
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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
    if (!onDelete) return;

    try {
      await onDelete(id);
      setDeleteConfirm(null);
      await fetchPessoas(pagination.page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar pessoa');
    }
  };

  if (isLoading && pessoas.length === 0) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Pessoas</h1>
        <Link href="/pessoas/novo" className={styles.createBtn}>
          + Nova Pessoa
        </Link>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {pessoas.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhuma pessoa encontrada</p>
          <Link href="/pessoas/novo">Criar primeira pessoa</Link>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Data de Nascimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td>{pessoa.nome}</td>
                    <td>{pessoa.email}</td>
                    <td>{pessoa.telefone || '-'}</td>
                    <td>{pessoa.dataNascimento ? formatDateBR(pessoa.dataNascimento) : '-'}</td>
                    <td className={styles.actions}>
                      <Link href={`/pessoas/${pessoa.id}`} className={styles.viewBtn}>
                        Ver
                      </Link>
                      <Link href={`/pessoas/${pessoa.id}/editar`} className={styles.editBtn}>
                        Editar
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(pessoa.id)}
                        className={styles.deleteBtn}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={styles.paginationBtn}
            >
              Anterior
            </button>
            <span className={styles.pageInfo}>
              Página {pagination.page} de {pagination.pages} (Total: {pagination.total})
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={styles.paginationBtn}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {deleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirmar Deleção</h2>
            <p>Tem certeza que deseja deletar esta pessoa?</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className={styles.confirmDeleteBtn}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
