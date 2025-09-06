import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AppRole, Permission } from '@/types/roles';

interface EnhancedProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: AppRole[];
  requiredPermissions?: Permission[];
  redirectTo?: string;
  fallbackMessage?: string;
}

const EnhancedProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedRoles,
  requiredPermissions,
  redirectTo = '/auth',
  fallbackMessage = "ليس لديك صلاحية للوصول إلى هذه الصفحة"
}: EnhancedProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, hasPermission, hasAnyRole, loadingPermissions } = usePermissions();
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);

  // Check localStorage for employee data (backward compatibility)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const currentUser = user || localUser;
  const isLoading = authLoading || loadingPermissions;

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not logged in
    if (requireAuth && !currentUser) {
      navigate(redirectTo);
      return;
    }

    // If user shouldn't be here (guest only pages)
    if (!requireAuth && currentUser) {
      navigate('/dashboard');
      return;
    }

    // Role-based access control
    if (allowedRoles && currentUser && !hasAnyRole(allowedRoles)) {
      navigate('/unauthorized');
      return;
    }

    // Permission-based access control
    if (requiredPermissions && currentUser) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      if (!hasAllPermissions) {
        navigate('/unauthorized');
        return;
      }
    }
  }, [currentUser, isLoading, requireAuth, allowedRoles, requiredPermissions, hasRole, hasPermission, hasAnyRole, navigate, redirectTo]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <div className="absolute inset-0 animate-ping">
                  <Shield className="h-12 w-12 mx-auto text-primary/20" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">جاري التحقق من الصلاحيات</h3>
                <p className="text-muted-foreground">يرجى الانتظار...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied state
  if ((requireAuth && !currentUser) || 
      (allowedRoles && currentUser && !hasAnyRole(allowedRoles)) ||
      (requiredPermissions && currentUser && !requiredPermissions.every(permission => hasPermission(permission)))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">غير مصرح بالدخول</CardTitle>
            <CardDescription>{fallbackMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              {!currentUser ? (
                <Button onClick={() => navigate('/auth')} className="w-full">
                  تسجيل الدخول
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                    العودة للوحة التحكم
                  </Button>
                  <Button onClick={() => navigate('/')} variant="ghost" className="w-full">
                    الصفحة الرئيسية
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnhancedProtectedRoute;