/**
 * Get current ISO 8601 timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Format date for display (DD/MM/YYYY)
 */
export const formatDateBR = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return isoDate;
  }
};
