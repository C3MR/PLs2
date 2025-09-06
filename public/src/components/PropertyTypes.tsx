import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Briefcase, 
  Store, 
  Warehouse, 
  Hotel,
  MapPin,
  Crown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PropertyTypes = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const propertyCategories = {
    residential: {
      title: 'العقارات السكنية',
      icon: Home,
      types: [
        { name: 'فيلا', icon: Crown, count: '150+' },
        { name: 'شقة', icon: Home, count: '300+' },
        { name: 'دبلكس', icon: Building, count: '80+' },
        { name: 'عمارة سكنية', icon: Building, count: '45+' },
        { name: 'أرض سكنية', icon: MapPin, count: '120+' },
        { name: 'استراحة', icon: Home, count: '60+' },
        { name: 'قصر', icon: Crown, count: '25+' },
      ]
    },
    commercial: {
      title: 'العقارات التجارية',
      icon: Store,
      types: [
        { name: 'مكتب', icon: Briefcase, count: '90+' },
        { name: 'معرض', icon: Store, count: '70+' },
        { name: 'عمارة تجارية', icon: Building, count: '35+' },
        { name: 'برج', icon: Building, count: '15+' },
        { name: 'مستودع', icon: Warehouse, count: '50+' },
        { name: 'محطة', icon: Store, count: '20+' },
        { name: 'أرض تجارية', icon: MapPin, count: '40+' },
        { name: 'فندق', icon: Hotel, count: '10+' },
      ]
    }
  };

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setIsDropdownOpen(false);
  };

  const selectedCategoryData = selectedCategory ? propertyCategories[selectedCategory as keyof typeof propertyCategories] : null;

  const TypeCard = ({ name, icon: Icon, count, hasSelectedCategory }: { name: string; icon: any; count: string; hasSelectedCategory: boolean }) => (
    <Card className={`group cursor-pointer hover:shadow-medium transition-all duration-300 hover:scale-105 border-border/50 bg-card/80 backdrop-blur-sm ${hasSelectedCategory ? 'mb-8' : 'mb-0'}`}>
      <CardContent className={`text-center space-y-6 transition-all duration-300 ${selectedCategory ? 'p-8 mt-8' : 'p-8'}`}>
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center group-hover:shadow-medium transition-all duration-300">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">{name}</h3>
          <p className="text-accent font-medium">{count}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="property-types" className="py-20 bg-gradient-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to Action - moved to top */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="bg-primary rounded-2xl p-8 md:p-12 shadow-strong">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              هل تبحث عن نوع عقار محدد؟
            </h3>
            <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              فريق خبرائنا جاهز لمساعدتك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 rounded-lg shadow-medium transition-all duration-300">
                تواصل مع خبير عقاري
              </button>
              <button className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-3 rounded-lg transition-all duration-300">
                استكشف جميع العقارات
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            تصنيف أنواع العقارات
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اختر نوع العقار المناسب لك من القائمة المنسدلة أدناه
          </p>
        </div>

        {/* Dropdown Selection */}
        <div className={`max-w-2xl mx-auto transition-all duration-300 ${isDropdownOpen ? 'mb-32' : 'mb-12'} animate-slide-up`}>
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="outline"
              className="w-full h-16 text-lg font-semibold border-2 border-primary/20 hover:border-primary/40 bg-card hover:bg-muted/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Building className="h-6 w-6 text-primary" />
                  <span className="text-foreground">
                    {selectedCategory ? propertyCategories[selectedCategory as keyof typeof propertyCategories].title : 'اختر نوع العقار'}
                  </span>
                </div>
                {isDropdownOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-strong z-50 animate-fade-in">
                <div className="p-4 flex gap-3 justify-center">
                  {Object.entries(propertyCategories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => handleCategorySelect(key)}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-primary/10 transition-all duration-200 group min-w-0 flex-1"
                    >
                      <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200 mb-3">
                        <category.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.types.length} أنواع
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Category Types */}
        {selectedCategoryData && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 md:gap-6 mt-12">
              {selectedCategoryData.types.map((type, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TypeCard {...type} hasSelectedCategory={!!selectedCategory} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyTypes;