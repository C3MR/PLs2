import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Create or update profile with deferred execution
          setTimeout(async () => {
            try {
              // Try to create or update profile
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

              if (!existingProfile) {
                await supabase
                  .from('profiles')
                  .insert({
                    user_id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || '',
                    email: session.user.email || '',
                    role: 'client'
                  });
              }
            } catch (error) {
              console.warn('Profile operations skipped - database not ready:', error);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/employee-login`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message === 'User already registered' 
            ? "هذا البريد الإلكتروني مسجل مسبقاً" 
            : "حدث خطأ أثناء التسجيل",
          variant: "destructive"
        });
      } else {
        toast({
          title: "تم التسجيل بنجاح",
          description: "يرجى تفقد بريدك الإلكتروني لتفعيل حسابك",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message === 'Invalid login credentials' 
            ? "بيانات الدخول غير صحيحة" 
            : "حدث خطأ أثناء تسجيل الدخول",
          variant: "destructive"
        });
      } else {
        toast({
          title: "مرحباً بك",
          description: "تم تسجيل الدخول بنجاح",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "تم تسجيل الخروج",
        description: "نتطلع لرؤيتك مرة أخرى",
      });
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });

    if (error) {
      toast({
        title: "خطأ في إعادة تعيين كلمة المرور",
        description: "تأكد من صحة البريد الإلكتروني",
        variant: "destructive"
      });
    } else {
      toast({
        title: "تم إرسال رابط إعادة التعيين",
        description: "تفقد بريدك الإلكتروني",
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};