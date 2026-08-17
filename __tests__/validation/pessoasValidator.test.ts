/**
 * Tests for Pessoa validation utilities
 */

import {
  validateNome,
  validateEmail,
  validateTelefone,
  validateDataNascimento,
  validateCreatePessoa,
  validateUpdatePessoa,
  normalizeEmail,
} from '@/lib/validation/pessoasValidator';

describe('Pessoa Validation', () => {
  describe('validateNome', () => {
    it('should validate valid names', () => {
      const result = validateNome('João Silva');
      expect(result.valid).toBe(true);
    });

    it('should reject undefined name', () => {
      const result = validateNome(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject empty name', () => {
      const result = validateNome('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject name with less than 3 characters', () => {
      const result = validateNome('Jo');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('mínimo 3');
    });

    it('should reject name with more than 255 characters', () => {
      const longName = 'a'.repeat(256);
      const result = validateNome(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('máximo 255');
    });

    it('should accept name with exactly 3 characters', () => {
      const result = validateNome('Jão');
      expect(result.valid).toBe(true);
    });

    it('should accept name with exactly 255 characters', () => {
      const name = 'a'.repeat(255);
      const result = validateNome(name);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate valid emails', () => {
      const result = validateEmail('joao@example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject undefined email', () => {
      const result = validateEmail(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('obrigatório');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválido');
    });

    it('should reject email without @', () => {
      const result = validateEmail('joaoexample.com');
      expect(result.valid).toBe(false);
    });

    it('should reject email without domain', () => {
      const result = validateEmail('joao@');
      expect(result.valid).toBe(false);
    });

    it('should accept email with subdomain', () => {
      const result = validateEmail('joao@mail.example.com');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTelefone', () => {
    it('should accept valid phone numbers', () => {
      const result = validateTelefone('11999999999');
      expect(result.valid).toBe(true);
    });

    it('should accept phone with formatting', () => {
      const result = validateTelefone('(11) 99999-9999');
      expect(result.valid).toBe(true);
    });

    it('should accept phone with spaces', () => {
      const result = validateTelefone('11 99999 9999');
      expect(result.valid).toBe(true);
    });

    it('should accept undefined phone (optional)', () => {
      const result = validateTelefone(undefined);
      expect(result.valid).toBe(true);
    });

    it('should accept empty phone (optional)', () => {
      const result = validateTelefone('');
      expect(result.valid).toBe(true);
    });

    it('should reject phone with less than 10 digits', () => {
      const result = validateTelefone('123456789');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 e 15');
    });

    it('should reject phone with more than 15 digits', () => {
      const result = validateTelefone('1234567890123456');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 e 15');
    });

    it('should accept phone with exactly 10 digits', () => {
      const result = validateTelefone('1234567890');
      expect(result.valid).toBe(true);
    });

    it('should accept phone with exactly 15 digits', () => {
      const result = validateTelefone('123456789012345');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateDataNascimento', () => {
    it('should accept valid past date', () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 30);
      const dateString = pastDate.toISOString().split('T')[0];

      const result = validateDataNascimento(dateString);
      expect(result.valid).toBe(true);
    });

    it('should accept undefined date (optional)', () => {
      const result = validateDataNascimento(undefined);
      expect(result.valid).toBe(true);
    });

    it('should accept empty date (optional)', () => {
      const result = validateDataNascimento('');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid date format', () => {
      const result = validateDataNascimento('15/01/1990');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('YYYY-MM-DD');
    });

    it('should reject invalid date', () => {
      const result = validateDataNascimento('2024-13-01');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválida');
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];

      const result = validateDataNascimento(dateString);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('passado');
    });

    it('should reject today date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = validateDataNascimento(today);
      expect(result.valid).toBe(false);
    });
  });

  describe('normalizeEmail', () => {
    it('should convert email to lowercase', () => {
      const normalized = normalizeEmail('JOAO@EXAMPLE.COM');
      expect(normalized).toBe('joao@example.com');
    });

    it('should trim whitespace', () => {
      const normalized = normalizeEmail('  joao@example.com  ');
      expect(normalized).toBe('joao@example.com');
    });
  });

  describe('validateCreatePessoa', () => {
    it('should validate complete valid data', () => {
      const data = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        dataNascimento: '1990-01-15',
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should validate data without optional fields', () => {
      const data = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(true);
    });

    it('should collect multiple validation errors', () => {
      const data = {
        nome: 'Jo', // Too short
        email: 'invalid-email', // Invalid format
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(false);
      expect(result.errors.nome).toBeDefined();
      expect(result.errors.email).toBeDefined();
    });

    it('should validate optional fields when provided', () => {
      const data = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '123', // Too short
        dataNascimento: '2025-01-01', // Future date
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(false);
      expect(result.errors.telefone).toBeDefined();
      expect(result.errors.dataNascimento).toBeDefined();
    });
  });

  describe('validateUpdatePessoa', () => {
    it('should validate partial update', () => {
      const data = {
        nome: 'João Silva Updated',
      };

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(true);
    });

    it('should validate empty update', () => {
      const data = {};

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(true);
    });

    it('should validate only provided fields', () => {
      const data = {
        email: 'invalid-email',
      };

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.nome).toBeUndefined();
    });

    it('should collect multiple validation errors', () => {
      const data = {
        nome: 'Jo', // Too short
        email: 'invalid', // Invalid
        telefone: '123', // Too short
      };

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(3);
    });
  });
});
