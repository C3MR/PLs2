import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Search, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout() {
  const { user: authUser, signOut } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check both auth user and localStorage (for backward compatibility)
    if (authUser) {
      setCurrentUser(authUser);
    } else {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }, [authUser]);

  const handleLogout = async () => {
    try {
      // Clear localStorage and sign out from Supabase
      localStorage.removeItem('currentUser');
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if signOut fails
      window.location.href = '/';
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background" dir="rtl">
        <div className="flex flex-1 flex-col order-1">
          {/* Header */}
          <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-muted/80" />
                <div className="flex items-center gap-3">
                  <img src="/lovable-uploads/520083f6-203f-4800-a8ef-af619a9befb4.png" alt="أفاز العقارية" className="h-8 w-auto" />
                  <div className="hidden md:block">
                    <h1 className="text-lg font-semibold">نظام إدارة العقارات</h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">v2.0</Badge>
                      <span className="text-xs text-muted-foreground">أفاز العقارية</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="البحث السريع..."
                    className="w-64 h-9 pl-10 pr-4 rounded-lg border border-border/40 bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    8
                  </Badge>
                </Button>
                
                {/* User Profile */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <div className="hidden md:block text-right">
                      <span className="text-sm font-medium">
                        {currentUser ? (currentUser.full_name || currentUser.name) : 'مستخدم'}
                      </span>
                      {currentUser && (
                        <p className="text-xs text-muted-foreground">
                          {currentUser.role || currentUser.position}
                        </p>
                      )}
                    </div>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:block">خروج</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto ml-6" dir="rtl">
            <Outlet />
          </main>
        </div>
        
        <DashboardSidebar />
      </div>
    </SidebarProvider>
  );
}