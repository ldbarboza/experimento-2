/**
 * Pessoa (Person) domain model
 */
export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  data_nascimento?: string; // ISO 8601 date format (YYYY-MM-DD)
  telefone?: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Request payload for creating a new Pessoa
 */
export interface CreatePessoaRequest {
  nome: string;
  email: string;
  data_nascimento?: string;
  telefone?: string;
}

/**
 * Request payload for updating a Pessoa
 */
export interface UpdatePessoaRequest {
  nome?: string;
  email?: string;
  data_nascimento?: string | null;
  telefone?: string | null;
}

/**
 * Standardized API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  statusCode: number;
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  statusCode: number;
}
