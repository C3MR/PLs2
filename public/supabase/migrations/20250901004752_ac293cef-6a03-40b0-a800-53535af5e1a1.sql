-- إنشاء trigger لحساب الوحدات الشاغرة تلقائياً
DROP TRIGGER IF EXISTS trigger_calculate_vacant_units ON public.properties;
CREATE TRIGGER trigger_calculate_vacant_units
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.calculate_vacant_units();