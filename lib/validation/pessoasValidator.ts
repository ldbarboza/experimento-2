import { CreatePessoaDTO, UpdatePessoaDTO, ValidationResult } from '@/lib/types/pessoa';

/**
 * Validates a person's name
 */
export const validateNome = (nome: string): { valid: boolean; error?: string } => {
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
 * Validates an email address
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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

  // Remove non-digit characters for validation
  const digitsOnly = telefone.replace(/\D/g, '');

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, error: 'Telefone deve ter entre 10 e 15 dígitos' };
  }

  return { valid: true };
};

/**
 * Validates a date of birth
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

  // Validate ISO 8601 format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dataNascimento)) {
    return { valid: false, error: 'Data deve estar no formato YYYY-MM-DD' };
  }

  const date = new Date(dataNascimento);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Data inválida' };
  }

  // Check if date is in the past
  if (date > new Date()) {
    return { valid: false, error: 'Data de nascimento deve ser no passado' };
  }

  return { valid: true };
};

/**
 * Validates a complete pessoa creation request
 */
export const validateCreatePessoa = (data: unknown): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: { _: 'Dados inválidos' },
    };
  }

  const dto = data as CreatePessoaDTO;

  const nomeValidation = validateNome(dto.nome);
  if (!nomeValidation.valid) {
    errors.nome = nomeValidation.error || 'Nome inválido';
  }

  const emailValidation = validateEmail(dto.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.error || 'Email inválido';
  }

  const telefoneValidation = validateTelefone(dto.telefone);
  if (!telefoneValidation.valid) {
    errors.telefone = telefoneValidation.error || 'Telefone inválido';
  }

  const dataNascimentoValidation = validateDataNascimento(dto.dataNascimento);
  if (!dataNascimentoValidation.valid) {
    errors.dataNascimento = dataNascimentoValidation.error || 'Data inválida';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

/**
 * Validates a pessoa update request
 */
export const validateUpdatePessoa = (data: unknown): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: { _: 'Dados inválidos' },
    };
  }

  const dto = data as UpdatePessoaDTO;

  // All fields are optional for updates
  if (dto.nome !== undefined) {
    const nomeValidation = validateNome(dto.nome);
    if (!nomeValidation.valid) {
      errors.nome = nomeValidation.error || 'Nome inválido';
    }
  }

  if (dto.email !== undefined) {
    const emailValidation = validateEmail(dto.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error || 'Email inválido';
    }
  }

  if (dto.telefone !== undefined) {
    const telefoneValidation = validateTelefone(dto.telefone);
    if (!telefoneValidation.valid) {
      errors.telefone = telefoneValidation.error || 'Telefone inválido';
    }
  }

  if (dto.dataNascimento !== undefined) {
    const dataNascimentoValidation = validateDataNascimento(dto.dataNascimento);
    if (!dataNascimentoValidation.valid) {
      errors.dataNascimento = dataNascimentoValidation.error || 'Data inválida';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};
