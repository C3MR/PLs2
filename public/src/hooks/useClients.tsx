import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  bio?: string;
  avatar_url?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'agent' | 'employee' | 'client';
  is_active: boolean;
  employee_id?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyRequest {
  id: string;
  activity_category: string;
  business_activity: string;
  establishment_name: string;
  capacity: string;
  status: string;
  priority: string;
  created_at: string;
  client_id: string;
  email: string;
  phone: string;
  assigned_to?: string;
  description?: string;
  client?: Client;
}

export interface SavedProperty {
  id: string;
  property_id: string;
  client_id: string;
  created_at: string;
  property?: {
    title: string;
    location: string;
    price: number;
    images: string[];
  };
}

export interface ClientDashboardData {
  stats: {
    newNotifications: number;
    savedProperties: number;
    completedRequests: number;
    activeRequests: number;
  };
  recentRequests: PropertyRequest[];
  savedProperties: SavedProperty[];
  notifications: any[];
}

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    enabled: true, // Re-enable after database setup
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Profiles table not found. Please apply database migrations first.');
          return [];
        }
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useClientDashboard = (clientId: string) => {
  return useQuery({
    queryKey: ['client-dashboard', clientId],
    queryFn: async (): Promise<ClientDashboardData> => {
      // Get client requests
      const { data: requests, error: requestsError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('email', clientId) // Use email for now since we don't have direct client_id relation
        .order('created_at', { ascending: false });

      if (requestsError && requestsError.code !== 'PGRST116') throw requestsError;

      // Get saved properties (we'll simulate this for now)
      const savedProperties: SavedProperty[] = [];

      // Calculate stats
      const stats = {
        newNotifications: 2,
        savedProperties: savedProperties.length,
        completedRequests: requests?.filter(r => r.status === 'completed').length || 0,
        activeRequests: requests?.filter(r => r.status !== 'completed').length || 0
      };

      // Mock notifications
      const notifications = [
        {
          id: 1,
          title: 'تم الرد على استفسارك حول العقار',
          time: 'منذ ساعتين',
          type: 'reply',
          isRead: false
        },
        {
          id: 2,
          title: 'عقار جديد متاح في منطقتك المفضلة',
          time: 'منذ 3 ساعات',
          type: 'new',
          isRead: false
        }
      ];

      return {
        stats,
        recentRequests: (requests?.slice(0, 3) || []).map(req => ({
          ...req,
          priority: 'medium',
          client_id: clientId,
          description: req.establishment_name || req.business_activity || 'طلب خدمة عقارية'
        })),
        savedProperties,
        notifications
      };
    },
    enabled: !!clientId
  });
};

export const useAddClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "تم إضافة العميل بنجاح",
        description: "تم إضافة العميل الجديد إلى قاعدة البيانات",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في إضافة العميل",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "تم تحديث بيانات العميل",
        description: "تم حفظ التغييرات بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث بيانات العميل",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "تم حذف العميل",
        description: "تم حذف العميل من قاعدة البيانات",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف العميل",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};