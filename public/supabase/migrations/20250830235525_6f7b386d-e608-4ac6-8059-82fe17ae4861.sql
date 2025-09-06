-- تحديث بيانات الموظفين لتطابق القائمة الجديدة
UPDATE public.profiles SET 
    full_name = 'منصور القميزي',
    email = 'ceo@avaz.sa',
    role = 'admin'
WHERE employee_id = 'em-001';

UPDATE public.profiles SET 
    full_name = 'عمر الحيدري',
    email = '3mr@avaz.sa',
    role = 'admin'
WHERE employee_id = 'em-002';

UPDATE public.profiles SET 
    full_name = 'عبد الرحمن الحميدان',
    email = 'abo-fahd@avaz.sa',
    role = 'property_manager'
WHERE employee_id = 'em-003';

UPDATE public.profiles SET 
    full_name = 'علي الزويدي',
    email = 'ali@avaz.sa',
    role = 'manager'
WHERE employee_id = 'em-004';

UPDATE public.profiles SET 
    full_name = 'عبد العزيز العتيبي',
    email = 'aziz@avaz.sa',
    role = 'sales_agent'
WHERE employee_id = 'em-005';

UPDATE public.profiles SET 
    full_name = 'أبو القاسم العجمي',
    email = 'abo-algasem@avaz.sa',
    role = 'property_manager'
WHERE employee_id = 'em-006';

UPDATE public.profiles SET 
    full_name = 'فيصل القميري',
    email = 'faisl@avaz.sa',
    role = 'sales_agent'
WHERE employee_id = 'em-007';

UPDATE public.profiles SET 
    full_name = 'سعود الحيد',
    email = 's3od@avaz.sa',
    role = 'sales_agent'
WHERE employee_id = 'em-008';

UPDATE public.profiles SET 
    full_name = 'أسامه سيف',
    email = 'osamh@avaz.sa',
    role = 'accountant'
WHERE employee_id = 'em-009';

-- حذف الموظف em-010 لأنه غير موجود في القائمة الجديدة
DELETE FROM public.profiles WHERE employee_id = 'em-010';