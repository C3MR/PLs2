import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, Phone, MessageSquare, Book, Video } from 'lucide-react';

const Help = () => {
  const faqItems = [
    {
      question: "كيف يمكنني إضافة عقار جديد؟",
      answer: "يمكنك إضافة عقار جديد من خلال قسم 'قاعدة العقارات' ثم النقر على زر 'إضافة عقار جديد'. تأكد من ملء جميع المعلومات المطلوبة."
    },
    {
      question: "كيف أدير صلاحيات المستخدمين؟",
      answer: "يتم إدارة الصلاحيات من قسم 'إدارة الأدوار' حيث يمكنك تعيين أدوار مختلفة للمستخدمين وتحديد الصلاحيات لكل دور."
    },
    {
      question: "كيف يمكنني عمل نسخة احتياطية من البيانات؟",
      answer: "يمكنك عمل نسخة احتياطية من قسم 'قاعدة البيانات' حيث تجد أدوات النسخ الاحتياطي والاستعادة."
    },
    {
      question: "كيف أتابع طلبات العملاء؟",
      answer: "يمكنك متابعة جميع طلبات العملاء من قسم 'إدارة الطلبات' حيث يمكنك رؤية حالة كل طلب والرد عليه."
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-right">مركز المساعدة</h1>
        <HelpCircle className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Book className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>دليل المستخدم</CardTitle>
            <CardDescription>
              دليل شامل لاستخدام جميع ميزات النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              عرض الدليل
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Video className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>شروحات فيديو</CardTitle>
            <CardDescription>
              مقاطع فيديو تعليمية لكيفية استخدام النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              مشاهدة الفيديوهات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-primary" />
            <CardTitle>الدعم المباشر</CardTitle>
            <CardDescription>
              تواصل مع فريق الدعم الفني مباشرة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              بدء محادثة
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">الأسئلة الشائعة</CardTitle>
            <CardDescription className="text-right">
              إجابات للأسئلة الأكثر شيوعاً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-right">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right">تواصل معنا</CardTitle>
            <CardDescription className="text-right">
              أرسل استفسارك وسيتم الرد عليك قريباً
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">الموضوع</label>
              <Input placeholder="اكتب موضوع الاستفسار" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الرسالة</label>
              <Textarea placeholder="اكتب استفسارك بالتفصيل" rows={4} />
            </div>
            <Button className="w-full">
              إرسال الاستفسار
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">معلومات الاتصال</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <div className="text-right">
                <p className="font-medium">الهاتف</p>
                <p className="text-sm text-muted-foreground">+966 11 234 5678</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div className="text-right">
                <p className="font-medium">البريد الإلكتروني</p>
                <p className="text-sm text-muted-foreground">support@avaz.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="text-right">
                <p className="font-medium">ساعات العمل</p>
                <p className="text-sm text-muted-foreground">الأحد - الخميس: 9:00 - 17:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;