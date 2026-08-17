/**
 * Validation utilities for Pessoa entity
 */

import { CreatePessoaDTO, UpdatePessoaDTO, ValidationError } from '@/lib/types/pessoa';

const NOME_MIN_LENGTH = 3;
const NOME_MAX_LENGTH = 255;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

/**
 * Validates a person's name
 */
export const validateNome = (nome: string): { valid: boolean; error?: string } => {
  if (!nome || typeof nome !== 'string') {
    return { valid: false, error: 'Nome é obrigatório' };
  }

  const trimmed = nome.trim();

  if (trimmed.length < NOME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Nome deve ter no mínimo ${NOME_MIN_LENGTH} caracteres`,
    };
  }

  if (trimmed.length > NOME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Nome deve ter no máximo ${NOME_MAX_LENGTH} caracteres`,
    };
  }

  return { valid: true };
};

/**
 * Validates an email address
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Email inválido' };
  }

  return { valid: true };
};

/**
 * Validates a phone number (flexible format)
 */
export const validateTelefone = (telefone?: string): { valid: boolean; error?: string } => {
  if (!telefone) {
    return { valid: true }; // Optional field
  }

  if (typeof telefone !== 'string') {
    return { valid: false, error: 'Telefone deve ser uma string' };
  }

  // Extract only digits
  const digitsOnly = telefone.replace(/\D/g, '');

  if (digitsOnly.length < PHONE_MIN_DIGITS || digitsOnly.length > PHONE_MAX_DIGITS) {
    return {
      valid: false,
      error: `Telefone deve ter entre ${PHONE_MIN_DIGITS} e ${PHONE_MAX_DIGITS} dígitos`,
    };
  }

  return { valid: true };
};

/**
 * Validates a date of birth (must be in the past)
 */
export const validateDataNascimento = (
  dataNascimento?: string
): { valid: boolean; error?: string } => {
  if (!dataNascimento) {
    return { valid: true }; // Optional field
  }

  if (typeof dataNascimento !== 'string') {
    return { valid: false, error: 'Data de nascimento deve ser uma string' };
  }

  // Check ISO 8601 format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dataNascimento)) {
    return { valid: false, error: 'Data deve estar no formato YYYY-MM-DD' };
  }

  const date = new Date(dataNascimento);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Data de nascimento inválida' };
  }

  if (date >= now) {
    return { valid: false, error: 'Data de nascimento deve ser no passado' };
  }

  return { valid: true };
};

/**
 * Normalizes email to lowercase
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Normalizes phone number (removes non-digits)
 */
export const normalizeTelefone = (telefone?: string): string | undefined => {
  if (!telefone) return undefined;
  return telefone.replace(/\D/g, '');
};

/**
 * Validates a complete Pessoa creation request
 */
export const validateCreatePessoa = (data: unknown): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: [{ field: 'root', message: 'Dados inválidos' }] };
  }

  const dto = data as Record<string, unknown>;

  // Validate nome
  const nomeValidation = validateNome(dto.nome as string);
  if (!nomeValidation.valid) {
    errors.push({ field: 'nome', message: nomeValidation.error! });
  }

  // Validate email
  const emailValidation = validateEmail(dto.email as string);
  if (!emailValidation.valid) {
    errors.push({ field: 'email', message: emailValidation.error! });
  }

  // Validate telefone (optional)
  if (dto.telefone) {
    const telefoneValidation = validateTelefone(dto.telefone as string);
    if (!telefoneValidation.valid) {
      errors.push({ field: 'telefone', message: telefoneValidation.error! });
    }
  }

  // Validate dataNascimento (optional)
  if (dto.dataNascimento) {
    const dataValidation = validateDataNascimento(dto.dataNascimento as string);
    if (!dataValidation.valid) {
      errors.push({ field: 'dataNascimento', message: dataValidation.error! });
    }
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Validates a complete Pessoa update request
 */
export const validateUpdatePessoa = (data: unknown): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: [{ field: 'root', message: 'Dados inválidos' }] };
  }

  const dto = data as Record<string, unknown>;

  // Validate nome if provided
  if (dto.nome !== undefined) {
    const nomeValidation = validateNome(dto.nome as string);
    if (!nomeValidation.valid) {
      errors.push({ field: 'nome', message: nomeValidation.error! });
    }
  }

  // Validate email if provided
  if (dto.email !== undefined) {
    const emailValidation = validateEmail(dto.email as string);
    if (!emailValidation.valid) {
      errors.push({ field: 'email', message: emailValidation.error! });
    }
  }

  // Validate telefone if provided
  if (dto.telefone !== undefined) {
    const telefoneValidation = validateTelefone(dto.telefone as string);
    if (!telefoneValidation.valid) {
      errors.push({ field: 'telefone', message: telefoneValidation.error! });
    }
  }

  // Validate dataNascimento if provided
  if (dto.dataNascimento !== undefined) {
    const dataValidation = validateDataNascimento(dto.dataNascimento as string);
    if (!dataValidation.valid) {
      errors.push({ field: 'dataNascimento', message: dataValidation.error! });
    }
  }

  return { valid: errors.length === 0, errors };
};
