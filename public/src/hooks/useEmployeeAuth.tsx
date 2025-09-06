import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EmployeeUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  employee_id?: string;
}

export const useEmployeeAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signInEmployee = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: authError.message === 'Invalid login credentials' 
            ? "بيانات الدخول غير صحيحة" 
            : "حدث خطأ أثناء تسجيل الدخول",
          variant: "destructive"
        });
        return { error: authError, user: null };
      }

      if (!authData.user) {
        const error = new Error("فشل في المصادقة");
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "فشل في المصادقة",
          variant: "destructive"
        });
        return { error, user: null };
      }

      // Check if user is employee/admin in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // If no profile exists or role is not employee/admin, check by email
      if (!profileData || !['admin', 'employee', 'super_admin', 'manager', 'agent'].includes(profileData.role)) {
        const { data: emailProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .in('role', ['admin', 'employee', 'super_admin', 'manager', 'agent'])
          .eq('is_active', true)
          .maybeSingle();

        if (!emailProfile) {
          await supabase.auth.signOut();
          toast({
            title: "غير مصرح لك بالدخول",
            description: "هذا الحساب غير مخول للوصول لنظام الموظفين",
            variant: "destructive"
          });
          return { error: new Error("Unauthorized"), user: null };
        }
        
        // Update the user_id in profile
        await supabase
          .from('profiles')
          .update({ 
            user_id: authData.user.id,
            last_login: new Date().toISOString() 
          })
          .eq('id', emailProfile.id);

      const employeeUser: EmployeeUser = {
        id: emailProfile.id,
        full_name: emailProfile.full_name,
        email: emailProfile.email,
        role: emailProfile.role,
        employee_id: emailProfile.employee_id
      };

      // Note: User data is managed by Supabase auth state
      // No localStorage storage needed for security compliance

      toast({
        title: "مرحباً بك",
        description: `أهلاً ${emailProfile.full_name}`,
      });

      return { error: null, user: employeeUser };
      }

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profileData.id);

      const employeeUser: EmployeeUser = {
        id: profileData.id,
        full_name: profileData.full_name,
        email: profileData.email,
        role: profileData.role,
        employee_id: profileData.employee_id
      };

      // Note: User data is managed by Supabase auth state
      // No localStorage storage needed for security compliance

      toast({
        title: "مرحباً بك",
        description: `أهلاً ${profileData.full_name}`,
      });

      return { error: null, user: employeeUser };

    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
      return { error, user: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    // Auth state is managed by Supabase context
    
    if (!error) {
      toast({
        title: "تم تسجيل الخروج",
        description: "نتطلع لرؤيتك مرة أخرى",
      });
    }
    return { error };
  };

  return {
    signInEmployee,
    signOut,
    loading
  };
};