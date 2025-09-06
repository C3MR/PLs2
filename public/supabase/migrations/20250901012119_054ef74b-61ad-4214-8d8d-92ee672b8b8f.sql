-- Security hardening: Add search_path to all database functions to prevent SQL injection
-- Fix all existing functions by adding SET search_path = 'public'

-- Update create_auth_user_for_admin function
CREATE OR REPLACE FUNCTION public.create_auth_user_for_admin(user_email text, temp_password text DEFAULT 'TempPass123!'::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

-- Update log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(p_event_type text, p_user_id uuid DEFAULT NULL::uuid, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb, p_severity text DEFAULT 'info'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO security_events (
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

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT role::text FROM profiles WHERE user_id = $1 LIMIT 1;
$function$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.user_id = $1 AND p.role = $2
  );
$function$;

-- Update get_user_permissions function
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id uuid DEFAULT auth.uid())
 RETURNS permission[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT ARRAY_AGG(rp.permission)
  FROM profiles p
  JOIN role_permissions rp ON p.role = rp.role
  WHERE p.user_id = $1;
$function$;

-- Update has_permission function
CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, required_permission permission)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN role_permissions rp ON p.role = rp.role
    WHERE p.user_id = $1 AND rp.permission = $2
  );
$function$;

-- Add rate limiting for public forms
-- Create rate limiting table for contact messages
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet,
  form_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for rate limiting performance
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_form_time 
ON public.rate_limit_log (ip_address, form_type, created_at);

-- Enable RLS on rate limiting table
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- RLS policy for rate limiting - system can insert and cleanup
CREATE POLICY "System can manage rate limiting" ON public.rate_limit_log
  FOR ALL USING (true);

-- Create function to check and log rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_address inet,
  p_form_type text,
  p_max_requests integer DEFAULT 5,
  p_time_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  request_count integer;
BEGIN
  -- Count recent requests from this IP for this form type
  SELECT COUNT(*) INTO request_count
  FROM rate_limit_log
  WHERE ip_address = p_ip_address
    AND form_type = p_form_type
    AND created_at > (now() - (p_time_window_minutes || ' minutes')::interval);
  
  -- If under limit, log this request and allow
  IF request_count < p_max_requests THEN
    INSERT INTO rate_limit_log (ip_address, form_type) 
    VALUES (p_ip_address, p_form_type);
    RETURN true;
  END IF;
  
  -- Over limit, deny request
  RETURN false;
END;
$function$;

-- Create cleanup function for old rate limit logs
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM rate_limit_log 
  WHERE created_at < (now() - interval '24 hours');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;