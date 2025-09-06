import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive mb-2">
            غير مصرح بالدخول
          </CardTitle>
          <CardDescription className="text-center">
            ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة. 
            يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">تفاصيل المشكلة:</p>
                <p className="text-sm text-muted-foreground">
                  تحتاج إلى دور مناسب (مدير، موظف، أو وكيل) للوصول إلى لوحة التحكم
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Home className="h-4 w-4 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
            
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للصفحة السابقة
            </Button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                هل تحتاج مساعدة؟{' '}
                <a 
                  href="#contact" 
                  className="text-primary hover:underline"
                >
                  تواصل معنا
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;