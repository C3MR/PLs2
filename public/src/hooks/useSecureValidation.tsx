import { useCallback } from 'react';

export const useSecureValidation = () => {
  // Enhanced email validation with security checks
  const validateSecureEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email || email.length > 254) return false;
    if (!emailRegex.test(email)) return false;
    
    // Additional security checks
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /<.*>/,
      /['"]/,
      /\\/,
      /\x00-\x1f/
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, []);

  // Enhanced text validation with XSS protection and stricter limits
  const validateSecureText = useCallback((text: string, maxLength: number = 500): boolean => {
    if (!text) return false;
    if (text.length > maxLength) return false;
    if (text.length < 1) return false;
    
    // Check for suspicious patterns with additional security
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /data:text\/html/i,
      /vbscript:/i,
      /<style/i,
      /<link/i,
      /<meta/i,
      /expression\s*\(/i,
      /url\s*\(/i,
      /@import/i,
      /&\s*{/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(text));
  }, []);

  // Phone number validation
  const validatePhone = useCallback((phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s-()]{7,15}$/;
    return phoneRegex.test(phone.trim());
  }, []);

  // Enhanced sanitization with stricter security
  const sanitizeText = useCallback((text: string): string => {
    return text
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data URLs
      .replace(/vbscript:/gi, '') // Remove vbscript
      .replace(/expression\s*\(/gi, '') // Remove CSS expressions
      .replace(/url\s*\(/gi, '') // Remove CSS url()
      .replace(/@import/gi, '') // Remove CSS imports
      .replace(/['"]/g, '') // Remove quotes for extra safety
      .substring(0, 500); // Stricter length limit
  }, []);

  return {
    validateSecureEmail,
    validateSecureText,
    validatePhone,
    sanitizeText
  };
};