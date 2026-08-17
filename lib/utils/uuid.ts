/**
 * Generate a simple UUID v4-like string
 * Note: This is a simplified implementation suitable for development/demo purposes
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
