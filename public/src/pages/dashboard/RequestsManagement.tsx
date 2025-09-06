import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { usePropertyRequests, type PropertyRequest } from '@/hooks/usePropertyRequests';
import UpdateRequestStatusModal from '@/components/modals/UpdateRequestStatusModal';

const RequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PropertyRequest | null>(null);
  
  const { requests, loading, fetchRequests, deleteRequest, exportRequests } = usePropertyRequests();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="h-3 w-3" />
            معلق
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 gap-1">
            <AlertCircle className="h-3 w-3" />
            قيد المعالجة
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            مكتمل
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            ملغي
          </Badge>
        );
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      in_progress: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getStatusStats();

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.property_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.property_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatBudget = (request: PropertyRequest) => {
    if (request.specific_budget) {
      return `${(request.specific_budget / 1000000).toFixed(1)}م ر.س`;
    }
    if (request.price_option) {
      return request.price_option;
    }
    return 'غير محدد';
  };

  const handleDeleteRequest = async (requestId: string) => {
    await deleteRequest(requestId);
  };

  const handleEditRequest = (request: PropertyRequest) => {
    setSelectedRequest(request);
    setIsUpdateModalOpen(true);
  };

  const handleStatusUpdated = () => {
    fetchRequests();
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة الطلبات</h1>
          <p className="text-muted-foreground">إدارة شاملة لجميع طلبات العقارات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => fetchRequests()}>
            <RefreshCw className="h-4 w-4" />
            تحديث
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportRequests}>
            <Download className="h-4 w-4" />
            تصدير Excel
          </Button>
          <Button className="gap-2" onClick={() => window.open('/property-request', '_blank')}>
            <Plus className="h-4 w-4" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">معلقة</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">قيد المعالجة</p>
                <p className="text-2xl font-bold text-blue-800">{stats.in_progress}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">مكتملة</p>
                <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">ملغية</p>
                <p className="text-2xl font-bold text-red-800">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالاسم، رقم الطلب، أو نوع العقار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="سكني">سكني</SelectItem>
                <SelectItem value="تجاري">تجاري</SelectItem>
                <SelectItem value="أرض">أرض</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              مرشحات متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            قائمة الطلبات ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4 font-medium text-muted-foreground">رقم الطلب</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">التواصل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">العقار</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الغرض</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الموقع</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الميزانية</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">المسؤول</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-mono text-sm font-medium">{request.request_id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{request.full_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(`tel:${request.phone}`)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(`mailto:${request.email}`)}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="block">{request.property_type}</span>
                          <span className="text-xs text-muted-foreground">{request.specific_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {request.purpose}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {request.preferred_districts.slice(0, 2).join(', ')}
                          {request.preferred_districts.length > 2 && '...'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{formatBudget(request)}</td>
                    <td className="p-4">{getStatusBadge(request.status)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{request.assigned_to || 'غير مُعيَّن'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(request.created_at)}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditRequest(request)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف الطلب "{request.request_id}"؟ هذا الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteRequest(request.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">لا توجد طلبات</p>
              <p className="text-sm text-muted-foreground">لا توجد طلبات تطابق المعايير المحددة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Request Status Modal */}
      {selectedRequest && (
        <UpdateRequestStatusModal 
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedRequest(null);
          }}
          onStatusUpdated={handleStatusUpdated}
          requestId={selectedRequest.id}
          currentStatus={selectedRequest.status}
          requestTitle={`${selectedRequest.request_id} - ${selectedRequest.full_name}`}
        />
      )}
    </div>
  );
};

export default RequestsManagement;