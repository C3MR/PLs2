import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Target, CheckCircle2, AlertCircle, BarChart3, UserPlus, Building, Plus, Calendar } from 'lucide-react';

const CRMDashboard = () => {
  // Mock data لعرض النظام بدون الحاجة لقاعدة البيانات
  const mockStats = {
    total: 156,
    new: 23,
    qualified: 45,
    won: 18,
    lost: 12,
    highPriority: 8
  };

  const mockLeads = [
    {
      id: '1',
      first_name: 'أحمد',
      last_name: 'محمد',
      phone: '+966501234567',
      email: 'ahmed@example.com',
      status: 'new',
      priority: 'high',
      score: 85,
      created_at: new Date().toISOString(),
      requirements: 'يبحث عن فيلا في شمال الرياض بمساحة لا تقل عن 400 متر مربع'
    },
    {
      id: '2',
      first_name: 'فاطمة',
      last_name: 'العلي',
      phone: '+966509876543',
      email: 'fatima@example.com',
      status: 'qualified',
      priority: 'medium',
      score: 92,
      created_at: new Date().toISOString(),
      requirements: 'شقة حديثة في وسط جدة قريبة من المدارس والمستشفيات'
    },
    {
      id: '3',
      first_name: 'عبدالله',
      last_name: 'الزهراني',
      phone: '+966505555555',
      email: 'abdullah@example.com',
      status: 'contacted',
      priority: 'urgent',
      score: 78,
      created_at: new Date().toISOString(),
      requirements: 'مكتب تجاري في برج المملكة للاستثمار'
    }
  ];

  const mockTasks = [
    {
      id: '1',
      title: 'متابعة مع أحمد محمد',
      priority: 'high',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      title: 'إرسال عرض لفاطمة العلي',
      priority: 'medium',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress'
    },
    {
      id: '3',
      title: 'جدولة زيارة مع عبدالله',
      priority: 'urgent',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }
  ];

  const statusColors = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500', 
    qualified: 'bg-green-500',
    proposal_sent: 'bg-purple-500',
    negotiation: 'bg-orange-500',
    won: 'bg-emerald-500',
    lost: 'bg-red-500',
    on_hold: 'bg-gray-500'
  };

  const statusLabels = {
    new: 'جديد',
    contacted: 'تم التواصل',
    qualified: 'مؤهل',
    proposal_sent: 'تم إرسال العرض',
    negotiation: 'تفاوض',
    won: 'فاز',
    lost: 'خسر',
    on_hold: 'معلق'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const priorityLabels = {
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    urgent: 'عاجل'
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">نظام إدارة العملاء CRM</h1>
          <p className="text-muted-foreground mt-2">إدارة شاملة للعملاء المحتملين والمبيعات</p>
        </div>
        <div className="flex gap-3">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            إضافة عميل محتمل
          </Button>
          <Button variant="outline">
            <Building className="h-4 w-4 mr-2" />
            إضافة فرصة بيع
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء المحتملين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.new} جديد هذا الأسبوع
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء مؤهلين</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.qualified}</div>
            <p className="text-xs text-muted-foreground">
              معدل التحويل {Math.round((mockStats.qualified / mockStats.total) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صفقات منجزة</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.won}</div>
            <p className="text-xs text-muted-foreground">
              هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مهام عاجلة</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              تحتاج متابعة فورية
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              توزيع حالات العملاء المحتملين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusLabels).map(([status, label]) => {
                const count = mockLeads.filter(l => l.status === status).length;
                const percentage = mockLeads.length ? (count / mockLeads.length) * 100 : 0;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                      <span className="text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المهام القادمة</CardTitle>
            <CardDescription>المهام المجدولة للأيام القادمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.due_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                    {priorityLabels[task.priority as keyof typeof priorityLabels]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>العملاء المحتملين الجدد</CardTitle>
          <CardDescription>أحدث العملاء المضافين للنظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {lead.first_name} {lead.last_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{lead.phone}</span>
                      <span>{lead.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={`${statusColors[lead.status as keyof typeof statusColors]} text-white`}>
                    {statusLabels[lead.status as keyof typeof statusLabels]}
                  </Badge>
                  <Badge variant="outline" className={priorityColors[lead.priority as keyof typeof priorityColors]}>
                    {priorityLabels[lead.priority as keyof typeof priorityLabels]}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">النقاط: {lead.score}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              إضافة عميل محتمل
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-6 w-6" />
              جدولة موعد
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              عرض التقارير
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              تحليل المبيعات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;