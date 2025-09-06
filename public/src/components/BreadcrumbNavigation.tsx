import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Home, Building, Users, FileText, BarChart3, Settings, Shield, HardDrive } from 'lucide-react';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  parent?: string;
}

const breadcrumbConfig: BreadcrumbConfig[] = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/properties', label: 'العقارات', icon: Building },
  { path: '/property-request', label: 'طلب خدمة', icon: FileText },
  { path: '/client-portal', label: 'بوابة العملاء', icon: Users },
  { path: '/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
  
  // Dashboard sub-pages
  { path: '/dashboard/properties', label: 'إدارة العقارات', icon: Building, parent: '/dashboard' },
  { path: '/dashboard/clients', label: 'إدارة العملاء', icon: Users, parent: '/dashboard' },
  { path: '/dashboard/requests', label: 'إدارة الطلبات', icon: FileText, parent: '/dashboard' },
  { path: '/dashboard/analytics', label: 'التقارير والتحليلات', icon: BarChart3, parent: '/dashboard' },
  { path: '/dashboard/reports', label: 'إدارة التقارير', icon: FileText, parent: '/dashboard' },
  { path: '/dashboard/map', label: 'خريطة العقارات', icon: Building, parent: '/dashboard' },
  { path: '/dashboard/appointments', label: 'جدولة المواعيد', icon: FileText, parent: '/dashboard' },
  { path: '/dashboard/messages', label: 'الرسائل', icon: FileText, parent: '/dashboard' },
  { path: '/dashboard/calls', label: 'إدارة المكالمات', icon: FileText, parent: '/dashboard' },
  { path: '/dashboard/roles', label: 'إدارة الأدوار', icon: Shield, parent: '/dashboard' },
  { path: '/dashboard/files', label: 'إدارة الملفات', icon: HardDrive, parent: '/dashboard' },
  { path: '/dashboard/users', label: 'إدارة المستخدمين', icon: Users, parent: '/dashboard' },
  { path: '/dashboard/notifications', label: 'إدارة الإشعارات', icon: FileText, parent: '/dashboard' },
  { path: '/dashboard/settings', label: 'الإعدادات', icon: Settings, parent: '/dashboard' },
];

const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const buildBreadcrumbs = (path: string): BreadcrumbConfig[] => {
    const breadcrumbs: BreadcrumbConfig[] = [];
    const current = breadcrumbConfig.find(config => config.path === path);
    
    if (!current) return breadcrumbs;

    // Build breadcrumb chain by following parent relationships
    let currentConfig = current;
    const chain: BreadcrumbConfig[] = [currentConfig];
    
    while (currentConfig.parent) {
      const parentConfig = breadcrumbConfig.find(config => config.path === currentConfig.parent);
      if (parentConfig) {
        chain.unshift(parentConfig);
        currentConfig = parentConfig;
      } else {
        break;
      }
    }

    // Always start with home if not already included
    if (chain[0]?.path !== '/') {
      const homeConfig = breadcrumbConfig.find(config => config.path === '/');
      if (homeConfig) {
        chain.unshift(homeConfig);
      }
    }

    return chain;
  };

  const breadcrumbs = buildBreadcrumbs(currentPath);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs for home page or unknown pages
  }

  return (
    <div className="bg-muted/30 border-b border-border/50 py-3">
      <div className="container mx-auto px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const IconComponent = breadcrumb.icon;

              return (
                <React.Fragment key={breadcrumb.path}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link 
                          to={breadcrumb.path}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          {breadcrumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;