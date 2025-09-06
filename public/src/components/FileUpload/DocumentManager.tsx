import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download,
  Trash2,
  Eye,
  Share2,
  MoreVertical,
  Search,
  Filter,
  Upload,
  Folder,
  File
} from 'lucide-react';
import { storageService, FileMetadata } from '@/services/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FileUploader from './FileUploader';

interface DocumentManagerProps {
  bucket: string;
  entityId?: string;
  entityType?: string;
  editable?: boolean;
  allowedTypes?: string[];
  className?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  bucket,
  entityId,
  entityType,
  editable = true,
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],
  className = ''
}) => {
  const [documents, setDocuments] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [bucket, entityId, entityType]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const files = await storageService.listFiles(bucket);
      const documentFiles = files.filter(file => 
        allowedTypes.includes(file.type) || !file.type.startsWith('image/')
      );
      setDocuments(documentFiles);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (file: FileMetadata) => {
    if (file.type === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (file.type.includes('word')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (file.type.includes('excel') || file.type.includes('sheet')) return <FileText className="h-5 w-5 text-green-500" />;
    if (file.type === 'text/plain') return <FileText className="h-5 w-5 text-gray-500" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
  };

  const getFileTypeBadge = (file: FileMetadata) => {
    if (file.type === 'application/pdf') return <Badge variant="destructive" className="text-xs">PDF</Badge>;
    if (file.type.includes('word')) return <Badge variant="default" className="bg-blue-500 text-xs">Word</Badge>;
    if (file.type.includes('excel') || file.type.includes('sheet')) return <Badge variant="default" className="bg-green-500 text-xs">Excel</Badge>;
    if (file.type === 'text/plain') return <Badge variant="secondary" className="text-xs">Text</Badge>;
    return <Badge variant="outline" className="text-xs">File</Badge>;
  };

  const handleDownload = async (doc: FileMetadata) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  };

  const handleView = (doc: FileMetadata) => {
    window.open(doc.url, '_blank');
  };

  const handleDelete = async (doc: FileMetadata) => {
    if (confirm(`هل أنت متأكد من حذف ${doc.name}؟`)) {
      const result = await storageService.delete(doc.bucket, doc.path);
      if (result.success) {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
      }
    }
  };

  const handleShare = async (doc: FileMetadata) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: doc.name,
          url: doc.url
        });
      } catch (error) {
        navigator.clipboard.writeText(doc.url);
      }
    } else {
      navigator.clipboard.writeText(doc.url);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">جاري تحميل الوثائق...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              إدارة الوثائق ({filteredDocuments.length})
            </CardTitle>
            {editable && (
              <Button
                onClick={() => setShowUploader(!showUploader)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                رفع وثيقة
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الوثائق..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              تصفية
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Uploader */}
      {showUploader && editable && (
        <FileUploader
          bucket={bucket}
          allowedTypes={allowedTypes}
          maxSize={50 * 1024 * 1024} // 50MB
          accept={{
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/plain': ['.txt']
          }}
          onSuccess={() => {
            loadDocuments();
            setShowUploader(false);
          }}
        />
      )}

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">لا توجد وثائق متاحة</p>
            {editable && (
              <Button onClick={() => setShowUploader(true)} className="gap-2">
                <Upload className="h-4 w-4" />
                رفع الوثيقة الأولى
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                  {/* File Icon */}
                  <div className="flex-shrink-0">
                    {getFileIcon(doc)}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{doc.name}</h4>
                      {getFileTypeBadge(doc)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                      {doc.uploadedBy && (
                        <span>رفع بواسطة: {doc.uploadedBy}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(doc)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      عرض
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      تحميل
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          عرض
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-2" />
                          تحميل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(doc)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          مشاركة
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {editable && (
                          <DropdownMenuItem 
                            onClick={() => handleDelete(doc)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            حذف
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentManager;