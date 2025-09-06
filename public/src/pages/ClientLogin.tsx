import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Building2, Users, Shield, Star, CheckCircle, UserPlus, LogIn, User, Phone, Mail } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          navigate("/");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "مرحباً بك",
          description: "تم تسجيل الدخول بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return null; // Will redirect automatically
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rotate-45 animate-float"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 border border-accent/20 rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 right-20 w-16 h-16 border border-primary/10 -rotate-12 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Welcome Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-right">
                <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
                  <Users className="w-4 h-4 mr-2" />
                  بوابة العملاء
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  مرحباً بك في{' '}
                  <span className="text-primary">أفاز العقارية</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  بوابتك الموثوقة لاستكشاف أفضل الفرص العقارية في المملكة العربية السعودية
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">حساب آمن ومحمي</h3>
                    <p className="text-sm text-muted-foreground">
                      بياناتك محمية بأعلى معايير الأمان والخصوصية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">خدمات مميزة</h3>
                    <p className="text-sm text-muted-foreground">
                      احصل على أفضل العروض العقارية والاستشارات المتخصصة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">سهولة الاستخدام</h3>
                    <p className="text-sm text-muted-foreground">
                      واجهة سهلة ومبسطة لتجربة مستخدم مثالية
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-center mb-8">
                <img src="/lovable-uploads/47abfa70-61aa-4466-bd26-c647871bab3f.png" alt="أفاز العقارية" className="h-16 w-auto" />
              </div>
              
              <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-2xl font-bold text-foreground">بوابة العملاء</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    قم بتسجيل الدخول أو إنشاء حساب جديد للوصول إلى خدماتنا المميزة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="signin" className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        تسجيل الدخول
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        حساب جديد
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="signin" className="space-y-4">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email" className="text-sm font-medium">البريد الإلكتروني</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@domain.com"
                            required
                            dir="ltr"
                            className="h-11"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signin-password" className="text-sm font-medium">كلمة المرور</Label>
                          <div className="relative">
                            <Input
                              id="signin-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="كلمة المرور"
                              required
                              dir="ltr"
                              className="h-11 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={loading}
                        >
                          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="signup" className="space-y-4">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-sm font-medium">الاسم الكامل</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="أدخل اسمك الكامل"
                            required
                            className="h-11"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-sm font-medium">البريد الإلكتروني</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@domain.com"
                            required
                            dir="ltr"
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-phone" className="text-sm font-medium">رقم الجوال</Label>
                          <Input
                            id="signup-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="05xxxxxxxx"
                            required
                            dir="ltr"
                            className="h-11"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-sm font-medium">كلمة المرور</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="كلمة المرور (6 أحرف على الأقل)"
                              required
                              minLength={6}
                              dir="ltr"
                              className="h-11 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                          <p>بإنشاء حساب جديد، فإنك توافق على <a href="#terms" className="text-primary hover:underline">الشروط والأحكام</a> و <a href="#privacy" className="text-primary hover:underline">سياسة الخصوصية</a></p>
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={loading}
                        >
                          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="text-center pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      للدعم الفني: تواصل معنا عبر <a href="#contact" className="text-primary hover:underline">صفحة التواصل</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClientLogin;