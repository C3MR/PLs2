-- إصلاح سياسات جدول العقارات للسماح بعرض البيانات
DROP POLICY IF EXISTS "Properties are publicly viewable" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can view properties" ON public.properties;
DROP POLICY IF EXISTS "Authorized users can create properties" ON public.properties;
DROP POLICY IF EXISTS "Authorized users can update properties" ON public.properties;
DROP POLICY IF EXISTS "Authorized users can delete properties" ON public.properties;

-- إنشاء سياسات جديدة أكثر مرونة
CREATE POLICY "Anyone can view properties" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update properties" 
ON public.properties 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  )
);

CREATE POLICY "Admins can delete properties" 
ON public.properties 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  )
);