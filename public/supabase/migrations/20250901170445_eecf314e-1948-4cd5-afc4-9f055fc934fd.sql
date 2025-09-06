-- تحديث الملف الشخصي لإزالة user_id الوهمي مؤقتاً
UPDATE profiles 
SET user_id = NULL 
WHERE email = 'c.3mr@hotmail.com' AND user_id = '550e8400-e29b-41d4-a716-446655440000';

-- إضافة function لربط المستخدم بعد إنشاؤه
CREATE OR REPLACE FUNCTION public.update_profile_user_id(
  p_email text,
  p_new_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE profiles 
  SET user_id = p_new_user_id,
      updated_at = now()
  WHERE email = p_email;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Profile not found'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Profile updated successfully',
    'email', p_email,
    'user_id', p_new_user_id
  );
END;
$$;