import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  Image, 
  X, 
  Download,
  FileText,
  Eye,
  Trash2
} from 'lucide-react';
import useFileUpload, { UseFileUploadOptions } from '@/hooks/useFileUpload';
import { FileMetadata } from '@/services/storage';

interface FileUploaderProps extends UseFileUploadOptions {
  accept?: Record<string, string[]>;
  multiple?: boolean;
  showPreview?: boolean;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  multiple = true,
  showPreview = true,
  className = '',
  ...uploadOptions
}) => {
  const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null);
  
  const {
    uploading,
    progress,
    uploadedFiles,
    uploadMultiple,
    deleteFile,
    clearFiles,
    storageInfo
  } = useFileUpload(uploadOptions);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadMultiple(acceptedFiles);
  }, [uploadMultiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: uploading
  });

  const getFileIcon = (file: FileMetadata) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePreview = (file: FileMetadata) => {
    if (file.type.startsWith('image/')) {
      setPreviewFile(file);
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleDownload = (file: FileMetadata) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className="text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            
            {uploading ? (
              <div className="space-y-4">
                <p className="text-lg font-medium">جاري رفع الملفات...</p>
                <Progress value={progress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground">{progress}% مكتمل</p>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-medium text-primary">اسحب الملفات هنا...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">اسحب الملفات هنا أو انقر للتحديد</p>
                <p className="text-sm text-muted-foreground">
                  {multiple ? 'يمكنك رفع عدة ملفات مرة واحدة' : 'يمكنك رفع ملف واحد فقط'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Storage Provider Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          {storageInfo.name}
        </Badge>
        {storageInfo.configured && (
          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
            متصل
          </Badge>
        )}
      </div>

      {/* Uploaded Files List */}
      {showPreview && uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">الملفات المرفوعة ({uploadedFiles.length})</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFiles}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                مسح الكل
              </Button>
            </div>
            
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Modal */}
      {previewFile && previewFile.type.startsWith('image/') && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={previewFile.url}
              alt={previewFile.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;