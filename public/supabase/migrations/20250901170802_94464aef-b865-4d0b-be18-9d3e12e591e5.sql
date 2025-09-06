-- تعديل الـ trigger function للتعامل مع الحالات الموجودة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- التحقق من وجود profile للمستخدم
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email) THEN
    -- تحديث الـ profile الموجود بـ user_id الجديد
    UPDATE public.profiles 
    SET user_id = NEW.id,
        updated_at = now()
    WHERE email = NEW.email;
  ELSE
    -- إنشاء profile جديد إذا لم يكن موجوداً
    INSERT INTO public.profiles (user_id, full_name, email, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'employee');
  END IF;
  
  RETURN NEW;
END;
$$;

-- التأكد من وجود الـ trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();