import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  UserCheck,
  Search,
  Filter,
  Shield,
  Crown,
  Users,
  Building,
  Star,
  User,
  Loader2,
  Edit
} from 'lucide-react';
import useRoles from '@/hooks/useRoles';
import ProtectedComponent from '@/components/ProtectedComponent';
import RoleSelector from '@/components/RoleSelector';
import { ROLES, getRoleInfo, canManageRole, type AppRole, type UserWithRole } from '@/types/roles';

const RolesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<AppRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<AppRole>('employee');

  const { 
    userProfile,
    usersWithRoles = [],
    loadingUsers,
    updateUserRole,
    isUpdatingRole
  } = useRoles();

  const currentUserRole = userProfile?.role as AppRole;

  // Filter users based on search and role
  const filteredUsers = usersWithRoles.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get role statistics
  const roleStats = Object.keys(ROLES).reduce((acc, role) => {
    acc[role as AppRole] = usersWithRoles.filter(user => user.role === role).length;
    return acc;
  }, {} as Record<AppRole, number>);

  const handleRoleUpdate = () => {
    if (selectedUser && newRole) {
      updateUserRole({ userId: selectedUser.user_id, newRole });
      setSelectedUser(null);
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'manager': return <Building className="h-4 w-4" />;
      case 'agent': return <Star className="h-4 w-4" />;
      case 'employee': return <User className="h-4 w-4" />;
      case 'client': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loadingUsers) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedComponent requiredPermissions={['users:read', 'users:roles']} requireAll={false}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة الأدوار والصلاحيات</h1>
            <p className="text-muted-foreground">إدارة أدوار المستخدمين وصلاحياتهم في النظام</p>
          </div>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(ROLES).map(([roleKey, roleInfo]) => (
            <Card key={roleKey} className={`border-l-4 border-l-${roleInfo.color.replace('bg-', '')}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{roleInfo.name}</p>
                    <p className="text-2xl font-bold">{roleStats[roleKey as AppRole] || 0}</p>
                  </div>
                  <div className={`p-2 rounded-full ${roleInfo.color} text-white`}>
                    {getRoleIcon(roleKey as AppRole)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن المستخدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as AppRole | 'all')}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="تصفية حسب الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  {Object.entries(ROLES).map(([key, role]) => (
                    <SelectItem key={key} value={key}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              المستخدمون ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد مستخدمين مطابقين للبحث</p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const canManage = canManageRole(currentUserRole, user.role);
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'م'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h4 className="font-medium">{user.full_name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            انضم في {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <Badge className={`${roleInfo.color} text-white`}>
                            {roleInfo.name}
                          </Badge>
                        </div>

                        <ProtectedComponent requiredPermission="users:roles">
                          {canManage && user.user_id !== userProfile?.user_id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setNewRole(user.role);
                                  }}
                                  className="gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  تعديل الدور
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تعديل دور المستخدم</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    تعديل دور المستخدم "{user.full_name}"
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                
                                <div className="space-y-4">
                                  <div>
                                    <Label>الدور الجديد</Label>
                                     <RoleSelector
                                       value={newRole}
                                       onValueChange={(value) => setNewRole(value)}
                                       placeholder="اختر الدور الجديد"
                                     />
                                  </div>
                                </div>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleRoleUpdate}
                                    disabled={isUpdatingRole}
                                  >
                                    {isUpdatingRole ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        جاري التحديث...
                                      </>
                                    ) : (
                                      'تأكيد التعديل'
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </ProtectedComponent>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedComponent>
  );
};

export default RolesManagement;