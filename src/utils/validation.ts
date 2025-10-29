export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (email.length > 255) return 'Email must be less than 255 characters';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 100) return 'Password must be less than 100 characters';
  
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.trim().length === 0) return 'Name cannot be empty';
  if (name.length > 100) return 'Name must be less than 100 characters';
  
  return null;
};

export const validateSQLQuery = (query: string): string | null => {
  if (!query) return 'Query cannot be empty';
  if (query.trim().length === 0) return 'Query cannot be empty';
  if (query.length > 5000) return 'Query is too long (max 5000 characters)';
  
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
