/**
 * Pessoa - Representa uma pessoa no sistema
 */
export interface Pessoa {
  id: string
  nome: string
  email: string
  telefone?: string
  data_nascimento?: string // ISO 8601 format (YYYY-MM-DD)
  ativo: boolean
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
}

/**
 * CreatePessoaRequest - Dados para criar uma nova pessoa
 */
export interface CreatePessoaRequest {
  nome: string
  email: string
  telefone?: string
  data_nascimento?: string
  ativo?: boolean
}

/**
 * UpdatePessoaRequest - Dados para atualizar uma pessoa (todos os campos opcionais)
 */
export interface UpdatePessoaRequest {
  nome?: string
  email?: string
  telefone?: string
  data_nascimento?: string
  ativo?: boolean
}

/**
 * ApiResponse - Resposta padrão da API
 */
export interface ApiResponse<T> {
  data?: T
  error?: string
  details?: Record<string, unknown>
}

/**
 * PaginationParams - Parâmetros de paginação
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * PaginatedResponse - Resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
