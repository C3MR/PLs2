import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, Home, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the token and type from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        if (!token || !type) {
          setStatus('error');
          setMessage('رابط التفعيل غير صحيح أو منتهي الصلاحية');
          return;
        }

        // Verify the email using Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any
        });

        if (error) {
          console.error('Verification error:', error);
          setStatus('error');
          setMessage('فشل في تفعيل الحساب. قد يكون الرابط منتهي الصلاحية.');
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('تم تفعيل حسابك بنجاح!');
          
          toast({
            title: "تم تفعيل الحساب",
            description: "مرحباً بك في نظام أفاز العقارية",
          });

          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/client-portal');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('حدث خطأ أثناء تفعيل الحساب');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('حدث خطأ غير متوقع');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <img src="/lovable-uploads/520083f6-203f-4800-a8ef-af619a9befb4.png" alt="أفاز العقارية" className="h-16 w-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              تفعيل الحساب
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">جاري تفعيل حسابك</h3>
                <p className="text-muted-foreground">يرجى الانتظار...</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">تم التفعيل بنجاح!</h3>
                <p className="text-green-700">{message}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  سيتم توجيهك تلقائياً خلال 3 ثوانٍ...
                </p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/client-portal')}
                  className="w-full"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  الذهاب لبوابة العملاء
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">فشل في التفعيل</h3>
                <p className="text-red-700">{message}</p>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/client-portal')}
                  className="w-full"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;