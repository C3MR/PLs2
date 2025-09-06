import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import avazLogoMain from '@/assets/avaz-logo-main.png';
import { useNavigate } from 'react-router-dom';

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'info@avaz.sa',
    password: 'Ma@010203',
    confirmPassword: 'Ma@010203',
    fullName: 'عمر الحيدري'
  });
  const [step, setStep] = useState(1); // 1: form, 2: success
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // إنشاء حساب المصادقة أولاً
      const { error: signUpError } = await signUp(
        formData.email, 
        formData.password, 
        formData.fullName
      );
      
      if (signUpError) {
        throw signUpError;
      }

      // تحديث الملف الشخصي ليصبح أدمن
      // Skip profile update - table doesn't exist yet
      console.warn('Profiles table not found. Admin role will be set after database migrations are applied.');

      setStep(2);
      toast({
        title: "تم إنشاء حساب المدير بنجاح",
        description: "يرجى تفقد بريدك الإلكتروني لتفعيل الحساب. سيتم توجيهك لصفحة تسجيل الدخول بعد التفعيل.",
      });

    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <img src={avazLogoMain} alt="أفاز العقارية" className="h-16 w-auto" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                تم إعداد المدير بنجاح
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-800 font-medium">تم إنشاء حساب المدير</p>
              <p className="text-green-700 text-sm mt-1">
                يرجى تفقد بريدك الإلكتروني ({formData.email}) لتفعيل الحساب
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/employee-login')}
                className="w-full"
              >
                الذهاب لصفحة تسجيل الدخول
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <img src={avazLogoMain} alt="أفاز العقارية" className="h-16 w-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              إعداد حساب المدير
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              إنشاء حساب المدير الأول للنظام
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-medium text-sm">تنبيه مهم</span>
            </div>
            <p className="text-blue-700 text-xs">
              هذه الصفحة لإنشاء حساب المدير الأول فقط. بعد إنشاء الحساب، ستحتاج لتفعيله من خلال البريد الإلكتروني.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="الاسم الكامل"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@avaz.sa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="أدخل كلمة المرور"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="أعد إدخال كلمة المرور"
                required
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  إنشاء حساب المدير
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Button 
              variant="link" 
              onClick={() => navigate('/employee-login')}
              className="text-xs text-muted-foreground"
            >
              هل لديك حساب بالفعل؟ تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;