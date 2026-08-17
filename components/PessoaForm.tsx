'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pessoa, CreatePessoaDTO, UpdatePessoaDTO } from '@/lib/types/pessoa';

interface PessoaFormProps {
  pessoa?: Pessoa;
  onSubmit?: (pessoa: Pessoa) => void;
  isLoading?: boolean;
}

export default function PessoaForm({ pessoa, onSubmit, isLoading = false }: PessoaFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (pessoa) {
      setFormData({
        nome: pessoa.nome,
        email: pessoa.email,
        telefone: pessoa.telefone || '',
        dataNascimento: pessoa.dataNascimento || '',
      });
    }
  }, [pessoa]);

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
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const url = pessoa ? `/api/pessoas/${pessoa.id}` : '/api/pessoas';
      const method = pessoa ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details);
        }
        setErrorMessage(data.message || 'Erro ao salvar pessoa');
        setSubmitting(false);
        return;
      }

      setSuccessMessage(
        pessoa ? 'Pessoa atualizada com sucesso!' : 'Pessoa criada com sucesso!'
      );

      if (onSubmit) {
        onSubmit(data);
      } else {
        // Redirect to list after 1 second
        setTimeout(() => {
          router.push('/pessoas');
        }, 1000);
      }
    } catch (error) {
      setErrorMessage('Erro ao salvar pessoa. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{errorMessage}</p>
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
          placeholder="Digite o telefone"
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

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting || isLoading ? 'Salvando...' : pessoa ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
