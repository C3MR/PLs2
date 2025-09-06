/*
  # إعداد قاعدة البيانات البسيط

  1. إنشاء الجداول الأساسية
    - `profiles` - ملفات المستخدمين
    - `properties` - العقارات
    - `contact_messages` - رسائل التواصل

  2. الأمان
    - تفعيل RLS على الجداول
    - سياسات أمان بسيطة

  3. البيانات الأولية
    - إنشاء حساب المدير
*/

-- إنشاء نوع الأدوار
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM (
      'super_admin',
      'admin', 
      'manager',
      'agent',
      'employee',
      'client'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- إنشاء جدول profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL,
  phone text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  role app_role NOT NULL DEFAULT 'client',
  is_active boolean NOT NULL DEFAULT true,
  employee_id text DEFAULT '',
  last_login timestamptz DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سياسات أمان بسيطة
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- إنشاء جدول العقارات
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT '',
  area numeric DEFAULT 0,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  property_type text NOT NULL DEFAULT 'apartment',
  status text NOT NULL DEFAULT 'available',
  images text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  created_by uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- تفعيل RLS للعقارات
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- سياسات العقارات
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update properties" ON public.properties FOR UPDATE USING (auth.uid() IS NOT NULL);

-- إنشاء جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  subject text DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- تفعيل RLS لرسائل التواصل
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- سياسات رسائل التواصل
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view messages" ON public.contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);

-- دالة تحديث الوقت
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء triggers للتحديث التلقائي
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- إدراج المدير عمر الحيدري
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  role,
  is_active,
  employee_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'عمر الحيدري',
  'info@avaz.sa',
  'super_admin'::app_role,
  true,
  'EMP-001',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- إدراج بعض العقارات التجريبية
INSERT INTO public.properties (title, description, price, location, area, bedrooms, bathrooms, property_type, status, amenities) VALUES
('شقة فاخرة في حي النخيل', 'شقة 3 غرف وصالة في موقع مميز', 650000, 'حي النخيل، الرياض', 180, 3, 2, 'apartment', 'available', '{"موقف سيارة", "تكييف مركزي"}'),
('فيلا عصرية في المونسية', 'فيلا دورين مع حديقة واسعة', 1250000, 'حي المونسية، الرياض', 400, 5, 4, 'villa', 'available', '{"حديقة", "مسبح", "موقف سيارتين"}'),
('محل تجاري في التحلية', 'محل تجاري في موقع حيوي', 180000, 'شارع التحلية، الرياض', 80, 0, 1, 'commercial', 'available', '{"مكيف", "واجهة زجاجية"}')
ON CONFLICT (id) DO NOTHING;