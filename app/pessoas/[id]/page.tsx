'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pessoa } from '@/lib/types/pessoa';
import { formatDateBR } from '@/lib/utils/date';
import styles from '@/styles/page.module.css';

export default function PessoaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPessoa = async () => {
      try {
        const response = await fetch(`/api/pessoas/${id}`);
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
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/pessoas/${id}`, {
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
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error || !pessoa) {
    return (
      <div className={styles.page}>
        <div className={styles.errorAlert}>{error || 'Pessoa não encontrada'}</div>
        <Link href="/pessoas" className={styles.backBtn}>
          ← Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Detalhes da Pessoa</h1>
        <Link href="/pessoas" className={styles.backBtn}>
          ← Voltar
        </Link>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.detailRow}>
          <label>Nome:</label>
          <span>{pessoa.nome}</span>
        </div>
        <div className={styles.detailRow}>
          <label>Email:</label>
          <span>{pessoa.email}</span>
        </div>
        <div className={styles.detailRow}>
          <label>Telefone:</label>
          <span>{pessoa.telefone || '-'}</span>
        </div>
        <div className={styles.detailRow}>
          <label>Data de Nascimento:</label>
          <span>{pessoa.dataNascimento ? formatDateBR(pessoa.dataNascimento) : '-'}</span>
        </div>
        <div className={styles.detailRow}>
          <label>Criado em:</label>
          <span>{new Date(pessoa.createdAt).toLocaleString('pt-BR')}</span>
        </div>
        <div className={styles.detailRow}>
          <label>Última atualização:</label>
          <span>{new Date(pessoa.updatedAt).toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href={`/pessoas/${id}/editar`} className={styles.editBtn}>
          Editar
        </Link>
        <button onClick={() => setDeleteConfirm(true)} className={styles.deleteBtn}>
          Deletar
        </button>
      </div>

      {deleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirmar Deleção</h2>
            <p>Tem certeza que deseja deletar {pessoa.nome}?</p>
            <div className={styles.modalActions}>
              <button
                onClick={() => setDeleteConfirm(false)}
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
              <button onClick={handleDelete} className={styles.confirmDeleteBtn}>
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
