/**
 * Normalize phone number by removing non-digit characters
 */
export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Format phone number for display
 * Converts 11 digits to (XX) XXXXX-XXXX format
 */
export const formatPhoneBR = (phone: string): string => {
  const digits = normalizePhone(phone);
  
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  
  return phone;
};
