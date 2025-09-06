-- إعادة إدراج جميع الموظفين من القائمة الجديدة
INSERT INTO public.profiles (user_id, employee_id, full_name, email, role) VALUES
-- منصور القميزي - الرئيس التنفيذي
(gen_random_uuid(), 'Em-001', 'منصور القميزي', 'ceo@avaz.sa', 'admin'),

-- عمر الحيدري - سكرتير تنفيذي مدير النظام
(gen_random_uuid(), 'Em-002', 'عمر الحيدري', '3mr@avaz.sa', 'admin'),

-- عبد الرحمن الحميدان - ادارة الاملاك والتشغيل والصيانة
(gen_random_uuid(), 'Em-003', 'عبد الرحمن الحميدان', 'abo-fahd@avaz.sa', 'property_manager'),

-- علي الزويدي - مدير فريق التسويق
(gen_random_uuid(), 'Em-004', 'علي الزويدي', 'ali@avaz.sa', 'manager'),

-- عبد العزيز العتيبي - مسوق عقاري
(gen_random_uuid(), 'Em-005', 'عبد العزيز العتيبي', 'aziz@avaz.sa', 'sales_agent'),

-- أبو القاسم العجمي - ادارة الأملاك
(gen_random_uuid(), 'Em-006', 'أبو القاسم العجمي', 'abo-algasem@avaz.sa', 'property_manager'),

-- فيصل القميري - مسوق عقاري
(gen_random_uuid(), 'Em-007', 'فيصل القميري', 'faisl@avaz.sa', 'sales_agent'),

-- سعود الحيد - مسوق عقاري القطاع السكني
(gen_random_uuid(), 'Em-008', 'سعود الحيد', 's3od@avaz.sa', 'sales_agent'),

-- أسامه سيف - محاسب
(gen_random_uuid(), 'Em-009', 'أسامه سيف', 'osamh@avaz.sa', 'accountant')

ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;