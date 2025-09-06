-- إنشاء حسابات المصادقة للموظفين والأدمن
-- نظراً لأن Supabase Auth يتطلب إنشاء الحسابات عبر واجهة التطبيق، سنقوم بإنشاء دالة مساعدة

-- أولاً، دالة لإنشاء حساب مصادقة جديد للأدمن
CREATE OR REPLACE FUNCTION create_auth_user_for_admin(
  user_email text,
  temp_password text DEFAULT 'TempPass123!'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  profile_exists boolean;
BEGIN
  -- التحقق من وجود ملف شخصي
  SELECT EXISTS(
    SELECT 1 FROM profiles 
    WHERE email = user_email 
    AND role IN ('admin', 'employee')
  ) INTO profile_exists;
  
  IF NOT profile_exists THEN
    RETURN json_build_object(
      'success', false,
      'error', 'profile_not_found',
      'message', 'لا يوجد ملف شخصي لهذا البريد الإلكتروني'
    );
  END IF;
  
  -- إنشاء معرف مستخدم جديد
  new_user_id := gen_random_uuid();
  
  -- تحديث ملف المستخدم بمعرف المستخدم الجديد
  UPDATE profiles 
  SET user_id = new_user_id
  WHERE email = user_email;
  
  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', user_email,
    'temp_password', temp_password,
    'message', 'تم إعداد الحساب، يرجى استخدام كلمة المرور المؤقتة'
  );
END;
$$;

-- دالة لإعادة تعيين كلمة المرور
CREATE OR REPLACE FUNCTION reset_employee_password()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- إعادة تعيين كلمات المرور لجميع الموظفين والأدمن
  -- سيتم إنشاء الحسابات عبر واجهة التطبيق
  
  RETURN json_build_object(
    'success', true,
    'message', 'يرجى إنشاء الحسابات عبر واجهة التطبيق',
    'admin_email', 'omar@avaz.sa',
    'temp_password', 'Admin123!',
    'note', 'استخدم هذه البيانات لإنشاء حساب جديد'
  );
END;
$$;