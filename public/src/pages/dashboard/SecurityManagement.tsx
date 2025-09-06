import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

const SecurityManagement = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-right">الأمان والصلاحيات</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          محمي
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة الأمان</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">ممتاز</div>
            <p className="text-xs text-muted-foreground">
              جميع الفحوصات ناجحة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المحاولات المشبوهة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              خلال آخر 24 ساعة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الجلسات النشطة</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              مستخدم متصل حالياً
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر تحديث أمني</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">اليوم</div>
            <p className="text-xs text-muted-foreground">
              محدث بأحدث الإصلاحات
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إعدادات الأمان
            </CardTitle>
            <CardDescription className="text-right">
              تكوين سياسات الأمان والحماية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-between">
              إدارة كلمات المرور
              <Lock className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              المصادقة الثنائية
              <Shield className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              سجل الأنشطة
              <Eye className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              التنبيهات الأمنية
            </CardTitle>
            <CardDescription className="text-right">
              مراقبة التهديدات والتنبيهات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">محاولة دخول مشبوهة</span>
              <Badge variant="destructive">عالي</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">نشاط غير اعتيادي</span>
              <Badge variant="secondary">متوسط</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">تحديث أمني متاح</span>
              <Badge variant="outline">منخفض</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityManagement;