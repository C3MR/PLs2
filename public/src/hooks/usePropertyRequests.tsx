import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PropertyRequest {
  id: string;
  request_id: string;
  full_name: string;
  phone: string;
  email: string;
  property_type: string;
  specific_type: string;
  purpose: string;
  capacity: string;
  capacity_other?: string;
  min_area?: number;
  max_area?: number;
  price_option?: string;
  specific_budget?: number;
  preferred_districts: string[];
  activity_category?: string;
  business_activity?: string;
  establishment_name?: string;
  branches_count?: string;
  how_did_you_hear_about_us?: string;
  status: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const usePropertyRequests = () => {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching property requests:', err);
      setError('فشل في تحميل بيانات الطلبات');
      toast({
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات الطلبات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string, assignedTo?: string) => {
    try {
      const updates: any = { status };
      if (assignedTo !== undefined) {
        updates.assigned_to = assignedTo;
      }

      const { error } = await supabase
        .from('property_requests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, ...updates } : request
        )
      );

      toast({
        title: "تم تحديث الطلب",
        description: "تم تحديث حالة الطلب بنجاح",
      });
    } catch (err) {
      console.error('Error updating request:', err);
      toast({
        title: "خطأ في تحديث الطلب",
        description: "حدث خطأ أثناء تحديث الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.filter(request => request.id !== id));
      toast({
        title: "تم حذف الطلب",
        description: "تم حذف الطلب بنجاح من قاعدة البيانات",
      });
    } catch (err) {
      console.error('Error deleting request:', err);
      toast({
        title: "خطأ في حذف الطلب",
        description: "حدث خطأ أثناء حذف الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  const exportRequests = () => {
    try {
      const csvContent = [
        // CSV Header
        ['رقم الطلب', 'الاسم', 'الجوال', 'البريد الإلكتروني', 'نوع العقار', 'الغرض', 'المساحة المطلوبة', 'الميزانية', 'الأحياء المفضلة', 'الحالة', 'المسؤول', 'تاريخ الإنشاء'].join(','),
        // CSV Data
        ...requests.map(request => [
          request.request_id,
          `"${request.full_name}"`,
          request.phone,
          request.email,
          request.property_type,
          request.purpose,
          request.min_area && request.max_area ? `${request.min_area} - ${request.max_area} م²` : '',
          request.specific_budget ? `${request.specific_budget} ر.س` : request.price_option || '',
          `"${request.preferred_districts.join(', ')}"`,
          request.status === 'pending' ? 'معلق' : request.status === 'in_progress' ? 'قيد المعالجة' : request.status === 'completed' ? 'مكتمل' : 'ملغي',
          request.assigned_to || '',
          new Date(request.created_at).toLocaleDateString('ar-SA')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `property_requests_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "تم تصدير قائمة الطلبات",
        description: "تم تنزيل ملف CSV بنجاح",
      });
    } catch (err) {
      console.error('Error exporting requests:', err);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير قائمة الطلبات",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    updateRequestStatus,
    deleteRequest,
    exportRequests
  };
};