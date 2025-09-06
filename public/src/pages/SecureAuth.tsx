import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Shield, UserPlus, LogIn } from 'lucide-react';
import { useEmployeeAuth } from '@/hooks/useEmployeeAuth';
import { useToast } from '@/hooks/use-toast';
import avazLogoMain from '@/assets/avaz-logo-main.png';
import { useNavigate } from 'react-router-dom';

const SecureAuth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    fullName: '' 
  });
  
  const { signInEmployee, loading: authLoading } = useEmployeeAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error, user } = await signInEmployee(loginData.email, loginData.password);
      
      if (error) {
        // Check if it's an invalid credentials error
        if (error.message?.includes('Invalid login credentials')) {
          toast({
            title: "خطأ في بيانات الدخول",
            description: "البريد الإلكتروني أو كلمة المرور غير صحيحة. إذا كنت المدير الأول، يرجى إنشاء حساب من صفحة إعداد المدير.",
            variant: "destructive",
            action: (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin-setup')}
              >
                إعداد المدير
              </Button>
            ),
          });
        } else {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: error.message,
            variant: "destructive",
          }
          )
          emailRedirectTo: `${window.location.origin}/employee-login`
        }
      } else if (user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ في الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "تسجيل حساب جديد غير متاح",
      description: "يتم إنشاء حسابات الموظفين من قبل الإدارة فقط",
      variant: "destructive",
    });
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
              نظام أفاز العقارية
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              نظام إدارة العقارات الآمن
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                إنشاء حساب
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">البريد الإلكتروني</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    placeholder="example@domain.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
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
                  disabled={isLoading || authLoading}
                >
                  {(isLoading || authLoading) ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                  <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">إنشاء حساب موظف</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    يتم إنشاء حسابات الموظفين من قبل الإدارة فقط. إذا كنت المدير الأول، يمكنك إعداد حسابك من الرابط أدناه.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin-setup')}
                    className="w-full"
                  >
                    إعداد حساب المدير الأول
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-green-500" />
              <span>حماية SSL + تشفير متقدم</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAuth;