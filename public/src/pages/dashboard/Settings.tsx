import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bell, Globe, Palette, Database } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-right">الإعدادات</h1>
        <SettingsIcon className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات الإشعارات
            </CardTitle>
            <CardDescription className="text-right">
              تحكم في الإشعارات والتنبيهات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-right">
                تفعيل الإشعارات
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-right">
                إشعارات البريد الإلكتروني
              </Label>
              <Switch
                id="email-notifications"
                defaultChecked={true}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-right">
                الإشعارات الفورية
              </Label>
              <Switch
                id="push-notifications"
                defaultChecked={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Palette className="h-5 w-5" />
              المظهر والواجهة
            </CardTitle>
            <CardDescription className="text-right">
              تخصيص مظهر النظام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-right">
                الوضع المظلم
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-right">اللغة</Label>
              <select className="w-full p-2 border rounded-md" defaultValue="ar">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Database className="h-5 w-5" />
              إعدادات النظام
            </CardTitle>
            <CardDescription className="text-right">
              إعدادات عامة للنظام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup" className="text-right">
                النسخ الاحتياطي التلقائي
              </Label>
              <Switch
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency" className="text-right">تكرار النسخ الاحتياطي</Label>
              <select className="w-full p-2 border rounded-md" defaultValue="daily">
                <option value="hourly">كل ساعة</option>
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Globe className="h-5 w-5" />
              إعدادات الشركة
            </CardTitle>
            <CardDescription className="text-right">
              معلومات الشركة والتواصل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">اسم الشركة</Label>
              <Input id="company-name" defaultValue="أفاز العقارية" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">رقم الهاتف</Label>
              <Input id="company-phone" defaultValue="+966 11 234 5678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">البريد الإلكتروني</Label>
              <Input id="company-email" defaultValue="info@avaz.com" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      
      <div className="flex justify-end gap-4">
        <Button variant="outline">إلغاء</Button>
        <Button>حفظ التغييرات</Button>
      </div>
    </div>
  );
};

export default Settings;