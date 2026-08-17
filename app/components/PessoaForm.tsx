'use client';

import { useState } from 'react';
import { Pessoa, CreatePessoaRequest, UpdatePessoaRequest, ValidationErrorDetails } from '@/lib/types';
import { createPessoa, updatePessoa } from '@/lib/api-client';

interface PessoaFormProps {
  pessoa?: Pessoa;
  onSuccess: (pessoa: Pessoa) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function PessoaForm({ pessoa, onSuccess, onError, onCancel }: PessoaFormProps) {
  const [formData, setFormData] = useState({
    nome: pessoa?.nome || '',
    email: pessoa?.email || '',
    telefone: pessoa?.telefone || '',
    data_nascimento: pessoa?.data_nascimento || '',
    ativo: pessoa?.ativo ?? true,
  });

  const [errors, setErrors] = useState<ValidationErrorDetails>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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
    setLoading(true);
    setErrors({});

    try {
      let result: Pessoa;

      if (pessoa) {
        result = await updatePessoa(pessoa.id, formData as UpdatePessoaRequest);
      } else {
        result = await createPessoa(formData as CreatePessoaRequest);
      }

      onSuccess(result);
    } catch (error: any) {
      if (error.details) {
        setErrors(error.details);
      }
      onError(error.message || 'Erro ao salvar pessoa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          required
        />
        {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome[0]}</p>}
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
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
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
        />
        {errors.telefone && <p className="mt-1 text-sm text-red-500">{errors.telefone[0]}</p>}
      </div>

      <div>
        <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="data_nascimento"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.data_nascimento ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.data_nascimento && (
          <p className="mt-1 text-sm text-red-500">{errors.data_nascimento[0]}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="ativo"
          name="ativo"
          checked={formData.ativo}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
          Ativo
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Salvando...' : pessoa ? 'Atualizar' : 'Criar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
