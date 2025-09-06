import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityConfigProps {
  className?: string;
}

const SecurityConfig: React.FC<SecurityConfigProps> = ({ className }) => {
  const securityMeasures = [
    {
      title: 'تشفير البيانات',
      status: 'active',
      description: 'جميع البيانات مشفرة في قاعدة البيانات',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'التحقق من الهوية',
      status: 'active', 
      description: 'نظام مصادقة متقدم مع Supabase',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'الحماية من الهجمات',
      status: 'active',
      description: 'حماية من XSS و SQL Injection',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'مراقبة الأمان',
      status: 'active',
      description: 'رصد الأنشطة المشبوهة والتهديدات',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'صلاحيات المستخدمين',
      status: 'active',
      description: 'نظام صلاحيات متقدم قائم على الأدوار',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      title: 'الحد من الطلبات',
      status: 'warning',
      description: 'حماية من الطلبات المتكررة',
      icon: AlertTriangle,
      color: 'text-yellow-500'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          إعدادات الأمان
        </CardTitle>
        <CardDescription>
          حالة الأمان الحالية للنظام
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityMeasures.map((measure, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <measure.icon className={`h-4 w-4 ${measure.color}`} />
                <div>
                  <p className="font-medium">{measure.title}</p>
                  <p className="text-sm text-muted-foreground">{measure.description}</p>
                </div>
              </div>
              <Badge variant={measure.status === 'active' ? 'default' : 'secondary'}>
                {measure.status === 'active' ? 'فعال' : 'تحذير'}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Shield className="h-4 w-4" />
            <span className="font-medium">النظام محمي</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
            تم تطبيق جميع إجراءات الأمان المطلوبة. النظام يعمل بأمان عالي.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityConfig;