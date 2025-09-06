import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Home, Building, Phone, User, UserCheck, FileText, Settings, ChevronDown, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin,
    isManager
  } = usePermissions();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-elegant transition-all duration-300">
      {/* Top Bar */}
      <div className="border-b border-border/30 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
        </div>
      </div>

      {/* Main Header */}
      <nav className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse group">
              <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <img src="/lovable-uploads/520083f6-203f-4800-a8ef-af619a9befb4.png" alt="أفاز العقارية" className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute -inset-2 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300 blur-sm"></div>
                </div>
                <div className="hidden sm:block">
                  
                  
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              <a href="/" className="group relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300">
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Home className="h-4 w-4" />
                  <span>الرئيسية</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
              
              <Link to="/properties" className="group relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300">
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Building className="h-4 w-4" />
                  <span>العقارات</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
              </Link>
              
              <a href="#about" className="group relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300">
                <span>من نحن</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
              
              <Link to="/property-request" className="group relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300">
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <FileText className="h-4 w-4" />
                  <span>طلب خدمة</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
              </Link>
              
              <a href="#contact" className="group relative px-4 py-2 text-foreground hover:text-primary transition-all duration-300">
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Phone className="h-4 w-4" />
                  <span>تواصل معنا</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>

            {/* Search and User Area */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Search Icon */}
              <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-muted/50">
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Notifications - Only show when logged in */}
              {user && (
                <Button variant="ghost" size="sm" className="hidden md:flex relative hover:bg-muted/50">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-destructive">
                    3
                  </Badge>
                </Button>
              )}

              {/* Authentication Buttons */}
              {!user ? (
                <>
                  <Link to="/client-portal">
                    <Button variant="default" className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium">
                      <UserCheck className="h-4 w-4 ml-2" />
                      بوابة العملاء
                    </Button>
                  </Link>
                  <Link to="/secure-auth">
                    <Button variant="outline" className="hidden md:flex text-sm hover:bg-muted/50 border-primary/30">
                      <User className="h-4 w-4 ml-2" />
                      دخول الموظفين
                    </Button>
                  </Link>
                </>
              ) : (
                /* User Profile - Only show when logged in */
                <div className="relative">
                  <Button variant="ghost" onClick={toggleUserMenu} className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-muted/50 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-right">
                      <p 
                        className="text-sm font-medium cursor-pointer hover:text-primary transition-colors duration-200" 
                        onClick={() => {
                          if (isAdmin || isManager) {
                            window.location.href = '/dashboard';
                          } else {
                            window.location.href = '/client-portal';
                          }
                        }}
                      >
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'مستخدم'}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-elegant z-50 animate-scale-in">
                      <div className="p-2 space-y-1">
                        {isAdmin || isManager ? (
                          <Link to="/dashboard" className="w-full">
                            <Button variant="ghost" className="w-full justify-start">
                              <Settings className="h-4 w-4 ml-2" />
                              لوحة التحكم
                            </Button>
                          </Link>
                        ) : (
                          <Link to="/client-portal" className="w-full">
                            <Button variant="ghost" className="w-full justify-start">
                              <User className="h-4 w-4 ml-2" />
                              بوابة العملاء
                            </Button>
                          </Link>
                        )}
                         <hr className="my-1" />
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 ml-2" />
                          تسجيل الخروج
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" onClick={toggleMenu} className="lg:hidden hover:bg-muted/50">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden animate-fade-in">
              <div className="px-4 pt-4 pb-6 space-y-3 bg-card/95 backdrop-blur-lg rounded-lg mt-2 shadow-elegant border border-border/50">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-300" onClick={toggleMenu}>
                  <Home className="h-5 w-5" />
                  <span>الرئيسية</span>
                </Link>
                <Link to="/properties" className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-300" onClick={toggleMenu}>
                  <Building className="h-5 w-5" />
                  <span>العقارات</span>
                </Link>
                <a href="#about" className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-300" onClick={toggleMenu}>
                  <span>من نحن</span>
                </a>
                <Link to="/property-request" className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-300" onClick={toggleMenu}>
                  <FileText className="h-5 w-5" />
                  <span>طلب خدمة</span>
                </Link>
                <a href="#contact" className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-all duration-300" onClick={toggleMenu}>
                  <Phone className="h-5 w-5" />
                  <span>تواصل معنا</span>
                </a>
                
                <div className="pt-4 space-y-3 border-t border-border/50">
                  {!user ? (
                    <>
                      <Link to="/client-portal" className="w-full">
                        <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-white shadow-elegant">
                          <UserCheck className="h-4 w-4 ml-2" />
                          بوابة العملاء
                        </Button>
                      </Link>
                      <Link to="/secure-auth" className="w-full">
                        <Button variant="outline" className="w-full border-primary/30 hover:border-primary/50 hover:bg-primary/5">
                          <User className="h-4 w-4 ml-2" />
                          دخول الموظفين
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button variant="destructive" className="w-full shadow-elegant" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;