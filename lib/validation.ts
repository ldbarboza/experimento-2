/**
 * Validation utilities for Pessoa data
 */

/**
 * Validates email format using a basic RFC 5322 pattern
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone format (basic pattern: digits, spaces, hyphens, parentheses)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validates date format (ISO 8601: YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateString)) return false

  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * Validates required fields for creating a person
 */
export function validateCreatePessoa(data: unknown): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: { body: 'Request body must be a JSON object' } }
  }

  const obj = data as Record<string, unknown>

  // Validate nome
  if (!obj.nome || typeof obj.nome !== 'string' || obj.nome.trim() === '') {
    errors.nome = 'Nome is required and must be a non-empty string'
  } else if (obj.nome.length > 255) {
    errors.nome = 'Nome must not exceed 255 characters'
  }

  // Validate email
  if (!obj.email || typeof obj.email !== 'string' || obj.email.trim() === '') {
    errors.email = 'Email is required and must be a non-empty string'
  } else if (!isValidEmail(obj.email)) {
    errors.email = 'Email must be in a valid format (e.g., user@example.com)'
  }

  // Validate telefone (optional)
  if (obj.telefone !== undefined && obj.telefone !== null) {
    if (typeof obj.telefone !== 'string') {
      errors.telefone = 'Telefone must be a string'
    } else if (obj.telefone.trim() !== '' && !isValidPhone(obj.telefone)) {
      errors.telefone = 'Telefone must contain at least 10 digits'
    }
  }

  // Validate data_nascimento (optional)
  if (obj.data_nascimento !== undefined && obj.data_nascimento !== null) {
    if (typeof obj.data_nascimento !== 'string') {
      errors.data_nascimento = 'Data de nascimento must be a string'
    } else if (!isValidDate(obj.data_nascimento)) {
      errors.data_nascimento = 'Data de nascimento must be in ISO 8601 format (YYYY-MM-DD)'
    }
  }

  // Validate ativo (optional)
  if (obj.ativo !== undefined && obj.ativo !== null) {
    if (typeof obj.ativo !== 'boolean') {
      errors.ativo = 'Ativo must be a boolean'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validates fields for updating a person (all fields optional)
 */
export function validateUpdatePessoa(data: unknown): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: { body: 'Request body must be a JSON object' } }
  }

  const obj = data as Record<string, unknown>

  // Validate nome (optional)
  if (obj.nome !== undefined && obj.nome !== null) {
    if (typeof obj.nome !== 'string' || obj.nome.trim() === '') {
      errors.nome = 'Nome must be a non-empty string'
    } else if (obj.nome.length > 255) {
      errors.nome = 'Nome must not exceed 255 characters'
    }
  }

  // Validate email (optional)
  if (obj.email !== undefined && obj.email !== null) {
    if (typeof obj.email !== 'string' || obj.email.trim() === '') {
      errors.email = 'Email must be a non-empty string'
    } else if (!isValidEmail(obj.email)) {
      errors.email = 'Email must be in a valid format (e.g., user@example.com)'
    }
  }

  // Validate telefone (optional)
  if (obj.telefone !== undefined && obj.telefone !== null) {
    if (typeof obj.telefone !== 'string') {
      errors.telefone = 'Telefone must be a string'
    } else if (obj.telefone.trim() !== '' && !isValidPhone(obj.telefone)) {
      errors.telefone = 'Telefone must contain at least 10 digits'
    }
  }

  // Validate data_nascimento (optional)
  if (obj.data_nascimento !== undefined && obj.data_nascimento !== null) {
    if (typeof obj.data_nascimento !== 'string') {
      errors.data_nascimento = 'Data de nascimento must be a string'
    } else if (!isValidDate(obj.data_nascimento)) {
      errors.data_nascimento = 'Data de nascimento must be in ISO 8601 format (YYYY-MM-DD)'
    }
  }

  // Validate ativo (optional)
  if (obj.ativo !== undefined && obj.ativo !== null) {
    if (typeof obj.ativo !== 'boolean') {
      errors.ativo = 'Ativo must be a boolean'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
