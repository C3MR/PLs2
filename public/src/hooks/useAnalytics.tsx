import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalProperties: number;
  totalClients: number;
  totalRequests: number;
  availableProperties: number;
  soldProperties: number;
  averagePrice: number;
  totalValue: number;
  completedDeals: number;
  activeClients: number;
  pendingRequests: number;
  monthlyData: {
    month: string;
    properties: number;
    clients: number;
    requests: number;
    value: number;
  }[];
  topDistricts: {
    name: string;
    properties: number;
    avgPrice: number;
    percentage: number;
  }[];
  propertyTypes: {
    type: string;
    count: number;
    percentage: number;
    avgPrice: number;
  }[];
  requestStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch properties data
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*');
      
      if (propertiesError) throw propertiesError;

      // Fetch clients data
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');
      
      if (clientsError) throw clientsError;

      // Fetch property requests data
      const { data: requests, error: requestsError } = await supabase
        .from('property_requests')
        .select('*');
      
      if (requestsError) throw requestsError;

      // Calculate analytics
      const totalProperties = properties?.length || 0;
      const totalClients = clients?.length || 0;
      const totalRequests = requests?.length || 0;
      
      const availableProperties = properties?.filter(p => p.status === 'available').length || 0;
      const soldProperties = properties?.filter(p => p.status === 'sold').length || 0;
      
      const averagePrice = properties?.length > 0 
        ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length 
        : 0;
      
      const totalValue = clients?.reduce((sum, c) => sum + (c.total_value || 0), 0) || 0;
      const completedDeals = clients?.reduce((sum, c) => sum + (c.completed_deals || 0), 0) || 0;
      const activeClients = clients?.filter(c => c.status === 'active').length || 0;
      const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;

      // Calculate monthly data (last 6 months)
      const monthlyData = [];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
      
      for (let i = 0; i < 6; i++) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - (5 - i));
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        
        const monthProperties = properties?.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= monthStart && createdAt < monthEnd;
        }).length || 0;
        
        const monthClients = clients?.filter(c => {
          const createdAt = new Date(c.created_at);
          return createdAt >= monthStart && createdAt < monthEnd;
        }).length || 0;
        
        const monthRequests = requests?.filter(r => {
          const createdAt = new Date(r.created_at);
          return createdAt >= monthStart && createdAt < monthEnd;
        }).length || 0;
        
        const monthValue = properties?.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= monthStart && createdAt < monthEnd && p.status === 'sold';
        }).reduce((sum, p) => sum + p.price, 0) || 0;
        
        monthlyData.push({
          month: months[monthStart.getMonth()],
          properties: monthProperties,
          clients: monthClients,
          requests: monthRequests,
          value: monthValue
        });
      }

      // Calculate top districts
      const districtMap = new Map();
      properties?.forEach(p => {
        const district = p.location.split('،')[0].trim(); // Extract district from location
        if (!districtMap.has(district)) {
          districtMap.set(district, { count: 0, totalPrice: 0 });
        }
        const current = districtMap.get(district);
        current.count++;
        current.totalPrice += p.price;
      });

      const topDistricts = Array.from(districtMap.entries())
        .map(([name, data]) => ({
          name,
          properties: data.count,
          avgPrice: data.totalPrice / data.count,
          percentage: (data.count / totalProperties) * 100
        }))
        .sort((a, b) => b.properties - a.properties)
        .slice(0, 5);

      // Calculate property types distribution
      const typeMap = new Map();
      properties?.forEach(p => {
        if (!typeMap.has(p.property_type)) {
          typeMap.set(p.property_type, { count: 0, totalPrice: 0 });
        }
        const current = typeMap.get(p.property_type);
        current.count++;
        current.totalPrice += p.price;
      });

      const propertyTypes = Array.from(typeMap.entries())
        .map(([type, data]) => ({
          type,
          count: data.count,
          percentage: (data.count / totalProperties) * 100,
          avgPrice: data.totalPrice / data.count
        }));

      // Calculate request status distribution
      const statusMap = new Map();
      requests?.forEach(r => {
        if (!statusMap.has(r.status)) {
          statusMap.set(r.status, 0);
        }
        statusMap.set(r.status, statusMap.get(r.status) + 1);
      });

      const requestStatus = Array.from(statusMap.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: (count / totalRequests) * 100
        }));

      setAnalytics({
        totalProperties,
        totalClients,
        totalRequests,
        availableProperties,
        soldProperties,
        averagePrice,
        totalValue,
        completedDeals,
        activeClients,
        pendingRequests,
        monthlyData,
        topDistricts,
        propertyTypes,
        requestStatus
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('فشل في تحميل بيانات التحليلات');
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = () => {
    if (!analytics) return;

    try {
      const csvContent = [
        ['نوع البيانات', 'القيمة'],
        ['إجمالي العقارات', analytics.totalProperties],
        ['إجمالي العملاء', analytics.totalClients],
        ['إجمالي الطلبات', analytics.totalRequests],
        ['العقارات المتاحة', analytics.availableProperties],
        ['العقارات المباعة', analytics.soldProperties],
        ['متوسط الأسعار', analytics.averagePrice],
        ['إجمالي القيمة', analytics.totalValue],
        ['الصفقات المكتملة', analytics.completedDeals],
        ['العملاء النشطون', analytics.activeClients],
        ['الطلبات المعلقة', analytics.pendingRequests]
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error exporting analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    exportAnalytics
  };
};