'use client';

import { useState, useEffect } from 'react';
import { Pessoa, CreatePessoaDTO } from '@/lib/types/pessoa';

interface PessoaFormProps {
  initialData?: Pessoa;
  // The form always produces a complete payload (nome/email required), so a
  // handler that accepts UpdatePessoaDTO is also valid here.
  onSubmit: (data: CreatePessoaDTO) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export default function PessoaForm({
  initialData,
  onSubmit,
  isLoading = false,
  error: externalError,
}: PessoaFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone || '',
    dataNascimento: initialData?.dataNascimento || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Filter out empty optional fields
      const dataToSubmit = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        ...(formData.telefone && { telefone: formData.telefone.trim() }),
        ...(formData.dataNascimento && { dataNascimento: formData.dataNascimento }),
      };

      await onSubmit(dataToSubmit);
      setSuccessMessage(
        initialData ? 'Pessoa atualizada com sucesso!' : 'Pessoa criada com sucesso!'
      );

      // Reset form if creating new person
      if (!initialData) {
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          dataNascimento: '',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar pessoa';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(externalError || errors.submit) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {externalError || errors.submit}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.nome ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o nome completo"
          required
        />
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o email"
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.telefone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="(11) 99999-9999"
        />
        {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
      </div>

      <div>
        <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.dataNascimento ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dataNascimento && (
          <p className="mt-1 text-sm text-red-600">{errors.dataNascimento}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting || isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
}
