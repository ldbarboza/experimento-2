'use client';

import { useState } from 'react';
import { Pessoa, CreatePessoaDTO, UpdatePessoaDTO } from '@/lib/types/pessoa';
import { validateCreatePessoa, validateUpdatePessoa } from '@/lib/validation/pessoasValidator';
import styles from '@/styles/form.module.css';

interface PessoaFormProps {
  onSubmit: (data: CreatePessoaDTO | UpdatePessoaDTO) => Promise<void>;
  initialData?: Pessoa;
  isLoading?: boolean;
  error?: string;
}

export default function PessoaForm({
  onSubmit,
  initialData,
  isLoading = false,
  error,
}: PessoaFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone || '',
    dataNascimento: initialData?.dataNascimento || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate
    const validation = initialData
      ? validateUpdatePessoa(formData)
      : validateCreatePessoa(formData);

    if (!validation.valid) {
      setErrors(validation.errors || {});
      return;
    }

    setErrors({});

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="nome">Nome *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Digite o nome completo"
          required
          className={errors.nome ? styles.inputError : ''}
        />
        {errors.nome && <span className={styles.errorText}>{errors.nome}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite o email"
          required
          className={errors.email ? styles.inputError : ''}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="telefone">Telefone</label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="Digite o telefone (opcional)"
          className={errors.telefone ? styles.inputError : ''}
        />
        {errors.telefone && <span className={styles.errorText}>{errors.telefone}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="dataNascimento">Data de Nascimento</label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          className={errors.dataNascimento ? styles.inputError : ''}
        />
        {errors.dataNascimento && (
          <span className={styles.errorText}>{errors.dataNascimento}</span>
        )}
      </div>

      <div className={styles.formActions}>
        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}
