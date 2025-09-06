-- إضافة عقارات تجريبية مع معرفات واضحة
INSERT INTO public.properties (title, description, price, location, area, bedrooms, bathrooms, property_type, status, images, amenities, created_by) VALUES
('شقة فاخرة في حي النخيل', 'شقة 3 غرف وصالة في موقع مميز بحي النخيل، مطبخ مجهز وتكييف مركزي', 650000.00, 'حي النخيل، الرياض', 180.5, 3, 2, 'apartment', 'available', '{}', '{"موقف سيارة", "تكييف مركزي", "مطبخ مجهز", "حراسة"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'Em-002' LIMIT 1)),

('فيلا عصرية في المونسية', 'فيلا دورين مع حديقة واسعة، 5 غرف نوم وصالة كبيرة', 1250000.00, 'حي المونسية، الرياض', 400.0, 5, 4, 'villa', 'available', '{}', '{"حديقة", "مسبح", "موقف سيارتين", "تكييف مركزي", "نظام أمني"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'Em-002' LIMIT 1)),

('محل تجاري في شارع التحلية', 'محل تجاري بمساحة 80 متر مربع في موقع حيوي', 180000.00, 'شارع التحلية، الرياض', 80.0, 0, 1, 'commercial', 'available', '{}', '{"مكيف", "واجهة زجاجية", "موقف عملاء"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'Em-006' LIMIT 1)),

('شقة اقتصادية في الشفا', 'شقة غرفتين وصالة، مناسبة للأسر الصغيرة', 420000.00, 'حي الشفا، الرياض', 120.0, 2, 1, 'apartment', 'available', '{}', '{"موقف سيارة", "مصعد"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'Em-003' LIMIT 1)),

('أرض سكنية في الدرعية', 'أرض سكنية بمساحة 600 متر مربع في موقع هادئ', 800000.00, 'الدرعية، الرياض', 600.0, 0, 0, 'land', 'available', '{}', '{"شارع تجاري", "قريب من الخدمات"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'Em-005' LIMIT 1)),

('فيلا للإيجار في الملقا', 'فيلا 4 غرف للإيجار الشهري، مفروشة بالكامل', 12000.00, 'حي الملقا، الرياض', 320.0, 4, 3, 'villa', 'for_rent', '{}', '{"مفروشة", "حديقة", "موقف سيارتين", "تكييف مركزي"}', (SELECT user_id FROM public.profiles WHERE employee_id = 'Em-007' LIMIT 1))

ON CONFLICT (id) DO NOTHING;