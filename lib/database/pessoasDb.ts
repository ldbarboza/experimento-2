import { Pessoa, CreatePessoaDTO, UpdatePessoaDTO, PaginatedResponse } from '@/lib/types/pessoa';
import { generateUUID } from '@/lib/utils/uuid';
import { getCurrentTimestamp } from '@/lib/utils/date';
import { normalizeEmail } from '@/lib/utils/normalization';

/**
 * In-memory database service for Pessoas
 * Singleton pattern ensures single instance across all requests
 */
class PessoasDatabase {
  private static instance: PessoasDatabase;
  private pessoas: Map<string, Pessoa> = new Map();
  private emailIndex: Map<string, string> = new Map(); // normalized email -> id

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): PessoasDatabase {
    if (!PessoasDatabase.instance) {
      PessoasDatabase.instance = new PessoasDatabase();
    }
    return PessoasDatabase.instance;
  }

  /**
   * Create a new pessoa
   */
  create(data: CreatePessoaDTO): Pessoa {
    const normalizedEmail = normalizeEmail(data.email);

    // Check for duplicate email
    if (this.emailIndex.has(normalizedEmail)) {
      throw new Error(`Email já existe: ${data.email}`);
    }

    const id = generateUUID();
    const now = getCurrentTimestamp();

    const pessoa: Pessoa = {
      id,
      nome: data.nome.trim(),
      email: normalizedEmail,
      telefone: data.telefone?.trim(),
      dataNascimento: data.dataNascimento,
      createdAt: now,
      updatedAt: now,
    };

    this.pessoas.set(id, pessoa);
    this.emailIndex.set(normalizedEmail, id);

    return pessoa;
  }

  /**
   * Read a single pessoa by ID
   */
  read(id: string): Pessoa | null {
    return this.pessoas.get(id) || null;
  }

  /**
   * Read all pessoas with pagination and optional search
   */
  readAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): PaginatedResponse<Pessoa> {
    let filtered = Array.from(this.pessoas.values());

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate pagination
    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const data = filtered.slice(start, end);

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
   * Update a pessoa
   */
  update(id: string, data: UpdatePessoaDTO): Pessoa {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      throw new Error(`Pessoa não encontrada: ${id}`);
    }

    // Check for email conflict if email is being updated
    if (data.email) {
      const normalizedNewEmail = normalizeEmail(data.email);
      const existingId = this.emailIndex.get(normalizedNewEmail);

      if (existingId && existingId !== id) {
        throw new Error(`Email já existe: ${data.email}`);
      }

      // Remove old email from index
      this.emailIndex.delete(normalizeEmail(pessoa.email));
      // Add new email to index
      this.emailIndex.set(normalizedNewEmail, id);
      pessoa.email = normalizedNewEmail;
    }

    // Update fields
    if (data.nome !== undefined) {
      pessoa.nome = data.nome.trim();
    }
    if (data.telefone !== undefined) {
      pessoa.telefone = data.telefone.trim();
    }
    if (data.dataNascimento !== undefined) {
      pessoa.dataNascimento = data.dataNascimento;
    }

    pessoa.updatedAt = getCurrentTimestamp();

    return pessoa;
  }

  /**
   * Delete a pessoa
   */
  delete(id: string): boolean {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      return false;
    }

    this.pessoas.delete(id);
    this.emailIndex.delete(normalizeEmail(pessoa.email));

    return true;
  }

  /**
   * Check if email exists (for validation)
   */
  emailExists(email: string, excludeId?: string): boolean {
    const normalizedEmail = normalizeEmail(email);
    const existingId = this.emailIndex.get(normalizedEmail);

    if (!existingId) {
      return false;
    }

    if (excludeId && existingId === excludeId) {
      return false;
    }

    return true;
  }

  /**
   * Get total count of pessoas
   */
  count(): number {
    return this.pessoas.size;
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.pessoas.clear();
    this.emailIndex.clear();
  }
}

// Export singleton instance
export const pessoasDb = PessoasDatabase.getInstance();
