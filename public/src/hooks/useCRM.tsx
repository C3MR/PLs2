import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  lead_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  secondary_phone?: string;
  source: 'website' | 'phone_call' | 'referral' | 'social_media' | 'advertisement' | 'walk_in' | 'event' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  interested_property_type?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_location?: string;
  requirements?: string;
  assigned_to?: string;
  created_by?: string;
  score: number;
  last_contact_date?: string;
  next_follow_up?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface SalesPipeline {
  id: string;
  lead_id: string;
  property_id?: string;
  deal_value: number;
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  commission_rate: number;
  commission_amount?: number;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost' | 'on_hold';
  stage_changed_at: string;
  assigned_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMTask {
  id: string;
  title: string;
  description?: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  completed_at?: string;
  lead_id?: string;
  property_id?: string;
  client_id?: string;
  assigned_to: string;
  created_by?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useLeads = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all leads
  const { data: leads, isLoading: loadingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Create lead mutation
  const createLead = useMutation({
    mutationFn: async (newLead: { first_name: string; last_name: string; phone: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...newLead,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "تم إنشاء العميل المحتمل",
        description: "تم إضافة العميل المحتمل بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء العميل المحتمل",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update lead mutation
  const updateLead = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات العميل المحتمل",
      });
    }
  });

  // Get lead statistics
  const getLeadStats = () => {
    if (!leads) return null;
    
    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      won: leads.filter(l => l.status === 'won').length,
      lost: leads.filter(l => l.status === 'lost').length,
      highPriority: leads.filter(l => l.priority === 'high' || l.priority === 'urgent').length
    };
  };

  return {
    leads,
    loadingLeads,
    createLead: createLead.mutate,
    updateLead: updateLead.mutate,
    isCreating: createLead.isPending,
    isUpdating: updateLead.isPending,
    leadStats: getLeadStats()
  };
};

export const useSalesPipeline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get pipeline data
  const { data: pipeline, isLoading: loadingPipeline } = useQuery({
    queryKey: ['sales-pipeline'],
    queryFn: async (): Promise<SalesPipeline[]> => {
      const { data, error } = await supabase
        .from('sales_pipeline')
        .select(`
          *,
          leads(first_name, last_name, phone),
          properties(title, price, location)
        `)
        .order('stage_changed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Create pipeline entry
  const createPipelineEntry = useMutation({
    mutationFn: async (entry: { deal_value: number; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('sales_pipeline')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-pipeline'] });
      toast({
        title: "تم إنشاء فرصة البيع",
        description: "تم إضافة فرصة جديدة لخط المبيعات",
      });
    }
  });

  return {
    pipeline,
    loadingPipeline,
    createPipelineEntry: createPipelineEntry.mutate,
    isCreating: createPipelineEntry.isPending
  };
};

export const useCRMTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get tasks
  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['crm-tasks'],
    queryFn: async (): Promise<CRMTask[]> => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select(`
          *,
          leads(first_name, last_name),
          properties(title),
          clients(name)
        `)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Create task
  const createTask = useMutation({
    mutationFn: async (task: { title: string; assigned_to: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .insert({
          ...task,
          created_by: user?.id,
          assigned_to: task.assigned_to || user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
      toast({
        title: "تم إنشاء المهمة",
        description: "تم إضافة مهمة جديدة",
      });
    }
  });

  // Update task
  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CRMTask> }) => {
      const { data, error } = await supabase
        .from('crm_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
    }
  });

  return {
    tasks,
    loadingTasks,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending
  };
};

export default { useLeads, useSalesPipeline, useCRMTasks };