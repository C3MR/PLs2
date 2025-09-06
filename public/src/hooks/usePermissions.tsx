import { useMemo } from 'react';
import { useRoles } from '@/hooks/useRoles';
import type { Permission, AppRole } from '@/types/roles';

export const usePermissions = () => {
  const { userPermissions = [], hasPermission, hasRole, hasAnyRole, loadingPermissions } = useRoles();

  // Check if user can perform specific actions
  const canManageUsers = useMemo(() => 
    hasPermission('users:create') || hasPermission('users:update') || hasPermission('users:delete'),
    [hasPermission]
  );

  const canManageProperties = useMemo(() => 
    hasPermission('properties:create') || hasPermission('properties:update') || hasPermission('properties:delete'),
    [hasPermission]
  );

  const canManageClients = useMemo(() => 
    hasPermission('clients:create') || hasPermission('clients:update') || hasPermission('clients:delete'),
    [hasPermission]
  );

  const canViewAnalytics = useMemo(() => 
    hasPermission('analytics:read'),
    [hasPermission]
  );

  const canManageSystem = useMemo(() => 
    hasPermission('system:settings') || hasPermission('system:backup') || hasPermission('system:logs'),
    [hasPermission]
  );

  // Check if user is admin or higher
  const isAdmin = useMemo(() => 
    hasAnyRole(['super_admin', 'admin']),
    [hasAnyRole]
  );

  // Check if user is manager or higher
  const isManager = useMemo(() => 
    hasAnyRole(['super_admin', 'admin', 'manager']),
    [hasAnyRole]
  );

  // Get user's effective permissions level
  const getPermissionLevel = useMemo(() => {
    if (hasRole('super_admin')) return 'super_admin';
    if (hasRole('admin')) return 'admin';
    if (hasRole('manager')) return 'manager';
    if (hasRole('agent')) return 'agent';
    if (hasRole('employee')) return 'employee';
    return 'client';
  }, [hasRole]);

  // Check if user can access a specific route/page
  const canAccessRoute = (route: string): boolean => {
    switch (route) {
      case '/dashboard/users':
      case '/dashboard/roles':
        return hasPermission('users:read') || isAdmin;
      
      case '/dashboard/properties':
        return hasPermission('properties:read');
      
      case '/dashboard/clients':
        return hasPermission('clients:read');
      
      case '/dashboard/requests':
        return hasPermission('requests:read');
      
      case '/dashboard/analytics':
        return hasPermission('analytics:read');
      
      case '/dashboard/reports':
        return hasPermission('analytics:read') || hasPermission('analytics:export');
      
      default:
        return true; // Allow access to general routes
    }
  };

  return {
    // Direct permission checks
    hasPermission,
    hasRole,
    hasAnyRole,
    userPermissions,
    
    // Computed permission checks
    canManageUsers,
    canManageProperties,
    canManageClients,
    canViewAnalytics,
    canManageSystem,
    isAdmin,
    isManager,
    
    // Utility functions
    getPermissionLevel,
    canAccessRoute,
    
    // Loading state
    loadingPermissions
  };
};

export default usePermissions;