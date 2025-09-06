-- إضافة حقول جديدة لجدول العقارات لتحسين النظام
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS property_usage text DEFAULT 'residential',
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS ad_license_number text;

-- إضافة فهرس لرقم الترخيص لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_properties_license_number ON public.properties(license_number);
CREATE INDEX IF NOT EXISTS idx_properties_ad_license_number ON public.properties(ad_license_number);

-- تحديث التعليقات
COMMENT ON COLUMN public.properties.property_usage IS 'استخدام العقار: تجاري أو سكني';
COMMENT ON COLUMN public.properties.license_number IS 'رقم ترخيص العقار';
COMMENT ON COLUMN public.properties.ad_license_number IS 'رقم ترخيص الإعلان';