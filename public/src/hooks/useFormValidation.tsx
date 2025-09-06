import { useState, useCallback } from 'react';
import { ValidationSchema, validateForm } from '@/utils/validation';

interface UseFormValidationOptions {
  schema: ValidationSchema;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
}

export const useFormValidation = ({ schema, onSubmit }: UseFormValidationOptions) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field errors when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateField = useCallback((field: string, value: any) => {
    if (!schema[field]) return [];

    const fieldSchema = { [field]: schema[field] };
    const { errors: fieldErrors } = validateForm({ [field]: value }, fieldSchema);
    return fieldErrors[field] || [];
  }, [schema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);

    const { isValid, errors: validationErrors } = validateForm(formData, schema);

    if (!isValid) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, schema, onSubmit]);

  const reset = useCallback(() => {
    setFormData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const getFieldError = (field: string) => errors[field]?.[0];

  return {
    formData,
    errors,
    isSubmitting,
    hasErrors,
    updateField,
    validateField,
    handleSubmit,
    reset,
    getFieldError,
    setFormData,
  };
};