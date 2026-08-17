'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PessoaForm from '@/components/PessoaForm';
import { Pessoa, UpdatePessoaDTO } from '@/lib/types/pessoa';
import styles from '@/styles/page.module.css';

export default function EditarPessoaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pessoa, setPessoa] = useState<Pessoa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: UpdatePessoaDTO) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/pessoas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar pessoa');
      }

      // Success - redirect to detail page
      router.push(`/pessoas/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
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
        <h1>Editar Pessoa</h1>
        <Link href={`/pessoas/${id}`} className={styles.backBtn}>
          ← Voltar
        </Link>
      </div>

      <div className={styles.content}>
        <PessoaForm
          onSubmit={handleSubmit}
          initialData={pessoa}
          isLoading={isSubmitting}
          error={error || undefined}
        />
      </div>
    </div>
  );
}
