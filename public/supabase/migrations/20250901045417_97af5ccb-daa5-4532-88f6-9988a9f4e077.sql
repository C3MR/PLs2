-- إضافة مستخدم جديد بالإيميل info@avaz.sa
INSERT INTO public.profiles (
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
  'مدير المعلومات',
  'info@avaz.sa',
  'admin'::app_role,
  true,
  'EMP-002',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  updated_at = now();