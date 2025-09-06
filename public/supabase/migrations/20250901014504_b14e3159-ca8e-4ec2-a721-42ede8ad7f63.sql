-- إضافة بيانات الأدمن والصلاحيات
-- إنشاء حساب المدير العام

-- إضافة الصلاحيات للأدوار المختلفة
INSERT INTO public.role_permissions (role, permission) VALUES 
-- Super Admin - جميع الصلاحيات
('super_admin', 'users:create'),
('super_admin', 'users:read'),
('super_admin', 'users:update'),
('super_admin', 'users:delete'),
('super_admin', 'properties:create'),
('super_admin', 'properties:read'),
('super_admin', 'properties:update'),
('super_admin', 'properties:delete'),
('super_admin', 'clients:create'),
('super_admin', 'clients:read'),
('super_admin', 'clients:update'),
('super_admin', 'clients:delete'),
('super_admin', 'requests:create'),
('super_admin', 'requests:read'),
('super_admin', 'requests:update'),
('super_admin', 'requests:delete'),
('super_admin', 'analytics:read'),
('super_admin', 'analytics:export'),
('super_admin', 'system:settings'),
('super_admin', 'system:backup'),
('super_admin', 'system:logs'),

-- Admin - معظم الصلاحيات
('admin', 'users:read'),
('admin', 'users:update'),
('admin', 'properties:create'),
('admin', 'properties:read'),
('admin', 'properties:update'),
('admin', 'properties:delete'),
('admin', 'clients:create'),
('admin', 'clients:read'),
('admin', 'clients:update'),
('admin', 'clients:delete'),
('admin', 'requests:create'),
('admin', 'requests:read'),
('admin', 'requests:update'),
('admin', 'requests:delete'),
('admin', 'analytics:read'),
('admin', 'analytics:export'),

-- Manager - صلاحيات إدارية
('manager', 'properties:create'),
('manager', 'properties:read'),
('manager', 'properties:update'),
('manager', 'clients:create'),
('manager', 'clients:read'),
('manager', 'clients:update'),
('manager', 'requests:create'),
('manager', 'requests:read'),
('manager', 'requests:update'),
('manager', 'analytics:read'),

-- Agent - صلاحيات أساسية
('agent', 'properties:read'),
('agent', 'clients:create'),
('agent', 'clients:read'),
('agent', 'clients:update'),
('agent', 'requests:create'),
('agent', 'requests:read'),
('agent', 'requests:update'),

-- Employee - صلاحيات محدودة
('employee', 'properties:read'),
('employee', 'clients:read'),
('employee', 'requests:read')

ON CONFLICT DO NOTHING;