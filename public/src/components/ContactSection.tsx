import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Building,
  Users,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validateKSAPhone, formatKSAPhone } from '@/utils/validation';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الجوال مطلوب';
    } else if (!validateKSAPhone(formData.phone)) {
      newErrors.phone = 'رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 أو +966)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'الرسالة مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "يرجى تصحيح الأخطاء",
        description: "تأكد من صحة جميع البيانات المدخلة",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formatKSAPhone(formData.phone),
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });
      
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "حدث خطأ أثناء إرسال رسالتك، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "هاتف",
      details: ["920004209"],
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      details: ["info@avaz.sa"],
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: MapPin,
      title: "العنوان",
      details: ["2225 طريق الملك عبدالعزيز حي الياسمين", "7443، الرياض 13326"],
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      details: ["الأحد - الخميس: 10:00 ص - 6:00 م"],
      gradient: "from-orange-500/10 to-red-500/10"
    }
  ];

  const quickActions = [
    {
      icon: Users,
      title: "استشارة عقارية",
      description: "استشارة مجانية مع خبرائنا",
      action: "احجز استشارة"
    },
    {
      icon: MessageCircle,
      title: "دعم فني",
      description: "تواصل مع فريق الدعم الفني",
      action: "تواصل الآن"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
            تواصل معنا
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            شريكك الموثوق في{' '}
            <span className="text-primary">السوق العقاري</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            تواصل معنا الآن للحصول على استشارة مجانية من خبرائنا العقاريين وابدأ رحلتك نحو استثمار عقاري ناجح
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in">
              <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Send className="h-6 w-6 text-primary" />
                  أرسل لنا رسالة
                </CardTitle>
                <p className="text-muted-foreground">املأ النموذج وسنتواصل معك في أقرب وقت</p>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: ''});
                      }}
                      placeholder="أدخل اسمك الكامل"
                      className={`text-right ${errors.name ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الجوال *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({...formData, phone: e.target.value});
                        if (errors.phone) setErrors({...errors, phone: ''});
                      }}
                      placeholder="05xxxxxxxx"
                      className={`text-right ${errors.phone ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({...formData, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                      placeholder="example@email.com"
                      className={`text-right ${errors.email ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="موضوع الرسالة"
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({...formData, message: e.target.value});
                      if (errors.message) setErrors({...errors, message: ''});
                    }}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    className={`text-right resize-none ${errors.message ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  <Send className="mr-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info & Quick Actions */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 hover:border-primary/50 transition-all duration-700 hover:scale-[1.05] animate-fade-in backdrop-blur-xl"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Magical background particles */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 left-4 w-16 h-16 bg-primary/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: `${index * 0.3}s`}}></div>
                    <div className="absolute bottom-3 right-3 w-12 h-12 bg-secondary/30 rounded-full blur-xl animate-pulse" style={{animationDelay: `${index * 0.5}s`}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: `${index * 0.7}s`}}></div>
                  </div>
                  
                  {/* Holographic border effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                  <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                  
                  {/* Floating light rays */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-secondary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <CardContent className="relative z-20 p-6">
                    <div className="flex items-start gap-6">
                      {/* Magical icon container */}
                      <div className="relative">
                        <div className="relative p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl shadow-2xl group-hover:shadow-primary/50 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 backdrop-blur-sm border border-primary/30">
                          <info.icon className="h-6 w-6 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                          
                          {/* Glowing aura */}
                          <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                          <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                        
                        {/* Floating sparkles */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.1s'}}></div>
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-secondary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.3s'}}></div>
                        <div className="absolute top-1/2 -right-2 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.5s'}}></div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-3 text-lg group-hover:text-primary transition-colors duration-500 transform group-hover:translate-x-2">
                          {info.title}
                        </h4>
                        <div className="space-y-2">
                          {info.details.map((detail, detailIndex) => (
                            <p 
                              key={detailIndex} 
                              className="text-slate-300 group-hover:text-white transition-all duration-500 transform group-hover:translate-y-1 group-hover:scale-[1.02]"
                              style={{transitionDelay: `${detailIndex * 0.1}s`}}
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                        
                        {/* Animated underline */}
                        <div className="mt-3 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
                      </div>
                    </div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                    
                    {/* Magic dust effect */}
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                      <div className="flex gap-0.5">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-0.5 h-0.5 bg-primary/60 rounded-full animate-ping"
                            style={{animationDelay: `${i * 0.1}s`}}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-muted/50 border-0">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-lg font-bold text-foreground">إجراءات سريعة</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-background/80 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <action.icon className="h-5 w-5 text-primary" />
                        <div>
                          <h5 className="font-medium text-foreground text-sm">{action.title}</h5>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Interactive Map */}
        <Card className="mt-12 overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="p-4 bg-muted/30">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                موقعنا على الخريطة
              </h3>
              <p className="text-muted-foreground text-sm">شركة أفاز العقارية - الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
          <div className="w-full h-96 overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.9378422716213!2d46.637822400000005!3d24.8317992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f0504d92ddee9%3A0x625630d6ca0acc31!2z2LTYsdmD2Kkg2KfZgdin2LIg2KfZhNi52YLYp9ix2YrYqQ!5e0!3m2!1sar!2ssa!4v1756575651649!5m2!1sar!2ssa" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;