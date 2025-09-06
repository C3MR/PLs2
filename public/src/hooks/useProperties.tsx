import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  property_type: string;
  status: string;
  price: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  amenities: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('فشل في تحميل بيانات العقارات');
      toast({
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات العقارات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties(prev => prev.filter(property => property.id !== id));
      toast({
        title: "تم حذف العقار",
        description: "تم حذف العقار بنجاح من قاعدة البيانات",
      });
    } catch (err) {
      console.error('Error deleting property:', err);
      toast({
        title: "خطأ في حذف العقار",
        description: "حدث خطأ أثناء حذف العقار. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProperties(prev => 
        prev.map(property => 
          property.id === id ? { ...property, ...updates } : property
        )
      );
      toast({
        title: "تم تحديث العقار",
        description: "تم تحديث بيانات العقار بنجاح",
      });
    } catch (err) {
      console.error('Error updating property:', err);
      toast({
        title: "خطأ في تحديث العقار",
        description: "حدث خطأ أثناء تحديث بيانات العقار. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    }
  };

  const exportProperties = () => {
    try {
      const csvContent = [
        // CSV Header
        ['العنوان', 'النوع', 'الموقع', 'السعر', 'المساحة', 'غرف النوم', 'دورات المياه', 'الحالة', 'تاريخ الإضافة'].join(','),
        // CSV Data
        ...properties.map(property => [
          `"${property.title}"`,
          property.property_type,
          `"${property.location}"`,
          property.price,
          property.area || 0,
          property.bedrooms || 0,
          property.bathrooms || 0,
          property.status === 'available' ? 'متاح' : property.status === 'sold' ? 'مباع' : 'مؤجر',
          new Date(property.created_at).toLocaleDateString('ar-SA')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `properties_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "تم تصدير قائمة العقارات",
        description: "تم تنزيل ملف CSV بنجاح",
      });
    } catch (err) {
      console.error('Error exporting properties:', err);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير قائمة العقارات",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    deleteProperty,
    updateProperty,
    exportProperties
  };
};