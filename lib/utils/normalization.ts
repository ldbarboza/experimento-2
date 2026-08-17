/**
 * Normalize email to lowercase for comparison
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Normalize phone number to digits only
 */
export const normalizeTelefone = (telefone: string): string => {
  return telefone.replace(/\D/g, '');
};
