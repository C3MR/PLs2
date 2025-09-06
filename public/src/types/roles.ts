// Types for roles and permissions system
export type AppRole = 
  | 'super_admin'
  | 'admin' 
  | 'manager'
  | 'agent'
  | 'employee'
  | 'client';

export type Permission = 
  // Properties permissions
  | 'properties:create'
  | 'properties:read'
  | 'properties:update'
  | 'properties:delete'
  | 'properties:publish'
  
  // Clients permissions
  | 'clients:create'
  | 'clients:read'
  | 'clients:update'
  | 'clients:delete'
  | 'clients:export'
  
  // Requests permissions
  | 'requests:create'
  | 'requests:read'
  | 'requests:update'
  | 'requests:delete'
  | 'requests:assign'
  
  // Analytics permissions
  | 'analytics:read'
  | 'analytics:export'
  
  // Users permissions
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'users:roles'
  
  // System permissions
  | 'system:settings'
  | 'system:backup'
  | 'system:logs';

export interface RoleInfo {
  role: AppRole;
  name: string;
  description: string;
  level: number;
  color: string;
}

export interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  role: AppRole;
  is_active: boolean;
  employee_id?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

// Role hierarchy and display info
export const ROLES: Record<AppRole, RoleInfo> = {
  super_admin: {
    role: 'super_admin',
    name: 'مدير عام',
    description: 'صلاحيات كاملة للنظام',
    level: 6,
    color: 'bg-red-500'
  },
  admin: {
    role: 'admin',
    name: 'مدير',
    description: 'إدارة النظام والمستخدمين',
    level: 5,
    color: 'bg-purple-500'
  },
  manager: {
    role: 'manager',
    name: 'مدير فرع',
    description: 'إدارة الفريق والعقارات',
    level: 4,
    color: 'bg-blue-500'
  },
  agent: {
    role: 'agent',
    name: 'مسوق عقاري',
    description: 'المبيعات وخدمة العملاء',
    level: 3,
    color: 'bg-green-500'
  },
  employee: {
    role: 'employee',
    name: 'موظف',
    description: 'وصول أساسي للنظام',
    level: 2,
    color: 'bg-gray-500'
  },
  client: {
    role: 'client',
    name: 'عميل',
    description: 'عرض العقارات المتاحة',
    level: 1,
    color: 'bg-orange-500'
  }
};

// Permission categories for better organization
export const PERMISSION_CATEGORIES = {
  properties: {
    name: 'العقارات',
    description: 'إدارة العقارات والمشاريع',
    icon: 'Building',
    permissions: [
      'properties:create',
      'properties:read', 
      'properties:update',
      'properties:delete',
      'properties:publish'
    ] as Permission[]
  },
  clients: {
    name: 'العملاء',
    description: 'إدارة قاعدة العملاء',
    icon: 'Users',
    permissions: [
      'clients:create',
      'clients:read',
      'clients:update', 
      'clients:delete',
      'clients:export'
    ] as Permission[]
  },
  requests: {
    name: 'الطلبات',
    description: 'إدارة طلبات العملاء',
    icon: 'FileText',
    permissions: [
      'requests:create',
      'requests:read',
      'requests:update',
      'requests:delete', 
      'requests:assign'
    ] as Permission[]
  },
  analytics: {
    name: 'التقارير',
    description: 'التحليلات والتقارير',
    icon: 'TrendingUp',
    permissions: [
      'analytics:read',
      'analytics:export'
    ] as Permission[]
  },
  users: {
    name: 'المستخدمين',
    description: 'إدارة المستخدمين والأدوار',
    icon: 'UserCheck',
    permissions: [
      'users:create',
      'users:read',
      'users:update',
      'users:delete',
      'users:roles'
    ] as Permission[]
  },
  system: {
    name: 'النظام',
    description: 'إعدادات النظام المتقدمة',
    icon: 'Settings',
    permissions: [
      'system:settings',
      'system:backup',
      'system:logs'
    ] as Permission[]
  }
};

// Helper functions
export const getRoleInfo = (role: AppRole): RoleInfo => ROLES[role];

export const getRoleLevel = (role: AppRole): number => ROLES[role].level;

export const canManageRole = (userRole: AppRole, targetRole: AppRole): boolean => {
  return getRoleLevel(userRole) > getRoleLevel(targetRole);
};

export const getPermissionCategory = (permission: Permission): string => {
  const [category] = permission.split(':');
  return category;
};

export const formatPermissionName = (permission: Permission): string => {
  const [category, action] = permission.split(':');
  const categoryInfo = PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES];
  
  const actionNames: Record<string, string> = {
    create: 'إنشاء',
    read: 'عرض',
    update: 'تعديل', 
    delete: 'حذف',
    publish: 'نشر',
    export: 'تصدير',
    assign: 'تخصيص',
    settings: 'إعدادات',
    backup: 'نسخ احتياطي',
    logs: 'سجلات',
    roles: 'أدوار'
  };
  
  return `${actionNames[action] || action} ${categoryInfo?.name || category}`;
};