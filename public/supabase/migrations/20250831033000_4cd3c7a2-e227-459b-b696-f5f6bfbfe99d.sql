-- Fix security issues by setting search_path for functions
CREATE OR REPLACE FUNCTION public.generate_client_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix set_client_id function
CREATE OR REPLACE FUNCTION public.set_client_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_id IS NULL OR NEW.client_id = '' THEN
    NEW.client_id := public.generate_client_id();
  END IF;
  RETURN NEW;
END;
$$;