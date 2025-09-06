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

-- Remove foreign key constraint temporarily to allow cleanup
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_created_by_fkey;
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_created_by_fkey;

-- Get the first available admin user ID to use as default
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find first admin user
  SELECT user_id INTO admin_user_id 
  FROM profiles 
  WHERE role IN ('admin', 'super_admin') 
  LIMIT 1;
  
  -- Update null created_by values with admin user ID
  IF admin_user_id IS NOT NULL THEN
    UPDATE public.clients 
    SET created_by = admin_user_id 
    WHERE created_by IS NULL;
    
    UPDATE public.properties 
    SET created_by = admin_user_id 
    WHERE created_by IS NULL;
  END IF;
END $$;

-- Make user_id NOT NULL in critical tables for security  
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

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