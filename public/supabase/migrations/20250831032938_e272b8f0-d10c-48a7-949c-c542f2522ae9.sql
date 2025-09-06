-- Create clients table for CRM functionality
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'company', 'investor')),
  status TEXT NOT NULL DEFAULT 'potential' CHECK (status IN ('active', 'potential', 'inactive')),
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_requests INTEGER DEFAULT 0,
  completed_deals INTEGER DEFAULT 0,
  total_value NUMERIC DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  preferred_areas TEXT[],
  rating NUMERIC(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Authenticated users can view all clients" 
ON public.clients 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Authenticated users can update clients" 
ON public.clients 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete clients" 
ON public.clients 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create index for better performance
CREATE INDEX idx_clients_client_id ON public.clients(client_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_phone ON public.clients(phone);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_clients_type ON public.clients(type);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate client ID
CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  counter INTEGER;
BEGIN
  -- Get the count of existing clients
  SELECT COUNT(*) + 1 INTO counter FROM public.clients;
  
  -- Generate ID with format CLI-XXX
  new_id := 'CLI-' || LPAD(counter::TEXT, 3, '0');
  
  -- Make sure it's unique
  WHILE EXISTS (SELECT 1 FROM public.clients WHERE client_id = new_id) LOOP
    counter := counter + 1;
    new_id := 'CLI-' || LPAD(counter::TEXT, 3, '0');
  END LOOP;
  
  RETURN new_id;
END;
$$;

-- Trigger to auto-generate client_id
CREATE OR REPLACE FUNCTION public.set_client_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.client_id IS NULL OR NEW.client_id = '' THEN
    NEW.client_id := public.generate_client_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_client_id
BEFORE INSERT ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.set_client_id();

-- Insert sample data
INSERT INTO public.clients (name, phone, email, type, status, join_date, total_requests, completed_deals, total_value, preferred_areas, rating, notes) VALUES
('أحمد محمد السالم', '0551234567', 'ahmed@example.com', 'individual', 'active', '2024-01-15', 5, 2, 4500000, ARRAY['العليا', 'الملقا'], 4.8, 'عميل مميز، يفضل العقارات الحديثة'),
('شركة العمران للاستثمار', '0559876543', 'info@alamran.com', 'company', 'active', '2023-11-20', 12, 8, 25000000, ARRAY['الورود', 'النرجس'], 4.9, 'شركة استثمارية كبيرة، تركز على العقارات التجارية'),
('فاطمة علي الأحمد', '0555432198', 'fatima@example.com', 'individual', 'potential', '2024-03-10', 1, 0, 0, ARRAY['السليمانية'], 4.5, 'عميلة جديدة، تبحث عن شقة للسكن'),
('خالد عبدالله النصر', '0553456789', 'khalid@example.com', 'investor', 'inactive', '2023-08-05', 8, 3, 8900000, ARRAY['الياسمين', 'النخيل'], 4.6, 'مستثمر عقاري، لم يتواصل منذ فترة');