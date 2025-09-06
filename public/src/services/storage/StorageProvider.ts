// Storage Provider Interface - مرن لدعم مقدمين مختلفين مستقبلاً
export interface FileUploadOptions {
  bucket: string;
  path?: string;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
  bucket: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export interface UploadResult {
  success: boolean;
  data?: FileMetadata;
  error?: string;
}

export interface StorageProvider {
  // File operations
  upload(file: File, options: FileUploadOptions): Promise<UploadResult>;
  delete(bucket: string, path: string): Promise<{ success: boolean; error?: string }>;
  getUrl(bucket: string, path: string): Promise<string | null>;
  getSignedUrl(bucket: string, path: string, expiresIn?: number): Promise<string | null>;
  
  // Bucket operations
  listFiles(bucket: string, path?: string): Promise<FileMetadata[]>;
  
  // Provider info
  getProviderName(): string;
  isConfigured(): boolean;
}

export type SupportedProvider = 'supabase' | 'aws-s3' | 'google-cloud' | 'azure';

export interface StorageConfig {
  provider: SupportedProvider;
  // Provider-specific config will be added here
}