-- Fix the profiles table by allowing NULL user_id temporarily and add a trigger to create profiles automatically
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'employee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the existing em-002 profile with a proper UUID (will be replaced when real user signs up)
UPDATE public.profiles 
SET user_id = gen_random_uuid() 
WHERE employee_id = 'em-002' AND user_id IS NULL;