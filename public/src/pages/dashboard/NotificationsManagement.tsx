import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  BellOff, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Check, 
  CheckCheck,
  Filter,
  Settings,
  Clock,
  Mail,
  Smartphone,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const NotificationsManagement = () => {
  const {
    notifications,
    notificationStats,
    preferences,
    loadingNotifications,
    loadingPreferences,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
    isUpdatingPreferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    getNotificationIcon,
    getPriorityColor
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');

  // Filter notifications
  const filteredNotifications = notifications?.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'read' && notification.is_read) ||
                         (statusFilter === 'unread' && !notification.is_read);

    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  }) || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[priority as keyof typeof colors] || colors.medium}>
        {priority === 'urgent' ? 'عاجل' : 
         priority === 'high' ? 'عالي' :
         priority === 'medium' ? 'متوسط' : 'منخفض'}
      </Badge>
    );
  };

  const handlePreferenceChange = (field: string, value: any) => {
    updatePreferences({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الإشعارات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتخصيص الإشعارات والتنبيهات
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            تمييز الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {notificationStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإشعارات</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notificationStats.total_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">غير المقروءة</CardTitle>
              <BellOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{notificationStats.unread_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العاجلة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{notificationStats.urgent_count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأخيرة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{notificationStats.recent_count}</div>
              <p className="text-xs text-muted-foreground">خلال 24 ساعة</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 flex gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="البحث في الإشعارات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        تصفية
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>تصفية حسب النوع</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                        جميع الأنواع
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('system')}>
                        نظام
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('property_update')}>
                        تحديث عقار
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter('client_message')}>
                        رسالة عميل
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>تصفية حسب الأولوية</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                        جميع الأولويات
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter('urgent')}>
                        عاجل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                        عالي
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                        متوسط
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        جميع الحالات
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('unread')}>
                        غير مقروء
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('read')}>
                        مقروء
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {loadingNotifications ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>النوع</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الرسالة</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow key={notification.id} className={!notification.is_read ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-medium">{notification.title}</div>
                          {notification.is_global && (
                            <Badge variant="outline" className="text-xs mt-1">عام</Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-muted-foreground">
                            {notification.message}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {getPriorityBadge(notification.priority)}
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: ar })}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={notification.is_read ? "secondary" : "default"}>
                            {notification.is_read ? "مقروء" : "غير مقروء"}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.is_read && (
                                <DropdownMenuItem 
                                  onClick={() => markAsRead(notification.id)}
                                  disabled={isMarkingAsRead}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  تمييز كمقروء
                                </DropdownMenuItem>
                              )}
                              
                              {notification.action_url && (
                                <DropdownMenuItem>
                                  <a 
                                    href={notification.action_url} 
                                    className="flex items-center"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    فتح الرابط
                                  </a>
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuSeparator />
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    حذف الإشعار
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      هل أنت متأكد من حذف هذا الإشعار؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteNotification(notification.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {!loadingNotifications && filteredNotifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد إشعارات للعرض
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                تفضيلات الإشعارات
              </CardTitle>
              <CardDescription>
                تخصيص كيفية وأوقات استلام الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingPreferences ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* General Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">الإعدادات العامة</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">إشعارات البريد الإلكتروني</div>
                          <div className="text-sm text-muted-foreground">استلام الإشعارات عبر البريد الإلكتروني</div>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.email_enabled || false}
                        onCheckedChange={(checked) => handlePreferenceChange('email_enabled', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">الإشعارات المباشرة</div>
                          <div className="text-sm text-muted-foreground">إشعارات مباشرة في المتصفح</div>
                        </div>
                      </div>
                      <Switch
                        checked={preferences?.push_enabled || false}
                        onCheckedChange={(checked) => handlePreferenceChange('push_enabled', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">أنواع الإشعارات</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">إشعارات النظام</div>
                        <div className="text-sm text-muted-foreground">تحديثات النظام والصيانة</div>
                      </div>
                      <Switch
                        checked={preferences?.system_notifications || false}
                        onCheckedChange={(checked) => handlePreferenceChange('system_notifications', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">إشعارات العقارات</div>
                        <div className="text-sm text-muted-foreground">تحديثات على العقارات والقوائم</div>
                      </div>
                      <Switch
                        checked={preferences?.property_notifications || false}
                        onCheckedChange={(checked) => handlePreferenceChange('property_notifications', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">إشعارات العملاء</div>
                        <div className="text-sm text-muted-foreground">رسائل واستفسارات العملاء</div>
                      </div>
                      <Switch
                        checked={preferences?.client_notifications || false}
                        onCheckedChange={(checked) => handlePreferenceChange('client_notifications', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">تذكيرات المهام</div>
                        <div className="text-sm text-muted-foreground">تذكيرات بالمهام والمتابعات</div>
                      </div>
                      <Switch
                        checked={preferences?.task_notifications || false}
                        onCheckedChange={(checked) => handlePreferenceChange('task_notifications', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">إشعارات المواعيد</div>
                        <div className="text-sm text-muted-foreground">تذكيرات بالمواعيد واللقاءات</div>
                      </div>
                      <Switch
                        checked={preferences?.appointment_notifications || false}
                        onCheckedChange={(checked) => handlePreferenceChange('appointment_notifications', checked)}
                        disabled={isUpdatingPreferences}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsManagement;