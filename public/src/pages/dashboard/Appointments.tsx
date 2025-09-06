import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  Users,
  CalendarDays
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const { toast } = useToast();

  // Mock data للمواعيد
  const appointments = [
    {
      id: 'APT-001',
      clientName: 'أحمد محمد السالم',
      clientPhone: '0551234567',
      propertyTitle: 'فيلا فاخرة في حي العليا',
      propertyLocation: 'العليا، الرياض',
      appointmentDate: '2024-03-20',
      appointmentTime: '10:00',
      duration: '30 دقيقة',
      type: 'viewing',
      status: 'confirmed',
      agent: 'سارة أحمد',
      notes: 'العميل مهتم بالحديقة والمسبح'
    },
    {
      id: 'APT-002',
      clientName: 'فاطمة علي الأحمد',
      clientPhone: '0559876543',
      propertyTitle: 'شقة عائلية في الملقا',
      propertyLocation: 'الملقا، الرياض',
      appointmentDate: '2024-03-20',
      appointmentTime: '14:00',
      duration: '45 دقيقة',
      type: 'consultation',
      status: 'pending',
      agent: 'محمد خالد',
      notes: 'استشارة حول التمويل العقاري'
    },
    {
      id: 'APT-003',
      clientName: 'خالد عبدالله النصر',
      clientPhone: '0555432198',
      propertyTitle: 'أرض تجارية في الورود',
      propertyLocation: 'الورود، الرياض',
      appointmentDate: '2024-03-21',
      appointmentTime: '11:30',
      duration: '60 دقيقة',
      type: 'virtual',
      status: 'confirmed',
      agent: 'علي محمد',
      notes: 'جولة افتراضية مع المهندس المعماري'
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const appointmentTypes = [
    { value: 'viewing', label: 'معاينة عقار', icon: Eye },
    { value: 'consultation', label: 'استشارة', icon: Users },
    { value: 'virtual', label: 'جولة افتراضية', icon: Video },
    { value: 'meeting', label: 'اجتماع', icon: CalendarDays }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800 gap-1">
          <CheckCircle className="h-3 w-3" />
          مؤكد
        </Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1">
          <Clock className="h-3 w-3" />
          في الانتظار
        </Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          ملغي
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 gap-1">
          <CheckCircle className="h-3 w-3" />
          مكتمل
        </Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = appointmentTypes.find(t => t.value === type);
    if (typeObj) {
      const IconComponent = typeObj.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <Calendar className="h-4 w-4" />;
  };

  const getTypeLabel = (type: string) => {
    const typeObj = appointmentTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const handleCreateAppointment = () => {
    toast({
      title: "✅ تم حجز الموعد بنجاح",
      description: "سيتم إرسال تذكير للعميل قبل الموعد",
    });
    setShowNewAppointment(false);
  };

  const todayAppointments = appointments.filter(apt => apt.appointmentDate === '2024-03-20');
  const upcomingAppointments = appointments.filter(apt => apt.appointmentDate > '2024-03-20');

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-right">جدولة المواعيد</h1>
          <p className="text-muted-foreground">إدارة مواعيد معاينة العقارات والاستشارات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية المواعيد
          </Button>
          <Button onClick={() => setShowNewAppointment(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            موعد جديد
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">{todayAppointments.length}</p>
            <p className="text-sm text-blue-600">مواعيد اليوم</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">{appointments.filter(a => a.status === 'confirmed').length}</p>
            <p className="text-sm text-green-600">مؤكدة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-800">{appointments.filter(a => a.status === 'pending').length}</p>
            <p className="text-sm text-yellow-600">في الانتظار</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <CalendarDays className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">{upcomingAppointments.length}</p>
            <p className="text-sm text-purple-600">قادمة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                مواعيد اليوم - 20 مارس 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getTypeIcon(appointment.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{appointment.clientName}</h4>
                          <p className="text-sm text-muted-foreground">{getTypeLabel(appointment.type)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{appointment.appointmentTime}</p>
                        <p className="text-xs text-muted-foreground">{appointment.duration}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span>{appointment.propertyTitle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{appointment.propertyLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>المسؤول: {appointment.agent}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {getStatusBadge(appointment.status)}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>ملاحظات:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                المواعيد القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{appointment.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{appointment.clientName}</p>
                        <p className="text-xs text-muted-foreground">{appointment.propertyTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{appointment.appointmentDate}</p>
                      <p className="text-xs text-muted-foreground">{appointment.appointmentTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Calendar */}
        <div className="space-y-6">
          {/* New Appointment Form */}
          {showNewAppointment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">موعد جديد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم العميل</label>
                  <Input placeholder="أدخل اسم العميل" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع الموعد</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الموعد" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">التاريخ</label>
                    <Input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الوقت</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="الوقت" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ملاحظات</label>
                  <Textarea placeholder="أي ملاحظات خاصة..." rows={3} />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateAppointment} className="flex-1">
                    حجز الموعد
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewAppointment(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">هذا الأسبوع</span>
                  <span className="font-bold">12 موعد</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">الشهر القادم</span>
                  <span className="font-bold">45 موعد</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">معدل الحضور</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">متوسط المدة</span>
                  <span className="font-bold">42 دقيقة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الأوقات المتاحة اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.slice(0, 8).map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;