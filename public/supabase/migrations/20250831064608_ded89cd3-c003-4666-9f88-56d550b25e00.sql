-- Secure property listings by requiring authentication
DROP POLICY IF EXISTS "Everyone can view properties" ON public.properties;

CREATE POLICY "Authenticated users can view properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add a public property view for non-authenticated users (limited info)
CREATE OR REPLACE VIEW public.public_properties AS
SELECT 
  id,
  title,
  price,
  location,
  property_type,
  area,
  status,
  (CASE WHEN array_length(images, 1) > 0 THEN images[1] ELSE NULL END) as featured_image
FROM public.properties 
WHERE status = 'available'
LIMIT 20;