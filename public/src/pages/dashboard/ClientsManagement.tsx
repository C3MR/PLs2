import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Users,
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
  Star,
  MessageCircle,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  Loader2
} from 'lucide-react';
import { useClients, useDeleteClient, type Client } from '@/hooks/useClients';
import AddClientModal from '@/components/modals/AddClientModal';
import ProtectedComponent from '@/components/ProtectedComponent';

const ClientsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: clients = [], isLoading: loading } = useClients();
  const deleteClientMutation = useDeleteClient();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">نشط</Badge>;
      case 'potential':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">محتمل</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-muted-foreground">غير نشط</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'individual':
        return <Badge variant="outline" className="text-xs">فرد</Badge>;
      case 'company':
        return <Badge variant="default" className="bg-purple-100 text-purple-800 text-xs">شركة</Badge>;
      case 'investor':
        return <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">مستثمر</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">غير محدد</Badge>;
    }
  };

  const getClientStats = () => {
    const stats = {
      total: clients.length,
      active: clients.filter(c => c.is_active).length,
      potential: 0, // Not available in current schema
      inactive: clients.filter(c => !c.is_active).length,
      totalValue: 0, // Not available in current schema
      avgRating: 0 // Not available in current schema
    };
    return stats;
  };

  const stats = getClientStats();

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && client.is_active) ||
                         (statusFilter === 'inactive' && !client.is_active);
    // Type filter not implemented in current schema
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const handleDeleteClient = async (clientId: string) => {
    deleteClientMutation.mutate(clientId);
  };

  const handleExportClients = () => {
    const csvContent = [
      ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'الحالة', 'تاريخ التسجيل'].join(','),
      ...filteredClients.map(client => [
        client.full_name,
        client.email,
        client.phone,
        client.is_active ? 'نشط' : 'غير نشط',
        new Date(client.created_at).toLocaleDateString('ar-SA')
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clients.csv';
    link.click();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات العملاء...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedComponent requiredPermission="clients:read">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة العملاء</h1>
          <p className="text-muted-foreground">إدارة شاملة لقاعدة بيانات العملاء</p>
        </div>
        <div className="flex gap-3">
          <ProtectedComponent requiredPermission="clients:export">
            <Button variant="outline" className="gap-2" onClick={handleExportClients}>
            <Download className="h-4 w-4" />
            تصدير قائمة العملاء
            </Button>
          </ProtectedComponent>
          <ProtectedComponent requiredPermission="clients:create">
            <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-4 w-4" />
              عميل جديد
            </Button>
          </ProtectedComponent>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي العملاء</p>
                <p className="text-3xl font-bold text-blue-800">{stats.total}</p>
                <p className="text-sm text-muted-foreground">العملاء المسجلين</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">عملاء نشطون</p>
                <p className="text-3xl font-bold text-green-800">{stats.active}</p>
                <p className="text-sm text-muted-foreground">يتفاعلون حالياً</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">إجمالي القيم</p>
                <p className="text-2xl font-bold text-purple-800">{(stats.totalValue / 1000000).toFixed(1)}م ر.س</p>
                <p className="text-sm text-muted-foreground">قيمة الصفقات</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Building className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">متوسط التقييم</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-orange-800">{stats.avgRating.toFixed(1)}</p>
                  <Star className="h-5 w-5 text-orange-500 fill-current" />
                </div>
                <p className="text-sm text-muted-foreground">رضا العملاء</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Star className="h-6 w-6 text-white" />
              </div>
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
                  placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم العميل..."
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
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="potential">محتمل</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="individual">فرد</SelectItem>
                <SelectItem value="company">شركة</SelectItem>
                <SelectItem value="investor">مستثمر</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              مرشحات متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            قائمة العملاء ({filteredClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4 font-medium text-muted-foreground">العميل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">التواصل</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">النوع</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الطلبات</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الصفقات</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">القيمة الإجمالية</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">التقييم</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">آخر نشاط</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {client.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{client.full_name}</p>
                          <p className="text-sm text-muted-foreground font-mono">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">{client.role}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={client.is_active ? "default" : "outline"} 
                             className={client.is_active ? "bg-green-100 text-green-800" : ""}>
                        {client.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="text-xs">0</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">0</Badge>
                    </td>
                    <td className="p-4 font-medium">-</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                        <span className="text-sm font-medium">-</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {client.last_login ? formatDate(client.last_login) : formatDate(client.created_at)}
                    </td>
                    <td className="p-4">
                       <div className="flex gap-1">
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <Eye className="h-3 w-3" />
                         </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                                هل أنت متأكد من حذف العميل "{client.full_name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteClient(client.id)}
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
          
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">لا يوجد عملاء</p>
              <p className="text-sm text-muted-foreground">لا يوجد عملاء يطابقون المعايير المحددة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      <AddClientModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClientAdded={() => {}} // Refresh will happen automatically via React Query
      />
      </div>
    </ProtectedComponent>
  );
};

export default ClientsManagement;