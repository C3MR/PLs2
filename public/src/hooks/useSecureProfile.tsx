import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/hooks/use-toast';
import { validateAndSanitizeInput, isRateLimited } from '@/utils/validation';
import type { Profile } from '@/hooks/useProfile';
import type { AppRole } from '@/types/roles';

export const useSecureProfile = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();

  // Admin-only role update mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      if (!hasPermission('users:update')) {
        throw new Error('Insufficient permissions to update user roles');
      }

      // Prevent self-role escalation
      if (userId === user?.id) {
        throw new Error('Cannot change your own role');
      }

      // Rate limiting
      if (isRateLimited(`role_update_${user?.id}`, 3, 60000)) {
        throw new Error('Rate limit exceeded. Too many role update attempts.');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({
        title: "تم تحديث الدور",
        description: "تم تحديث دور المستخدم بنجاح",
      });
    },
    onError: (error: Error | any) => {
      toast({
        title: "خطأ في تحديث الدور",
        description: error?.message || 'حدث خطأ غير متوقع',
        variant: "destructive",
      });
    }
  });

  // Secure profile update (admin can update any profile)
  const updateAnyProfile = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      if (!hasPermission('users:update')) {
        throw new Error('Insufficient permissions to update user profiles');
      }

      // Remove role from updates to prevent unauthorized role changes
      const { role, ...safeUpdates } = updates;
      
      // Input validation and sanitization
      const sanitizedUpdates: any = {};
      
      if (safeUpdates.full_name) {
        sanitizedUpdates.full_name = validateAndSanitizeInput(safeUpdates.full_name, 100);
      }
      
      if (safeUpdates.email) {
        sanitizedUpdates.email = validateAndSanitizeInput(safeUpdates.email, 254);
      }
      
      if (safeUpdates.phone) {
        sanitizedUpdates.phone = validateAndSanitizeInput(safeUpdates.phone, 20);
      }
      
      if (safeUpdates.bio) {
        sanitizedUpdates.bio = validateAndSanitizeInput(safeUpdates.bio, 500);
      }

      // Rate limiting
      if (isRateLimited(`profile_update_${user?.id}`, 5, 60000)) {
        throw new Error('Rate limit exceeded. Too many profile update attempts.');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث ملف المستخدم بنجاح",
      });
    },
    onError: (error: Error | any) => {
      toast({
        title: "خطأ في التحديث",
        description: error?.message || 'حدث خطأ غير متوقع',
        variant: "destructive",
      });
    }
  });

  return {
    updateUserRole: updateUserRole.mutate,
    updateAnyProfile: updateAnyProfile.mutate,
    isUpdatingRole: updateUserRole.isPending,
    isUpdatingProfile: updateAnyProfile.isPending
  };
};

export default useSecureProfile;