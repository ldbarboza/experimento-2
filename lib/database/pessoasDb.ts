/**
 * In-memory database service for Pessoa entity
 * Implements singleton pattern for single instance across application
 */

import { Pessoa, CreatePessoaDTO, UpdatePessoaDTO, PaginatedResponse } from '../types/pessoa';
import { normalizeEmail } from '../validation/pessoasValidator';

export class PessoasDatabase {
  private static instance: PessoasDatabase;
  private pessoas: Map<string, Pessoa> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id mapping

  private constructor() {}

  /**
   * Get singleton instance of database
   */
  static getInstance(): PessoasDatabase {
    if (!PessoasDatabase.instance) {
      PessoasDatabase.instance = new PessoasDatabase();
    }
    return PessoasDatabase.instance;
  }

  /**
   * Generate UUID v4
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Get current ISO timestamp
   */
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Check if email already exists (case-insensitive)
   */
  private emailExists(email: string, excludeId?: string): boolean {
    const normalizedEmail = normalizeEmail(email);
    const existingId = this.emailIndex.get(normalizedEmail);
    return existingId !== undefined && existingId !== excludeId;
  }

  /**
   * Create a new person
   * @throws Error if email already exists
   */
  create(data: CreatePessoaDTO): Pessoa {
    const normalizedEmail = normalizeEmail(data.email);

    if (this.emailExists(normalizedEmail)) {
      throw new Error(`Email ${data.email} já está registrado`);
    }

    const id = this.generateId();
    const now = this.getCurrentTimestamp();

    const pessoa: Pessoa = {
      id,
      nome: data.nome.trim(),
      email: normalizedEmail,
      telefone: data.telefone ? data.telefone.trim() : undefined,
      dataNascimento: data.dataNascimento,
      createdAt: now,
      updatedAt: now,
    };

    this.pessoas.set(id, pessoa);
    this.emailIndex.set(normalizedEmail, id);

    return pessoa;
  }

  /**
   * Read a single person by ID
   * @returns Person object or null if not found
   */
  read(id: string): Pessoa | null {
    return this.pessoas.get(id) || null;
  }

  /**
   * Read all people with pagination and optional search
   */
  readAll(page: number = 1, limit: number = 10, search?: string): PaginatedResponse<Pessoa> {
    let pessoas = Array.from(this.pessoas.values());

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      pessoas = pessoas.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    pessoas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = pessoas.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const data = pessoas.slice(startIndex, endIndex);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  /**
   * Update a person
   * @throws Error if person not found or email already exists
   */
  update(id: string, data: UpdatePessoaDTO): Pessoa {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      throw new Error(`Pessoa com ID ${id} não encontrada`);
    }

    // Check if new email is already taken by another person
    if (data.email && data.email !== pessoa.email) {
      const normalizedNewEmail = normalizeEmail(data.email);
      if (this.emailExists(normalizedNewEmail, id)) {
        throw new Error(`Email ${data.email} já está registrado`);
      }
      // Remove old email from index
      this.emailIndex.delete(pessoa.email);
      // Add new email to index
      this.emailIndex.set(normalizedNewEmail, id);
      pessoa.email = normalizedNewEmail;
    }

    // Update fields
    if (data.nome !== undefined) {
      pessoa.nome = data.nome.trim();
    }
    if (data.telefone !== undefined) {
      pessoa.telefone = data.telefone ? data.telefone.trim() : undefined;
    }
    if (data.dataNascimento !== undefined) {
      pessoa.dataNascimento = data.dataNascimento;
    }

    pessoa.updatedAt = this.getCurrentTimestamp();

    return pessoa;
  }

  /**
   * Delete a person
   * @throws Error if person not found
   */
  delete(id: string): void {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      throw new Error(`Pessoa com ID ${id} não encontrada`);
    }

    this.pessoas.delete(id);
    this.emailIndex.delete(pessoa.email);
  }

  /**
   * Search people by name or email
   */
  search(query: string): Pessoa[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.pessoas.values()).filter(
      (p) =>
        p.nome.toLowerCase().includes(queryLower) ||
        p.email.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Get total count of people
   */
  count(): number {
    return this.pessoas.size;
  }

  /**
   * Clear all data (useful for testing)
   */
  clear(): void {
    this.pessoas.clear();
    this.emailIndex.clear();
  }

  /**
   * Get all people (without pagination)
   */
  getAll(): Pessoa[] {
    return Array.from(this.pessoas.values());
  }
}

// Export singleton instance
export const db = PessoasDatabase.getInstance();
