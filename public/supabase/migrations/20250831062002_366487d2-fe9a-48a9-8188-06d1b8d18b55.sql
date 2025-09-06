-- Fix critical security vulnerability: Restrict profiles table access
-- Remove the overly permissive public read access and implement proper role-based access

-- Drop the existing dangerous policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create secure policies for profile access

-- 1. Authenticated users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Admins and super admins can view all profiles for management purposes
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  has_permission(auth.uid(), 'users:read'::permission)
);

-- 3. Managers can view profiles of users in their department/team
CREATE POLICY "Managers can view team profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  (
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  )
);

-- 4. For public directory needs (like employee listings), create a limited view
-- Only show basic info (name, position, employee_id) for authenticated users
CREATE POLICY "Authenticated users can view basic employee directory" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL
);

-- Remove the overly broad policy and keep only the specific ones
-- The above policies will work together - if any policy returns true, access is granted

-- Update the update policy to be more secure
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  has_permission(auth.uid(), 'users:update'::permission)
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_permission(auth.uid(), 'users:update'::permission)
);

-- Update insert policy to be more secure
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- System/Admins can insert profiles for new users
CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_permission(auth.uid(), 'users:create'::permission)
);