-- إصلاح مشاكل الصلاحيات وإضافة المدير العام
-- إنشاء بيانات مدير النظام

-- إدراج المدير العام
INSERT INTO public.profiles (
  id,
  user_id,
  full_name,
  email,
  role,
  is_active,
  employee_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'عمر المدير العام',
  'omar@avaz.sa',
  'super_admin',
  true,
  'EMP-001',
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- إدراج جميع الصلاحيات للأدوار
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

ON CONFLICT (role, permission) DO NOTHING;

-- تحديث صلاحيات الـ RLS للـ properties للسماح بالتعديل للمستخدمين المصرح لهم
DROP POLICY IF EXISTS "Property creators can update their properties" ON public.properties;
DROP POLICY IF EXISTS "Property creators can delete their properties" ON public.properties;

-- سياسة جديدة للتحديث - للمستخدمين المصرح لهم أو منشئ العقار
CREATE POLICY "Authorized users can update properties" ON public.properties
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'properties:update')
  );

-- سياسة جديدة للحذف - للمستخدمين المصرح لهم أو منشئ العقار  
CREATE POLICY "Authorized users can delete properties" ON public.properties
  FOR DELETE USING (
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'properties:delete')
  );

-- تحديث سياسة الإنشاء للسماح للمستخدمين المصرح لهم
DROP POLICY IF EXISTS "Authenticated users can create properties" ON public.properties;

CREATE POLICY "Authorized users can create properties" ON public.properties
  FOR INSERT WITH CHECK (
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'properties:create')
  );