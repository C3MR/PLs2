import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  FileText, 
  ArrowRight, 
  Star,
  TrendingUp,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

// Related content suggestions based on current page
interface RelatedLink {
  title: string;
  description: string;
  url: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  icon?: React.ComponentType<{ className?: string }>;
}

interface InternalLinkingSystemProps {
  currentPage: string;
  className?: string;
}

const getRelatedLinks = (currentPage: string): RelatedLink[] => {
  const linkDatabase: Record<string, RelatedLink[]> = {
    '/': [
      {
        title: 'تصفح العقارات المتاحة',
        description: 'اكتشف مجموعة واسعة من العقارات المميزة',
        url: '/properties',
        category: 'عقارات',
        priority: 'high',
        icon: Building
      },
      {
        title: 'طلب خدمة عقارية',
        description: 'احصل على استشارة مجانية من خبرائنا',
        url: '/property-request',
        category: 'خدمات',
        priority: 'high',
        icon: FileText
      },
      {
        title: 'بوابة العملاء',
        description: 'سجل دخولك لمتابعة طلباتك',
        url: '/client-portal',
        category: 'حساب',
        priority: 'medium',
        icon: Users
      }
    ],
    '/properties': [
      {
        title: 'طلب عقار مخصص',
        description: 'لم تجد ما تبحث عنه؟ أخبرنا بمتطلباتك',
        url: '/property-request',
        category: 'خدمات',
        priority: 'high',
        icon: FileText
      },
      {
        title: 'تسجيل دخول العملاء',
        description: 'احفظ العقارات المفضلة وتابع طلباتك',
        url: '/client-portal',
        category: 'حساب',
        priority: 'medium',
        icon: Users
      },
      {
        title: 'تواصل معنا',
        description: 'هل تحتاج مساعدة في اختيار العقار؟',
        url: '/#contact',
        category: 'دعم',
        priority: 'medium',
        icon: Phone
      }
    ],
    '/property-request': [
      {
        title: 'تصفح العقارات الحالية',
        description: 'ربما تجد ما تبحث عنه في قائمتنا الحالية',
        url: '/properties',
        category: 'عقارات',
        priority: 'high',
        icon: Building
      },
      {
        title: 'إنشاء حساب عميل',
        description: 'أنشئ حساباً لمتابعة طلبك بسهولة',
        url: '/client-portal',
        category: 'حساب',
        priority: 'medium',
        icon: Users
      },
      {
        title: 'معرفة المزيد عن خدماتنا',
        description: 'اكتشف جميع الخدمات العقارية التي نقدمها',
        url: '/#services',
        category: 'خدمات',
        priority: 'medium',
        icon: Star
      }
    ],
    '/client-portal': [
      {
        title: 'تصفح العقارات',
        description: 'استكشف العقارات المتاحة للبيع والإيجار',
        url: '/properties',
        category: 'عقارات',
        priority: 'high',
        icon: Building
      },
      {
        title: 'طلب خدمة جديدة',
        description: 'احصل على خدمة عقارية مخصصة',
        url: '/property-request',
        category: 'خدمات',
        priority: 'high',
        icon: FileText
      }
    ],
    '/dashboard': [
      {
        title: 'إدارة العقارات',
        description: 'أضف وعدل العقارات في النظام',
        url: '/dashboard/properties',
        category: 'إدارة',
        priority: 'high',
        icon: Building
      },
      {
        title: 'إدارة العملاء',
        description: 'تابع وأدر قاعدة بيانات العملاء',
        url: '/dashboard/clients',
        category: 'إدارة',
        priority: 'high',
        icon: Users
      },
      {
        title: 'إدارة الطلبات',
        description: 'تابع ورد على طلبات العملاء',
        url: '/dashboard/requests',
        category: 'إدارة',
        priority: 'high',
        icon: FileText
      },
      {
        title: 'التقارير والتحليلات',
        description: 'اطلع على إحصائيات الأداء',
        url: '/dashboard/analytics',
        category: 'تقارير',
        priority: 'medium',
        icon: TrendingUp
      }
    ]
  };

  return linkDatabase[currentPage] || [];
};

const InternalLinkingSystem: React.FC<InternalLinkingSystemProps> = ({ 
  currentPage, 
  className = '' 
}) => {
  const relatedLinks = getRelatedLinks(currentPage);

  if (relatedLinks.length === 0) {
    return null;
  }

  const highPriorityLinks = relatedLinks.filter(link => link.priority === 'high');
  const mediumPriorityLinks = relatedLinks.filter(link => link.priority === 'medium');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* High Priority Links */}
      {highPriorityLinks.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              مقترحات مهمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {highPriorityLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  to={link.url}
                  className="block p-4 bg-background/80 rounded-lg border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                  title={`انتقل إلى ${link.title}`}
                  aria-label={`رابط إلى ${link.title}: ${link.description}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {IconComponent && (
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {link.category}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Medium Priority Links */}
      {mediumPriorityLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">روابط ذات صلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mediumPriorityLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={index}
                    to={link.url}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group"
                    title={`انتقل إلى ${link.title}`}
                    aria-label={`رابط إلى ${link.title}: ${link.description}`}
                  >
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InternalLinkingSystem;