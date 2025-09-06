import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { AppRole, UserWithRole } from '@/types/roles';

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  recentRegistrations: number;
  roleDistribution: Record<AppRole, number>;
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Get all users with detailed information
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users-management'],
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

  // Get user statistics
  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    enabled: false, // Disable until profiles table exists
    queryFn: async (): Promise<UserStats> => {
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('role, is_active, created_at');

      if (error) throw error;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: UserStats = {
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(u => u.is_active).length,
        recentRegistrations: allUsers.filter(u => 
          new Date(u.created_at) > weekAgo
        ).length,
        roleDistribution: {
          super_admin: 0,
          admin: 0,
          manager: 0,
          agent: 0,
          employee: 0,
          client: 0
        }
      };

      allUsers.forEach(user => {
        if (user.role) {
          stats.roleDistribution[user.role]++;
        }
      });

      return stats;
    }
  });

  // Update user role
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: "تم تحديث الدور",
        description: "تم تحديث دور المستخدم بنجاح",
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

  // Toggle user active status
  const toggleUserStatus = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: data.is_active ? "تم تفعيل المستخدم" : "تم إلغاء تفعيل المستخدم",
        description: `تم ${data.is_active ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث حالة المستخدم",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Bulk update users
  const bulkUpdateUsers = useMutation({
    mutationFn: async ({ userIds, updates }: { 
      userIds: string[]; 
      updates: Partial<Pick<UserWithRole, 'role' | 'is_active'>>
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .in('user_id', userIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setSelectedUsers([]);
      toast({
        title: "تم تحديث المستخدمين",
        description: `تم تحديث ${data.length} مستخدم بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في التحديث المجمع",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete user (soft delete by deactivating)
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: "تم حذف المستخدم",
        description: "تم إلغاء تفعيل المستخدم بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف المستخدم",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    users,
    userStats,
    selectedUsers,
    
    // Loading states
    loadingUsers,
    isUpdatingRole: updateUserRole.isPending,
    isTogglingStatus: toggleUserStatus.isPending,
    isBulkUpdating: bulkUpdateUsers.isPending,
    isDeleting: deleteUser.isPending,
    
    // Actions
    updateUserRole: updateUserRole.mutate,
    toggleUserStatus: toggleUserStatus.mutate,
    bulkUpdateUsers: bulkUpdateUsers.mutate,
    deleteUser: deleteUser.mutate,
    
    // Selection management
    setSelectedUsers,
    selectUser: (userId: string) => {
      setSelectedUsers(prev => 
        prev.includes(userId) 
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    },
    selectAllUsers: () => {
      if (users) {
        setSelectedUsers(users.map(u => u.user_id).filter(Boolean));
      }
    },
    clearSelection: () => setSelectedUsers([])
  };
};

export default useUserManagement;