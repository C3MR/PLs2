-- Update storage bucket policies to work with our roles system
-- First, let's ensure our storage buckets have proper RLS policies

-- Create or update policies for property-images bucket (public bucket)
DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'properties:create'::permission)
);

DROP POLICY IF EXISTS "Property creators can update their images" ON storage.objects;
CREATE POLICY "Property creators can update their images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
  AND (
    has_permission(auth.uid(), 'properties:update'::permission)
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

DROP POLICY IF EXISTS "Property managers can delete images" ON storage.objects;
CREATE POLICY "Property managers can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
  AND (
    has_permission(auth.uid(), 'properties:delete'::permission)
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

-- Create or update policies for property-documents bucket (private bucket)
DROP POLICY IF EXISTS "Authenticated users can view property documents" ON storage.objects;
CREATE POLICY "Authenticated users can view property documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'properties:read'::permission)
);

DROP POLICY IF EXISTS "Property managers can upload documents" ON storage.objects;
CREATE POLICY "Property managers can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'properties:create'::permission)
);

DROP POLICY IF EXISTS "Property managers can update documents" ON storage.objects;
CREATE POLICY "Property managers can update documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'properties:update'::permission)
);

DROP POLICY IF EXISTS "Property managers can delete documents" ON storage.objects;
CREATE POLICY "Property managers can delete documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'properties:delete'::permission)
);

-- Create or update policies for client-files bucket (private bucket)
DROP POLICY IF EXISTS "Users can view client files they have access to" ON storage.objects;
CREATE POLICY "Users can view client files they have access to"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
  AND (
    has_permission(auth.uid(), 'clients:read'::permission)
    OR auth.uid()::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Client managers can upload files" ON storage.objects;
CREATE POLICY "Client managers can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'clients:create'::permission)
);

DROP POLICY IF EXISTS "Client managers can update files" ON storage.objects;
CREATE POLICY "Client managers can update files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'clients:update'::permission)
);

DROP POLICY IF EXISTS "Client managers can delete files" ON storage.objects;
CREATE POLICY "Client managers can delete files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
  AND has_permission(auth.uid(), 'clients:delete'::permission)
);

-- Create admin bucket for system files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'admin-files', 
  'admin-files', 
  false, 
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv', 'application/zip']
) ON CONFLICT (id) DO NOTHING;

-- Policies for admin-files bucket (super restricted)
DROP POLICY IF EXISTS "Only admins can access admin files" ON storage.objects;
CREATE POLICY "Only admins can access admin files"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'admin-files' 
  AND auth.uid() IS NOT NULL
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
)
WITH CHECK (
  bucket_id = 'admin-files' 
  AND auth.uid() IS NOT NULL
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);