import { Pessoa, CreatePessoaRequest, UpdatePessoaRequest } from './types'

/**
 * In-memory database for storing people
 * Uses a Map for O(1) lookups by ID
 */
class PessoaDatabase {
  private pessoas: Map<string, Pessoa> = new Map()
  private nextId: number = 1

  /**
   * Create a new person
   */
  create(data: CreatePessoaRequest): Pessoa {
    const id = this.generateId()
    const now = new Date().toISOString()

    const pessoa: Pessoa = {
      id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      data_nascimento: data.data_nascimento,
      ativo: data.ativo !== false,
      createdAt: now,
      updatedAt: now,
    }

    this.pessoas.set(id, pessoa)
    return pessoa
  }

  /**
   * Get all people with optional filtering
   */
  getAll(filters?: {
    nome?: string
    email?: string
    ativo?: boolean
  }): Pessoa[] {
    let result = Array.from(this.pessoas.values())

    if (filters?.nome) {
      result = result.filter((p) =>
        p.nome.toLowerCase().includes(filters.nome!.toLowerCase())
      )
    }

    if (filters?.email) {
      result = result.filter((p) =>
        p.email.toLowerCase().includes(filters.email!.toLowerCase())
      )
    }

    if (filters?.ativo !== undefined) {
      result = result.filter((p) => p.ativo === filters.ativo)
    }

    return result
  }

  /**
   * Get a person by ID
   */
  getById(id: string): Pessoa | null {
    return this.pessoas.get(id) || null
  }

  /**
   * Update a person (partial update)
   */
  update(id: string, data: UpdatePessoaRequest): Pessoa | null {
    const pessoa = this.pessoas.get(id)
    if (!pessoa) {
      return null
    }

    const updated: Pessoa = {
      ...pessoa,
      ...data,
      id: pessoa.id,
      createdAt: pessoa.createdAt,
      updatedAt: new Date().toISOString(),
    }

    this.pessoas.set(id, updated)
    return updated
  }

  /**
   * Delete a person
   */
  delete(id: string): boolean {
    return this.pessoas.delete(id)
  }

  /**
   * Check if a person exists
   */
  exists(id: string): boolean {
    return this.pessoas.has(id)
  }

  /**
   * Get total count of people
   */
  count(): number {
    return this.pessoas.size
  }

  /**
   * Clear all data (useful for testing)
   */
  clear(): void {
    this.pessoas.clear()
    this.nextId = 1
  }

  /**
   * Generate a unique ID using UUID v4
   */
  private generateId(): string {
    return crypto.randomUUID()
  }
}

// Singleton instance
let dbInstance: PessoaDatabase | null = null

/**
 * Get the database instance (singleton pattern)
 */
export function getDatabase(): PessoaDatabase {
  if (!dbInstance) {
    dbInstance = new PessoaDatabase()
  }
  return dbInstance
}

/**
 * Reset database (for testing)
 */
export function resetDatabase(): void {
  if (dbInstance) {
    dbInstance.clear()
  }
}
