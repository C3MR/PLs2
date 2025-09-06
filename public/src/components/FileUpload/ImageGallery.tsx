import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Grid3x3, 
  List, 
  Search, 
  Filter,
  Download,
  Trash2,
  Eye,
  Heart,
  Share2,
  MoreVertical,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { storageService, FileMetadata } from '@/services/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageGalleryProps {
  bucket: string;
  entityId?: string;
  entityType?: string;
  editable?: boolean;
  onImageSelect?: (image: FileMetadata) => void;
  selectedImages?: string[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  bucket,
  entityId,
  entityType,
  editable = true,
  onImageSelect,
  selectedImages = [],
  className = ''
}) => {
  const [images, setImages] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<FileMetadata | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadImages();
  }, [bucket, entityId, entityType]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const files = await storageService.listFiles(bucket);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      setImages(imageFiles);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageClick = (image: FileMetadata) => {
    if (onImageSelect) {
      onImageSelect(image);
    } else {
      setSelectedImage(image);
    }
  };

  const handleDownload = async (image: FileMetadata) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    link.click();
  };

  const handleDelete = async (image: FileMetadata) => {
    if (confirm(`هل أنت متأكد من حذف ${image.name}؟`)) {
      const result = await storageService.delete(image.bucket, image.path);
      if (result.success) {
        setImages(prev => prev.filter(img => img.id !== image.id));
      }
    }
  };

  const handleShare = async (image: FileMetadata) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.name,
          url: image.url
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(image.url);
      }
    } else {
      navigator.clipboard.writeText(image.url);
    }
  };

  const toggleFavorite = (imageId: string) => {
    setFavorites(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
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
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">جاري تحميل الصور...</p>
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
              <ImageIcon className="h-5 w-5" />
              معرض الصور ({filteredImages.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الصور..."
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

      {/* Images Display */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد صور متاحة</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImages.includes(image.id)
                        ? 'border-primary'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                    
                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedImage(image)}>
                            <Eye className="h-4 w-4 mr-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(image)}>
                            <Download className="h-4 w-4 mr-2" />
                            تحميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(image)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            مشاركة
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {editable && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(image)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              حذف
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Favorite */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.includes(image.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-white'
                          }`} 
                        />
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">
                        {image.name}
                      </p>
                      <p className="text-white/70 text-xs">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedImages.includes(image.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{image.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(image.size)}</span>
                        <span>{formatDate(image.uploadedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(image.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.includes(image.id) 
                              ? 'fill-red-500 text-red-500' 
                              : ''
                          }`} 
                        />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedImage(image)}>
                            <Eye className="h-4 w-4 mr-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(image)}>
                            <Download className="h-4 w-4 mr-2" />
                            تحميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(image)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            مشاركة
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {editable && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(image)}
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {selectedImage.name}
                </Badge>
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {formatFileSize(selectedImage.size)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(selectedImage)}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;