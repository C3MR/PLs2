// Validation utilities for forms with KSA-specific validations

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateKSAPhone = (phone: string): boolean => {
  // KSA phone validation: starts with +966 or 05 and has correct length
  const ksaPhoneRegex = /^(\+966|05)[0-9]{8}$/;
  const cleanPhone = phone.replace(/\s+/g, '');
  return ksaPhoneRegex.test(cleanPhone);
};

export const formatKSAPhone = (phone: string): string => {
  // Format KSA phone number consistently
  const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+966/, '05');
  return cleanPhone;
};

export const validateRequired = (value: string | undefined | null): boolean => {
  return value !== undefined && value !== null && value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون على الأقل 8 أحرف');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  // Basic XSS prevention
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "'")
    .replace(/\//g, '&#x2F;');
};

// Rate limiting for form submissions
const submissionTimes = new Map<string, number[]>();

export const isRateLimited = (identifier: string, maxSubmissions = 5, timeWindow = 300000): boolean => {
  const now = Date.now();
  const submissions = submissionTimes.get(identifier) || [];
  
  // Filter submissions within time window
  const recentSubmissions = submissions.filter(time => now - time < timeWindow);
  
  if (recentSubmissions.length >= maxSubmissions) {
    return true;
  }
  
  // Add current submission
  recentSubmissions.push(now);
  submissionTimes.set(identifier, recentSubmissions);
  
  return false;
};

// Secure input validation with sanitization
export const validateAndSanitizeInput = (input: string, maxLength = 1000): string => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  
  if (input.length > maxLength) {
    throw new Error(`Input too long. Maximum ${maxLength} characters allowed`);
  }
  
  return sanitizeInput(input);
};

// File upload validation
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize = 10 * 1024 * 1024): boolean => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large');
  }
  
  return true;
};

// Email validation with additional security checks
export const validateSecureEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Basic format check
  if (!emailRegex.test(email)) return false;
  
  // Additional security checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes('..')) return false; // Consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return true;
};

// Form validation schema type
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export const validateForm = (data: Record<string, any>, schema: ValidationSchema): {
  isValid: boolean;
  errors: Record<string, string[]>;
} => {
  const errors: Record<string, string[]> = {};

  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const value = data[field];
    const fieldErrors: string[] = [];

    rules.forEach(rule => {
      if (rule.required && !validateRequired(value)) {
        fieldErrors.push(rule.message || `${field} مطلوب`);
      }
      
      if (value && rule.minLength && !validateMinLength(value, rule.minLength)) {
        fieldErrors.push(rule.message || `${field} يجب أن يكون على الأقل ${rule.minLength} أحرف`);
      }
      
      if (value && rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
        fieldErrors.push(rule.message || `${field} يجب ألا يزيد عن ${rule.maxLength} حرف`);
      }
      
      if (value && rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message || `تنسيق ${field} غير صحيح`);
      }
      
      if (value && rule.custom && !rule.custom(value)) {
        fieldErrors.push(rule.message || `${field} غير صالح`);
      }
    });

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};