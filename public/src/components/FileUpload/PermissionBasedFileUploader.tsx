import React from 'react';
import { FileUploader } from '@/components/FileUpload';
import ProtectedComponent from '@/components/ProtectedComponent';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import type { Permission } from '@/types/roles';

interface PermissionBasedFileUploaderProps {
  bucket: string;
  requiredPermission?: Permission;
  entityId?: string;
  entityType?: string;
  allowedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  className?: string;
  fallbackMessage?: string;
}

const PermissionBasedFileUploader: React.FC<PermissionBasedFileUploaderProps> = ({
  bucket,
  requiredPermission,
  entityId,
  entityType,
  allowedTypes,
  maxFileSize,
  multiple = true,
  className,
  fallbackMessage
}) => {
  const { hasPermission, loadingPermissions } = usePermissions();

  // Determine required permission based on bucket if not explicitly provided
  const getRequiredPermission = (): Permission | undefined => {
    if (requiredPermission) return requiredPermission;
    
    switch (bucket) {
      case 'property-images':
      case 'property-documents':
        return 'properties:create';
      case 'client-files':
        return 'clients:create';
      case 'admin-files':
        return 'system:settings';
      default:
        return undefined;
    }
  };

  const permission = getRequiredPermission();

  // Show loading state while checking permissions
  if (loadingPermissions) {
    return (
      <div className="p-4 border-2 border-dashed border-border rounded-lg">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          جاري التحقق من الصلاحيات...
        </div>
      </div>
    );
  }

  // If no permission required, show uploader directly
  if (!permission) {
    return (
      <FileUploader
        bucket={bucket}
        multiple={multiple}
        className={className}
      />
    );
  }

  // Show permission-based component
  return (
    <ProtectedComponent
      requiredPermission={permission}
      fallback={
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {fallbackMessage || (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">صلاحيات غير كافية</span>
                </div>
                لا تملك الصلاحيات اللازمة لرفع الملفات في هذا القسم.
                الصلاحية المطلوبة: <code className="text-xs bg-amber-100 px-1 rounded">{permission}</code>
              </>
            )}
          </AlertDescription>
        </Alert>
      }
    >
      <FileUploader
        bucket={bucket}
        multiple={multiple}
        className={className}
      />
    </ProtectedComponent>
  );
};

export default PermissionBasedFileUploader;