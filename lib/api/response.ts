import { ErrorResponse } from '@/lib/types/pessoa';

/**
 * Create a standardized error response
 */
export const createErrorResponse = (
  status: number,
  message: string,
  details?: Record<string, string>
): ErrorResponse => {
  return {
    status,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Create a success response
 */
export const createSuccessResponse = <T>(data: T) => {
  return data;
};
