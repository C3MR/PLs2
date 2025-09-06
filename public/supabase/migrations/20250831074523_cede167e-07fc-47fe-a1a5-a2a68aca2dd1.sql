-- Create an edge function to handle admin/employee authentication
CREATE OR REPLACE FUNCTION public.authenticate_employee(
  email_input text,
  password_input text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record auth.users%ROWTYPE;
  profile_record profiles%ROWTYPE;
  result json;
BEGIN
  -- First, try to authenticate with Supabase Auth
  -- This function will be called from the frontend after successful auth
  
  -- Get user profile
  SELECT * INTO profile_record 
  FROM profiles 
  WHERE email = email_input 
  AND role IN ('admin', 'employee')
  AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'unauthorized',
      'message', 'غير مسموح لك بالدخول للنظام'
    );
  END IF;
  
  -- Update last login
  UPDATE profiles 
  SET last_login = now() 
  WHERE id = profile_record.id;
  
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', profile_record.id,
      'full_name', profile_record.full_name,
      'email', profile_record.email,
      'role', profile_record.role,
      'employee_id', profile_record.employee_id
    )
  );
END;
$$;