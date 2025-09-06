import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { isRateLimited, validateSecureEmail } from '@/utils/validation';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);
  const { logFailedLogin, logSuccessfulLogin } = useSecurityMonitoring();

  const secureSignIn = async (email: string, password: string, ipAddress?: string) => {
    setLoading(true);
    
    try {
      // Rate limiting check
      const identifier = ipAddress || email;
      if (isRateLimited(identifier, 5, 900000)) { // 5 attempts per 15 minutes
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Input validation
      if (!validateSecureEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        // Log failed login attempt
        logFailedLogin(email, error.message);
        throw error;
      }

      // Log successful login
      if (data.user) {
        logSuccessfulLogin(data.user.id);
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const secureSignUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    
    try {
      // Input validation
      if (!validateSecureEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (!fullName || fullName.trim().length < 2) {
        throw new Error('Full name is required');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "تم إنشاء الحساب",
        description: "تم إنشاء حسابك بنجاح. يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    secureSignIn,
    secureSignUp,
    loading
  };
};