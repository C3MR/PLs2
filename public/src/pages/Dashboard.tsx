import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import InternalLinkingSystem from '@/components/InternalLinkingSystem';
import SmartNavigation from '@/components/SmartNavigation';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - في التطبيق الحقيقي سيأتي من API
  const stats = {
    totalRequests: 248,
    pendingRequests: 32,
    completedRequests: 195,
    cancelledRequests: 21,
    totalClients: 156,
    activeClients: 89,
    monthlyGrowth: 12.5,
    revenue: 2847500
  };

  const recentRequests = [
    {
      id: 'REQ-001234',
      clientName: 'أحمد محمد السالم',
      propertyType: 'فيلا',
      location: 'حي العليا',
      budget: '2,500,000',
      status: 'pending',
      date: '2024-03-15',
      priority: 'high'
    },
    {
      id: 'REQ-001235',
      clientName: 'فاطمة علي الأحمد',
      propertyType: 'شقة',
      location: 'حي الملقا',
      budget: '800,000',
      status: 'in_progress',
      date: '2024-03-14',
      priority: 'medium'
    },
    {
      id: 'REQ-001236',
      clientName: 'خالد عبدالله النصر',
      propertyType: 'أرض تجارية',
      location: 'حي الورود',
      budget: '5,000,000',
      status: 'completed',
      date: '2024-03-13',
      priority: 'high'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">معلق</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">قيد المعالجة</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">مكتمل</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">ملغي</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">عالي</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs border-orange-200">متوسط</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">منخفض</Badge>;
      default:
        return null;
    }
  };

  // Quick action handlers
  const handleNewRequest = () => navigate('/property-request');
  const handleNewClient = () => navigate('/dashboard/clients');
  const handleNewProperty = () => navigate('/dashboard/properties');
  const handleReports = () => navigate('/dashboard/reports');
  const handleSchedule = () => navigate('/dashboard/appointments');
  const handleMarketAnalysis = () => navigate('/dashboard/market-analysis');
  const handleExportReport = () => {
    // إنشاء ملف CSV بسيط
    const csvContent = "data:text/csv;charset=utf-8," 
      + "رقم الطلب,العميل,نوع العقار,الموقع,الميزانية,الحالة\n"
      + recentRequests.map(req => 
        `${req.id},${req.clientName},${req.propertyType},${req.location},${req.budget},${req.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 p-6">
      <div className="container mx-auto space-y-8" dir="rtl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground text-right">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-2">مرحباً بك في نظام إدارة العقارات المتقدم</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExportReport}>
              <Download className="h-4 w-4" />
              تصدير التقرير
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" onClick={handleNewRequest}>
              <Plus className="h-4 w-4" />
              طلب جديد
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي الطلبات</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.totalRequests}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+{stats.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">العملاء النشطون</p>
                  <p className="text-3xl font-bold text-green-800">{stats.activeClients}</p>
                  <p className="text-sm text-muted-foreground mt-2">من أصل {stats.totalClients}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">طلبات معلقة</p>
                  <p className="text-3xl font-bold text-purple-800">{stats.pendingRequests}</p>
                  <Progress value={(stats.pendingRequests / stats.totalRequests) * 100} className="mt-2 h-2" />
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">الإيرادات الشهرية</p>
                  <p className="text-2xl font-bold text-orange-800">{stats.revenue.toLocaleString('en-US')} ر.س</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-500 rounded-full">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                أداء الطلبات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">رسم بياني لأداء الطلبات</p>
                  <p className="text-sm text-muted-foreground mt-2">يعرض إحصائيات مفصلة للـ 12 شهر الماضية</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                توزيع أنواع العقارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">سكني</span>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">تجاري</span>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">مختلط</span>
                  </div>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">صناعي</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                أحدث الطلبات
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  بحث
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-4 font-medium text-muted-foreground">رقم الطلب</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">نوع العقار</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الموقع</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الميزانية</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الأولوية</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono text-sm">{request.id}</td>
                      <td className="p-4 font-medium">{request.clientName}</td>
                      <td className="p-4">{request.propertyType}</td>
                      <td className="p-4 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </td>
                      <td className="p-4 font-medium">{request.budget} ر.س</td>
                      <td className="p-4">{getStatusBadge(request.status)}</td>
                      <td className="p-4">{getPriorityBadge(request.priority)}</td>
                      <td className="p-4 text-sm text-muted-foreground">{request.date}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>الإجراءات السريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" onClick={handleNewRequest}>
                <Plus className="h-6 w-6" />
                <span className="text-xs">طلب جديد</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" onClick={handleNewClient}>
                <Users className="h-6 w-6" />
                <span className="text-xs">عميل جديد</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" onClick={handleNewProperty}>
                <Building className="h-6 w-6" />
                <span className="text-xs">عقار جديد</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" onClick={handleReports}>
                <FileText className="h-6 w-6" />
                <span className="text-xs">تقرير شامل</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" onClick={handleSchedule}>
                <Calendar className="h-6 w-6" />
                <span className="text-xs">جدولة موعد</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300" onClick={handleMarketAnalysis}>
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs">تحليل السوق</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Internal Navigation and Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InternalLinkingSystem currentPage="/dashboard" />
          <SmartNavigation />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;