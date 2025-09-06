import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  bio: string;
  avatar_url: string;
  role: 'super_admin' | 'admin' | 'manager' | 'agent' | 'employee' | 'client';
  is_active: boolean;
  employee_id: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

// Safe profile update interface excluding protected fields
export interface SafeProfileUpdate {
  full_name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current user's profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    enabled: false, // Disable until profiles table exists
    queryFn: async (): Promise<Profile | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Update profile mutation (excluding role and other protected fields for security)
  const updateProfile = useMutation({
    mutationFn: async (updates: SafeProfileUpdate) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث ملفك الشخصي بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending
  };
};

export default useProfile;