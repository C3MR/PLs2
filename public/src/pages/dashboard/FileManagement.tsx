import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionBasedDocumentManager } from '@/components/FileUpload';
import ProtectedComponent from '@/components/ProtectedComponent';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  HardDrive, 
  Shield, 
  FileText, 
  Image, 
  Users, 
  Building, 
  Settings,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

const FileManagement = () => {
  const { hasPermission, isAdmin, canManageProperties, canManageClients, canManageSystem } = usePermissions();

  const getBucketStats = () => {
    // This would normally come from an API call
    return {
      'property-images': { count: 45, size: '12.3 MB' },
      'property-documents': { count: 23, size: '8.7 MB' },
      'client-files': { count: 67, size: '15.2 MB' },
      'admin-files': { count: 12, size: '4.1 MB' }
    };
  };

  const stats = getBucketStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HardDrive className="h-8 w-8 text-primary" />
            إدارة الملفات والتخزين
          </h1>
          <p className="text-muted-foreground">إدارة ملفات النظام والوثائق بناءً على الصلاحيات</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">محمي بالصلاحيات</span>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProtectedComponent requiredPermission="properties:read">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">صور العقارات</p>
                  <p className="text-2xl font-bold">{stats['property-images'].count}</p>
                  <p className="text-xs text-muted-foreground">{stats['property-images'].size}</p>
                </div>
                <Image className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        <ProtectedComponent requiredPermission="properties:read">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">وثائق العقارات</p>
                  <p className="text-2xl font-bold">{stats['property-documents'].count}</p>
                  <p className="text-xs text-muted-foreground">{stats['property-documents'].size}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        <ProtectedComponent requiredPermission="clients:read">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ملفات العملاء</p>
                  <p className="text-2xl font-bold">{stats['client-files'].count}</p>
                  <p className="text-xs text-muted-foreground">{stats['client-files'].size}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        <ProtectedComponent requiredPermission="system:settings">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ملفات النظام</p>
                  <p className="text-2xl font-bold">{stats['admin-files'].count}</p>
                  <p className="text-xs text-muted-foreground">{stats['admin-files'].size}</p>
                </div>
                <Settings className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>
      </div>

      {/* File Management Tabs */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            العقارات
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            العملاء
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            النظام
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                ملفات العقارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    صور العقارات
                  </h3>
                  <PermissionBasedDocumentManager
                    bucket="property-images"
                    entityType="property"
                    allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    readPermission="properties:read"
                    writePermission="properties:create"
                    deletePermission="properties:delete"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    الوثائق والمستندات
                  </h3>
                  <PermissionBasedDocumentManager
                    bucket="property-documents"
                    entityType="property"
                    allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                    readPermission="properties:read"
                    writePermission="properties:create"
                    deletePermission="properties:delete"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                ملفات العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PermissionBasedDocumentManager
                bucket="client-files"
                entityType="client"
                allowedTypes={['application/pdf', 'image/jpeg', 'image/png', 'application/msword']}
                readPermission="clients:read"
                writePermission="clients:create"
                deletePermission="clients:delete"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <ProtectedComponent 
            requiredPermission="system:settings"
            fallback={
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">صلاحيات غير كافية</h3>
                  <p className="text-muted-foreground">
                    هذا القسم متاح للمديرين فقط
                  </p>
                </CardContent>
              </Card>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  ملفات النظام (إداري)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PermissionBasedDocumentManager
                  bucket="admin-files"
                  entityType="system"
                  allowedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/zip']}
                  readPermission="system:settings"
                  writePermission="system:settings"
                  deletePermission="system:settings"
                />
              </CardContent>
            </Card>
          </ProtectedComponent>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إعدادات الملفات والصلاحيات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">صلاحياتك الحالية:</h3>
                  <div className="space-y-2">
                    {canManageProperties && (
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Building className="h-3 w-3" />
                        إدارة العقارات
                      </Badge>
                    )}
                    {canManageClients && (
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Users className="h-3 w-3" />
                        إدارة العملاء
                      </Badge>
                    )}
                    {canManageSystem && (
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Settings className="h-3 w-3" />
                        إدارة النظام
                      </Badge>
                    )}
                    {isAdmin && (
                      <Badge variant="default" className="flex items-center gap-1 w-fit">
                        <Shield className="h-3 w-3" />
                        صلاحيات إدارية
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">إعدادات التخزين:</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• الحد الأقصى لحجم الملف: 50 MB</p>
                    <p>• الأنواع المدعومة: PDF, Word, Excel, صور</p>
                    <p>• التخزين محمي بصلاحيات متقدمة</p>
                    <p>• النسخ الاحتياطي التلقائي مفعل</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileManagement;