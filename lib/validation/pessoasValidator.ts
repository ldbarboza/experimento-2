import { CreatePessoaDTO, UpdatePessoaDTO, ValidationError } from '@/lib/types/pessoa';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-()]+$/;
const MIN_NOME_LENGTH = 3;
const MAX_NOME_LENGTH = 255;
const MIN_PHONE_LENGTH = 10;
const MAX_PHONE_LENGTH = 15;

export const validateNome = (nome: string): ValidationError | null => {
  if (!nome || typeof nome !== 'string') {
    return { field: 'nome', message: 'Nome é obrigatório' };
  }

  const trimmed = nome.trim();
  if (trimmed.length < MIN_NOME_LENGTH) {
    return {
      field: 'nome',
      message: `Nome deve ter no mínimo ${MIN_NOME_LENGTH} caracteres`,
    };
  }

  if (trimmed.length > MAX_NOME_LENGTH) {
    return {
      field: 'nome',
      message: `Nome deve ter no máximo ${MAX_NOME_LENGTH} caracteres`,
    };
  }

  return null;
};

export const validateEmail = (email: string): ValidationError | null => {
  if (!email || typeof email !== 'string') {
    return { field: 'email', message: 'Email é obrigatório' };
  }

  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return { field: 'email', message: 'Email inválido' };
  }

  return null;
};

export const validateTelefone = (telefone?: string): ValidationError | null => {
  if (!telefone) {
    return null; // Optional field
  }

  if (typeof telefone !== 'string') {
    return { field: 'telefone', message: 'Telefone deve ser uma string' };
  }

  const trimmed = telefone.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (digitsOnly.length < MIN_PHONE_LENGTH || digitsOnly.length > MAX_PHONE_LENGTH) {
    return {
      field: 'telefone',
      message: `Telefone deve ter entre ${MIN_PHONE_LENGTH} e ${MAX_PHONE_LENGTH} dígitos`,
    };
  }

  if (!PHONE_REGEX.test(trimmed)) {
    return {
      field: 'telefone',
      message: 'Telefone deve conter apenas dígitos, espaços, hífens e parênteses',
    };
  }

  return null;
};

export const validateDataNascimento = (dataNascimento?: string): ValidationError | null => {
  if (!dataNascimento) {
    return null; // Optional field
  }

  if (typeof dataNascimento !== 'string') {
    return { field: 'dataNascimento', message: 'Data de nascimento deve ser uma string' };
  }

  const date = new Date(dataNascimento);
  if (isNaN(date.getTime())) {
    return { field: 'dataNascimento', message: 'Data de nascimento inválida' };
  }

  const today = new Date();
  if (date >= today) {
    return {
      field: 'dataNascimento',
      message: 'Data de nascimento deve ser no passado',
    };
  }

  return null;
};

export const validateCreatePessoa = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return [{ field: 'root', message: 'Dados inválidos' }];
  }

  const dto = data as Record<string, unknown>;

  const nomeError = validateNome(dto.nome as string);
  if (nomeError) errors.push(nomeError);

  const emailError = validateEmail(dto.email as string);
  if (emailError) errors.push(emailError);

  const telefoneError = validateTelefone(dto.telefone as string | undefined);
  if (telefoneError) errors.push(telefoneError);

  const dataNascimentoError = validateDataNascimento(dto.dataNascimento as string | undefined);
  if (dataNascimentoError) errors.push(dataNascimentoError);

  return errors;
};

export const validateUpdatePessoa = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return [{ field: 'root', message: 'Dados inválidos' }];
  }

  const dto = data as Record<string, unknown>;

  if (dto.nome !== undefined) {
    const nomeError = validateNome(dto.nome as string);
    if (nomeError) errors.push(nomeError);
  }

  if (dto.email !== undefined) {
    const emailError = validateEmail(dto.email as string);
    if (emailError) errors.push(emailError);
  }

  if (dto.telefone !== undefined) {
    const telefoneError = validateTelefone(dto.telefone as string | undefined);
    if (telefoneError) errors.push(telefoneError);
  }

  if (dto.dataNascimento !== undefined) {
    const dataNascimentoError = validateDataNascimento(dto.dataNascimento as string | undefined);
    if (dataNascimentoError) errors.push(dataNascimentoError);
  }

  return errors;
};
