-- Fix database function security by adding proper search_path settings
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    WHERE p.user_id = $1 AND p.role = $2
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id uuid DEFAULT auth.uid())
RETURNS permission[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(rp.permission)
  FROM profiles p
  JOIN role_permissions rp ON p.role = rp.role
  WHERE p.user_id = $1;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM profiles WHERE user_id = $1 LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, required_permission permission)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN role_permissions rp ON p.role = rp.role
    WHERE p.user_id = $1 AND rp.permission = $2
  );
$$;

-- Update null created_by values with system UUID before making NOT NULL
UPDATE public.clients 
SET created_by = gen_random_uuid() 
WHERE created_by IS NULL;

UPDATE public.properties 
SET created_by = gen_random_uuid() 
WHERE created_by IS NULL;

-- Now make user_id NOT NULL in critical tables for security  
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Add NOT NULL constraint to created_by in security-critical tables
ALTER TABLE public.clients 
ALTER COLUMN created_by SET NOT NULL;

ALTER TABLE public.properties 
ALTER COLUMN created_by SET NOT NULL;

-- Strengthen profile RLS policies to prevent self-role escalation
DROP POLICY IF EXISTS "Users can update own profile (no role changes)" ON public.profiles;

CREATE POLICY "Users can update own profile (no role changes)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  (
    role = (SELECT role FROM profiles WHERE user_id = auth.uid()) OR 
    has_permission(auth.uid(), 'users:update'::permission)
  )
);