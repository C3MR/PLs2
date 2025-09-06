import { useState, useCallback } from 'react';
import { storageService, FileMetadata, UploadResult } from '@/services/storage';
import { toast } from '@/hooks/use-toast';

export interface UseFileUploadOptions {
  bucket: string;
  path?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onSuccess?: (file: FileMetadata) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([]);

  const validateFile = useCallback((file: File): string | null => {
    const { maxSize = 10 * 1024 * 1024, allowedTypes } = options; // Default 10MB

    if (file.size > maxSize) {
      return `حجم الملف كبير جداً. الحد الأقصى ${(maxSize / 1024 / 1024).toFixed(1)} ميجابايت`;
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return 'نوع الملف غير مدعوم';
    }

    return null;
  }, [options]);

  const uploadFile = useCallback(async (file: File): Promise<UploadResult> => {
    const validation = validateFile(file);
    if (validation) {
      const result = { success: false, error: validation };
      options.onError?.(validation);
      return result;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await storageService.upload(file, {
        bucket: options.bucket,
        path: options.path,
        contentType: file.type
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data) {
        setUploadedFiles(prev => [...prev, result.data!]);
        options.onSuccess?.(result.data);
        toast({
          title: "تم رفع الملف بنجاح",
          description: `تم رفع ${file.name} بنجاح`,
        });
      } else {
        const error = result.error || 'فشل في رفع الملف';
        options.onError?.(error);
        toast({
          title: "خطأ في رفع الملف",
          description: error,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في رفع الملف';
      options.onError?.(errorMessage);
      toast({
        title: "خطأ في رفع الملف",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [options, validateFile]);

  const uploadMultiple = useCallback(async (files: FileList | File[]): Promise<UploadResult[]> => {
    const fileArray = Array.from(files);
    const results: UploadResult[] = [];

    for (const file of fileArray) {
      const result = await uploadFile(file);
      results.push(result);
    }

    return results;
  }, [uploadFile]);

  const deleteFile = useCallback(async (file: FileMetadata): Promise<boolean> => {
    try {
      const result = await storageService.delete(file.bucket, file.path);
      
      if (result.success) {
        setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
        toast({
          title: "تم حذف الملف",
          description: `تم حذف ${file.name} بنجاح`,
        });
        return true;
      } else {
        toast({
          title: "خطأ في حذف الملف",
          description: result.error || 'فشل في حذف الملف',
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "خطأ في حذف الملف",
        description: error instanceof Error ? error.message : 'فشل في حذف الملف',
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploading,
    progress,
    uploadedFiles,
    uploadFile,
    uploadMultiple,
    deleteFile,
    clearFiles,
    validateFile,
    storageInfo: storageService.getProviderInfo()
  };
};

export default useFileUpload;