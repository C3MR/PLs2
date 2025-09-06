-- حذف أي مستخدم موجود بهذا البريد الإلكتروني أولاً
DELETE FROM public.profiles WHERE email = 'c.3mr@hotmail.com';

-- إنشاء المستخدم مرة أخرى بمعرف مستخدم ثابت
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
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'عمر محمد',
  'c.3mr@hotmail.com',
  'admin'::app_role,
  true,
  'EMP-002',
  now(),
  now()
);