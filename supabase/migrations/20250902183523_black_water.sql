/*
  # Create profiles table and essential schema

  1. New Tables
    - `profiles` - User profiles with roles and authentication data
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `role` (enum: super_admin, admin, manager, agent, employee, client)
      - `is_active` (boolean)
      - `employee_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to read/update their own data
    - Add policies for admins to manage all profiles

  3. Functions
    - Auto-update updated_at timestamp
*/

-- Create app_role enum type
CREATE TYPE app_role AS ENUM (
  'super_admin',
  'admin', 
  'manager',
  'agent',
  'employee',
  'client'
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  role app_role NOT NULL DEFAULT 'client',
  is_active boolean NOT NULL DEFAULT true,
  employee_id text DEFAULT '',
  last_login timestamptz DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE role IN ('super_admin', 'admin') AND is_active = true
  ));

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE role IN ('super_admin', 'admin') AND is_active = true
  ));

CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE role IN ('super_admin', 'admin') AND is_active = true
  ) OR NOT EXISTS (SELECT 1 FROM public.profiles));

CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE role IN ('super_admin', 'admin') AND is_active = true
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON public.profiles(is_active);

-- Insert default admin profile
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  role,
  is_active,
  employee_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'عمر الحيدري',
  'info@avaz.sa',
  'super_admin'::app_role,
  true,
  'EMP-001',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();