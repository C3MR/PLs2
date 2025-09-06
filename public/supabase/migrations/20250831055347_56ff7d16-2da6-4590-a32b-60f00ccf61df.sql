-- Insert admin user manually into auth.users table and profiles table
-- Note: This is a special case for creating an admin account

-- First, let's create a function to safely insert an admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email text,
  user_password text,
  full_name text DEFAULT 'المدير العام'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  hashed_password text;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- Simple password hashing (in production, Supabase handles this)
  hashed_password := crypt(user_password, gen_salt('bf'));
  
  -- Insert into auth.users (this is handled by Supabase in production)
  -- We'll create the profile directly and let the trigger handle the rest
  
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    email,
    role,
    is_active,
    employee_id,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    full_name,
    user_email,
    'super_admin'::app_role,
    true,
    'EMP-001',
    now(),
    now()
  );
  
  RETURN new_user_id;
END;
$$;

-- Create the admin user profile
SELECT create_admin_user('3mr@avaz.sa', 'Ma@010203', 'عمر - المدير العام');

-- Grant super admin all permissions
INSERT INTO public.role_permissions (role, permission)
SELECT 'super_admin'::app_role, permission::permission
FROM unnest(ARRAY[
  'users:create', 'users:read', 'users:update', 'users:delete',
  'properties:create', 'properties:read', 'properties:update', 'properties:delete',
  'clients:create', 'clients:read', 'clients:update', 'clients:delete',
  'requests:create', 'requests:read', 'requests:update', 'requests:delete',
  'analytics:read', 'analytics:export',
  'system:settings', 'system:backup', 'system:logs'
]) AS permission
ON CONFLICT (role, permission) DO NOTHING;