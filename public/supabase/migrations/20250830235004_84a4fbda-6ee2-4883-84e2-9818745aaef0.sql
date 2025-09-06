-- إضافة المستخدمين والموظفين
-- أولاً: إدخال بيانات في جدول profiles مع user_id وهمي مؤقت (سيتم استبداله عند التسجيل الفعلي)

INSERT INTO public.profiles (user_id, employee_id, full_name, email, role) VALUES
-- المستخدم التجريبي
(gen_random_uuid(), 'test-001', 'مستخدم تجريبي', 'test@avaz.com', 'admin'),

-- الموظفين من لوحة الدخول
(gen_random_uuid(), 'em-001', 'محمد العتيبي', 'mohammed.alotaibi@avaz.com', 'manager'),
(gen_random_uuid(), 'em-002', 'عمر الحيدري', 'omar.alhaydari@avaz.com', 'property_manager'),
(gen_random_uuid(), 'em-003', 'فاطمة الغامدي', 'fatima.alghamdi@avaz.com', 'sales_agent'),
(gen_random_uuid(), 'em-004', 'أحمد الشمري', 'ahmed.alshamri@avaz.com', 'accountant'),
(gen_random_uuid(), 'em-005', 'نورا القحطاني', 'nora.alqahtani@avaz.com', 'customer_service'),
(gen_random_uuid(), 'em-006', 'خالد الدوسري', 'khalid.aldosari@avaz.com', 'property_manager'),
(gen_random_uuid(), 'em-007', 'سارة النعيمي', 'sara.alnaimi@avaz.com', 'sales_agent'),
(gen_random_uuid(), 'em-008', 'عبدالله المالكي', 'abdullah.almalki@avaz.com', 'legal_advisor'),
(gen_random_uuid(), 'em-009', 'ريم الزهراني', 'reem.alzahrani@avaz.com', 'marketing_specialist'),
(gen_random_uuid(), 'em-010', 'يوسف الحربي', 'yusuf.alharbi@avaz.com', 'maintenance_coordinator')

ON CONFLICT (employee_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- إضافة بعض العقارات التجريبية
INSERT INTO public.properties (title, description, price, location, area, bedrooms, bathrooms, property_type, status, images, amenities, created_by) VALUES
('شقة فاخرة في حي النخيل', 'شقة 3 غرف وصالة في موقع مميز بحي النخيل، مطبخ مجهز وتكييف مركزي', 650000.00, 'حي النخيل، الرياض', 180.5, 3, 2, 'apartment', 'available', '{}', '{"موقف سيارة", "تكييف مركزي", "مطبخ مجهز", "حراسة"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'em-002' LIMIT 1)),

('فيلا عصرية في المونسية', 'فيلا دورين مع حديقة واسعة، 5 غرف نوم وصالة كبيرة', 1250000.00, 'حي المونسية، الرياض', 400.0, 5, 4, 'villa', 'available', '{}', '{"حديقة", "مسبح", "موقف سيارتين", "تكييف مركزي", "نظام أمني"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'em-002' LIMIT 1)),

('محل تجاري في شارع التحلية', 'محل تجاري بمساحة 80 متر مربع في موقع حيوي', 180000.00, 'شارع التحلية، الرياض', 80.0, 0, 1, 'commercial', 'available', '{}', '{"مكيف", "واجهة زجاجية", "موقف عملاء"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'em-006' LIMIT 1)),

('استراحة في الخرج', 'استراحة مع مجلس كبير وحديقة واسعة، مناسبة للعائلات', 85000.00, 'الخرج', 1200.0, 4, 3, 'rest_house', 'available', '{}', '{"مجلس", "حديقة واسعة", "مطبخ خارجي", "العاب اطفال"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'em-002' LIMIT 1));