// Permission-based utility functions
import type { Permission, AppRole } from '@/types/roles';

// Default permissions for each action type
export const DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  // Properties
  viewProperties: ['properties:read'],
  createProperty: ['properties:create'],
  editProperty: ['properties:update'],
  deleteProperty: ['properties:delete'],
  publishProperty: ['properties:publish'],
  
  // Clients
  viewClients: ['clients:read'],
  createClient: ['clients:create'],
  editClient: ['clients:update'],
  deleteClient: ['clients:delete'],
  exportClients: ['clients:export'],
  
  // Requests
  viewRequests: ['requests:read'],
  createRequest: ['requests:create'],
  editRequest: ['requests:update'],
  deleteRequest: ['requests:delete'],
  assignRequest: ['requests:assign'],
  
  // Analytics
  viewAnalytics: ['analytics:read'],
  exportAnalytics: ['analytics:export'],
  
  // Users
  viewUsers: ['users:read'],
  createUser: ['users:create'],
  editUser: ['users:update'],
  deleteUser: ['users:delete'],
  manageRoles: ['users:roles'],
  
  // System
  systemSettings: ['system:settings'],
  systemBackup: ['system:backup'],
  systemLogs: ['system:logs']
};

// Helper function to check if user can perform action
export const canPerformAction = (userPermissions: Permission[], action: string): boolean => {
  const requiredPermissions = DEFAULT_PERMISSIONS[action];
  if (!requiredPermissions) return false;
  
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

// Role hierarchy levels for comparison
export const ROLE_LEVELS: Record<AppRole, number> = {
  'super_admin': 6,
  'admin': 5,
  'manager': 4,
  'agent': 3,
  'employee': 2,
  'client': 1
};

// Check if user role can manage target role
export const canManageUserRole = (userRole: AppRole, targetRole: AppRole): boolean => {
  return ROLE_LEVELS[userRole] > ROLE_LEVELS[targetRole];
};

// Get actions available for a role
export const getAvailableActions = (userPermissions: Permission[]): string[] => {
  return Object.keys(DEFAULT_PERMISSIONS).filter(action => 
    canPerformAction(userPermissions, action)
  );
};

// Permission categories for UI organization
export const PERMISSION_GROUPS = {
  properties: {
    label: 'العقارات',
    permissions: ['properties:create', 'properties:read', 'properties:update', 'properties:delete', 'properties:publish']
  },
  clients: {
    label: 'العملاء',
    permissions: ['clients:create', 'clients:read', 'clients:update', 'clients:delete', 'clients:export']
  },
  requests: {
    label: 'الطلبات',
    permissions: ['requests:create', 'requests:read', 'requests:update', 'requests:delete', 'requests:assign']
  },
  analytics: {
    label: 'التحليلات',
    permissions: ['analytics:read', 'analytics:export']
  },
  users: {
    label: 'المستخدمين',
    permissions: ['users:create', 'users:read', 'users:update', 'users:delete', 'users:roles']
  },
  system: {
    label: 'النظام',
    permissions: ['system:settings', 'system:backup', 'system:logs']
  }
} as const;

// Action labels in Arabic
export const ACTION_LABELS: Record<string, string> = {
  viewProperties: 'عرض العقارات',
  createProperty: 'إضافة عقار',
  editProperty: 'تعديل عقار',
  deleteProperty: 'حذف عقار',
  publishProperty: 'نشر عقار',
  
  viewClients: 'عرض العملاء',
  createClient: 'إضافة عميل',
  editClient: 'تعديل عميل',
  deleteClient: 'حذف عميل',
  exportClients: 'تصدير العملاء',
  
  viewRequests: 'عرض الطلبات',
  createRequest: 'إضافة طلب',
  editRequest: 'تعديل طلب',
  deleteRequest: 'حذف طلب',
  assignRequest: 'تخصيص طلب',
  
  viewAnalytics: 'عرض التحليلات',
  exportAnalytics: 'تصدير التحليلات',
  
  viewUsers: 'عرض المستخدمين',
  createUser: 'إضافة مستخدم',
  editUser: 'تعديل مستخدم',
  deleteUser: 'حذف مستخدم',
  manageRoles: 'إدارة الأدوار',
  
  systemSettings: 'إعدادات النظام',
  systemBackup: 'النسخ الاحتياطي',
  systemLogs: 'سجلات النظام'
};