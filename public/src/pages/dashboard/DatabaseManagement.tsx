import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Shield, RefreshCw, Download, Upload } from 'lucide-react';

const DatabaseManagement = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-right">إدارة قاعدة البيانات</h1>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          متصل
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة قاعدة البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">طبيعي</div>
            <p className="text-xs text-muted-foreground">
              آخر فحص: منذ 5 دقائق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجم البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245 MB</div>
            <p className="text-xs text-muted-foreground">
              85% من المساحة المتاحة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النسخ الاحتياطية</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">يومي</div>
            <p className="text-xs text-muted-foreground">
              آخر نسخة: اليوم 03:00
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              عمليات الصيانة
            </CardTitle>
            <CardDescription className="text-right">
              أدوات الصيانة والتحسين
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-between">
              تحسين الأداء
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              تنظيف البيانات المؤقتة
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              فحص التكامل
              <Shield className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Download className="h-5 w-5" />
              النسخ الاحتياطية
            </CardTitle>
            <CardDescription className="text-right">
              إدارة النسخ الاحتياطية والاستعادة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between">
              إنشاء نسخة احتياطية
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              استعادة من نسخة احتياطية
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              جدولة النسخ الاحتياطية
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseManagement;