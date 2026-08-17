import { ApiResponse, Pessoa, PaginatedResponse, CreatePessoaRequest, UpdatePessoaRequest } from './types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super();
  }
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.details);
  }

  return data;
}

export async function listPessoas(
  page: number = 1,
  limit: number = 10,
  filters?: { ativo?: boolean; search?: string }
): Promise<PaginatedResponse<Pessoa>> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());

  if (filters?.ativo !== undefined) {
    params.set('ativo', filters.ativo.toString());
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }

  const response = await fetchApi<PaginatedResponse<Pessoa>>(
    `/api/pessoas?${params.toString()}`
  );

  return response.data!;
}

export async function getPessoa(id: string): Promise<Pessoa> {
  const response = await fetchApi<Pessoa>(`/api/pessoas/${id}`);
  return response.data!;
}

export async function createPessoa(data: CreatePessoaRequest): Promise<Pessoa> {
  const response = await fetchApi<Pessoa>('/api/pessoas', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response.data!;
}

export async function updatePessoa(id: string, data: UpdatePessoaRequest): Promise<Pessoa> {
  const response = await fetchApi<Pessoa>(`/api/pessoas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return response.data!;
}

export async function deletePessoa(id: string): Promise<void> {
  await fetch(`/api/pessoas/${id}`, {
    method: 'DELETE',
  });
}
