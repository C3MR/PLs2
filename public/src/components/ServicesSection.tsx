import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, Settings, PiggyBank, Briefcase, ArrowLeft, ArrowRight, Building, BarChart3, Shield, Users, Target, Globe, FileText, CheckCircle, Camera, Share2, Search, Zap, Smartphone, Monitor, MapPin, Calculator, LineChart, DollarSign, TrendingDown, Handshake, Phone, Mail, Calendar, Wrench, Clock, Award, BookOpen, Gavel, Home, Landmark, UserCheck, Clipboard } from 'lucide-react';
const ServicesSection = () => {
  const mainServices = [{
    id: 'marketing',
    icon: Share2,
    title: "التسويق العقاري",
    description: "نساعدك في تسويق عقارك بأفضل الطرق وأحدث التقنيات للوصول إلى أكبر شريحة من المشترين المحتملين.",
    features: [{
      icon: Camera,
      text: "تسويق رقمي متطور عبر منصات التواصل الاجتماعي"
    }, {
      icon: Search,
      text: "شبكة واسعة من العملاء المؤهلين والمهتمين"
    }, {
      icon: Target,
      text: "تحليل السوق المتخصص واستهداف دقيق للعملاء"
    }, {
      icon: Monitor,
      text: "خدمات التصوير الاحترافي والجولات الافتراضية"
    }, {
      icon: Zap,
      text: "إعلانات مدفوعة على Google و Facebook"
    }, {
      icon: BarChart3,
      text: "تقارير أداء مفصلة للحملات التسويقية"
    }, {
      icon: Calculator,
      text: "استراتيجيات تسعير مدروسة لضمان أفضل عائد"
    }],
    detailedDescription: "نقدم خدمات تسويق عقاري شاملة تستخدم أحدث الأساليب والتقنيات الرقمية لضمان وصول إعلانك إلى أكبر شريحة من المشترين المحتملين. فريقنا المتخصص يضع استراتيجيات تسويقية مخصصة لكل عقار حسب موقعه ونوعه والجمهور المستهدف.",
    subServices: [{
      icon: Smartphone,
      title: "التصوير الاحترافي",
      description: "تصوير احترافي للعقار مع جولات افتراضية ثلاثية الأبعاد"
    }, {
      icon: Monitor,
      title: "الإعلانات المدفوعة",
      description: "حملات إعلانية مدروسة على منصات التواصل الاجتماعي"
    }, {
      icon: Search,
      title: "التسويق الرقمي",
      description: "استراتيجيات تسويق رقمي متطورة للوصول للعملاء المستهدفين"
    }, {
      icon: BarChart3,
      title: "تحليل السوق",
      description: "تحليل شامل لأحركة السوق العقاري ومتطلبات العملاء"
    }]
  }, {
    id: 'management',
    icon: Home,
    title: "إدارة الأملاك",
    description: "نتولى إدارة عقاراتك بكفاءة عالية من خلال فريق متخصص يضمن تحقيق أقصى عائد استثماري ممكن.",
    features: [{
      icon: Building,
      text: "إدارة شاملة للعقارات السكنية والتجارية"
    }, {
      icon: Wrench,
      text: "صيانة دورية واستباقية لحفظ قيمة العقار"
    }, {
      icon: DollarSign,
      text: "تحصيل الإيجارات وإدارة العقود"
    }, {
      icon: FileText,
      text: "تقارير مالية مفصلة شهرية وسنوية"
    }, {
      icon: Users,
      text: "إدارة علاقات المستأجرين والمالكين"
    }, {
      icon: Clock,
      text: "خدمات الطوارئ والصيانة الفورية 24/7"
    }, {
      icon: TrendingUp,
      text: "تطوير وتحسين العقارات لزيادة قيمتها الإيجارية"
    }],
    detailedDescription: "خدمة إدارة أملاك متكاملة تشمل جميع جوانب إدارة العقارات من تحصيل الإيجارات إلى الصيانة والتطوير. نضمن لك عائداً استثمارياً ممتازاً مع الحفاظ على قيمة عقارك وتطويرها.",
    subServices: [{
      icon: Wrench,
      title: "الصيانة الدورية",
      description: "برامج صيانة دورية واستباقية لحفظ قيمة العقار وجودته"
    }, {
      icon: DollarSign,
      title: "تحصيل الإيجارات",
      description: "إدارة عقود الإيجار وتحصيل المدفوعات بطريقة احترافية"
    }, {
      icon: Users,
      title: "إدارة العقود",
      description: "إدارة شاملة لعقود الإيجار وعلاقات المستأجرين"
    }, {
      icon: FileText,
      title: "التقارير الدورية",
      description: "تقارير مالية مفصلة ومتابعة دورية لأداء العقارات"
    }]
  }, {
    id: 'investment',
    icon: LineChart,
    title: "الاستثمار",
    description: "نقدم فرص استثمارية متميزة في القطاع العقاري مع دراسات جدوى احترافية لضمان نجاح استثماراتك.",
    features: [{
      icon: BookOpen,
      text: "دراسات جدوى معمقة للمشاريع الاستثمارية"
    }, {
      icon: TrendingDown,
      text: "تحليل المخاطر والفرص الاستثمارية"
    }, {
      icon: UserCheck,
      text: "استشارات استثمارية من خبراء معتمدين"
    }, {
      icon: BarChart3,
      text: "متابعة الأداء والعائد على الاستثمار"
    }, {
      icon: MapPin,
      text: "تحديد أفضل المواقع والأوقات للاستثمار"
    }, {
      icon: Briefcase,
      text: "إدارة محافظ الاستثمار العقاري"
    }, {
      icon: Handshake,
      text: "خدمات التخارج الاستثماري بأفضل الأسعار"
    }],
    detailedDescription: "نساعدك في بناء محفظة استثمارية عقارية ناجحة من خلال تحليل السوق المتخصص وتحديد أفضل الفرص الاستثمارية. خبراؤنا يقدمون دراسات جدوى شاملة لضمان اتخاذ قرارات استثمارية مدروسة ومربحة.",
    subServices: [{
      icon: BookOpen,
      title: "دراسات الجدوى",
      description: "دراسات جدوى تفصيلية للمشاريع الاستثمارية العقارية"
    }, {
      icon: LineChart,
      title: "تحليل السوق",
      description: "تحليل شامل لأحركة السوق العقاري والفرص الاستثمارية"
    }, {
      icon: Calculator,
      title: "التقييم المالي",
      description: "تقييم دقيق للعائد على الاستثمار والمخاطر المالية"
    }, {
      icon: Handshake,
      title: "استشارات متخصصة",
      description: "استشارات استثمارية من خبراء عقاريين معتمدين"
    }]
  }, {
    id: 'support',
    icon: Clipboard,
    title: "الخدمات المساندة",
    description: "نقدم خدمات استشارية متكاملة للقطاع التجاري تشمل دراسة ملفات المستثمرين وتطوير خطط التوسع وتحليل المواقع الاستراتيجية.",
    features: [{
      icon: Gavel,
      text: "استشارات قانونية متخصصة في القانون العقاري"
    }, {
      icon: MapPin,
      text: "تحليل المواقع الاستراتيجية وإمكانياتها"
    }, {
      icon: TrendingUp,
      text: "تطوير خطط التوسع للشركات والمستثمرين"
    }, {
      icon: Clipboard,
      text: "دراسة ملفات المستثمرين وتقييم القدرات المالية"
    }, {
      icon: Landmark,
      text: "خدمات التمويل والحلول المصرفية"
    }, {
      icon: Settings,
      text: "إدارة المشاريع العقارية من البداية للنهاية"
    }, {
      icon: Award,
      text: "استشارات تطوير العقارات والتصميم"
    }],
    detailedDescription: "مجموعة شاملة من الخدمات المساندة التي تدعم رحلتك العقارية. من الاستشارات القانونية إلى التمويل وإدارة المشاريع، نوفر لك كل ما تحتاجه لإنجاح مشروعك العقاري.",
    subServices: [{
      icon: Gavel,
      title: "تنظيم العلاقات التعاقدية",
      description: "إدارة وتنظيم العلاقة بين المالك والمستأجر وضمان حقوق الطرفين"
    }, {
      icon: Landmark,
      title: "دعم التوسع والانتشار",
      description: "المساهمة في تحقيق خطط التوسع وتقديم الدعم اللازم للأنشطة التجارية"
    }, {
      icon: UserCheck,
      title: "اقتراح المواقع المناسبة",
      description: "دراسة احتياجات المنطقة واقتراح أفضل المواقع للأنشطة التجارية"
    }, {
      icon: Clipboard,
      title: "إدارة العقود والمواثيق",
      description: "خدمات شاملة من استئجار المواقع إلى إدارة العقود وتطبيق العقود"
    }]
  }];
  const additionalServices = [{
    icon: Building,
    title: "تقييم العقارات",
    description: "تقييم عقاري معتمد ودقيق"
  }, {
    icon: BarChart3,
    title: "تحليل السوق",
    description: "تحليل شامل لاتجاهات السوق العقاري"
  }, {
    icon: Shield,
    title: "الخدمات القانونية",
    description: "استشارات قانونية متخصصة"
  }, {
    icon: Users,
    title: "إدارة المجتمعات",
    description: "إدارة احترافية للمجمعات السكنية"
  }, {
    icon: Target,
    title: "التسويق المستهدف",
    description: "حملات تسويقية مخصصة لكل عقار"
  }, {
    icon: Globe,
    title: "التسويق الدولي",
    description: "فتح أسواق عالمية للعقارات المميزة"
  }];
  return <section id="services" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
            خدماتنا
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            خدمات عقارية{' '}
            <span className="text-primary">متكاملة ومتميزة</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة متكاملة من الخدمات العقارية المتميزة لتلبية احتياجاتكم المختلفة وتحقيق أهدافكم الاستثمارية
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {mainServices.map((service, index) => <Card key={service.id} className="relative bg-gradient-to-br from-background to-background/95 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group border-0 backdrop-blur-sm overflow-hidden hover:scale-105 hover:-translate-y-2" style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.5) 100%)',
          boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.2), 0 0 20px hsl(var(--primary) / 0.1)'
        }}>
              <div className="w-16 h-16 flex items-center justify-center bg-secondary/10 text-secondary rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <service.icon className="text-2xl h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-foreground/80 mb-4 group-hover:text-foreground transition-colors duration-300">
                {service.description}
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary flex items-center group-hover:text-primary transition-colors">
                    <span>المزيد</span>
                    <span className="w-5 h-5 flex items-center justify-center mr-1">
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-right flex items-center gap-3">
                      <service.icon className="h-8 w-8 text-primary" />
                      {service.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground text-right mt-4">
                      {service.detailedDescription}
                    </DialogDescription>
                  </DialogHeader>
                  
                   <div className="mt-6">
                     <h4 className="text-xl font-semibold mb-4 text-right">الميزات والخدمات:</h4>
                     <div className="space-y-3">
                       {service.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start gap-3 text-right">
                           <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                           <span className="text-foreground">{feature.text}</span>
                         </div>)}
                     </div>
                   </div>
                   
                   {service.subServices && <div className="mt-8">
                       <h4 className="text-xl font-semibold mb-6 text-right">الخدمات التفصيلية:</h4>
                       <div className="grid md:grid-cols-2 gap-4">
                         {service.subServices.map((subService, subIndex) => <div key={subIndex} className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                             <div className="flex items-center gap-3 mb-2 text-right">
                               <subService.icon className="h-6 w-6 text-primary flex-shrink-0" />
                               <h5 className="font-semibold text-foreground">{subService.title}</h5>
                             </div>
                             <p className="text-sm text-muted-foreground text-right">{subService.description}</p>
                           </div>)}
                       </div>
                     </div>}
                  
                  <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                    <h4 className="text-lg font-semibold mb-3 text-right">هل تريد معرفة المزيد؟</h4>
                    <p className="text-muted-foreground text-right mb-4">
                      تواصل معنا للحصول على استشارة مجانية ومخصصة حول هذه الخدمة
                    </p>
                    <Button className="w-full">
                      احجز استشارة مجانية
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>)}
        </div>

        {/* Additional Services */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">خدمات إضافية متخصصة</h3>
            <p className="text-lg text-muted-foreground">لتلبية جميع احتياجاتكم العقارية بأعلى معايير الجودة</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => <Card key={index} className="p-6 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <CardContent className="p-0 text-center">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          
        </div>
      </div>
    </section>;
};
export default ServicesSection;