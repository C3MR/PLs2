import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | 'property_update' | 'client_message' | 'task_reminder' | 'appointment' | 'document_upload';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  is_global: boolean;
  action_url?: string;
  metadata: Record<string, any>;
  expires_at?: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  system_notifications: boolean;
  property_notifications: boolean;
  client_notifications: boolean;
  task_notifications: boolean;
  appointment_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  urgent_count: number;
  recent_count: number;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  // Get user notifications
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user?.id
  });

  // Get notification statistics
  const { data: notificationStats } = useQuery({
    queryKey: ['notification-stats', user?.id],
    queryFn: async (): Promise<NotificationStats> => {
      const { data, error } = await supabase.rpc('get_notification_stats');
      
      if (error) throw error;
      return data[0] || { total_count: 0, unread_count: 0, urgent_count: 0, recent_count: 0 };
    },
    enabled: !!user?.id
  });

  // Get notification preferences
  const { data: preferences, isLoading: loadingPreferences } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as NotificationPreferences | null;
    },
    enabled: !!user?.id
  });

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث الإشعار",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('mark_all_notifications_read');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast({
        title: "تم تحديث الإشعارات",
        description: `تم تمييز ${count} إشعار كمقروء`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث الإشعارات",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast({
        title: "تم حذف الإشعار",
        description: "تم حذف الإشعار بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف الإشعار",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update notification preferences
  const updatePreferences = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          ...updates
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast({
        title: "تم تحديث التفضيلات",
        description: "تم حفظ تفضيلات الإشعارات بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حفظ التفضيلات",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create notification (for admins)
  const createNotification = useMutation({
    mutationFn: async ({
      userId,
      title,
      message,
      type = 'info',
      priority = 'medium',
      isGlobal = false,
      actionUrl,
      metadata = {},
      expiresAt
    }: {
      userId?: string;
      title: string;
      message: string;
      type?: Notification['type'];
      priority?: Notification['priority'];
      isGlobal?: boolean;
      actionUrl?: string;
      metadata?: Record<string, any>;
      expiresAt?: string;
    }) => {
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId || null,
        p_title: title,
        p_message: message,
        p_type: type,
        p_priority: priority,
        p_is_global: isGlobal,
        p_action_url: actionUrl || null,
        p_metadata: metadata,
        p_expires_at: expiresAt || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
      toast({
        title: "تم إرسال الإشعار",
        description: "تم إنشاء الإشعار بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء الإشعار",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Set up real-time notifications
  useEffect(() => {
    if (!user?.id || isRealTimeEnabled) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
          
          // Show toast for new notification
          const notification = payload.new as Notification;
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.type === 'error' ? 'destructive' : 'default',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'is_global=eq.true'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
          
          // Show toast for global notification
          const notification = payload.new as Notification;
          toast({
            title: `🌍 ${notification.title}`,
            description: notification.message,
            variant: notification.type === 'error' ? 'destructive' : 'default',
          });
        }
      )
      .subscribe();

    setIsRealTimeEnabled(true);

    return () => {
      supabase.removeChannel(channel);
      setIsRealTimeEnabled(false);
    };
  }, [user?.id, queryClient, isRealTimeEnabled]);

  // Helper functions
  const getUnreadCount = () => notificationStats?.unread_count || 0;
  const getUrgentCount = () => notificationStats?.urgent_count || 0;
  const hasUnreadNotifications = () => getUnreadCount() > 0;
  const hasUrgentNotifications = () => getUrgentCount() > 0;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'system': return '⚙️';
      case 'property_update': return '🏠';
      case 'client_message': return '💬';
      case 'task_reminder': return '📋';
      case 'appointment': return '📅';
      case 'document_upload': return '📎';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return {
    // Data
    notifications,
    notificationStats,
    preferences,
    
    // Loading states
    loadingNotifications,
    loadingPreferences,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
    isDeleting: deleteNotification.isPending,
    isUpdatingPreferences: updatePreferences.isPending,
    isCreating: createNotification.isPending,
    
    // Actions
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
    updatePreferences: updatePreferences.mutate,
    createNotification: createNotification.mutate,
    
    // Helper functions
    getUnreadCount,
    getUrgentCount,
    hasUnreadNotifications,
    hasUrgentNotifications,
    getNotificationIcon,
    getPriorityColor
  };
};

export default useNotifications;