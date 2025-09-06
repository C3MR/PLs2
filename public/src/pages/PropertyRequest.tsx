import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  Clock,
  MessageCircle,
  Send,
  ChevronDown
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validateKSAPhone, formatKSAPhone } from '@/utils/validation';
import InternalLinkingSystem from '@/components/InternalLinkingSystem';
import SmartNavigation from '@/components/SmartNavigation';

const PropertyRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    propertyUsage: '',
    propertyType: '',
    facilityName: '',
    activityType: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    preferredTime: '',
    contactMethod: '',
    requestDescription: ''
  });
  const [showDynamicFields, setShowDynamicFields] = useState({
    propertyUsage: false,
    propertyType: false,
    facilityName: false,
    activityType: false
  });

  const { toast } = useToast();

  const propertyTypeOptions = {
    commercial: [
      { value: 'commercial_land', label: 'أرض تجارية' },
      { value: 'showroom', label: 'معرض' },
      { value: 'office', label: 'مكتب' },
      { value: 'hall', label: 'صالة' },
      { value: 'warehouse', label: 'مستودع' },
      { value: 'drive_thru', label: 'درايف ثرو' },
      { value: 'commercial_building', label: 'عمارة تجارية' }
    ],
    residential: [
      { value: 'residential_land', label: 'أرض سكنية' },
      { value: 'apartment', label: 'شقة' },
      { value: 'villa', label: 'فيلا' },
      { value: 'duplex', label: 'دوبلكس' },
      { value: 'traditional_house', label: 'بيت شعبي' },
      { value: 'residential_building', label: 'عمارة سكنية' }
    ]
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Handle dynamic field visibility
    if (field === 'serviceType') {
      const newShowFields = { ...showDynamicFields };
      
      if (value === 'marketing' || value === 'management') {
        newShowFields.propertyUsage = true;
        newShowFields.propertyType = true;
        newShowFields.facilityName = false;
        newShowFields.activityType = false;
      } else if (value === 'support') {
        newShowFields.facilityName = true;
        newShowFields.activityType = true;
        newShowFields.propertyUsage = false;
        newShowFields.propertyType = false;
      } else {
        newShowFields.propertyUsage = false;
        newShowFields.propertyType = false;
        newShowFields.facilityName = false;
        newShowFields.activityType = false;
      }
      
      setShowDynamicFields(newShowFields);
      
      // Clear dependent fields
      setFormData(prev => ({
        ...prev,
        propertyUsage: '',
        propertyType: '',
        facilityName: '',
        activityType: ''
      }));
    }

    // Update property type options based on usage
    if (field === 'propertyUsage') {
      setFormData(prev => ({
        ...prev,
        propertyType: '' // Clear property type when usage changes
      }));
    }
  };

  const validateForm = () => {
    if (!formData.serviceType) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى اختيار نوع الخدمة",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.clientName.trim()) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى إدخال الاسم",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.clientPhone.trim()) {
      toast({
        title: "خطأ في النموذج", 
        description: "يرجى إدخال رقم الجوال",
        variant: "destructive"
      });
      return false;
    }

    if (!validateKSAPhone(formData.clientPhone)) {
      toast({
        title: "خطأ في النموذج",
        description: "رقم الجوال غير صحيح",
        variant: "destructive"
      });
      return false;
    }

    if (formData.clientEmail && !validateEmail(formData.clientEmail)) {
      toast({
        title: "خطأ في النموذج",
        description: "البريد الإلكتروني غير صحيح",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.contactMethod) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى اختيار وسيلة التواصل المفضلة",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestId = `REQ-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.clientName.trim(),
          phone: formatKSAPhone(formData.clientPhone),
          email: formData.clientEmail.trim() || null,
          subject: `طلب خدمة: ${formData.serviceType}`,
          message: `نوع الخدمة: ${formData.serviceType}
${formData.propertyUsage ? `استخدام العقار: ${formData.propertyUsage}` : ''}
${formData.propertyType ? `نوع العقار: ${formData.propertyType}` : ''}
${formData.facilityName ? `اسم المنشأة: ${formData.facilityName}` : ''}
${formData.activityType ? `نوع النشاط: ${formData.activityType}` : ''}
${formData.preferredTime ? `وقت التواصل المفضل: ${formData.preferredTime}` : ''}
وسيلة التواصل المفضلة: ${formData.contactMethod}
${formData.requestDescription ? `الوصف: ${formData.requestDescription}` : ''}`,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "✅ تم إرسال الطلب بنجاح",
        description: "سيتم التواصل معك قريباً",
      });
      
      // Reset form
      setFormData({
        serviceType: '',
        propertyUsage: '',
        propertyType: '',
        facilityName: '',
        activityType: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        preferredTime: '',
        contactMethod: '',
        requestDescription: ''
      });
      
      setShowDynamicFields({
        propertyUsage: false,
        propertyType: false,
        facilityName: false,
        activityType: false
      });
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلبك، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary-dark/40"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent"></div>
          
          {/* Animated Geometric Shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rotate-45 animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-primary/30 rounded-lg animate-spin" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-32 right-32 w-8 h-8 bg-gradient-to-r from-primary-light to-primary transform rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Moving Dots Pattern */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-tl from-primary-dark/10 to-transparent rounded-lg animate-float" style={{animationDelay: '1.5s'}}></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="border border-primary/20"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              طلب خدمة
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              يمكنك طلب أي من خدماتنا العقارية المتميزة من خلال تعبئة النموذج أدناه وسيقوم فريقنا بالتواصل معك في أقرب وقت ممكن
            </p>
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold text-center text-foreground">
                نموذج طلب الخدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Type */}
                  <div className="md:col-span-2">
                    <Label className="text-lg font-semibold mb-3 block">
                      نوع الخدمة <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                      <SelectTrigger className="h-12 text-right">
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">التسويق العقاري</SelectItem>
                        <SelectItem value="management">إدارة الأملاك</SelectItem>
                        <SelectItem value="investment">الاستثمار</SelectItem>
                        <SelectItem value="support">الخدمات المساندة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Property Usage - Dynamic Field */}
                  {showDynamicFields.propertyUsage && (
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">
                        استخدام العقار <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.propertyUsage} onValueChange={(value) => handleInputChange('propertyUsage', value)}>
                        <SelectTrigger className="h-12 text-right">
                          <SelectValue placeholder="اختر استخدام العقار" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commercial">تجاري</SelectItem>
                          <SelectItem value="residential">سكني</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Property Type - Dynamic Field */}
                  {showDynamicFields.propertyType && formData.propertyUsage && (
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">
                        نوع العقار <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger className="h-12 text-right">
                          <SelectValue placeholder="اختر نوع العقار" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.propertyUsage && propertyTypeOptions[formData.propertyUsage as keyof typeof propertyTypeOptions]?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Facility Name - Dynamic Field for Support Services */}
                  {showDynamicFields.facilityName && (
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">
                        اسم المنشأة <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.facilityName}
                        onChange={(e) => handleInputChange('facilityName', e.target.value)}
                        placeholder="أدخل اسم المنشأة"
                        className="h-12"
                      />
                    </div>
                  )}

                  {/* Activity Type - Dynamic Field for Support Services */}
                  {showDynamicFields.activityType && (
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">
                        النشاط <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.activityType} onValueChange={(value) => handleInputChange('activityType', value)}>
                        <SelectTrigger className="h-12 text-right">
                          <SelectValue placeholder="اختر نوع النشاط" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">تجارة التجزئة</SelectItem>
                          <SelectItem value="restaurant">مطاعم وكافيهات</SelectItem>
                          <SelectItem value="healthcare">رعاية صحية</SelectItem>
                          <SelectItem value="education">تعليم</SelectItem>
                          <SelectItem value="entertainment">ترفيه</SelectItem>
                          <SelectItem value="other">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Client Information */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      الاسم <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        className="h-12 pr-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      رقم الجوال <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="05xxxxxxxx"
                        className="h-12 pr-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      البريد الإلكتروني
                    </Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="example@domain.com"
                        className="h-12 pr-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      وقت التواصل المفضل
                    </Label>
                    <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                      <SelectTrigger className="h-12 text-right">
                        <SelectValue placeholder="اختر وقت التواصل المفضل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">صباحاً (9 ص - 12 م)</SelectItem>
                        <SelectItem value="afternoon">ظهراً (12 م - 3 م)</SelectItem>
                        <SelectItem value="evening">مساءً (3 م - 6 م)</SelectItem>
                        <SelectItem value="anytime">أي وقت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Method */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      وسيلة التواصل المفضلة <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup 
                      value={formData.contactMethod} 
                      onValueChange={(value) => handleInputChange('contactMethod', value)}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="call" id="call" />
                        <Label htmlFor="call" className="flex items-center cursor-pointer">
                          <Phone className="h-4 w-4 ml-2 text-primary" />
                          اتصال هاتفي
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="whatsapp" id="whatsapp" />
                        <Label htmlFor="whatsapp" className="flex items-center cursor-pointer">
                          <MessageCircle className="h-4 w-4 ml-2 text-green-600" />
                          واتساب
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Request Description */}
                  <div className="md:col-span-2">
                    <Label className="text-lg font-semibold mb-3 block">
                      ملاحظات أو وصف الطلب
                    </Label>
                    <Textarea
                      value={formData.requestDescription}
                      onChange={(e) => handleInputChange('requestDescription', e.target.value)}
                      placeholder="يرجى وصف طلبك بالتفصيل..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-12 py-4 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all duration-300 hover:shadow-elegant"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">الأسئلة الشائعة</h2>
            <p className="text-lg text-muted-foreground">
              إليك بعض الأسئلة الشائعة حول خدماتنا العقارية
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-0 shadow-medium bg-card">
              <h3 className="text-xl font-bold text-foreground mb-3">
                ما هي مدة الرد على طلب الخدمة؟
              </h3>
              <p className="text-muted-foreground">
                سيتم الرد على طلبك خلال مدة أقصاها 24 ساعة من وقت تقديم الطلب.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-medium bg-card">
              <h3 className="text-xl font-bold text-foreground mb-3">
                ما هي الخدمات المساندة للقطاع التجاري؟
              </h3>
              <p className="text-muted-foreground">
                نقدم خدمات متنوعة تشمل دراسات الجدوى، والاستشارات العقارية، وإدارة المرافق التجارية.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-medium bg-card">
              <h3 className="text-xl font-bold text-foreground mb-3">
                هل يمكنني تعديل طلبي بعد الإرسال؟
              </h3>
              <p className="text-muted-foreground">
                نعم، يمكنك التواصل معنا لتعديل طلبك قبل بدء تنفيذ الخدمة.
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-medium bg-card">
              <h3 className="text-xl font-bold text-foreground mb-3">
                هل تغطي خدماتكم جميع مناطق الرياض؟
              </h3>
              <p className="text-muted-foreground">
                نعم، نغطي جميع مناطق الرياض وضواحيها بفريق متخصص لكل منطقة.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Internal Linking and Navigation */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <InternalLinkingSystem currentPage="/property-request" />
            <SmartNavigation />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertyRequest;