import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import avazLogoMain from '@/assets/avaz-logo-main.png';

const SecureAuth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: getErrorMessage(error.message),
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام أفاز العقارية",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "كلمة مرور ضعيفة",
        description: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (error) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: getErrorMessage(error.message),
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('Invalid login credentials')) {
      return 'بيانات الدخول غير صحيحة';
    }
    if (error.includes('User already registered')) {
      return 'المستخدم مسجل مسبقاً';
    }
    if (error.includes('Password should be at least 6 characters')) {
      return 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل';
    }
    return error;
  };

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
              نظام الدخول الآمن
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              تسجيل دخول آمن لموظفي أفاز العقارية
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              هذا النظام الجديد يستخدم المصادقة الآمنة عبر Supabase
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pr-10"
                      placeholder="your-email@avaz.sa"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pr-10 pl-10"
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail">البريد الإلكتروني</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your-email@avaz.sa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword">كلمة المرور</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="8 أحرف على الأقل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="أعد كتابة كلمة المرور"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-green-500" />
              <span>حماية SSL + تشفير AES-256</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAuth;