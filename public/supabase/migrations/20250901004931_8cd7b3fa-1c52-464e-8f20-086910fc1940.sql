-- إنشاء trigger لحساب الوحدات الشاغرة تلقائياً
CREATE TRIGGER trigger_calculate_vacant_units
  BEFORE INSERT OR UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.calculate_vacant_units();