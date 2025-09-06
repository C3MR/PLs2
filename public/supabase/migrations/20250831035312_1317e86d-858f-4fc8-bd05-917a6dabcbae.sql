-- Create storage buckets for file management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('property-documents', 'property-documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('client-files', 'client-files', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Create RLS policies for property images (public access)
CREATE POLICY "Anyone can view property images" ON storage.objects
FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update their property images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete their property images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);

-- Create RLS policies for property documents (private access)
CREATE POLICY "Authenticated users can view property documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can upload property documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update property documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete property documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-documents' 
  AND auth.uid() IS NOT NULL
);

-- Create RLS policies for client files (private access)
CREATE POLICY "Authenticated users can view client files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can upload client files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update client files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete client files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'client-files' 
  AND auth.uid() IS NOT NULL
);

-- Create file_metadata table for additional file information
CREATE TABLE public.file_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  bucket_id TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT, -- 'property', 'client', 'request'
  entity_id UUID,
  tags TEXT[],
  description TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on file_metadata
ALTER TABLE public.file_metadata ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for file_metadata
CREATE POLICY "Authenticated users can view file metadata" ON public.file_metadata
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own file metadata" ON public.file_metadata
FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own file metadata" ON public.file_metadata
FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own file metadata" ON public.file_metadata
FOR DELETE USING (auth.uid() = uploaded_by);

-- Create indexes for better performance
CREATE INDEX idx_file_metadata_entity ON public.file_metadata(entity_type, entity_id);
CREATE INDEX idx_file_metadata_bucket ON public.file_metadata(bucket_id);
CREATE INDEX idx_file_metadata_uploaded_by ON public.file_metadata(uploaded_by);

-- Create trigger for updated_at
CREATE TRIGGER update_file_metadata_updated_at
BEFORE UPDATE ON public.file_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();