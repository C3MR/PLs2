import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { AppRole } from '@/types/roles';

export const useAdminRoleManagement = () => {
  const queryClient = useQueryClient();

  // Admin-only role update mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "تم تحديث الدور",
        description: `تم تحديث دور المستخدم بنجاح`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تحديث الدور",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    updateUserRole: updateUserRole.mutate,
    isUpdating: updateUserRole.isPending
  };
};

export default useAdminRoleManagement;