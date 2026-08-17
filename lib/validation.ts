import { ValidationErrorDetails } from './types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateTelefone(telefone: string): boolean {
  if (!telefone) return true;
  return PHONE_REGEX.test(telefone) && telefone.length <= 20;
}

export function validateNome(nome: string): boolean {
  return nome && nome.trim().length > 0 && nome.length <= 255;
}

export function validateDataNascimento(data: string): boolean {
  if (!data) return true;
  const date = new Date(data);
  return !isNaN(date.getTime());
}

export interface ValidatePessoaOptions {
  checkEmailUniqueness?: (email: string, excludeId?: string) => boolean;
}

export function validatePessoa(
  data: Record<string, unknown>,
  options: ValidatePessoaOptions = {}
): { valid: boolean; errors: ValidationErrorDetails } {
  const errors: ValidationErrorDetails = {};

  // Validate nome
  if (!data.nome || typeof data.nome !== 'string' || !validateNome(data.nome)) {
    errors.nome = ['Nome é obrigatório e deve ter no máximo 255 caracteres'];
  }

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.email = ['Email é obrigatório'];
  } else if (!validateEmail(data.email)) {
    errors.email = ['Email deve ser válido'];
  } else if (options.checkEmailUniqueness && !options.checkEmailUniqueness(data.email, data.id as string)) {
    errors.email = ['Email já está em uso'];
  }

  // Validate telefone
  if (data.telefone && typeof data.telefone === 'string' && !validateTelefone(data.telefone)) {
    errors.telefone = ['Telefone deve conter apenas números, espaços e caracteres especiais (-, +, parênteses)'];
  }

  // Validate data_nascimento
  if (data.data_nascimento && typeof data.data_nascimento === 'string' && !validateDataNascimento(data.data_nascimento)) {
    errors.data_nascimento = ['Data de nascimento deve ser uma data válida (ISO 8601)'];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
