import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowUp,
  Heart,
  Star
} from 'lucide-react';
import avazLogoMain from '@/assets/avaz-logo-main.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary-dark/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent"></div>
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-16 left-16 w-24 h-24 bg-primary/10 rotate-45 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-24 w-16 h-16 bg-primary/15 rounded-lg animate-spin" style={{animationDuration: '6s'}}></div>
        <div className="absolute bottom-20 right-40 w-12 h-12 bg-gradient-to-r from-primary-light/20 to-primary/20 transform rotate-12 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-accent/30 rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Moving Dots Pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/5 w-28 h-28 bg-gradient-to-br from-primary/5 to-transparent rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/5 w-20 h-20 bg-gradient-to-tl from-primary-dark/5 to-transparent rounded-lg animate-float" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-32 h-32 bg-gradient-to-r from-accent/5 to-transparent rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Large Decorative Elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 border border-primary/5 rotate-45 animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 border border-accent/10 -rotate-12 animate-pulse" style={{animationDelay: '4s', animationDuration: '10s'}}></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 pt-16 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/lovable-uploads/520083f6-203f-4800-a8ef-af619a9befb4.png" alt="أفاز العقارية" className="h-14 w-auto brightness-0 invert opacity-90" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  أفاز العقارية
                </h3>
                <p className="text-sm text-accent">Avaz Real Estate</p>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              شريكك الموثوق في عالم العقارات بالمملكة العربية السعودية. نقدم حلول عقارية 
              متكاملة ومبتكرة لتحقيق أهدافكم الاستثمارية.
            </p>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10 text-accent hover:text-accent/80 transition-all duration-300 group">
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10 text-accent hover:text-accent/80 transition-all duration-300 group">
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10 text-accent hover:text-accent/80 transition-all duration-300 group">
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10 text-accent hover:text-accent/80 transition-all duration-300 group">
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Star className="h-5 w-5 ml-2 text-accent" />
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  العقارات
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  من نحن
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  تواصل معنا
                </a>
              </li>
              <li>
                <Link to="/employee-login" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  الموظفين
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Building className="h-5 w-5 ml-2 text-accent" />
              خدماتنا
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#property-marketing" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  التسويق العقاري
                </a>
              </li>
              <li>
                <a href="#property-management" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  إدارة الأملاك
                </a>
              </li>
              <li>
                <a href="#investment-consulting" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  الاستشارات الاستثمارية
                </a>
              </li>
              <li>
                <a href="#commercial-services" className="text-white/80 hover:text-accent transition-colors duration-300 flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 ml-2"></span>
                  الخدمات التجارية
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Phone className="h-5 w-5 ml-2 text-accent" />
              معلومات التواصل
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse group">
                <div className="bg-accent/20 p-2 rounded-lg group-hover:bg-accent/30 transition-colors">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">العنوان</p>
                  <p className="text-sm text-white/80">الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse group">
                <div className="bg-accent/20 p-2 rounded-lg group-hover:bg-accent/30 transition-colors">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">الهاتف</p>
                  <p className="text-sm text-white/80">+966 11 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse group">
                <div className="bg-accent/20 p-2 rounded-lg group-hover:bg-accent/30 transition-colors">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">البريد الإلكتروني</p>
                  <p className="text-sm text-white/80">info@avaz.com</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-white">اشترك في النشرة الإخبارية</h5>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Input 
                  placeholder="بريدك الإلكتروني" 
                  className="flex-1 bg-white/10 border-white/20 focus:border-accent text-white placeholder:text-white/60 transition-colors"
                />
                <Button 
                  size="sm" 
                  className="bg-accent hover:bg-accent/90 text-primary shadow-soft hover:shadow-elegant transition-all duration-300"
                >
                  اشتراك
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-white/80">
            <span>© 2024 أفاز العقارية. جميع الحقوق محفوظة.</span>
            <Heart className="h-4 w-4 text-accent animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <a href="#terms" className="text-sm text-white/80 hover:text-accent transition-colors">
              الشروط والأحكام
            </a>
            <span className="text-white/60">•</span>
            <a href="/privacy-policy" className="text-sm text-white/80 hover:text-accent transition-colors">
              سياسة الخصوصية
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-primary shadow-elegant hover:shadow-glow transition-all duration-300 z-40 group"
        size="sm"
      >
        <ArrowUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </Button>
    </footer>
  );
};

export default Footer;