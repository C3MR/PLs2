-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  service_type TEXT NOT NULL,
  property_usage TEXT,
  property_type TEXT,
  facility_name TEXT,
  activity_type TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  preferred_time TEXT,
  contact_method TEXT NOT NULL,
  request_description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for service requests
CREATE POLICY "Service requests are viewable by authenticated users" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service requests can be updated by authenticated users" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_service_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_service_requests_updated_at();

-- Create index for better performance
CREATE INDEX idx_service_requests_request_id ON public.service_requests(request_id);
CREATE INDEX idx_service_requests_created_at ON public.service_requests(created_at);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);