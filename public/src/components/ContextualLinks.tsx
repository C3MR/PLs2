import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building, Users, FileText, Phone, Mail, MapPin } from 'lucide-react';

interface ContextualLink {
  title: string;
  url: string;
  description?: string;
  category?: string;
  external?: boolean;
}

interface ContextualLinksProps {
  context: 'property-detail' | 'client-portal' | 'contact-form' | 'dashboard';
  entityId?: string;
  className?: string;
}

const ContextualLinks: React.FC<ContextualLinksProps> = ({ 
  context, 
  entityId, 
  className = '' 
}) => {
  const getContextualLinks = (): ContextualLink[] => {
    switch (context) {
      case 'property-detail':
        return [
          {
            title: 'عقارات مشابهة',
            url: '/properties?similar=true',
            description: 'اكتشف عقارات مشابهة في نفس المنطقة',
            category: 'عقارات'
          },
          {
            title: 'طلب معاينة',
            url: '/property-request',
            description: 'احجز موعد لمعاينة هذا العقار',
            category: 'خدمات'
          },
          {
            title: 'تواصل مع المسوق',
            url: '/#contact',
            description: 'تحدث مع مسوق عقاري متخصص',
            category: 'دعم'
          },
          {
            title: 'حاسبة التمويل',
            url: '/financing-calculator',
            description: 'احسب قسط التمويل العقاري',
            category: 'أدوات'
          }
        ];

      case 'client-portal':
        return [
          {
            title: 'تصفح العقارات الجديدة',
            url: '/properties?sort=newest',
            description: 'اطلع على أحدث العقارات المضافة',
            category: 'عقارات'
          },
          {
            title: 'طلب خدمة جديدة',
            url: '/property-request',
            description: 'احصل على خدمة عقارية مخصصة',
            category: 'خدمات'
          },
          {
            title: 'مركز المساعدة',
            url: '/help-center',
            description: 'أسئلة شائعة ودليل الاستخدام',
            category: 'دعم'
          }
        ];

      case 'contact-form':
        return [
          {
            title: 'تصفح العقارات',
            url: '/properties',
            description: 'ربما تجد ما تبحث عنه في قائمتنا',
            category: 'عقارات'
          },
          {
            title: 'خدماتنا العقارية',
            url: '/#services',
            description: 'تعرف على جميع خدماتنا المتاحة',
            category: 'خدمات'
          },
          {
            title: 'من نحن',
            url: '/#about',
            description: 'تعرف على شركة أفاز العقارية',
            category: 'معلومات'
          }
        ];

      case 'dashboard':
        return [
          {
            title: 'إضافة عقار جديد',
            url: '/dashboard/properties',
            description: 'أضف عقار جديد إلى النظام',
            category: 'إدارة'
          },
          {
            title: 'متابعة الطلبات',
            url: '/dashboard/requests',
            description: 'راجع وتابع طلبات العملاء',
            category: 'إدارة'
          },
          {
            title: 'عرض التقارير',
            url: '/dashboard/analytics',
            description: 'اطلع على تقارير الأداء',
            category: 'تحليلات'
          }
        ];

      default:
        return [];
    }
  };

  const links = getContextualLinks();

  if (links.length === 0) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">قد يهمك أيضاً</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
              title={`انتقل إلى ${link.title}`}
              aria-label={`${link.title}${link.description ? `: ${link.description}` : ''}`}
            >
              <div className="flex-1">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {link.title}
                </h4>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {link.description}
                  </p>
                )}
                {link.category && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {link.category}
                  </Badge>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextualLinks;