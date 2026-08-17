/**
 * Person entity interface
 */
export interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}
