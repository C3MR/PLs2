-- Create property requests table for form submissions
CREATE TABLE public.property_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  
  -- Client information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  
  -- Request details
  purpose TEXT NOT NULL CHECK (purpose IN ('buy', 'rent', 'investment')),
  capacity TEXT NOT NULL,
  capacity_other TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial')),
  specific_type TEXT NOT NULL,
  activity_category TEXT,
  business_activity TEXT,
  establishment_name TEXT,
  branches_count TEXT,
  
  -- Location and requirements
  preferred_districts TEXT[] DEFAULT '{}',
  min_area NUMERIC,
  max_area NUMERIC,
  
  -- Price options
  price_option TEXT CHECK (price_option IN ('market', 'budget')),
  specific_budget NUMERIC,
  
  -- Additional details
  how_did_you_hear_about_us TEXT,
  notes TEXT,
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_to UUID
);

-- Enable RLS
ALTER TABLE public.property_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create property requests" 
ON public.property_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all property requests" 
ON public.property_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update property requests" 
ON public.property_requests 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Update existing profiles table structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create user roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'client')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = $1 LIMIT 1;
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.get_user_role() = 'admin');

-- Create triggers for automatic timestamp updates (skip profiles as it already exists)
CREATE TRIGGER update_property_requests_updated_at
  BEFORE UPDATE ON public.property_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_property_requests_status ON public.property_requests(status);
CREATE INDEX idx_property_requests_created_at ON public.property_requests(created_at);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);