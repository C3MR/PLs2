import { Button } from '@/components/ui/button';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import riyadhSkyline from '@/assets/riyadh-skyline.jpg';
import RiyadhMapBackground from './RiyadhMapBackground';
const HeroSection = () => {
  return <section id="home" className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Riyadh Map Background with Search Animation */}
      <RiyadhMapBackground />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-900/10 to-black/20" />
      
      {/* Animated Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-2 h-2 bg-accent rounded-full animate-pulse-slow opacity-60" />
        <div className="absolute top-40 left-32 w-1 h-1 bg-primary rounded-full animate-float opacity-80" />
        <div className="absolute bottom-32 right-40 w-3 h-3 bg-accent rounded-full animate-pulse-slow opacity-40" />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-primary rounded-full animate-float opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">افاز العقارية</h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">التسويق - إدارة الأملاك - الاستثمار - الخدمات المساندة للقطاع التجاري</p>

          {/* Stats */}
          

          {/* Action Buttons */}
          

          {/* Scroll Indicator */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse-slow" />
            </div>
          </div>

        </div>
      </div>
    </section>;
};
export default HeroSection;