'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PessoaForm from '@/components/PessoaForm';
import { CreatePessoaDTO } from '@/lib/types/pessoa';
import styles from '@/styles/page.module.css';

export default function NovaPessoaPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreatePessoaDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar pessoa');
      }

      // Success - redirect to list
      router.push('/pessoas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Nova Pessoa</h1>
        <Link href="/pessoas" className={styles.backBtn}>
          ← Voltar
        </Link>
      </div>

      <div className={styles.content}>
        <PessoaForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
