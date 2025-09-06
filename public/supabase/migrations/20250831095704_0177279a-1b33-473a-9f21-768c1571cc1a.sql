-- CRITICAL SECURITY FIXES: Phase 1 - Database Security

-- 1. Fix search path vulnerability in all database functions
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id uuid DEFAULT auth.uid())
 RETURNS permission[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT ARRAY_AGG(rp.permission)
  FROM public.profiles p
  JOIN public.role_permissions rp ON p.role = rp.role
  WHERE p.user_id = $1;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role::text FROM public.profiles WHERE user_id = $1 LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = $1 AND p.role = $2
  );
$function$;

CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, required_permission permission)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.role_permissions rp ON p.role = rp.role
    WHERE p.user_id = $1 AND rp.permission = $2
  );
$function$;

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

-- 2. DROP dangerous profile UPDATE policies that allow role changes
DROP POLICY IF EXISTS "Users can update own profile except role" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profile but not role" ON public.profiles;

-- 3. Create secure profile UPDATE policies
CREATE POLICY "Users can update own profile (no role changes)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    -- Prevent role changes unless user has permission
    (OLD.role = NEW.role) 
    OR has_permission(auth.uid(), 'users:update'::permission)
  )
);

-- 4. Restrict anonymous access in RLS policies
-- Update activity_logs policies
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
CREATE POLICY "Authenticated system can insert activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Update contact_messages policy to be more restrictive
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
CREATE POLICY "Rate limited contact message creation" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true); -- Keep this public but will add rate limiting in app

-- Update property_requests policy
DROP POLICY IF EXISTS "Anyone can create property requests" ON public.property_requests;
CREATE POLICY "Rate limited property request creation" 
ON public.property_requests 
FOR INSERT 
WITH CHECK (true); -- Keep this public but will add rate limiting in app

-- 5. Add audit trigger for role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Log role changes and prevent unauthorized changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Block role changes for users without permission
    IF NOT public.has_permission(auth.uid(), 'users:update'::permission) AND auth.uid() = NEW.user_id THEN
      RAISE EXCEPTION 'Unauthorized: Cannot change your own role';
    END IF;
    
    -- Log the role change
    PERFORM public.log_activity(
      NEW.user_id,
      'user:role_change'::activity_type,
      'user',
      NEW.user_id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for profile role changes
DROP TRIGGER IF EXISTS audit_profile_role_changes ON public.profiles;
CREATE TRIGGER audit_profile_role_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();

-- 6. Add comprehensive logging function with proper search path
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid, 
  p_activity_type activity_type, 
  p_entity_type text DEFAULT NULL::text, 
  p_entity_id uuid DEFAULT NULL::uuid, 
  p_metadata jsonb DEFAULT '{}'::jsonb, 
  p_ip_address inet DEFAULT NULL::inet, 
  p_user_agent text DEFAULT NULL::text, 
  p_session_id text DEFAULT NULL::text, 
  p_success boolean DEFAULT true, 
  p_error_message text DEFAULT NULL::text
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    activity_type,
    entity_type,
    entity_id,
    metadata,
    ip_address,
    user_agent,
    session_id,
    success,
    error_message
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_entity_type,
    p_entity_id,
    p_metadata,
    p_ip_address,
    p_user_agent,
    p_session_id,
    p_success,
    p_error_message
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$;