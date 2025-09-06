import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  Building,
  Target,
  Filter,
  Search,
  PlusCircle,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportsManagement = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const { toast } = useToast();

  // تصنيف التقارير
  const reportCategories = {
    properties: {
      name: 'تقارير العقارات',
      icon: Building,
      color: 'bg-blue-500',
      reports: [
        {
          id: 'propertyPerformanceReport',
          name: 'تقرير أداء العقار',
          description: 'تحليل شامل لأداء عقار محدد مع إحصائيات المشاهدات والطلبات',
          audience: 'ملاك العقارات',
          permissions: ['مدير النظام', 'الرئيس التنفيذي', 'مدير أملاك'],
          estimatedTime: '2-3 دقائق',
          lastGenerated: '2024-03-14'
        }
      ]
    },
    employees: {
      name: 'تقارير الموظفين',
      icon: Users,
      color: 'bg-green-500',
      reports: [
        {
          id: 'agentPerformanceReport',
          name: 'تقرير أداء الموظف',
          description: 'مؤشرات الأداء والإنجازات مع مقارنة بالأهداف المحددة',
          audience: 'الإدارة العليا',
          permissions: ['مدير النظام', 'الرئيس التنفيذي', 'مدير تسويق'],
          estimatedTime: '3-5 دقائق',
          lastGenerated: '2024-03-15'
        }
      ]
    },
    clients: {
      name: 'تقارير العملاء',
      icon: UserCheck,
      color: 'bg-purple-500',
      reports: [
        {
          id: 'clientRequestSummary',
          name: 'ملخص طلب العميل',
          description: 'تقرير مفصل عن طلب العميل مع العقارات المقترحة',
          audience: 'المسوقون المتعاونون',
          permissions: ['مدير النظام', 'الرئيس التنفيذي', 'مدير تسويق', 'مدير أملاك'],
          estimatedTime: '1-2 دقيقة',
          lastGenerated: '2024-03-15'
        }
      ]
    }
  };

  // إحصائيات التقارير
  const reportStats = {
    totalGenerated: 142,
    thisMonth: 28,
    pending: 3,
    automated: 15
  };

  // التقارير المولدة مؤخراً
  const recentReports = [
    {
      id: 'RPT-001',
      name: 'تقرير أداء العقار - فيلا الملقا',
      type: 'propertyPerformanceReport',
      generatedBy: 'أحمد محمد',
      date: '2024-03-15',
      status: 'completed',
      downloadCount: 5
    },
    {
      id: 'RPT-002',
      name: 'تقرير أداء الموظف - سارة أحمد',
      type: 'agentPerformanceReport',
      generatedBy: 'مدير النظام',
      date: '2024-03-14',
      status: 'completed',
      downloadCount: 2
    },
    {
      id: 'RPT-003',
      name: 'ملخص طلب العميل - REQ-001234',
      type: 'clientRequestSummary',
      generatedBy: 'علي محمد',
      date: '2024-03-14',
      status: 'generating',
      downloadCount: 0
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار نوع التقرير أولاً",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // محاكاة عملية إنشاء التقرير
    toast({
      title: "🔄 جاري إنشاء التقرير",
      description: "يرجى الانتظار، سيتم إنشاء التقرير بصيغة PDF قريباً...",
    });

    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "✅ تم إنشاء التقرير بنجاح",
        description: "تم إنشاء التقرير وتحميله تلقائياً",
      });
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 gap-1">
          <CheckCircle className="h-3 w-3" />
          مكتمل
        </Badge>;
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          قيد الإنشاء
        </Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          فشل
        </Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة التقارير</h1>
          <p className="text-muted-foreground">إنشاء وإدارة التقارير الاحترافية بصيغة PDF</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            تقارير مجدولة
          </Button>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            إنشاء تقرير جديد
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي التقارير</p>
                <p className="text-3xl font-bold text-blue-800">{reportStats.totalGenerated}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">هذا الشهر</p>
                <p className="text-3xl font-bold text-green-800">{reportStats.thisMonth}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">قيد الإنتظار</p>
                <p className="text-3xl font-bold text-orange-800">{reportStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">تلقائية</p>
                <p className="text-3xl font-bold text-purple-800">{reportStats.automated}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">إنشاء تقرير</TabsTrigger>
          <TabsTrigger value="templates">قوالب التقارير</TabsTrigger>
          <TabsTrigger value="history">سجل التقارير</TabsTrigger>
        </TabsList>

        {/* إنشاء تقرير جديد */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                إنشاء تقرير جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* اختيار نوع التقرير */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">اختر نوع التقرير</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(reportCategories).map(([key, category]) => (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold">{category.name}</h4>
                      </div>
                      {category.reports.map((report) => (
                        <Card
                          key={report.id}
                          className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                            selectedReport === report.id ? 'ring-2 ring-primary shadow-lg bg-primary/5' : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedReport(report.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-sm">{report.name}</h5>
                                {selectedReport === report.id && (
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{report.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {report.audience}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{report.estimatedTime}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* خيارات إضافية */}
              {selectedReport && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromDate">من تاريخ</Label>
                      <Input
                        id="fromDate"
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toDate">إلى تاريخ</Label>
                      <Input
                        id="toDate"
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      placeholder="أي ملاحظات أو تعليمات خاصة للتقرير..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full md:w-auto gap-2"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري إنشاء التقرير...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        إنشاء وتحميل التقرير PDF
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* قوالب التقارير */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(reportCategories).map(([key, category]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
                {category.reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">الجمهور:</span>
                            <Badge variant="outline" className="text-xs">{report.audience}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">آخر إنشاء:</span>
                            <span>{report.lastGenerated}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">الوقت المقدر:</span>
                            <span>{report.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            معاينة
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            إنشاء
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* سجل التقارير */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  سجل التقارير المولدة
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
                      <th className="text-right p-4 font-medium text-muted-foreground">اسم التقرير</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">النوع</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">المنشئ</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">التحميلات</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{report.name}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {report.type === 'propertyPerformanceReport' ? 'أداء عقار' :
                             report.type === 'agentPerformanceReport' ? 'أداء موظف' :
                             'ملخص طلب'}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{report.generatedBy}</td>
                        <td className="p-4 text-sm text-muted-foreground">{report.date}</td>
                        <td className="p-4">{getStatusBadge(report.status)}</td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="text-xs">
                            {report.downloadCount}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-3 w-3" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsManagement;