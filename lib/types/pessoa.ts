/**
 * Pessoa (Person) entity types and interfaces
 */

export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string; // ISO 8601 format: YYYY-MM-DD
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface CreatePessoaDTO {
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
}

export interface UpdatePessoaDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  status: number;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}
