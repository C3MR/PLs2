-- إضافة حقول خاصة بالعمارات (التجارية والسكنية)
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS total_units integer,
ADD COLUMN IF NOT EXISTS showrooms_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS offices_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS apartments_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS occupied_percentage numeric(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS vacant_units integer;

-- إضافة تعليقات للحقول الجديدة
COMMENT ON COLUMN public.properties.total_units IS 'العدد الإجمالي للوحدات (للعمارات فقط)';
COMMENT ON COLUMN public.properties.showrooms_count IS 'عدد المعارض (للعمارات التجارية)';
COMMENT ON COLUMN public.properties.offices_count IS 'عدد المكاتب (للعمارات التجارية)';
COMMENT ON COLUMN public.properties.apartments_count IS 'عدد الشقق (للعمارات السكنية)';
COMMENT ON COLUMN public.properties.occupied_percentage IS 'نسبة الإشغال المئوية';
COMMENT ON COLUMN public.properties.vacant_units IS 'عدد الوحدات الشاغرة (محسوبة تلقائياً)';

-- إنشاء دالة لحساب الوحدات الشاغرة تلقائياً
CREATE OR REPLACE FUNCTION public.calculate_vacant_units()
RETURNS TRIGGER AS $$
BEGIN
  -- حساب الوحدات الشاغرة فقط للعمارات
  IF NEW.property_type IN ('commercial_building', 'residential_building') THEN
    IF NEW.total_units IS NOT NULL AND NEW.occupied_percentage IS NOT NULL THEN
      NEW.vacant_units := NEW.total_units - ROUND((NEW.total_units * NEW.occupied_percentage / 100.0)::numeric);
    END IF;
  ELSE
    -- مسح القيم للعقارات الأخرى
    NEW.total_units := NULL;
    NEW.showrooms_count := NULL;
    NEW.offices_count := NULL;
    NEW.apartments_count := NULL;
    NEW.occupied_percentage := NULL;
    NEW.vacant_units := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path TO 'public';