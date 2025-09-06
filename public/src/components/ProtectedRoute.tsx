import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import type { AppRole, Permission } from '@/types/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: AppRole[];
  requiredPermissions?: Permission[];
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedRoles,
  requiredPermissions,
  redirectTo = '/auth' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { hasRole, hasPermission, hasAnyRole, loadingPermissions } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || loadingPermissions) return;

    if (requireAuth && !user) {
      navigate(redirectTo);
      return;
    }

    if (!requireAuth && user) {
      navigate('/client-portal');
      return;
    }

    // Role-based access control
    if (allowedRoles && user && !hasAnyRole(allowedRoles)) {
      navigate('/unauthorized');
      return;
    }

    // Permission-based access control
    if (requiredPermissions && user) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      if (!hasAllPermissions) {
        navigate('/unauthorized');
        return;
      }
    }
  }, [user, loading, loadingPermissions, requireAuth, allowedRoles, requiredPermissions, hasRole, hasPermission, hasAnyRole, navigate, redirectTo]);

  if (loading || loadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;