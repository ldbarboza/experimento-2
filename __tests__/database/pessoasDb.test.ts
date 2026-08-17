/**
 * Tests for PessoasDatabase service
 */

import { PessoasDatabase } from '@/lib/database/pessoasDb';
import { CreatePessoaDTO } from '@/lib/types/pessoa';

describe('PessoasDatabase', () => {
  let db: PessoasDatabase;

  beforeEach(() => {
    // Get fresh instance for each test
    db = PessoasDatabase.getInstance();
    db.clear();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PessoasDatabase.getInstance();
      const instance2 = PessoasDatabase.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Create', () => {
    it('should create a new person', () => {
      const data: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        dataNascimento: '1990-01-15',
      };

      const pessoa = db.create(data);

      expect(pessoa.id).toBeDefined();
      expect(pessoa.nome).toBe('João Silva');
      expect(pessoa.email).toBe('joao@example.com');
      expect(pessoa.telefone).toBe('11999999999');
      expect(pessoa.dataNascimento).toBe('1990-01-15');
      expect(pessoa.createdAt).toBeDefined();
      expect(pessoa.updatedAt).toBeDefined();
    });

    it('should normalize email to lowercase', () => {
      const data: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'JOAO@EXAMPLE.COM',
      };

      const pessoa = db.create(data);

      expect(pessoa.email).toBe('joao@example.com');
    });

    it('should throw error for duplicate email', () => {
      const data: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      db.create(data);

      expect(() => {
        db.create(data);
      }).toThrow('já está registrado');
    });

    it('should throw error for duplicate email (case-insensitive)', () => {
      const data1: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const data2: CreatePessoaDTO = {
        nome: 'João Silva 2',
        email: 'JOAO@EXAMPLE.COM',
      };

      db.create(data1);

      expect(() => {
        db.create(data2);
      }).toThrow('já está registrado');
    });

    it('should create person without optional fields', () => {
      const data: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const pessoa = db.create(data);

      expect(pessoa.telefone).toBeUndefined();
      expect(pessoa.dataNascimento).toBeUndefined();
    });
  });

  describe('Read', () => {
    it('should read a person by ID', () => {
      const data: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const created = db.create(data);
      const read = db.read(created.id);

      expect(read).toEqual(created);
    });

    it('should return null for non-existent ID', () => {
      const read = db.read('non-existent-id');
      expect(read).toBeNull();
    });
  });

  describe('ReadAll', () => {
    it('should return all people', () => {
      const data1: CreatePessoaDTO = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const data2: CreatePessoaDTO = {
        nome: 'Maria Santos',
        email: 'maria@example.com',
      };

      db.create(data1);
      db.create(data2);

      const result = db.readAll();

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should support pagination', () => {
      // Create 25 people
      for (let i = 0; i < 25; i++) {
        db.create({
          nome: `Pessoa ${i}`,
          email: `pessoa${i}@example.com`,
        });
      }

      const page1 = db.readAll(1, 10);
      const page2 = db.readAll(2, 10);
      const page3 = db.readAll(3, 10);

      expect(page1.data).toHaveLength(10);
      expect(page2.data).toHaveLength(10);
      expect(page3.data).toHaveLength(5);
      expect(page1.pagination.pages).toBe(3);
      expect(page1.pagination.total).toBe(25);
    });

    it('should support search by name', () => {
      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      const result = db.readAll(1, 10, 'João');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].nome).toBe('João Silva');
    });

    it('should support search by email', () => {
      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      const result = db.readAll(1, 10, 'maria');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].email).toBe('maria@example.com');
    });

    it('should return empty array when search has no results', () => {
      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      const result = db.readAll(1, 10, 'nonexistent');

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('Update', () => {
    it('should update a person', () => {
      const created = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      const updated = db.update(created.id, {
        nome: 'João Silva Updated',
      });

      expect(updated.nome).toBe('João Silva Updated');
      expect(updated.email).toBe('joao@example.com');
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it('should support partial update', () => {
      const created = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
      });

      const updated = db.update(created.id, {
        telefone: '11888888888',
      });

      expect(updated.nome).toBe('João Silva');
      expect(updated.email).toBe('joao@example.com');
      expect(updated.telefone).toBe('11888888888');
    });

    it('should throw error for non-existent ID', () => {
      expect(() => {
        db.update('non-existent-id', { nome: 'New Name' });
      }).toThrow('não encontrada');
    });

    it('should throw error when updating to duplicate email', () => {
      const pessoa1 = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      expect(() => {
        db.update(pessoa1.id, {
          email: 'maria@example.com',
        });
      }).toThrow('já está registrado');
    });

    it('should allow updating email to same email', () => {
      const pessoa = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      const updated = db.update(pessoa.id, {
        email: 'joao@example.com',
      });

      expect(updated.email).toBe('joao@example.com');
    });

    it('should normalize email when updating', () => {
      const pessoa = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      const updated = db.update(pessoa.id, {
        email: 'NEWEMAIL@EXAMPLE.COM',
      });

      expect(updated.email).toBe('newemail@example.com');
    });
  });

  describe('Delete', () => {
    it('should delete a person', () => {
      const created = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.delete(created.id);

      const read = db.read(created.id);
      expect(read).toBeNull();
    });

    it('should throw error for non-existent ID', () => {
      expect(() => {
        db.delete('non-existent-id');
      }).toThrow('não encontrada');
    });

    it('should remove email from index when deleting', () => {
      const created = db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.delete(created.id);

      // Should be able to create new person with same email
      const newPessoa = db.create({
        nome: 'João Silva 2',
        email: 'joao@example.com',
      });

      expect(newPessoa.email).toBe('joao@example.com');
    });
  });

  describe('Search', () => {
    it('should search by name', () => {
      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      const results = db.search('João');

      expect(results).toHaveLength(1);
      expect(results[0].nome).toBe('João Silva');
    });

    it('should search by email', () => {
      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      const results = db.search('maria');

      expect(results).toHaveLength(1);
      expect(results[0].email).toBe('maria@example.com');
    });
  });

  describe('Count', () => {
    it('should return correct count', () => {
      expect(db.count()).toBe(0);

      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      expect(db.count()).toBe(1);

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      expect(db.count()).toBe(2);
    });
  });

  describe('Clear', () => {
    it('should clear all data', () => {
      db.create({
        nome: 'João Silva',
        email: 'joao@example.com',
      });

      db.create({
        nome: 'Maria Santos',
        email: 'maria@example.com',
      });

      expect(db.count()).toBe(2);

      db.clear();

      expect(db.count()).toBe(0);
    });
  });
});
