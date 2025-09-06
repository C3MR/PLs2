-- حذف الملفات الشخصية المكررة والاحتفاظ بالأدمن فقط
DELETE FROM profiles 
WHERE email = 'omar@avaz.sa' 
AND role = 'employee';

-- التأكد من وجود الأدمن بالدور الصحيح
UPDATE profiles 
SET role = 'super_admin',
    is_active = true,
    updated_at = now()
WHERE email = 'omar@avaz.sa' 
AND role = 'admin';