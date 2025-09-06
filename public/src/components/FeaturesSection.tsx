import { Search, MapPin, TrendingUp } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 mx-4 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">بحث ذكي</h3>
              <p className="text-xs text-gray-600">نظام بحث متطور يساعدك في العثور على العقار المناسب</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">خرائط تفاعلية</h3>
              <p className="text-xs text-gray-600">استكشف العقارات على الخريطة مع معلومات تفصيلية</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto bg-primary-light/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary-light" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">تحليل السوق</h3>
              <p className="text-xs text-gray-600">تقارير وإحصائيات متقدمة لمساعدتك في اتخاذ القرار</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;