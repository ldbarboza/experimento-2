/**
 * Validation utilities for Pessoa entity
 */

import { ValidationResult, ValidationErrors, CreatePessoaDTO, UpdatePessoaDTO } from '../types/pessoa';

/**
 * Validate person's name
 * - Required
 * - Minimum 3 characters
 * - Maximum 255 characters
 */
export const validateNome = (nome: string | undefined): ValidationResult => {
  if (!nome || typeof nome !== 'string') {
    return { valid: false, error: 'Nome é obrigatório' };
  }

  const trimmed = nome.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Nome deve ter no mínimo 3 caracteres' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Nome deve ter no máximo 255 caracteres' };
  }

  return { valid: true };
};

/**
 * Validate email address
 * - Required
 * - Valid email format
 * - Normalized to lowercase
 */
export const validateEmail = (email: string | undefined): ValidationResult => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Email inválido' };
  }

  return { valid: true };
};

/**
 * Validate phone number (optional)
 * - If provided, must contain 10-15 digits
 * - Accepts digits, spaces, hyphens, parentheses
 */
export const validateTelefone = (telefone: string | undefined): ValidationResult => {
  if (!telefone) {
    return { valid: true }; // Optional field
  }

  if (typeof telefone !== 'string') {
    return { valid: false, error: 'Telefone deve ser uma string' };
  }

  // Extract only digits
  const digitsOnly = telefone.replace(/\D/g, '');

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, error: 'Telefone deve conter entre 10 e 15 dígitos' };
  }

  return { valid: true };
};

/**
 * Validate date of birth (optional)
 * - If provided, must be a valid date in the past
 * - Format: YYYY-MM-DD (ISO 8601)
 */
export const validateDataNascimento = (dataNascimento: string | undefined): ValidationResult => {
  if (!dataNascimento) {
    return { valid: true }; // Optional field
  }

  if (typeof dataNascimento !== 'string') {
    return { valid: false, error: 'Data de nascimento deve ser uma string' };
  }

  // Validate ISO 8601 format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dataNascimento)) {
    return { valid: false, error: 'Data de nascimento deve estar no formato YYYY-MM-DD' };
  }

  const date = new Date(dataNascimento);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Data de nascimento inválida' };
  }

  // Check if date is in the past
  if (date >= new Date()) {
    return { valid: false, error: 'Data de nascimento deve ser no passado' };
  }

  return { valid: true };
};

/**
 * Normalize email to lowercase
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Normalize phone number (keep only digits and common separators)
 */
export const normalizeTelefone = (telefone: string): string => {
  return telefone.trim();
};

/**
 * Validate complete pessoa creation data
 */
export const validateCreatePessoa = (data: CreatePessoaDTO): { valid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  const nomeValidation = validateNome(data.nome);
  if (!nomeValidation.valid) {
    errors.nome = nomeValidation.error || 'Nome inválido';
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error || 'Email inválido';
  }

  if (data.telefone) {
    const telefoneValidation = validateTelefone(data.telefone);
    if (!telefoneValidation.valid) {
      errors.telefone = telefoneValidation.error || 'Telefone inválido';
    }
  }

  if (data.dataNascimento) {
    const dataNascimentoValidation = validateDataNascimento(data.dataNascimento);
    if (!dataNascimentoValidation.valid) {
      errors.dataNascimento = dataNascimentoValidation.error || 'Data de nascimento inválida';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate complete pessoa update data
 */
export const validateUpdatePessoa = (data: UpdatePessoaDTO): { valid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  if (data.nome !== undefined) {
    const nomeValidation = validateNome(data.nome);
    if (!nomeValidation.valid) {
      errors.nome = nomeValidation.error || 'Nome inválido';
    }
  }

  if (data.email !== undefined) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || 'Email inválido';
    }
  }

  if (data.telefone !== undefined) {
    const telefoneValidation = validateTelefone(data.telefone);
    if (!telefoneValidation.valid) {
      errors.telefone = telefoneValidation.error || 'Telefone inválido';
    }
  }

  if (data.dataNascimento !== undefined) {
    const dataNascimentoValidation = validateDataNascimento(data.dataNascimento);
    if (!dataNascimentoValidation.valid) {
      errors.dataNascimento = dataNascimentoValidation.error || 'Data de nascimento inválida';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
