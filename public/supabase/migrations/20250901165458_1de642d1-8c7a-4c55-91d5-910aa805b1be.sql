-- إنشاء function لربط المستخدم بالملف الشخصي
CREATE OR REPLACE FUNCTION public.link_user_to_profile(
  p_email text,
  p_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- تحديث الملف الشخصي بـ user_id الجديد
  UPDATE public.profiles 
  SET user_id = p_user_id,
      updated_at = now()
  WHERE email = p_email;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'profile_not_found',
      'message', 'لم يتم العثور على ملف شخصي بهذا البريد الإلكتروني'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'تم ربط المستخدم بالملف الشخصي بنجاح',
    'email', p_email,
    'user_id', p_user_id
  );
END;
$$;

-- ربط المستخدم c.3mr@hotmail.com بالملف الشخصي (بعد إنشاء المستخدم)
-- هذا سيتم تنفيذه بعد إنشاء المستخدم في Auth
SELECT 'تم إعداد function لربط المستخدم - جاهز للاستخدام بعد إنشاء المستخدم في Auth' as status;