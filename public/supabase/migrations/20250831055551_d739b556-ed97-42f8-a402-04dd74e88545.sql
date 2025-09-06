-- Insert all employee profiles into the database
-- Note: This creates the employee records in the profiles table

-- Function to create multiple employees at once
CREATE OR REPLACE FUNCTION create_employee_batch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert all employees into profiles table
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    email,
    role,
    is_active,
    employee_id,
    phone,
    bio,
    created_at,
    updated_at
  ) VALUES 
  -- Em-001: منصور القميزي - الرئيس التنفيذي
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'منصور القميزي',
    'ceo@avaz.sa',
    'super_admin'::app_role,
    true,
    'Em-001',
    '509000616',
    'الرئيس التنفيذي',
    now(),
    now()
  ),
  -- Em-003: عبد الرحمن الحميدان - ادارة الاملاك والتشغيل والصيانة
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'عبد الرحمن الحميدان',
    'abo-fahd@avaz.sa',
    'manager'::app_role,
    true,
    'Em-003',
    '504247988',
    'ادارة الاملاك والتشغيل والصيانة',
    now(),
    now()
  ),
  -- Em-004: علي الزويدي - مدير فريق التسويق
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'علي الزويدي',
    'ali@avaz.sa',
    'manager'::app_role,
    true,
    'Em-004',
    '509450210',
    'مدير فريق التسويق',
    now(),
    now()
  ),
  -- Em-005: عبد العزيز العتيبي - مسوق عقاري
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'عبد العزيز العتيبي',
    'aziz@avaz.sa',
    'agent'::app_role,
    true,
    'Em-005',
    '544462646',
    'مسوق عقاري',
    now(),
    now()
  ),
  -- Em-006: أبو القاسم العجمي - ادارة الأملاك
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'أبو القاسم العجمي',
    'abo-algasem@avaz.sa',
    'agent'::app_role,
    true,
    'Em-006',
    '530123105',
    'ادارة الأملاك',
    now(),
    now()
  ),
  -- Em-007: فيصل القميري - مسوق عقاري
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'فيصل القميري',
    'faisl@avaz.sa',
    'agent'::app_role,
    true,
    'Em-007',
    '651286830',
    'مسوق عقاري',
    now(),
    now()
  ),
  -- Em-008: سعود الحيد - مسوق عقاري القطاع السكني
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'سعود الحيد',
    's3od@avaz.sa',
    'agent'::app_role,
    true,
    'Em-008',
    '555596926',
    'مسوق عقاري القطاع السكني',
    now(),
    now()
  ),
  -- Em-009: أسامه سيف - محاسب
  (
    gen_random_uuid(),
    gen_random_uuid(),
    'أسامه سيف',
    'osamh@avaz.sa',
    'employee'::app_role,
    true,
    'Em-009',
    '536127880',
    'محاسب',
    now(),
    now()
  )
  ON CONFLICT (employee_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    bio = EXCLUDED.bio,
    updated_at = now();
    
END;
$$;

-- Execute the function to create all employees
SELECT create_employee_batch();

-- Grant permissions to managers and agents
INSERT INTO public.role_permissions (role, permission)
SELECT 'manager'::app_role, permission::permission
FROM unnest(ARRAY[
  'properties:create', 'properties:read', 'properties:update', 'properties:delete',
  'clients:create', 'clients:read', 'clients:update', 'clients:delete',
  'requests:create', 'requests:read', 'requests:update', 'requests:delete',
  'analytics:read'
]) AS permission
ON CONFLICT (role, permission) DO NOTHING;

-- Grant permissions to agents
INSERT INTO public.role_permissions (role, permission)
SELECT 'agent'::app_role, permission::permission
FROM unnest(ARRAY[
  'properties:read', 'properties:update',
  'clients:create', 'clients:read', 'clients:update',
  'requests:create', 'requests:read', 'requests:update'
]) AS permission
ON CONFLICT (role, permission) DO NOTHING;

-- Grant permissions to employees
INSERT INTO public.role_permissions (role, permission)
SELECT 'employee'::app_role, permission::permission
FROM unnest(ARRAY[
  'properties:read',
  'clients:read',
  'requests:read'
]) AS permission
ON CONFLICT (role, permission) DO NOTHING;