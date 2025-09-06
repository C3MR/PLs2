import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building,
  BarChart3,
  Settings,
  MapPin,
  Calendar,
  Bell,
  HelpCircle,
  LogOut,
  Home,
  UserCog,
  Target,
  TrendingUp,
  Database,
  Shield,
  Mail,
  Phone,
  HardDrive,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import avazLogoCompact from '/lovable-uploads/520083f6-203f-4800-a8ef-af619a9befb4.png';

const mainMenuItems = [
  {
    title: 'لوحة التحكم',
    url: '/dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: 'إدارة الطلبات',
    url: '/dashboard/requests',
    icon: FileText,
    badge: '32'
  },
  {
    title: 'إدارة العملاء',
    url: '/dashboard/clients',
    icon: Users,
    badge: null
  },
  {
    title: 'قاعدة العقارات',
    url: '/dashboard/properties',
    icon: Building,
    badge: null
  },
  {
    title: 'التقارير والتحليلات',
    url: '/dashboard/analytics',
    icon: BarChart3,
    badge: null
  },
  {
    title: 'إدارة التقارير',
    url: '/dashboard/reports',
    icon: FileText,
    badge: null
  },
  {
    title: 'نظام CRM',
    url: '/dashboard/crm',
    icon: Target,
    badge: null
  }
];

const managementItems = [
  {
    title: 'خريطة العقارات',
    url: '/dashboard/map',
    icon: MapPin,
    badge: null
  },
  {
    title: 'جدولة المواعيد',
    url: '/dashboard/appointments',
    icon: Calendar,
    badge: '5'
  },
  {
    title: 'تحليل السوق',
    url: '/dashboard/market-analysis',
    icon: TrendingUp,
    badge: null
  },
  {
    title: 'قاعدة البيانات',
    url: '/dashboard/database',
    icon: Database,
    badge: null
  }
];

const communicationItems = [
  {
    title: 'الرسائل',
    url: '/dashboard/messages',
    icon: Mail,
    badge: '12'
  },
  {
    title: 'المكالمات',
    url: '/dashboard/calls',
    icon: Phone,
    badge: null
  },
  {
    title: 'الإشعارات',
    url: '/dashboard/notifications',
    icon: Bell,
    badge: '8'
  }
];

const systemItems = [
  {
    title: 'إدارة الأدوار',
    url: '/dashboard/roles',
    icon: Shield,
    badge: null
  },
  {
    title: 'إدارة الملفات',
    url: '/dashboard/files',
    icon: HardDrive,
    badge: null
  },
  {
    title: 'إدارة المستخدمين',
    url: '/dashboard/users',
    icon: UserCog,
    badge: null
  },
  {
    title: 'الأمان والصلاحيات',
    url: '/dashboard/security',
    icon: Shield,
    badge: null
  },
  {
    title: 'الإعدادات',
    url: '/dashboard/settings',
    icon: Settings,
    badge: null
  },
  {
    title: 'المساعدة',
    url: '/dashboard/help',
    icon: HelpCircle,
    badge: null
  }
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  // State for collapsible groups
  const [openGroups, setOpenGroups] = useState({
    main: true,
    management: false,
    communication: false,
    system: false
  });

  const toggleGroup = (groupName: keyof typeof openGroups) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-700 font-bold rounded-lg px-3 py-2 shadow-lg border-l-4 border-amber-600 transform scale-105 transition-all duration-300' 
      : 'hover:bg-muted/50 hover:text-foreground transition-colors duration-200 rounded-lg px-3 py-2 text-muted-foreground';

  // Auto-expand group that contains active route
  const getGroupForPath = (path: string) => {
    if (mainMenuItems.some(item => item.url === path)) return 'main';
    if (managementItems.some(item => item.url === path)) return 'management';
    if (communicationItems.some(item => item.url === path)) return 'communication';
    if (systemItems.some(item => item.url === path)) return 'system';
    return null;
  };

  const activeGroup = getGroupForPath(currentPath);
  if (activeGroup && !openGroups[activeGroup as keyof typeof openGroups]) {
    setOpenGroups(prev => ({
      ...prev,
      [activeGroup]: true
    }));
  }

  return (
    <Sidebar
      className={`${collapsed ? 'w-20' : 'w-80'} transition-all duration-300 border-l border-border/40 order-2 ml-6`}
      collapsible="icon"
      side="right"
    >
      <SidebarContent className="bg-gradient-to-b from-accent/10 to-accent/5 backdrop-blur-sm border-r-4 border-accent/20 mr-6 ml-2" dir="rtl">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-accent/30 bg-accent/10">
          <div className="flex items-center gap-3">
            <img 
              src={avazLogoCompact} 
              alt="أفاز" 
              className="h-10 w-10 object-contain"
            />
            {!collapsed && (
              <div>
                <h2 className="font-bold text-accent-foreground">أفاز العقارية</h2>
                <p className="text-xs text-muted-foreground">نظام الإدارة المتقدم</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access to Home */}
        <div className="p-4 border-b border-accent/30 bg-accent/5">
          <SidebarMenuButton asChild>
            <NavLink to="/" className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/20 hover:text-accent-foreground transition-colors">
              <Home className="h-5 w-5 text-muted-foreground" />
              {!collapsed && <span className="text-sm text-muted-foreground">الصفحة الرئيسية</span>}
            </NavLink>
          </SidebarMenuButton>
        </div>

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className={`${collapsed ? 'sr-only' : ''} bg-blue-900 text-white font-semibold px-4 py-3 rounded-lg mx-3 mb-3 cursor-pointer flex items-center justify-between hover:bg-blue-800 transition-colors`}
            onClick={() => !collapsed && toggleGroup('main')}
          >
            <span>القائمة الرئيسية</span>
            {!collapsed && (
              openGroups.main ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className={`transition-all duration-300 ${openGroups.main || collapsed ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in">
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                       <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`} />
                       {!collapsed && (
                         <div className="flex items-center justify-between w-full">
                           <span className={`text-sm ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`}>{item.title}</span>
                           {item.badge && (
                             <Badge variant="secondary" className="text-xs">
                               {item.badge}
                             </Badge>
                           )}
                         </div>
                       )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Tools */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className={`${collapsed ? 'sr-only' : ''} bg-blue-900 text-white font-semibold px-4 py-3 rounded-lg mx-3 mb-3 cursor-pointer flex items-center justify-between hover:bg-blue-800 transition-colors`}
            onClick={() => !collapsed && toggleGroup('management')}
          >
            <span>أدوات الإدارة</span>
            {!collapsed && (
              openGroups.management ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className={`transition-all duration-300 ${openGroups.management || collapsed ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in">
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                       <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`} />
                       {!collapsed && (
                         <div className="flex items-center justify-between w-full">
                           <span className={`text-sm ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`}>{item.title}</span>
                           {item.badge && (
                             <Badge variant="secondary" className="text-xs">
                               {item.badge}
                             </Badge>
                           )}
                         </div>
                       )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className={`${collapsed ? 'sr-only' : ''} bg-blue-900 text-white font-semibold px-4 py-3 rounded-lg mx-3 mb-3 cursor-pointer flex items-center justify-between hover:bg-blue-800 transition-colors`}
            onClick={() => !collapsed && toggleGroup('communication')}
          >
            <span>التواصل والمتابعة</span>
            {!collapsed && (
              openGroups.communication ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className={`transition-all duration-300 ${openGroups.communication || collapsed ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <SidebarMenu>
              {communicationItems.map((item) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in">
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                       <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`} />
                       {!collapsed && (
                         <div className="flex items-center justify-between w-full">
                           <span className={`text-sm ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`}>{item.title}</span>
                           {item.badge && (
                             <Badge variant="destructive" className="text-xs">
                               {item.badge}
                             </Badge>
                           )}
                         </div>
                       )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Management */}
        <SidebarGroup>
          <SidebarGroupLabel 
            className={`${collapsed ? 'sr-only' : ''} bg-blue-900 text-white font-semibold px-4 py-3 rounded-lg mx-3 mb-3 cursor-pointer flex items-center justify-between hover:bg-blue-800 transition-colors`}
            onClick={() => !collapsed && toggleGroup('system')}
          >
            <span>إدارة النظام</span>
            {!collapsed && (
              openGroups.system ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent className={`transition-all duration-300 ${openGroups.system || collapsed ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in">
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`} />
                      {!collapsed && (
                         <div className="flex items-center justify-between w-full">
                           <span className={`text-sm ${isActive(item.url) ? 'text-gray-700' : 'text-muted-foreground'}`}>{item.title}</span>
                           {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Section */}
        <div className="mt-auto p-6 border-t border-accent/30 bg-accent/5">
          <SidebarMenuButton asChild>
            <button 
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-colors w-full text-right"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
              {!collapsed && <span className="text-sm text-muted-foreground">تسجيل الخروج</span>}
            </button>
          </SidebarMenuButton>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}