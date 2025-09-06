// Export all file upload components
export { default as FileUploader } from './FileUploader';
export { default as ImageGallery } from './ImageGallery';
export { default as DocumentManager } from './DocumentManager';
export { default as PermissionBasedFileUploader } from './PermissionBasedFileUploader';
export { default as PermissionBasedDocumentManager } from './PermissionBasedDocumentManager';

// Export the hook
export { default as useFileUpload } from '../../hooks/useFileUpload';

// Export storage service and types
export { storageService } from '../../services/storage';
export type { FileMetadata, StorageProvider, UploadResult } from '../../services/storage';