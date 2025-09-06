import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AppRole, Permission } from '@/types/roles';

interface ImprovedProtectedComponentProps {
  children: ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requiredRole?: AppRole;
  requiredRoles?: AppRole[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

const ImprovedProtectedComponent = ({ 
  children, 
  requiredPermission,
  requiredPermissions,
  requiredRole,
  requiredRoles,
  fallback,
  requireAll = true
}: ImprovedProtectedComponentProps) => {
  const { hasPermission, hasRole, hasAnyRole, loadingPermissions } = usePermissions();

  // Loading state
  if (loadingPermissions) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div className="absolute inset-0 animate-ping">
              <Shield className="h-8 w-8 mx-auto text-primary/20" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Check access
  let hasAccess = true;

  // Single permission check
  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  }

  // Multiple permissions check
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      hasAccess = requiredPermissions.every(permission => hasPermission(permission));
    } else {
      hasAccess = requiredPermissions.some(permission => hasPermission(permission));
    }
  }

  // Single role check
  if (requiredRole) {
    hasAccess = hasAccess && hasRole(requiredRole);
  }

  // Multiple roles check
  if (requiredRoles && requiredRoles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(requiredRoles);
  }

  // If access denied, show fallback or default message
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 p-2 rounded-full bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-lg text-amber-800">صلاحية مطلوبة</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-amber-700">
            تحتاج إلى صلاحيات إضافية لعرض هذا المحتوى.
            {requiredPermissions && (
              <div className="mt-2 text-xs">
                الصلاحيات المطلوبة: {requiredPermissions.join(', ')}
              </div>
            )}
            {requiredRoles && (
              <div className="mt-2 text-xs">
                الأدوار المطلوبة: {requiredRoles.join(', ')}
              </div>
            )}
          </CardDescription>
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
              className="text-amber-700 border-amber-300 hover:bg-amber-100"
            >
              إعادة تحديث
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ImprovedProtectedComponent;