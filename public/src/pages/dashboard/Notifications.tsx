import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Settings,
  Filter,
  Mail,
  Trash2,
  Archive,
  Clock,
  User,
  Building,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

const Notifications = () => {
  // Mock data للإشعارات
  const notifications = [
    {
      id: 'NOT-001',
      title: 'طلب عقار جديد',
      message: 'تم استلام طلب جديد لشراء فيلا في حي العليا من العميل أحمد محمد السالم',
      type: 'new_request',
      priority: 'high',
      timestamp: '2024-03-20 15:30',
      isRead: false,
      actionRequired: true,
      relatedEntity: 'REQ-001234'
    },
    {
      id: 'NOT-002',
      title: 'موعد معاينة قريب',
      message: 'لديك موعد معاينة خلال ساعة مع العميلة فاطمة علي في الملقا',
      type: 'appointment_reminder',
      priority: 'medium',
      timestamp: '2024-03-20 14:45',
      isRead: false,
      actionRequired: true,
      relatedEntity: 'APT-002'
    },
    {
      id: 'NOT-003',
      title: 'تحديث حالة العقار',
      message: 'تم تغيير حالة العقار PROP-001 من "متاح" إلى "تحت التعاقد"',
      type: 'property_update',
      priority: 'low',
      timestamp: '2024-03-20 13:20',
      isRead: true,
      actionRequired: false,
      relatedEntity: 'PROP-001'
    },
    {
      id: 'NOT-004',
      title: 'رسالة جديدة',
      message: 'وصلت رسالة جديدة من خالد عبدالله حول الأرض التجارية في الورود',
      type: 'new_message',
      priority: 'medium',
      timestamp: '2024-03-20 12:15',
      isRead: true,
      actionRequired: false,
      relatedEntity: 'MSG-003'
    },
    {
      id: 'NOT-005',
      title: 'تذكير بالمتابعة',
      message: 'يجب متابعة العميل نورا سعد الغامدي بخصوص شكواها المرسلة أمس',
      type: 'follow_up',
      priority: 'high',
      timestamp: '2024-03-20 11:00',
      isRead: false,
      actionRequired: true,
      relatedEntity: 'MSG-004'
    },
    {
      id: 'NOT-006',
      title: 'تقرير شهري جاهز',
      message: 'تم إنشاء التقرير الشهري لمارس 2024 وهو جاهز للتحميل',
      type: 'report_ready',
      priority: 'low',
      timestamp: '2024-03-20 09:30',
      isRead: true,
      actionRequired: false,
      relatedEntity: 'RPT-003'
    }
  ];

  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    actionRequired: notifications.filter(n => n.actionRequired).length,
    high_priority: notifications.filter(n => n.priority === 'high').length
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_request':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'appointment_reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'property_update':
        return <Building className="h-5 w-5 text-green-500" />;
      case 'new_message':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'follow_up':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'report_ready':
        return <CheckCircle className="h-5 w-5 text-teal-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">عالي</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">متوسط</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">منخفض</Badge>;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'new_request': 'طلب جديد',
      'appointment_reminder': 'تذكير موعد',
      'property_update': 'تحديث عقار',
      'new_message': 'رسالة جديدة',
      'follow_up': 'متابعة',
      'report_ready': 'تقرير جاهز'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-right">الإشعارات</h1>
          <p className="text-muted-foreground">مركز الإشعارات والتنبيهات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            إعدادات الإشعارات
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-800">{notificationStats.total}</p>
            <p className="text-sm text-blue-600">إجمالي الإشعارات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-800">{notificationStats.unread}</p>
            <p className="text-sm text-red-600">غير مقروءة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-800">{notificationStats.actionRequired}</p>
            <p className="text-sm text-orange-600">تحتاج إجراء</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-800">{notificationStats.high_priority}</p>
            <p className="text-sm text-purple-600">أولوية عالية</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Notifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  جميع الإشعارات
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    تحديد الكل كمقروء
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Archive className="h-4 w-4" />
                    أرشفة
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 border-b hover:bg-muted/50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50 border-r-4 border-r-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-muted/30 rounded-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              {getPriorityBadge(notification.priority)}
                              {notification.actionRequired && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                  يحتاج إجراء
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(notification.timestamp).toLocaleTimeString('ar-SA', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {notification.relatedEntity && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {notification.relatedEntity}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {notification.actionRequired && (
                              <Button size="sm" className="h-8 text-xs">
                                اتخاذ إجراء
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Archive className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Settings */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ملخص اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">إشعارات جديدة</span>
                  <span className="font-bold text-primary">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">تحتاج متابعة</span>
                  <span className="font-bold text-orange-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">مواعيد قريبة</span>
                  <span className="font-bold text-green-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">طلبات جديدة</span>
                  <span className="font-bold text-blue-600">5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">أنواع الإشعارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">طلبات جديدة</span>
                  </div>
                  <Badge variant="secondary">12</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">تذكير مواعيد</span>
                  </div>
                  <Badge variant="secondary">5</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">رسائل</span>
                  </div>
                  <Badge variant="secondary">8</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">متابعات</span>
                  </div>
                  <Badge variant="secondary">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إعدادات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  إعدادات الإشعارات
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Archive className="h-4 w-4" />
                  عرض المؤرشفة
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Filter className="h-4 w-4" />
                  تصفية متقدمة
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Trash2 className="h-4 w-4" />
                  مسح المقروءة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;