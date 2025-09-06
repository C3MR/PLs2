-- Fix security warnings

-- Update functions to have proper search_path
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