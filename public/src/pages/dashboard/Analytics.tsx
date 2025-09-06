import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  DollarSign,
  Activity,
  Calendar,
  Target,
  Zap,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
  FileText,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const { analytics, loading, fetchAnalytics, exportAnalytics } = useAnalytics();
  const { toast } = useToast();

  const handleExport = () => {
    exportAnalytics();
    toast({
      title: "تم تصدير التقرير",
      description: "تم تنزيل ملف CSV بنجاح",
    });
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'apartment': 'شقة',
      'villa': 'فيلا',
      'commercial': 'تجاري',
      'land': 'أرض'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': 'معلق',
      'in_progress': 'قيد المعالجة',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات التحليلات...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">لا توجد بيانات متاحة للتحليل</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-right">التقارير والتحليلات</h1>
          <p className="text-muted-foreground">تحليلات شاملة لأداء السوق والعقارات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
            تحديث البيانات
          </Button>
          <Button className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي العقارات</p>
                <p className="text-3xl font-bold text-blue-800">{analytics.totalProperties.toLocaleString('en-US')}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{analytics.availableProperties} متاح</span>
                </div>
              </div>
              <Building className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">إجمالي العملاء</p>
                <p className="text-3xl font-bold text-green-800">{analytics.totalClients}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{analytics.activeClients} نشط</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">متوسط السعر</p>
                <p className="text-2xl font-bold text-purple-800">{(analytics.averagePrice / 1000000).toFixed(1)}م ر.س</p>
                <div className="flex items-center gap-1 mt-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-purple-600">للعقار الواحد</span>
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-orange-800">{analytics.totalRequests}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">{analytics.pendingRequests} معلق</span>
                </div>
              </div>
              <FileText className="h-12 w-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              الأداء الشهري (آخر 6 أشهر)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyData.map((month, index) => (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">{month.properties} عقار</span>
                      <span className="text-green-600">{month.clients} عميل</span>
                      <span className="text-purple-600">{month.requests} طلب</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Progress value={(month.properties / Math.max(...analytics.monthlyData.map(m => m.properties))) * 100} className="h-2" />
                    <Progress value={(month.clients / Math.max(...analytics.monthlyData.map(m => m.clients))) * 100} className="h-2" />
                    <Progress value={(month.requests / Math.max(...analytics.monthlyData.map(m => m.requests))) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Districts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              أفضل الأحياء أداءً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topDistricts.map((district, index) => (
                <div key={district.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{district.name}</p>
                      <p className="text-sm text-muted-foreground">{district.properties} عقار</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(district.avgPrice / 1000000).toFixed(1)}م ر.س</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{district.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Types & Request Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              توزيع أنواع العقارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.propertyTypes.map((type) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{getPropertyTypeLabel(type.type)}</span>
                    <div className="flex gap-2 text-sm">
                      <span>{type.count} عقار</span>
                      <span className="text-muted-foreground">({type.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress value={type.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    متوسط السعر: {(type.avgPrice / 1000000).toFixed(1)}م ر.س
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              حالة الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.requestStatus.map((status) => (
                <div key={status.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{getStatusLabel(status.status)}</span>
                    <div className="flex gap-2 text-sm">
                      <span>{status.count} طلب</span>
                      <span className="text-muted-foreground">({status.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress value={status.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            ملخص الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Building className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{analytics.availableProperties}</p>
              <p className="text-sm text-muted-foreground">عقارات متاحة</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{analytics.completedDeals}</p>
              <p className="text-sm text-muted-foreground">صفقات مكتملة</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{(analytics.totalValue / 1000000).toFixed(1)}م</p>
              <p className="text-sm text-muted-foreground">إجمالي القيمة (ر.س)</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{analytics.activeClients}</p>
              <p className="text-sm text-muted-foreground">عملاء نشطون</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;