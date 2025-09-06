import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Building, 
  Users, 
  FileText,
  BarChart3,
  Settings,
  ChevronUp
} from 'lucide-react';

interface NavigationItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface SmartNavigationProps {
  className?: string;
}

const SmartNavigation: React.FC<SmartNavigationProps> = ({ className = '' }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define navigation hierarchy
  const navigationHierarchy: Record<string, NavigationItem[]> = {
    '/': [
      { title: 'العقارات', url: '/properties', icon: Building, description: 'تصفح جميع العقارات' },
      { title: 'طلب خدمة', url: '/property-request', icon: FileText, description: 'احصل على خدمة عقارية' },
      { title: 'بوابة العملاء', url: '/client-portal', icon: Users, description: 'دخول العملاء' }
    ],
    '/properties': [
      { title: 'الرئيسية', url: '/', icon: Home, description: 'العودة للصفحة الرئيسية' },
      { title: 'طلب عقار مخصص', url: '/property-request', icon: FileText, description: 'طلب عقار حسب المواصفات' }
    ],
    '/property-request': [
      { title: 'العقارات المتاحة', url: '/properties', icon: Building, description: 'تصفح العقارات الحالية' },
      { title: 'بوابة العملاء', url: '/client-portal', icon: Users, description: 'تسجيل دخول العملاء' }
    ],
    '/dashboard': [
      { title: 'إدارة العقارات', url: '/dashboard/properties', icon: Building, description: 'إدارة قاعدة العقارات' },
      { title: 'إدارة العملاء', url: '/dashboard/clients', icon: Users, description: 'إدارة قاعدة العملاء' },
      { title: 'إدارة الطلبات', url: '/dashboard/requests', icon: FileText, description: 'متابعة طلبات العملاء' },
      { title: 'التحليلات', url: '/dashboard/analytics', icon: BarChart3, description: 'تقارير الأداء' }
    ]
  };

  // Get next/previous pages for sequential navigation
  const getSequentialNavigation = () => {
    const dashboardPages = [
      '/dashboard',
      '/dashboard/requests',
      '/dashboard/clients', 
      '/dashboard/properties',
      '/dashboard/analytics',
      '/dashboard/reports'
    ];

    const publicPages = [
      '/',
      '/properties',
      '/property-request',
      '/client-portal'
    ];

    let pages = publicPages;
    if (currentPath.startsWith('/dashboard')) {
      pages = dashboardPages;
    }

    const currentIndex = pages.indexOf(currentPath);
    if (currentIndex === -1) return null;

    return {
      previous: currentIndex > 0 ? pages[currentIndex - 1] : null,
      next: currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null
    };
  };

  const sequential = getSequentialNavigation();
  const suggestions = navigationHierarchy[currentPath] || [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sequential Navigation */}
      {sequential && (sequential.previous || sequential.next) && (
        <div className="flex justify-between items-center">
          {sequential.previous ? (
            <Link to={sequential.previous}>
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                الصفحة السابقة
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
          
          {sequential.next && (
            <Link to={sequential.next}>
              <Button variant="outline" className="gap-2">
                الصفحة التالية
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Quick Navigation Suggestions */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.url}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                title={`انتقل إلى ${item.title}`}
                aria-label={`${item.title}${item.description ? `: ${item.description}` : ''}`}
              >
                {IconComponent && (
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Back to Top */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollToTop}
          className="gap-2 text-muted-foreground hover:text-primary"
        >
          <ChevronUp className="h-4 w-4" />
          العودة للأعلى
        </Button>
      </div>
    </div>
  );
};

export default SmartNavigation;