-- إزالة القيد الأجنبي وتحديث البيانات
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- إدراج جميع الموظفين من القائمة الجديدة
INSERT INTO public.profiles (user_id, employee_id, full_name, email, role) VALUES
(gen_random_uuid(), 'Em-001', 'منصور القميزي', 'ceo@avaz.sa', 'admin'),
(gen_random_uuid(), 'Em-002', 'عمر الحيدري', '3mr@avaz.sa', 'admin'),
(gen_random_uuid(), 'Em-003', 'عبد الرحمن الحميدان', 'abo-fahd@avaz.sa', 'property_manager'),
(gen_random_uuid(), 'Em-004', 'علي الزويدي', 'ali@avaz.sa', 'manager'),
(gen_random_uuid(), 'Em-005', 'عبد العزيز العتيبي', 'aziz@avaz.sa', 'sales_agent'),
(gen_random_uuid(), 'Em-006', 'أبو القاسم العجمي', 'abo-algasem@avaz.sa', 'property_manager'),
(gen_random_uuid(), 'Em-007', 'فيصل القميري', 'faisl@avaz.sa', 'sales_agent'),
(gen_random_uuid(), 'Em-008', 'سعود الحيد', 's3od@avaz.sa', 'sales_agent'),
(gen_random_uuid(), 'Em-009', 'أسامه سيف', 'osamh@avaz.sa', 'accountant')

ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;