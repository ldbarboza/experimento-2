/**
 * In-memory database service for Pessoa entity
 * Singleton pattern ensures single instance across all requests
 */

import { Pessoa, CreatePessoaDTO, UpdatePessoaDTO, PaginatedResponse } from '@/lib/types/pessoa';
import { normalizeEmail, normalizeTelefone } from '@/lib/validation/pessoasValidator';

class PessoasDatabase {
  private static instance: PessoasDatabase;
  private pessoas: Map<string, Pessoa> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id mapping for quick lookup

  private constructor() {}

  /**
   * Gets the singleton instance of the database
   */
  static getInstance(): PessoasDatabase {
    if (!PessoasDatabase.instance) {
      PessoasDatabase.instance = new PessoasDatabase();
    }
    return PessoasDatabase.instance;
  }

  /**
   * Generates a UUID v4
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Gets current ISO timestamp
   */
  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Creates a new person
   * @throws Error if email already exists
   */
  create(dto: CreatePessoaDTO): Pessoa {
    const normalizedEmail = normalizeEmail(dto.email);

    // Check for duplicate email
    if (this.emailIndex.has(normalizedEmail)) {
      throw new Error(`Email ${dto.email} já está registrado`);
    }

    const id = this.generateId();
    const now = this.getCurrentTimestamp();

    const pessoa: Pessoa = {
      id,
      nome: dto.nome.trim(),
      email: normalizedEmail,
      telefone: dto.telefone ? normalizeTelefone(dto.telefone) : undefined,
      dataNascimento: dto.dataNascimento,
      createdAt: now,
      updatedAt: now,
    };

    this.pessoas.set(id, pessoa);
    this.emailIndex.set(normalizedEmail, id);

    return pessoa;
  }

  /**
   * Reads a single person by ID
   */
  read(id: string): Pessoa | null {
    return this.pessoas.get(id) || null;
  }

  /**
   * Reads all people with pagination and optional search
   */
  readAll(page: number = 1, limit: number = 10, search?: string): PaginatedResponse<Pessoa> {
    let allPessoas = Array.from(this.pessoas.values());

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      allPessoas = allPessoas.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort by createdAt descending (newest first)
    allPessoas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = allPessoas.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const data = allPessoas.slice(startIndex, endIndex);

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
   * Updates a person
   * @throws Error if person not found or email already exists
   */
  update(id: string, dto: UpdatePessoaDTO): Pessoa {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      throw new Error(`Pessoa com ID ${id} não encontrada`);
    }

    // Check for email conflict if email is being updated
    if (dto.email) {
      const normalizedNewEmail = normalizeEmail(dto.email);
      const existingId = this.emailIndex.get(normalizedNewEmail);

      if (existingId && existingId !== id) {
        throw new Error(`Email ${dto.email} já está registrado`);
      }

      // Remove old email from index
      this.emailIndex.delete(normalizeEmail(pessoa.email));
      // Add new email to index
      this.emailIndex.set(normalizedNewEmail, id);
    }

    // Update fields
    const updated: Pessoa = {
      ...pessoa,
      nome: dto.nome !== undefined ? dto.nome.trim() : pessoa.nome,
      email: dto.email !== undefined ? normalizeEmail(dto.email) : pessoa.email,
      telefone: dto.telefone !== undefined ? normalizeTelefone(dto.telefone) : pessoa.telefone,
      dataNascimento: dto.dataNascimento !== undefined ? dto.dataNascimento : pessoa.dataNascimento,
      updatedAt: this.getCurrentTimestamp(),
    };

    this.pessoas.set(id, updated);
    return updated;
  }

  /**
   * Deletes a person
   * @throws Error if person not found
   */
  delete(id: string): void {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      throw new Error(`Pessoa com ID ${id} não encontrada`);
    }

    this.pessoas.delete(id);
    this.emailIndex.delete(normalizeEmail(pessoa.email));
  }

  /**
   * Checks if an email exists (case-insensitive)
   */
  emailExists(email: string, excludeId?: string): boolean {
    const normalizedEmail = normalizeEmail(email);
    const id = this.emailIndex.get(normalizedEmail);
    return id !== undefined && id !== excludeId;
  }

  /**
   * Gets total count of people
   */
  count(): number {
    return this.pessoas.size;
  }

  /**
   * Clears all data (useful for testing)
   */
  clear(): void {
    this.pessoas.clear();
    this.emailIndex.clear();
  }
}

export const pessoasDb = PessoasDatabase.getInstance();
