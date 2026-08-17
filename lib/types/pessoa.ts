/**
 * Pessoa (Person) data model
 */
export interface Pessoa {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string; // ISO 8601 format (YYYY-MM-DD)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * DTO for creating a new pessoa
 */
export interface CreatePessoaDTO {
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
}

/**
 * DTO for updating a pessoa (all fields optional)
 */
export interface UpdatePessoaDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * API Error response
 */
export interface ErrorResponse {
  status: number;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
}
