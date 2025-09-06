-- Add missing employee Em-002: عمر الحيدري

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
) VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'عمر الحيدري',
  '3mr@avaz.sa',
  'super_admin'::app_role,
  true,
  'Em-002',
  '500075446',
  'سكرتير تنفيذي مدير النظام - جميع الصلاحيات',
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