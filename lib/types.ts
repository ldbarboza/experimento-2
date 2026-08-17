export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  data_nascimento?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
  status: 'success' | 'error';
}

export interface ValidationErrorDetails {
  [field: string]: string[];
}

export type CreatePessoaRequest = Omit<Pessoa, 'id' | 'criado_em' | 'atualizado_em'>;

export type UpdatePessoaRequest = Partial<Omit<Pessoa, 'id' | 'criado_em' | 'atualizado_em'>>;
