import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import RoleSelector from '@/components/RoleSelector';
import ProtectedComponent from '@/components/ProtectedComponent';
import { useUserManagement } from '@/hooks/useUserManagement';
import { ROLES, type AppRole, type UserWithRole } from '@/types/roles';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Ban, 
  Check,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const UsersManagement = () => {
  const {
    users,
    userStats,
    selectedUsers,
    loadingUsers,
    isUpdatingRole,
    isTogglingStatus,
    isBulkUpdating,
    isDeleting,
    updateUserRole,
    toggleUserStatus,
    bulkUpdateUsers,
    deleteUser,
    setSelectedUsers,
    selectUser,
    selectAllUsers,
    clearSelection
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<AppRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter users based on search and filters
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const handleRoleChange = (userId: string, newRole: AppRole) => {
    updateUserRole({ userId, newRole });
  };

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    toggleUserStatus({ userId, isActive: !currentStatus });
  };

  const handleBulkRoleUpdate = (newRole: AppRole) => {
    if (selectedUsers.length > 0) {
      bulkUpdateUsers({ userIds: selectedUsers, updates: { role: newRole } });
    }
  };

  const handleBulkStatusUpdate = (isActive: boolean) => {
    if (selectedUsers.length > 0) {
      bulkUpdateUsers({ userIds: selectedUsers, updates: { is_active: isActive } });
    }
  };

  const getRoleInfo = (role: AppRole) => ROLES[role];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground mt-2">
            إدارة المستخدمين والأدوار والصلاحيات
          </p>
        </div>
        
        <ProtectedComponent requiredPermission="users:create">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            إضافة مستخدم جديد
          </Button>
        </ProtectedComponent>
      </div>

      {/* Statistics Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمين النشطين</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userStats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التسجيلات الأخيرة</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userStats.recentRegistrations}</div>
              <p className="text-xs text-muted-foreground">خلال 7 أيام</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المديرين</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {userStats.roleDistribution.admin + userStats.roleDistribution.super_admin}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث عن المستخدمين..."
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
                  <DropdownMenuLabel>تصفية حسب الدور</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter('all')}>
                    جميع الأدوار
                  </DropdownMenuItem>
                  {Object.values(ROLES).map(roleInfo => (
                    <DropdownMenuItem 
                      key={roleInfo.role}
                      onClick={() => setRoleFilter(roleInfo.role)}
                    >
                      {roleInfo.name}
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    جميع الحالات
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                    نشط
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                    غير نشط
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      إجراءات مجمعة ({selectedUsers.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>تحديث الدور</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.values(ROLES).map(roleInfo => (
                      <DropdownMenuItem 
                        key={roleInfo.role}
                        onClick={() => handleBulkRoleUpdate(roleInfo.role)}
                      >
                        {roleInfo.name}
                      </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate(true)}>
                      تفعيل المحدد
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate(false)}>
                      إلغاء تفعيل المحدد
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearSelection}
                >
                  إلغاء التحديد
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllUsers();
                        } else {
                          clearSelection();
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>آخر نشاط</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedUsers.includes(user.user_id!)}
                        onCheckedChange={() => selectUser(user.user_id!)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback>
                            {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                          {user.employee_id && (
                            <div className="text-xs text-muted-foreground">
                              ID: {user.employee_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <ProtectedComponent 
                        requiredPermission="users:update"
                        fallback={
                          <Badge className={getRoleInfo(user.role!).color}>
                            {getRoleInfo(user.role!).name}
                          </Badge>
                        }
                      >
                        <RoleSelector
                          value={user.role}
                          onValueChange={(newRole) => handleRoleChange(user.user_id!, newRole)}
                          disabled={isUpdatingRole}
                          showBadge={false}
                          className="w-40"
                        />
                      </ProtectedComponent>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ar })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {user.last_login 
                          ? format(new Date(user.last_login), 'dd/MM/yyyy', { locale: ar })
                          : 'لم يسجل دخول'
                        }
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            عرض التفاصيل
                          </DropdownMenuItem>
                          
                          <ProtectedComponent requiredPermission="users:update">
                            <DropdownMenuItem 
                              onClick={() => handleStatusToggle(user.user_id!, user.is_active!)}
                              disabled={isTogglingStatus}
                            >
                              {user.is_active ? (
                                <>
                                  <Ban className="h-4 w-4 mr-2" />
                                  إلغاء التفعيل
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  تفعيل
                                </>
                              )}
                            </DropdownMenuItem>
                          </ProtectedComponent>
                          
                          <DropdownMenuSeparator />
                          
                          <ProtectedComponent requiredPermission="users:delete">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  حذف المستخدم
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا المستخدم؟ سيتم إلغاء تفعيل الحساب نهائياً.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteUser(user.user_id!)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </ProtectedComponent>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loadingUsers && filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد نتائج للبحث الحالي
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;