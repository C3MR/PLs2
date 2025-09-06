-- CRITICAL SECURITY FIXES: Phase 1 - Database Security (Fixed)

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
    -- Only allow role changes if user has permission or role stays the same
    role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
    OR has_permission(auth.uid(), 'users:update'::permission)
  )
);

-- 4. Restrict anonymous access in RLS policies
DROP POLICY IF EXISTS "System can insert activity logs" ON public.activity_logs;
CREATE POLICY "Authenticated system can insert activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Add comprehensive logging function with proper search path
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