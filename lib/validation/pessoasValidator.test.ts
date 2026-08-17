/**
 * Tests for Pessoa validation utilities
 */

import {
  validateNome,
  validateEmail,
  validateTelefone,
  validateDataNascimento,
  normalizeEmail,
  normalizeTelefone,
  validateCreatePessoa,
  validateUpdatePessoa,
} from './pessoasValidator';

describe('Validation Utilities', () => {
  describe('validateNome', () => {
    it('should validate a valid name', () => {
      const result = validateNome('João Silva');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty name', () => {
      const result = validateNome('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
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

    it('should trim whitespace', () => {
      const result = validateNome('   João Silva   ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate a valid email', () => {
      const result = validateEmail('joao@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid email format', () => {
      const invalidEmails = ['joao', 'joao@', '@example.com', 'joao@example'];
      invalidEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.valid).toBe(false);
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'joao@example.com',
        'joao.silva@example.com',
        'joao+tag@example.co.uk',
        'joao123@example.com',
      ];
      validEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateTelefone', () => {
    it('should validate a valid phone number', () => {
      const result = validateTelefone('11999999999');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept optional phone number', () => {
      const result = validateTelefone();
      expect(result.valid).toBe(true);
    });

    it('should accept phone with formatting', () => {
      const result = validateTelefone('(11) 99999-9999');
      expect(result.valid).toBe(true);
    });

    it('should reject phone with too few digits', () => {
      const result = validateTelefone('123456789');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('entre 10 e 15');
    });

    it('should reject phone with too many digits', () => {
      const result = validateTelefone('123456789012345678');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('entre 10 e 15');
    });
  });

  describe('validateDataNascimento', () => {
    it('should validate a valid past date', () => {
      const pastDate = '1990-01-15';
      const result = validateDataNascimento(pastDate);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept optional date', () => {
      const result = validateDataNascimento();
      expect(result.valid).toBe(true);
    });

    it('should reject invalid date format', () => {
      const result = validateDataNascimento('15/01/1990');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('YYYY-MM-DD');
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const result = validateDataNascimento(dateString);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('passado');
    });

    it('should reject invalid date', () => {
      const result = validateDataNascimento('2024-13-45');
      expect(result.valid).toBe(false);
    });
  });

  describe('normalizeEmail', () => {
    it('should convert to lowercase', () => {
      const result = normalizeEmail('JOAO@EXAMPLE.COM');
      expect(result).toBe('joao@example.com');
    });

    it('should trim whitespace', () => {
      const result = normalizeEmail('  joao@example.com  ');
      expect(result).toBe('joao@example.com');
    });
  });

  describe('normalizeTelefone', () => {
    it('should remove non-digit characters', () => {
      const result = normalizeTelefone('(11) 99999-9999');
      expect(result).toBe('11999999999');
    });

    it('should return undefined for empty phone', () => {
      const result = normalizeTelefone();
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = normalizeTelefone('');
      expect(result).toBeUndefined();
    });
  });

  describe('validateCreatePessoa', () => {
    it('should validate a valid create request', () => {
      const data = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        dataNascimento: '1990-01-15',
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate with only required fields', () => {
      const data = {
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect multiple validation errors', () => {
      const data = {
        nome: 'Jo',
        email: 'invalid-email',
        telefone: '123',
        dataNascimento: 'future-date',
      };

      const result = validateCreatePessoa(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid data type', () => {
      const result = validateCreatePessoa('invalid');
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('validateUpdatePessoa', () => {
    it('should validate a valid update request', () => {
      const data = {
        nome: 'João Silva Updated',
        email: 'joao.updated@example.com',
      };

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow partial update', () => {
      const data = {
        nome: 'João Silva Updated',
      };

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow empty update object', () => {
      const data = {};

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate only provided fields', () => {
      const data = {
        email: 'invalid-email',
      };

      const result = validateUpdatePessoa(data);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === 'email')).toBe(true);
    });

    it('should reject invalid data type', () => {
      const result = validateUpdatePessoa('invalid');
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });
});
