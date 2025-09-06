import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Users,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Star,
  Building,
  UserCheck,
  Settings
} from 'lucide-react';

import Layout from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background" dir="rtl">
        <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-primary/10 p-6 rounded-full">
                <Shield className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            التزاماتنا وإجراءاتنا التشغيلية لحماية خصوصيتكم وضمان شفافية التعامل
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Commitments Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" />
                أبرز التزاماتنا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">النزاهة والصدق</h3>
                      <p className="text-muted-foreground">
                        معلومات دقيقة وواضحة في جميع تعاملاتنا.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <Users className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">الاحترافية</h3>
                      <p className="text-muted-foreground">
                        فريق عمل مؤهل لخدمتكم بأعلى كفاءة.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <FileText className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">الامتثال للأنظمة</h3>
                      <p className="text-muted-foreground">
                        التزام كامل بلوائح الهيئة العامة للعقار.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <Shield className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">حماية الخصوصية</h3>
                      <p className="text-muted-foreground">
                        نتعامل مع بياناتكم بسرية وأمان تام.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Procedures Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                الإجراءات التشغيلية
              </CardTitle>
              <p className="text-muted-foreground">
                اختر الدور الذي يمثلك للاطلاع على الإجراءات الخاصة بك.
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Property Owners/Advertisers Procedures */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">إجراءات المُعلنين ومُلّاك العقارات</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">1</Badge>
                      <h4 className="font-semibold">طلب إدراج عقار</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      تقديم الطلب عبر قنواتنا الرسمية مع المستندات اللازمة.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">2</Badge>
                      <h4 className="font-semibold">التحقق والمعاينة</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      يقوم فريقنا بالتحقق من المستندات ومعاينة العقار.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">3</Badge>
                      <h4 className="font-semibold">العمولات والرسوم</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      يتم توضيحها بشفافية في عقد الوساطة قبل البدء.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Buyers/Tenants Procedures */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">إجراءات المشترين والمستأجرين</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">1</Badge>
                      <h4 className="font-semibold">الاستفسار والزيارة</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ترتيب مواعيد لزيارة العقارات المناسبة.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-teal-100 text-teal-800">2</Badge>
                      <h4 className="font-semibold">تقديم العروض</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      إيصال عروض الشراء أو الاستئجار الرسمية للمالك.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">3</Badge>
                      <h4 className="font-semibold">إتمام الصفقة</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      تقديم الدعم لإتمام الإجراءات عبر المنصات المعتمدة.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Management Service */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                خدمة إدارة الأملاك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                يتم توقيع عقد إدارة أملاك يوضح نطاق الخدمات (تحصيل الإيجارات، الصيانة، وغيرها)، 
                مع تزويد المالك بتقارير دورية وشفافة.
              </p>
            </CardContent>
          </Card>

          {/* Professional Code of Conduct */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                السياسات العامة وميثاق العمل
              </CardTitle>
              <p className="text-muted-foreground">ميثاق السلوك المهني</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg border-l-4 border-primary bg-muted/30">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">النزاهة والصدق</h4>
                    <p className="text-muted-foreground">نتعامل مع جميع الأطراف بصدق وأمانة.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg border-l-4 border-primary bg-muted/30">
                  <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">الاحترافية</h4>
                    <p className="text-muted-foreground">نلتزم بتقديم الخدمات بكفاءة مهنية عالية.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg border-l-4 border-primary bg-muted/30">
                  <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">تضارب المصالح</h4>
                    <p className="text-muted-foreground">نتجنب أي مواقف قد تؤدي إلى تضارب في المصالح.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complaints and Disputes Resolution */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                حل الشكاوى والنزاعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  نرحب دائماً بملاحظاتكم واقتراحاتكم. لتقديم شكوى أو مقترح، يرجى التواصل معنا.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="mailto:info@avaz.sa"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    info@avaz.sa
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
    </Layout>
  );
};

export default PrivacyPolicy;