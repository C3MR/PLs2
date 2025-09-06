-- Security hardening: Add search_path isolation to database functions
-- This prevents potential SQL injection through search_path manipulation

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'employee');
  RETURN NEW;
END;
$function$;

-- Update authenticate_employee function  
CREATE OR REPLACE FUNCTION public.authenticate_employee(email_input text, password_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_record auth.users%ROWTYPE;
  profile_record profiles%ROWTYPE;
  result json;
BEGIN
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
$function$;

-- Update create_auth_user_for_admin function
CREATE OR REPLACE FUNCTION public.create_auth_user_for_admin(user_email text, temp_password text DEFAULT 'TempPass123!'::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Create security events table for enhanced monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  severity text DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Security events policies - only admins can view security events
CREATE POLICY "Only security admins can view security events"
ON public.security_events
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND has_permission(auth.uid(), 'system:logs'::permission)
);

CREATE POLICY "System can insert security events"
ON public.security_events
FOR INSERT
WITH CHECK (true);

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_user_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_severity text DEFAULT 'info'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    ip_address,
    user_agent,
    metadata,
    severity
  ) VALUES (
    p_event_type,
    p_user_id,
    p_ip_address,
    p_user_agent,
    p_metadata,
    p_severity
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;