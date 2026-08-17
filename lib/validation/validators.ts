import { ValidationError } from '../types';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (flexible international format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-()+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate birth date (must be in the past)
 */
export function validateBirthDate(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
  return date < new Date();
}

/**
 * Validate person data
 */
export function validatePerson(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Invalid request body' }],
    };
  }

  const obj = data as Record<string, unknown>;

  // Validate name
  if (!obj.name || typeof obj.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (obj.name.trim().length < 3) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 3 characters long',
    });
  } else if (obj.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Name must not exceed 100 characters',
    });
  }

  // Validate email
  if (!obj.email || typeof obj.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(obj.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate phone (optional)
  if (obj.phone !== undefined && obj.phone !== null && obj.phone !== '') {
    if (typeof obj.phone !== 'string') {
      errors.push({ field: 'phone', message: 'Phone must be a string' });
    } else if (!validatePhone(obj.phone)) {
      errors.push({
        field: 'phone',
        message: 'Invalid phone format',
      });
    }
  }

  // Validate birthDate (optional)
  if (obj.birthDate !== undefined && obj.birthDate !== null && obj.birthDate !== '') {
    if (typeof obj.birthDate !== 'string') {
      errors.push({ field: 'birthDate', message: 'Birth date must be a string' });
    } else if (!validateBirthDate(obj.birthDate)) {
      errors.push({
        field: 'birthDate',
        message: 'Birth date must be a valid date in the past',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
