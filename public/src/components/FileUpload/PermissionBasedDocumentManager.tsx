import React from 'react';
import { DocumentManager } from '@/components/FileUpload';
import ProtectedComponent from '@/components/ProtectedComponent';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, Lock } from 'lucide-react';
import type { Permission } from '@/types/roles';

interface PermissionBasedDocumentManagerProps {
  bucket: string;
  entityId?: string;
  entityType?: string;
  allowedTypes?: string[];
  readPermission?: Permission;
  writePermission?: Permission;
  deletePermission?: Permission;
  className?: string;
  title?: string;
}

const PermissionBasedDocumentManager: React.FC<PermissionBasedDocumentManagerProps> = ({
  bucket,
  entityId,
  entityType,
  allowedTypes,
  readPermission,
  writePermission,
  deletePermission,
  className,
  title
}) => {
  const { hasPermission, loadingPermissions, isAdmin } = usePermissions();

  // Determine permissions based on bucket if not explicitly provided
  const getPermissions = () => {
    const permissions = {
      read: readPermission,
      write: writePermission,
      delete: deletePermission
    };

    if (!permissions.read || !permissions.write || !permissions.delete) {
      switch (bucket) {
        case 'property-images':
        case 'property-documents':
          return {
            read: permissions.read || 'properties:read',
            write: permissions.write || 'properties:create',
            delete: permissions.delete || 'properties:delete'
          };
        case 'client-files':
          return {
            read: permissions.read || 'clients:read',
            write: permissions.write || 'clients:create',
            delete: permissions.delete || 'clients:delete'
          };
        case 'admin-files':
          return {
            read: permissions.read || 'system:settings',
            write: permissions.write || 'system:settings',
            delete: permissions.delete || 'system:settings'
          };
        default:
          return permissions;
      }
    }

    return permissions;
  };

  const permissions = getPermissions();

  // Check if user has any access at all
  const hasReadAccess = !permissions.read || hasPermission(permissions.read as Permission) || isAdmin;
  const hasWriteAccess = !permissions.write || hasPermission(permissions.write as Permission) || isAdmin;
  const hasDeleteAccess = !permissions.delete || hasPermission(permissions.delete as Permission) || isAdmin;

  // Show loading state
  if (loadingPermissions) {
    return (
      <div className="p-8 border border-border rounded-lg">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          جاري التحقق من الصلاحيات...
        </div>
      </div>
    );
  }

  // If no read access, show access denied
  if (!hasReadAccess) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Lock className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4" />
            <span className="font-medium">وصول مرفوض</span>
          </div>
          لا تملك الصلاحيات اللازمة لعرض الملفات في هذا القسم.
          {permissions.read && (
            <div className="mt-2 text-xs">
              الصلاحية المطلوبة: <code className="bg-red-100 px-1 rounded">{permissions.read}</code>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      {/* Permission status indicator */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium">صلاحيات الوصول:</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className={`px-2 py-1 rounded ${hasReadAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            عرض: {hasReadAccess ? '✓' : '✗'}
          </span>
          <span className={`px-2 py-1 rounded ${hasWriteAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            رفع: {hasWriteAccess ? '✓' : '✗'}
          </span>
          <span className={`px-2 py-1 rounded ${hasDeleteAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            حذف: {hasDeleteAccess ? '✓' : '✗'}
          </span>
        </div>
      </div>

      <DocumentManager
        bucket={bucket}
        entityId={entityId}
        entityType={entityType}
        allowedTypes={allowedTypes}
        editable={hasWriteAccess}
        className="space-y-4"
      />
    </div>
  );
};

export default PermissionBasedDocumentManager;