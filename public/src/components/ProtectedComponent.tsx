import React from 'react';
import { useRoles } from '@/hooks/useRoles';
import type { Permission, AppRole } from '@/types/roles';

interface ProtectedComponentProps {
  children: React.ReactNode;
  
  // Permission-based protection
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  
  // Role-based protection
  requiredRole?: AppRole;
  requiredRoles?: AppRole[];
  
  // Alternative content when access is denied
  fallback?: React.ReactNode;
  
  // Whether to require ALL permissions/roles or just ANY
  requireAll?: boolean;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requiredRole,
  requiredRoles,
  fallback = null,
  requireAll = false
}) => {
  const { hasPermission, hasRole, hasAnyRole, loadingProfile, loadingPermissions } = useRoles();

  // Show loading state while checking permissions
  if (loadingProfile || loadingPermissions) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  let hasAccess = true;

  // Check single permission
  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      hasAccess = requiredPermissions.every(permission => hasPermission(permission));
    } else {
      hasAccess = requiredPermissions.some(permission => hasPermission(permission));
    }
  }

  // Check single role
  if (requiredRole) {
    hasAccess = hasAccess && hasRole(requiredRole);
  }

  // Check multiple roles
  if (requiredRoles && requiredRoles.length > 0) {
    if (requireAll) {
      hasAccess = hasAccess && requiredRoles.every(role => hasRole(role));
    } else {
      hasAccess = hasAccess && hasAnyRole(requiredRoles);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default ProtectedComponent;