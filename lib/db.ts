import { Pessoa, PaginatedResponse } from './types';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

class PessoaStore {
  private pessoas: Map<string, Pessoa> = new Map();
  private emails: Set<string> = new Set();

  create(data: Omit<Pessoa, 'id' | 'criado_em' | 'atualizado_em'>): Pessoa {
    const id = generateUUID();
    const now = getCurrentTimestamp();

    const pessoa: Pessoa = {
      ...data,
      id,
      criado_em: now,
      atualizado_em: now,
    };

    this.pessoas.set(id, pessoa);
    this.emails.add(pessoa.email.toLowerCase());

    return pessoa;
  }

  getById(id: string): Pessoa | null {
    return this.pessoas.get(id) || null;
  }

  list(
    page: number = 1,
    limit: number = 10,
    filters?: { ativo?: boolean; search?: string }
  ): PaginatedResponse<Pessoa> {
    let items = Array.from(this.pessoas.values());

    // Apply filters
    if (filters?.ativo !== undefined) {
      items = items.filter((p) => p.ativo === filters.ativo);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchLower) ||
          p.email.toLowerCase().includes(searchLower)
      );
    }

    const total = items.length;
    const offset = (page - 1) * limit;
    const data = items.slice(offset, offset + limit);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  update(id: string, data: Partial<Omit<Pessoa, 'id' | 'criado_em' | 'atualizado_em'>>): Pessoa | null {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) return null;

    // Handle email change
    if (data.email && data.email !== pessoa.email) {
      this.emails.delete(pessoa.email.toLowerCase());
      this.emails.add(data.email.toLowerCase());
    }

    const updated: Pessoa = {
      ...pessoa,
      ...data,
      atualizado_em: getCurrentTimestamp(),
    };

    this.pessoas.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    const pessoa = this.pessoas.get(id);
    if (!pessoa) return false;

    this.emails.delete(pessoa.email.toLowerCase());
    this.pessoas.delete(id);
    return true;
  }

  emailExists(email: string, excludeId?: string): boolean {
    const emailLower = email.toLowerCase();
    if (!this.emails.has(emailLower)) return false;
    if (excludeId) {
      const pessoa = this.pessoas.get(excludeId);
      return pessoa?.email.toLowerCase() !== emailLower;
    }
    return true;
  }

  clear(): void {
    this.pessoas.clear();
    this.emails.clear();
  }
}

// Singleton instance
let store: PessoaStore | null = null;

export function getStore(): PessoaStore {
  if (!store) {
    store = new PessoaStore();
  }
  return store;
}
