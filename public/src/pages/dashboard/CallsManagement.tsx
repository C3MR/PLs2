import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import {
  Phone,
  Clock,
  User,
  Calendar,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Filter,
  Plus,
  Edit,
  Star,
  MapPin,
  UserPlus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface ClientData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  callType: 'incoming' | 'outgoing';
  callDate: string;
  purpose: string;
  propertyType?: string;
  budget?: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'follow_up';
  notes: string;
  nextAction?: string;
  followUpDate?: string;
}

const CallsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [formData, setFormData] = useState<Partial<ClientData>>({
    callType: 'incoming',
    priority: 'medium',
    status: 'new',
    callDate: new Date().toISOString().slice(0, 16)
  });

  // Mock data للعملاء من المكالمات
  const [clients, setClients] = useState<ClientData[]>([
    {
      id: 'CL-001',
      name: 'أحمد محمد السالم',
      phone: '0551234567',
      email: 'ahmed@email.com',
      callType: 'incoming',
      callDate: '2024-03-20 14:30',
      purpose: 'البحث عن فيلا للشراء',
      propertyType: 'فيلا',
      budget: '2-3 مليون',
      location: 'العليا',
      priority: 'high',
      status: 'interested',
      notes: 'عميل جاد ومهتم بالفلل في العليا',
      nextAction: 'إرسال عروض الفلل المتاحة',
      followUpDate: '2024-03-22'
    },
    {
      id: 'CL-002',
      name: 'فاطمة علي الأحمد',
      phone: '0559876543',
      callType: 'outgoing',
      callDate: '2024-03-20 13:15',
      purpose: 'متابعة طلب تقييم العقار',
      propertyType: 'شقة',
      priority: 'medium',
      status: 'follow_up',
      notes: 'تم تحديد موعد التقييم يوم الخميس',
      followUpDate: '2024-03-25'
    },
    {
      id: 'CL-003',
      name: 'خالد عبدالله النصر',
      phone: '0555432198',
      callType: 'incoming',
      callDate: '2024-03-20 11:45',
      purpose: 'استفسار عن الأراضي الاستثمارية',
      propertyType: 'أرض',
      budget: '5+ مليون',
      priority: 'high',
      status: 'new',
      notes: 'مستثمر يبحث عن أراضي تجارية'
    }
  ]);

  const handleSaveClient = () => {
    if (!formData.name || !formData.phone || !formData.purpose) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const clientData: ClientData = {
      id: editingClient?.id || `CL-${Date.now()}`,
      name: formData.name!,
      phone: formData.phone!,
      email: formData.email,
      callType: formData.callType!,
      callDate: formData.callDate!,
      purpose: formData.purpose!,
      propertyType: formData.propertyType,
      budget: formData.budget,
      location: formData.location,
      priority: formData.priority!,
      status: formData.status!,
      notes: formData.notes || '',
      nextAction: formData.nextAction,
      followUpDate: formData.followUpDate
    };

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? clientData : c));
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات العميل بنجاح"
      });
    } else {
      setClients(prev => [clientData, ...prev]);
      toast({
        title: "تم الإضافة",
        description: "تم إضافة العميل الجديد بنجاح"
      });
    }

    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      callType: 'incoming',
      priority: 'medium',
      status: 'new',
      callDate: new Date().toISOString().slice(0, 16)
    });
  };

  const openEditDialog = (client: ClientData) => {
    setEditingClient(client);
    setFormData(client);
    setIsDialogOpen(true);
  };

  const getCallTypeIcon = (type: string) => {
    return type === 'incoming' 
      ? <PhoneIncoming className="h-4 w-4 text-green-500" />
      : <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: 'secondary' as const, label: 'جديد', color: 'text-blue-600' },
      contacted: { variant: 'default' as const, label: 'تم التواصل', color: 'text-gray-600' },
      interested: { variant: 'default' as const, label: 'مهتم', color: 'text-green-600' },
      not_interested: { variant: 'destructive' as const, label: 'غير مهتم', color: 'text-red-600' },
      follow_up: { variant: 'outline' as const, label: 'متابعة', color: 'text-orange-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Star className="h-4 w-4 text-red-500 fill-current" />;
      case 'medium':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const stats = {
    totalClients: clients.length,
    incomingCalls: clients.filter(c => c.callType === 'incoming').length,
    outgoingCalls: clients.filter(c => c.callType === 'outgoing').length,
    highPriority: clients.filter(c => c.priority === 'high').length,
    interestedClients: clients.filter(c => c.status === 'interested').length,
    followUpNeeded: clients.filter(c => c.status === 'follow_up').length
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة عملاء المكالمات</h1>
          <p className="text-muted-foreground">إدخال وإدارة بيانات العملاء من المكالمات الواردة والصادرة</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة عميل جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم العميل *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="اسم العميل"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="callType">نوع المكالمة *</Label>
                  <Select value={formData.callType} onValueChange={(value) => setFormData(prev => ({ ...prev, callType: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incoming">مكالمة واردة</SelectItem>
                      <SelectItem value="outgoing">مكالمة صادرة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="callDate">تاريخ ووقت المكالمة *</Label>
                  <Input
                    id="callDate"
                    type="datetime-local"
                    value={formData.callDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, callDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="purpose">غرض المكالمة *</Label>
                  <Input
                    id="purpose"
                    value={formData.purpose || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="مثال: البحث عن شقة للإيجار"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyType">نوع العقار</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شقة">شقة</SelectItem>
                      <SelectItem value="فيلا">فيلا</SelectItem>
                      <SelectItem value="أرض">أرض</SelectItem>
                      <SelectItem value="محل تجاري">محل تجاري</SelectItem>
                      <SelectItem value="مكتب">مكتب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">الميزانية</Label>
                  <Input
                    id="budget"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="مثال: 500,000 - 800,000"
                  />
                </div>
                <div>
                  <Label htmlFor="location">المنطقة المفضلة</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="مثال: العليا، الملقا"
                  />
                </div>
                <div>
                  <Label htmlFor="status">حالة العميل</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="contacted">تم التواصل</SelectItem>
                      <SelectItem value="interested">مهتم</SelectItem>
                      <SelectItem value="not_interested">غير مهتم</SelectItem>
                      <SelectItem value="follow_up">يحتاج متابعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">ملاحظات المكالمة</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="ملاحظات مهمة حول المكالمة..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="nextAction">الإجراء التالي</Label>
                  <Input
                    id="nextAction"
                    value={formData.nextAction || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextAction: e.target.value }))}
                    placeholder="مثال: إرسال عروض، تحديد موعد"
                  />
                </div>
                <div>
                  <Label htmlFor="followUpDate">تاريخ المتابعة</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveClient}>
                  {editingClient ? 'تحديث' : 'حفظ'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <UserPlus className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">{stats.totalClients}</p>
            <p className="text-xs text-blue-600">إجمالي العملاء</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <PhoneIncoming className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">{stats.incomingCalls}</p>
            <p className="text-xs text-green-600">مكالمات واردة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <PhoneOutgoing className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">{stats.outgoingCalls}</p>
            <p className="text-xs text-purple-600">مكالمات صادرة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-800">{stats.highPriority}</p>
            <p className="text-xs text-red-600">أولوية عالية</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-800">{stats.interestedClients}</p>
            <p className="text-xs text-emerald-600">عملاء مهتمون</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-800">{stats.followUpNeeded}</p>
            <p className="text-xs text-orange-600">يحتاج متابعة</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              قائمة عملاء المكالمات
            </CardTitle>
            <div className="flex gap-2">
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
                  <th className="text-right p-3 font-medium text-muted-foreground">العميل</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الهاتف</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">نوع المكالمة</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الغرض</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">نوع العقار</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الأولوية</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">تاريخ المكالمة</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{client.name}</p>
                          {client.email && <p className="text-xs text-muted-foreground">{client.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">{client.phone}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getCallTypeIcon(client.callType)}
                        <span className="text-sm">
                          {client.callType === 'incoming' ? 'واردة' : 'صادرة'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm max-w-[200px] truncate" title={client.purpose}>
                      {client.purpose}
                    </td>
                    <td className="p-3 text-sm">{client.propertyType || '-'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(client.priority)}
                        <span className="text-sm">
                          {client.priority === 'high' ? 'عالية' : 
                           client.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{getStatusBadge(client.status)}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(client.callDate).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(client)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallsManagement;