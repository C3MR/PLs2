import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Building2, Award, Target, Heart, Lightbulb, UsersIcon } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import regaLogo from '@/assets/rega-logo.png';
const AboutSection = () => {
  const stats = [{
    icon: Award,
    label: "أكثر من 10 سنوات خبرة",
    value: "10+"
  }, {
    icon: Users,
    label: "أكثر من 1000 عميل راضٍ",
    value: "1000+"
  }, {
    icon: Building2,
    label: "مشاريع منجزة",
    value: "500+"
  }, {
    icon: CheckCircle,
    label: "معدل نجاح عالي",
    value: "95%"
  }];
  const values = [{
    icon: CheckCircle,
    title: "النزاهة",
    description: "نلتزم بأعلى معايير النزاهة والأخلاق في جميع تعاملاتنا، ونضع مصلحة عملائنا في المقام الأول."
  }, {
    icon: Target,
    title: "التميز",
    description: "نسعى دائماً لتحقيق التميز في كل ما نقوم به، ونحرص على تطوير أدائنا باستمرار لتقديم أفضل الخدمات."
  }, {
    icon: UsersIcon,
    title: "العمل الجماعي",
    description: "نؤمن بقوة العمل الجماعي والتعاون المشترك لتحقيق النجاح، ونشجع روح الفريق الواحد في جميع أعمالنا."
  }, {
    icon: Lightbulb,
    title: "الابتكار",
    description: "نشجع الأفكار الجديدة والحلول المبتكرة لتطوير خدماتنا، ونواكب أحدث التقنيات في مجال العقارات."
  }];
  const licenses = [{
    title: "فال للوساطة والتسويق",
    number: "1200015364",
    description: "رخصة معتمدة من برنامج فال للوساطة العقارية تؤهلنا لتقديم خدمات الوساطة والتسويق العقاري بكفاءة عالية",
    logos: ["FAL", "REGA"]
  }, {
    title: "فال لإدارة الأملاك",
    number: "2200000131",
    description: "رخصة معتمدة لإدارة الأملاك العقارية وتقديم خدمات إدارية متكاملة تضمن الحفاظ على قيمة العقارات وتطويرها",
    logos: ["FAL", "REGA"]
  }, {
    title: "فال لإدارة المرافق",
    number: "3200000547",
    description: "رخصة معتمدة لإدارة المرافق العقارية وتقديم خدمات متكاملة تضمن كفاءة تشغيل وصيانة المرافق",
    logos: ["FAL", "REGA"]
  }, {
    title: "البيع والتسويق على الخارطة",
    number: "4200000896",
    description: "رخصة معتمدة للبيع والتسويق العقاري على الخارطة تؤهلنا لتسويق المشاريع تحت الإنشاء وبيعها قبل الانتهاء من البناء",
    logos: ["FAL", "REGA"]
  }];
  return <section id="about" className="relative py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <ParticleBackground className="opacity-60" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
            من نحن
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            شريكك الموثوق في{' '}
            <span className="text-primary">السوق العقاري</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            تأسست شركة أفاز العقارية على يد مجموعة من الخبراء في مجال العقارات، بهدف تقديم خدمات عقارية متكاملة تلبي احتياجات السوق السعودي
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-16 sm:mb-20">
          {stats.map((stat, index) => <Card key={index} className="text-center p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <CardContent className="p-0">
                <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">{stat.label}</div>
              </CardContent>
            </Card>)}
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 hover:border-primary/50 animate-fade-in transition-all duration-700 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.05] backdrop-blur-xl">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{
              animationDelay: '1s'
            }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{
              animationDelay: '2s'
            }}></div>
            </div>
            
            {/* Moving gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
            <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
            
            <CardContent className="relative z-20 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {/* Icon container with glowing effect */}
                  <div className="relative p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl shadow-2xl group-hover:shadow-primary/50 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 backdrop-blur-sm border border-primary/30">
                    <Target className="h-10 w-10 text-primary group-hover:rotate-180 transition-transform duration-700" />
                    
                    {/* Glowing rings */}
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <div className="absolute -inset-2 bg-primary/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{
                  animationDelay: '0.2s'
                }}></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{
                  animationDelay: '0.5s'
                }}></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-500 transform group-hover:translate-x-2">
                    رؤيتنا
                  </h3>
                  <div className="h-1.5 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full group-hover:from-primary group-hover:via-secondary group-hover:to-primary transition-all duration-700 group-hover:scale-x-125 origin-left"></div>
                  
                  {/* Animated sparkles */}
                  <div className="absolute top-0 right-4 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{
                  animationDelay: '0.3s'
                }}></div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-white transition-all duration-500 transform group-hover:translate-y-1 group-hover:scale-[1.02]">
                أن نكون الشركة الرائدة في مجال الخدمات العقارية في المملكة العربية السعودية، وأن نساهم بفعالية في تطوير القطاع العقاري بما يتماشى مع رؤية المملكة 2030 من خلال تقديم حلول عقارية مبتكرة ومستدامة.
              </p>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{
                animationDelay: '0.3s'
              }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{
                animationDelay: '0.6s'
              }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 hover:border-secondary/50 animate-fade-in transition-all duration-700 hover:shadow-2xl hover:shadow-secondary/30 hover:scale-[1.05] backdrop-blur-xl" style={{
          animationDelay: '0.2s'
        }}>
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{
              animationDelay: '0.5s'
            }}></div>
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-accent/20 rounded-full blur-2xl animate-pulse" style={{
              animationDelay: '1.5s'
            }}></div>
              <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{
              animationDelay: '2.5s'
            }}></div>
            </div>
            
            {/* Moving gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"></div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-secondary/50 via-accent/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
            <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
            
            <CardContent className="relative z-20 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {/* Icon container with glowing effect */}
                  <div className="relative p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl shadow-2xl group-hover:shadow-secondary/50 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-6 backdrop-blur-sm border border-secondary/30">
                    <Heart className="h-10 w-10 text-secondary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                    
                    {/* Glowing rings */}
                    <div className="absolute inset-0 bg-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <div className="absolute -inset-2 bg-secondary/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Floating hearts */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{
                  animationDelay: '0.1s'
                }}></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{
                  animationDelay: '0.4s'
                }}></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-secondary transition-colors duration-500 transform group-hover:translate-x-2">
                    رسالتنا
                  </h3>
                  <div className="h-1.5 bg-gradient-to-r from-secondary via-secondary/50 to-transparent rounded-full group-hover:from-secondary group-hover:via-accent group-hover:to-secondary transition-all duration-700 group-hover:scale-x-125 origin-left"></div>
                  
                  {/* Animated sparkles */}
                  <div className="absolute top-0 right-4 w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{
                  animationDelay: '0.2s'
                }}></div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg group-hover:text-white transition-all duration-500 transform group-hover:translate-y-1 group-hover:scale-[1.02]">
                تقديم خدمات عقارية متكاملة ذات جودة عالية تلبي احتياجات عملائنا وتتجاوز توقعاتهم من خلال فريق محترف يتمتع بالخبرة والكفاءة، والالتزام بأعلى معايير الشفافية والمصداقية في جميع تعاملاتنا.
              </p>
              
              {/* Decorative elements */}
              <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{
                animationDelay: '0.1s'
              }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{
                animationDelay: '0.4s'
              }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{
                animationDelay: '0.7s'
              }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">قيمنا</h3>
            <p className="text-lg text-muted-foreground">القيم التي نؤمن بها ونعمل وفقاً لها</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => <Card key={index} className="p-4 sm:p-5 md:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <CardContent className="p-0">
                  <value.icon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-primary mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{value.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Licenses */}
        <div className="bg-muted/50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
              تراخيصنا المعتمدة
            </Badge>
            <h3 className="text-3xl font-bold text-foreground mb-4">نفتخر بحصولنا على جميع التراخيص المعتمدة</h3>
            <p className="text-lg text-muted-foreground">من الجهات المختصة لتقديم خدماتنا العقارية بأعلى معايير الجودة والاحترافية</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {licenses.map((license, index) => <Card key={index} className="p-4 sm:p-5 md:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <CardContent className="p-0">
                  {/* License Icon or small image */}
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {/* License Info */}
                  <Badge variant="secondary" className="mb-2 text-xs">
                    رقم الترخيص: {license.number}
                  </Badge>
                  
                  <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{license.title}</h4>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{license.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

      </div>
    </section>;
};
export default AboutSection;