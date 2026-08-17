/**
 * Tests for PessoasDatabase service
 */

import { pessoasDb } from './pessoasDb';
import { CreatePessoaDTO } from '@/lib/types/pessoa';

describe('PessoasDatabase', () => {
  beforeEach(() => {
    pessoasDb.clear();
  });

  describe('create', () => {
    it('should create a new person', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        dataNascimento: '1990-01-15',
      };

      const pessoa = pessoasDb.create(dto);

      expect(pessoa.id).toBeDefined();
      expect(pessoa.nome).toBe('João Silva');
      expect(pessoa.email).toBe('joao@example.com');
      expect(pessoa.telefone).toBe('11999999999');
      expect(pessoa.dataNascimento).toBe('1990-01-15');
      expect(pessoa.createdAt).toBeDefined();
      expect(pessoa.updatedAt).toBeDefined();
    });

    it('should normalize email to lowercase', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'JOAO@EXAMPLE.COM',
      };

      const pessoa = pessoasDb.create(dto);

      expect(pessoa.email).toBe('joao@example.com');
    });

    it('should throw error on duplicate email', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      pessoasDb.create(dto);

      expect(() => pessoasDb.create(dto)).toThrow('já está registrado');
    });

    it('should throw error on duplicate email (case-insensitive)', () => {
      const dto1: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const dto2: CreatePessoaDTO = {
        nome: 'João Silva 2',
        email: 'JOAO@EXAMPLE.COM',
      };

      pessoasDb.create(dto1);

      expect(() => pessoasDb.create(dto2)).toThrow('já está registrado');
    });

    it('should normalize phone number', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '(11) 99999-9999',
      };

      const pessoa = pessoasDb.create(dto);

      expect(pessoa.telefone).toBe('11999999999');
    });
  });

  describe('read', () => {
    it('should read a person by id', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = pessoasDb.create(dto);
      const read = pessoasDb.read(created.id);

      expect(read).toEqual(created);
    });

    it('should return null for non-existent id', () => {
      const read = pessoasDb.read('non-existent-id');

      expect(read).toBeNull();
    });
  });

  describe('readAll', () => {
    it('should return empty array when no people exist', () => {
      const result = pessoasDb.readAll();

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.pages).toBe(0);
    });

    it('should return all people with pagination', () => {
      const dtos: CreatePessoaDTO[] = [
        { nome: 'João Silva', email: 'joao@example.com' },
        { nome: 'Maria Santos', email: 'maria@example.com' },
        { nome: 'Pedro Oliveira', email: 'pedro@example.com' },
      ];

      dtos.forEach((dto) => pessoasDb.create(dto));

      const result = pessoasDb.readAll(1, 10);

      expect(result.data).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should paginate correctly', () => {
      const dtos: CreatePessoaDTO[] = Array.from({ length: 25 }, (_, i) => ({
        nome: `Pessoa ${i + 1}`,
        email: `pessoa${i + 1}@example.com`,
      }));

      dtos.forEach((dto) => pessoasDb.create(dto));

      const page1 = pessoasDb.readAll(1, 10);
      const page2 = pessoasDb.readAll(2, 10);
      const page3 = pessoasDb.readAll(3, 10);

      expect(page1.data).toHaveLength(10);
      expect(page2.data).toHaveLength(10);
      expect(page3.data).toHaveLength(5);
      expect(page1.pagination.pages).toBe(3);
    });

    it('should search by name', () => {
      const dtos: CreatePessoaDTO[] = [
        { nome: 'João Silva', email: 'joao@example.com' },
        { nome: 'Maria Santos', email: 'maria@example.com' },
        { nome: 'João Oliveira', email: 'joao.oliveira@example.com' },
      ];

      dtos.forEach((dto) => pessoasDb.create(dto));

      const result = pessoasDb.readAll(1, 10, 'João');

      expect(result.data).toHaveLength(2);
      expect(result.data.every((p) => p.nome.includes('João'))).toBe(true);
    });

    it('should search by email', () => {
      const dtos: CreatePessoaDTO[] = [
        { nome: 'João Silva', email: 'joao@example.com' },
        { nome: 'Maria Santos', email: 'maria@example.com' },
      ];

      dtos.forEach((dto) => pessoasDb.create(dto));

      const result = pessoasDb.readAll(1, 10, 'joao');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].email).toBe('joao@example.com');
    });

    it('should sort by createdAt descending', () => {
      const dtos: CreatePessoaDTO[] = [
        { nome: 'Pessoa 1', email: 'pessoa1@example.com' },
        { nome: 'Pessoa 2', email: 'pessoa2@example.com' },
        { nome: 'Pessoa 3', email: 'pessoa3@example.com' },
      ];

      dtos.forEach((dto) => pessoasDb.create(dto));

      const result = pessoasDb.readAll();

      expect(result.data[0].nome).toBe('Pessoa 3');
      expect(result.data[1].nome).toBe('Pessoa 2');
      expect(result.data[2].nome).toBe('Pessoa 1');
    });
  });

  describe('update', () => {
    it('should update a person', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = pessoasDb.create(dto);
      const updated = pessoasDb.update(created.id, {
        nome: 'João Silva Updated',
        email: 'joao.updated@example.com',
      });

      expect(updated.nome).toBe('João Silva Updated');
      expect(updated.email).toBe('joao.updated@example.com');
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it('should allow partial update', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
      };

      const created = pessoasDb.create(dto);
      const updated = pessoasDb.update(created.id, {
        nome: 'João Silva Updated',
      });

      expect(updated.nome).toBe('João Silva Updated');
      expect(updated.email).toBe('joao@example.com');
      expect(updated.telefone).toBe('11999999999');
    });

    it('should throw error if person not found', () => {
      expect(() =>
        pessoasDb.update('non-existent-id', { nome: 'Updated' })
      ).toThrow('não encontrada');
    });

    it('should throw error on email conflict', () => {
      const dto1: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const dto2: CreatePessoaDTO = {
        nome: 'Maria Santos',
        email: 'maria@example.com',
      };

      const pessoa1 = pessoasDb.create(dto1);
      pessoasDb.create(dto2);

      expect(() =>
        pessoasDb.update(pessoa1.id, { email: 'maria@example.com' })
      ).toThrow('já está registrado');
    });

    it('should allow updating to same email', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = pessoasDb.create(dto);
      const updated = pessoasDb.update(created.id, {
        email: 'joao@example.com',
      });

      expect(updated.email).toBe('joao@example.com');
    });
  });

  describe('delete', () => {
    it('should delete a person', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = pessoasDb.create(dto);
      pessoasDb.delete(created.id);

      const read = pessoasDb.read(created.id);
      expect(read).toBeNull();
    });

    it('should throw error if person not found', () => {
      expect(() => pessoasDb.delete('non-existent-id')).toThrow('não encontrada');
    });

    it('should remove email from index', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = pessoasDb.create(dto);
      pessoasDb.delete(created.id);

      // Should be able to create a new person with the same email
      const newPessoa = pessoasDb.create(dto);
      expect(newPessoa.email).toBe('joao@example.com');
    });
  });

  describe('emailExists', () => {
    it('should return true if email exists', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      pessoasDb.create(dto);

      expect(pessoasDb.emailExists('joao@example.com')).toBe(true);
    });

    it('should return false if email does not exist', () => {
      expect(pessoasDb.emailExists('nonexistent@example.com')).toBe(false);
    });

    it('should check case-insensitively', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      pessoasDb.create(dto);

      expect(pessoasDb.emailExists('JOAO@EXAMPLE.COM')).toBe(true);
    });

    it('should exclude specified id', () => {
      const dto: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = pessoasDb.create(dto);

      expect(pessoasDb.emailExists('joao@example.com', created.id)).toBe(false);
    });
  });

  describe('count', () => {
    it('should return correct count', () => {
      expect(pessoasDb.count()).toBe(0);

      const dtos: CreatePessoaDTO[] = [
        { nome: 'Pessoa 1', email: 'pessoa1@example.com' },
        { nome: 'Pessoa 2', email: 'pessoa2@example.com' },
      ];

      dtos.forEach((dto) => pessoasDb.create(dto));

      expect(pessoasDb.count()).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear all data', () => {
      const dtos: CreatePessoaDTO[] = [
        { nome: 'Pessoa 1', email: 'pessoa1@example.com' },
        { nome: 'Pessoa 2', email: 'pessoa2@example.com' },
      ];

      dtos.forEach((dto) => pessoasDb.create(dto));

      expect(pessoasDb.count()).toBe(2);

      pessoasDb.clear();

      expect(pessoasDb.count()).toBe(0);
    });
  });
});
