import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { AppRole, Permission, UserWithRole } from '@/types/roles';

export const useRoles = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current user's role and permissions
  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    enabled: false, // Disable until profiles table exists
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Get user's permissions
  const { data: userPermissions, isLoading: loadingPermissions } = useQuery({
    queryKey: ['user-permissions', user?.id],
    enabled: false, // Disable until profiles table exists
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase.rpc('get_user_permissions', {
        user_id: user.id
      });

      if (error) throw error;
      return data as Permission[];
    },
    enabled: !!user?.id
  });

  // Get all users with roles (for admin use)
  const { data: usersWithRoles, isLoading: loadingUsers } = useQuery({
    queryKey: ['users-with-roles'],
    enabled: false, // Disable until profiles table exists
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserWithRole[];
    }
  });

  // Check if user has specific permission
  const hasPermission = (permission: Permission): boolean => {
    return userPermissions?.includes(permission) || false;
  };

  // Check if user has specific role
  const hasRole = (role: AppRole): boolean => {
    return userProfile?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: AppRole[]): boolean => {
    return roles.includes(userProfile?.role);
  };

  // Update user role mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
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
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "تم تحديث الدور",
        description: `تم تحديث دور المستخدم بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث الدور",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    // User data
    userProfile,
    userPermissions,
    usersWithRoles,
    
    // Loading states
    loadingProfile,
    loadingPermissions,
    loadingUsers,
    
    // Permission checks
    hasPermission,
    hasRole,
    hasAnyRole,
    
    // Actions
    updateUserRole: updateUserRole.mutate,
    isUpdatingRole: updateUserRole.isPending
  };
};

export default useRoles;