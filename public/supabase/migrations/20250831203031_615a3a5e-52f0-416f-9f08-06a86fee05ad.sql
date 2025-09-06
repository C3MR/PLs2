-- Fix security vulnerability in contact_messages table
-- Remove overly permissive policies that allow any authenticated user to view/update contact messages

DROP POLICY IF EXISTS "Authenticated users can view all contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON public.contact_messages;

-- Create restrictive policies that require specific permissions
CREATE POLICY "Only authorized staff can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND has_permission(auth.uid(), 'clients:read'::permission)
);

CREATE POLICY "Only authorized staff can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND has_permission(auth.uid(), 'clients:update'::permission)
);

-- Keep the existing INSERT policy as-is since contact forms need to be public
-- Policy "Anyone can create contact messages" remains unchanged