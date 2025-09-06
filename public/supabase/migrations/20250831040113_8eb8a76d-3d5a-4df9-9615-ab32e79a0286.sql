-- Create enhanced user roles system (fixed version)
CREATE TYPE public.app_role AS ENUM (
  'super_admin',    -- صلاحيات كاملة
  'admin',          -- إدارة النظام
  'manager',        -- مدير فرع
  'agent',          -- مسوق عقاري  
  'employee',       -- موظف عادي
  'client'          -- عميل
);

-- Create permissions enum
CREATE TYPE public.permission AS ENUM (
  -- Properties permissions
  'properties:create',
  'properties:read',
  'properties:update', 
  'properties:delete',
  'properties:publish',
  
  -- Clients permissions
  'clients:create',
  'clients:read',
  'clients:update',
  'clients:delete',
  'clients:export',
  
  -- Requests permissions
  'requests:create',
  'requests:read', 
  'requests:update',
  'requests:delete',
  'requests:assign',
  
  -- Analytics permissions
  'analytics:read',
  'analytics:export',
  
  -- Users permissions
  'users:create',
  'users:read',
  'users:update',
  'users:delete',
  'users:roles',
  
  -- System permissions
  'system:settings',
  'system:backup',
  'system:logs'
);

-- Create role_permissions mapping table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission permission NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role, permission)
);

-- First remove the existing role column default to avoid casting issues
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Update the role column to use the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE app_role USING (
  CASE 
    WHEN role = 'employee' THEN 'employee'::app_role
    WHEN role = 'admin' THEN 'admin'::app_role
    WHEN role = 'manager' THEN 'manager'::app_role
    WHEN role = 'agent' THEN 'agent'::app_role
    WHEN role = 'client' THEN 'client'::app_role
    ELSE 'employee'::app_role
  END
);

-- Set the new default
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'employee'::app_role;

-- Set default role for any NULL values
UPDATE public.profiles 
SET role = 'employee'::app_role 
WHERE role IS NULL;

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission) VALUES
-- Super Admin - all permissions
('super_admin', 'properties:create'),
('super_admin', 'properties:read'),
('super_admin', 'properties:update'),
('super_admin', 'properties:delete'),
('super_admin', 'properties:publish'),
('super_admin', 'clients:create'),
('super_admin', 'clients:read'),
('super_admin', 'clients:update'),
('super_admin', 'clients:delete'),
('super_admin', 'clients:export'),
('super_admin', 'requests:create'),
('super_admin', 'requests:read'),
('super_admin', 'requests:update'),
('super_admin', 'requests:delete'),
('super_admin', 'requests:assign'),
('super_admin', 'analytics:read'),
('super_admin', 'analytics:export'),
('super_admin', 'users:create'),
('super_admin', 'users:read'),
('super_admin', 'users:update'),
('super_admin', 'users:delete'),
('super_admin', 'users:roles'),
('super_admin', 'system:settings'),
('super_admin', 'system:backup'),
('super_admin', 'system:logs'),

-- Admin - most permissions except system critical
('admin', 'properties:create'),
('admin', 'properties:read'),
('admin', 'properties:update'),
('admin', 'properties:delete'),
('admin', 'properties:publish'),
('admin', 'clients:create'),
('admin', 'clients:read'),
('admin', 'clients:update'),
('admin', 'clients:delete'),
('admin', 'clients:export'),
('admin', 'requests:create'),
('admin', 'requests:read'),
('admin', 'requests:update'),
('admin', 'requests:delete'),
('admin', 'requests:assign'),
('admin', 'analytics:read'),
('admin', 'analytics:export'),
('admin', 'users:create'),
('admin', 'users:read'),
('admin', 'users:update'),
('admin', 'users:roles'),

-- Manager - team management
('manager', 'properties:create'),
('manager', 'properties:read'),
('manager', 'properties:update'),
('manager', 'properties:publish'),
('manager', 'clients:create'),
('manager', 'clients:read'),
('manager', 'clients:update'),
('manager', 'clients:export'),
('manager', 'requests:create'),
('manager', 'requests:read'),
('manager', 'requests:update'),
('manager', 'requests:assign'),
('manager', 'analytics:read'),
('manager', 'users:read'),

-- Agent - sales focused
('agent', 'properties:read'),
('agent', 'properties:update'),
('agent', 'clients:create'),
('agent', 'clients:read'),
('agent', 'clients:update'),
('agent', 'requests:create'),
('agent', 'requests:read'),
('agent', 'requests:update'),

-- Employee - basic access
('employee', 'properties:read'),
('employee', 'clients:read'),
('employee', 'requests:read'),

-- Client - own data only
('client', 'properties:read');

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id uuid DEFAULT auth.uid())
RETURNS permission[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(rp.permission)
  FROM public.profiles p
  JOIN public.role_permissions rp ON p.role = rp.role
  WHERE p.user_id = $1;
$$;

-- Create function to check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, required_permission permission)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.role_permissions rp ON p.role = rp.role
    WHERE p.user_id = $1 AND rp.permission = $2
  );
$$;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = $1 AND p.role = $2
  );
$$;

-- Enable RLS on role_permissions
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for role_permissions
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only super admins can modify role permissions
CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions
FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin')
);