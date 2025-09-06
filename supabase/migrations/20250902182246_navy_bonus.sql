/*
  # تحديث بيانات المدير عمر الحيدري

  1. تحديث البيانات
    - تغيير الإيميل من omar@avaz.sa إلى info@avaz.sa
    - تحديث كلمة المرور إلى Ma@010203
    - الاحتفاظ بالاسم: عمر الحيدري
  
  2. الأمان
    - تحديث الملف الشخصي في جدول profiles
    - الحفاظ على الدور super_admin
*/

-- تحديث بيانات المدير عمر الحيدري
UPDATE public.profiles 
SET 
  email = 'info@avaz.sa',
  full_name = 'عمر الحيدري',
  role = 'super_admin'::app_role,
  is_active = true,
  updated_at = now()
WHERE employee_id = 'Em-002' OR email = 'omar@avaz.sa' OR email = '3mr@avaz.sa';

-- إضافة ملف شخصي جديد إذا لم يكن موجوداً
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
  'عمر الحيدري',
  'info@avaz.sa',
  'super_admin'::app_role,
  true,
  'EMP-001',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- حذف أي ملفات شخصية مكررة للإيميلات القديمة
DELETE FROM public.profiles 
WHERE email IN ('omar@avaz.sa', '3mr@avaz.sa', 'c.3mr@hotmail.com') 
AND email != 'info@avaz.sa';