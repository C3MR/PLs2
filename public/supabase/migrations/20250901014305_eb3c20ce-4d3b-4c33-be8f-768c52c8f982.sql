-- إصلاح صلاحيات الـ properties
-- تحديث السياسات للسماح بالتعديل للمستخدمين المصرح لهم

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Property creators can update their properties" ON public.properties;
DROP POLICY IF EXISTS "Property creators can delete their properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can create properties" ON public.properties;

-- سياسة جديدة للتحديث - للمستخدمين المصرح لهم أو منشئ العقار
CREATE POLICY "Authorized users can update properties" ON public.properties
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'properties:update'::permission)
  );

-- سياسة جديدة للحذف - للمستخدمين المصرح لهم أو منشئ العقار  
CREATE POLICY "Authorized users can delete properties" ON public.properties
  FOR DELETE USING (
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'properties:delete'::permission)
  );

-- تحديث سياسة الإنشاء للسماح للمستخدمين المصرح لهم
CREATE POLICY "Authorized users can create properties" ON public.properties
  FOR INSERT WITH CHECK (
    (auth.uid() = created_by AND auth.uid() IS NOT NULL) OR 
    has_permission(auth.uid(), 'properties:create'::permission)
  );