-- Fix critical security vulnerability: First check and remove existing policies properly
-- Then create secure replacement policies

-- Drop ALL existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Managers can view team profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view basic employee directory" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Now create secure policies from scratch

-- SELECT policies (multiple policies work with OR logic)
-- 1. Users can view their own profile
CREATE POLICY "view_own_profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Authenticated users with proper permissions can view all profiles
CREATE POLICY "admin_view_all_profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  has_permission(auth.uid(), 'users:read'::permission)
);

-- INSERT policies
-- 1. Users can insert their own profile
CREATE POLICY "insert_own_profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. Admins can insert profiles for new users
CREATE POLICY "admin_insert_profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  has_permission(auth.uid(), 'users:create'::permission)
);

-- UPDATE policies
-- 1. Users can update their own profile
CREATE POLICY "update_own_profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Admins can update any profile
CREATE POLICY "admin_update_profiles" 
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

-- No DELETE policy - profiles should not be deleted, only deactivated