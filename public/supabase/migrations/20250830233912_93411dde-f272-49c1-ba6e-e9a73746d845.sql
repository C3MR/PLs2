-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  employee_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  location TEXT NOT NULL,
  area DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_type TEXT NOT NULL DEFAULT 'apartment',
  status TEXT NOT NULL DEFAULT 'available',
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Insert the specific user em-002 (عمر الحيدري)
INSERT INTO public.profiles (employee_id, full_name, email, role) 
VALUES ('em-002', 'عمر الحيدري', 'omar.alhaydari@avaz.com', 'property_manager');

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for properties
CREATE POLICY "Everyone can view properties" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "Only em-002 can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND employee_id = 'em-002'
  )
);

CREATE POLICY "Property creators can update their properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Property creators can delete their properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();