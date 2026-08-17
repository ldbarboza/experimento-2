import { Pessoa, CreatePessoaDTO, UpdatePessoaDTO } from '@/lib/types/pessoa';
import { generateId } from '@/lib/utils/uuid';

interface DatabaseError {
  code: string;
  message: string;
}

class PessoasDatabase {
  private static instance: PessoasDatabase;
  private pessoas: Map<string, Pessoa> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id mapping

  private constructor() {}

  static getInstance(): PessoasDatabase {
    if (!PessoasDatabase.instance) {
      PessoasDatabase.instance = new PessoasDatabase();
    }
    return PessoasDatabase.instance;
  }

  /**
   * Create a new person
   */
  create(data: CreatePessoaDTO): Pessoa | DatabaseError {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check for duplicate email
    if (this.emailIndex.has(normalizedEmail)) {
      return {
        code: 'DUPLICATE_EMAIL',
        message: 'Email já cadastrado',
      };
    }

    const id = generateId();
    const now = new Date().toISOString();

    const pessoa: Pessoa = {
      id,
      nome: data.nome.trim(),
      email: normalizedEmail,
      telefone: data.telefone ? data.telefone.trim() : undefined,
      dataNascimento: data.dataNascimento ? data.dataNascimento.trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.pessoas.set(id, pessoa);
    this.emailIndex.set(normalizedEmail, id);

    return pessoa;
  }

  /**
   * Read a single person by ID
   */
  read(id: string): Pessoa | null {
    return this.pessoas.get(id) || null;
  }

  /**
   * Read all people with pagination and search
   */
  readAll(page: number = 1, limit: number = 10, search?: string) {
    let filtered = Array.from(this.pessoas.values());

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const data = filtered.slice(startIndex, endIndex);

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
   */
  update(id: string, data: UpdatePessoaDTO): Pessoa | DatabaseError | null {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      return null;
    }

    // Check for email conflict if email is being updated
    if (data.email) {
      const normalizedNewEmail = data.email.toLowerCase().trim();
      const currentNormalizedEmail = pessoa.email.toLowerCase();

      if (normalizedNewEmail !== currentNormalizedEmail) {
        if (this.emailIndex.has(normalizedNewEmail)) {
          return {
            code: 'DUPLICATE_EMAIL',
            message: 'Email já cadastrado',
          };
        }

        // Remove old email from index
        this.emailIndex.delete(currentNormalizedEmail);
        // Add new email to index
        this.emailIndex.set(normalizedNewEmail, id);
        pessoa.email = normalizedNewEmail;
      }
    }

    // Update fields
    if (data.nome) {
      pessoa.nome = data.nome.trim();
    }
    if (data.telefone !== undefined) {
      pessoa.telefone = data.telefone ? data.telefone.trim() : undefined;
    }
    if (data.dataNascimento !== undefined) {
      pessoa.dataNascimento = data.dataNascimento ? data.dataNascimento.trim() : undefined;
    }

    pessoa.updatedAt = new Date().toISOString();

    return pessoa;
  }

  /**
   * Delete a person
   */
  delete(id: string): boolean {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) {
      return false;
    }

    this.emailIndex.delete(pessoa.email.toLowerCase());
    this.pessoas.delete(id);

    return true;
  }

  /**
   * Check if email exists
   */
  emailExists(email: string): boolean {
    return this.emailIndex.has(email.toLowerCase().trim());
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
}

export const db = PessoasDatabase.getInstance();
export default PessoasDatabase;
