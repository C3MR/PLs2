import Header from './Header';
import Footer from './Footer';
import BreadcrumbNavigation from './BreadcrumbNavigation';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

const Layout = ({ children, showHeader = true, showFooter = true, showBreadcrumbs = true, className = "" }: LayoutProps) => {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`} dir="rtl">
      {showHeader && <Header />}
      {showBreadcrumbs && showHeader && <BreadcrumbNavigation />}
      <main className={`flex-1 ${showHeader ? 'pt-[140px]' : ''} overflow-x-hidden`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;