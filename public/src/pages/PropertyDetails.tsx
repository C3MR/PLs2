import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowRight, 
  Share2, 
  Phone, 
  Mail, 
  MessageCircle, 
  DollarSign,
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Home,
  Building,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Car,
  Wifi,
  Droplets,
  Wrench,
  Camera,
  Wind,
  Users,
  Settings,
  TreePine,
  Heart,
  Calendar,
  X,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import property images
import propertyApartment from "@/assets/property-apartment.jpg";
import propertyVilla from "@/assets/property-villa.jpg";
import propertyCommercial from "@/assets/property-commercial.jpg";
import propertyLand from "@/assets/property-land.jpg";
import InternalLinkingSystem from "@/components/InternalLinkingSystem";
import ContextualLinks from "@/components/ContextualLinks";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  status: string;
  amenities: string[];
  created_at: string;
  created_by?: string;
}

// دالة لاختيار الصورة المناسبة حسب نوع العقار
const getPropertyImages = (propertyType: string) => {
  const images = [];
  switch (propertyType) {
    case 'villa':
    case 'duplex':
    case 'traditional_house':
      images.push(propertyVilla, propertyApartment, propertyCommercial, propertyLand, propertyVilla);
      break;
    case 'apartment':
    case 'residential_building':
      images.push(propertyApartment, propertyVilla, propertyCommercial, propertyVilla, propertyLand);
      break;
    case 'commercial':
    case 'showroom':
    case 'office':
    case 'hall':
    case 'warehouse':
    case 'drive_thru':
    case 'commercial_building':
      images.push(propertyCommercial, propertyApartment, propertyVilla, propertyLand, propertyCommercial);
      break;
    default:
      images.push(propertyApartment, propertyVilla, propertyCommercial, propertyLand, propertyApartment);
  }
  return images;
};

// دالة لتوليد رقم إعلان عقاري فريد
const generateAdNumber = (propertyId: string) => {
  const hash = propertyId.slice(0, 8).toUpperCase();
  return `R-2024-${hash.slice(0, 3)}`;
};

// دالة للحصول على اسم نوع العقار
const getPropertyTypeLabel = (type: string) => {
  const types: { [key: string]: string } = {
    'apartment': 'شقة',
    'villa': 'فيلا',
    'commercial': 'محل تجاري',
    'land': 'أرض',
    'residential_land': 'أرض سكنية',
    'commercial_land': 'أرض تجارية',
    'rest_house': 'استراحة',
    'duplex': 'دوبلكس',
    'traditional_house': 'بيت شعبي',
    'residential_building': 'عمارة سكنية',
    'commercial_building': 'عمارة تجارية',
    'showroom': 'معرض',
    'office': 'مكتب',
    'hall': 'صالة',
    'warehouse': 'مستودع',
    'drive_thru': 'درايف ثرو'
  };
  return types[type] || type;
};

// دالة للحصول على لون الحالة
const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-500';
    case 'sold': return 'bg-red-500';
    case 'rented': return 'bg-blue-500';
    case 'for_rent': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

// دالة للحصول على تسمية الحالة
const getStatusLabel = (status: string) => {
  const statuses: { [key: string]: string } = {
    'available': 'متاح للبيع',
    'sold': 'مباع',
    'rented': 'مؤجر',
    'for_rent': 'للإيجار'
  };
  return statuses[status] || status;
};

// دالة لاختيار الأيقونة المناسبة للمرفق
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();
  if (amenityLower.includes('حراسة') || amenityLower.includes('أمن')) return Shield;
  if (amenityLower.includes('كهرباء') || amenityLower.includes('كهربائي')) return Zap;
  if (amenityLower.includes('موقف') || amenityLower.includes('سيارة') || amenityLower.includes('جراج')) return Car;
  if (amenityLower.includes('واي فاي') || amenityLower.includes('انترنت') || amenityLower.includes('wifi')) return Wifi;
  if (amenityLower.includes('مياه') || amenityLower.includes('مياة')) return Droplets;
  if (amenityLower.includes('صيانة') || amenityLower.includes('خدمة')) return Wrench;
  if (amenityLower.includes('كاميرا') || amenityLower.includes('مراقبة')) return Camera;
  if (amenityLower.includes('تكييف') || amenityLower.includes('هوا')) return Wind;
  if (amenityLower.includes('مصعد') || amenityLower.includes('اسانسير')) return Settings;
  if (amenityLower.includes('استقبال') || amenityLower.includes('خدمات')) return Users;
  if (amenityLower.includes('حديقة') || amenityLower.includes('مساحة')) return TreePine;
  if (amenityLower.includes('مسبح')) return Droplets;
  if (amenityLower.includes('مطبخ') || amenityLower.includes('مجهز')) return Settings;
  if (amenityLower.includes('مفروش') || amenityLower.includes('اثاث')) return Home;
  return Settings;
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [priceRequestForm, setPriceRequestForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    offerType: '',
    additionalDetails: ''
  });

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .maybeSingle();

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل بيانات العقار",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "عقار غير موجود",
          description: "لم يتم العثور على العقار المطلوب",
          variant: "destructive",
        });
        navigate('/properties');
        return;
      }

      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل العقار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property?.title || 'عقار للبيع',
      text: `${property?.title} - ${property?.price?.toLocaleString('en-US')} ريال`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط العقار إلى الحافظة",
      });
    }
  };

  const handleContact = (method: 'phone' | 'email' | 'whatsapp') => {
    const contactInfo = {
      phone: '+966456712350966',
      email: 'info@avaz.sa'
    };

    switch (method) {
      case 'phone':
        window.open(`tel:${contactInfo.phone}`);
        break;
      case 'email':
        window.open(`mailto:${contactInfo.email}?subject=استفسار عن العقار ${property?.title}&body=أود الاستفسار عن العقار رقم ${generateAdNumber(property?.id || '')}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/966456712350966?text=مرحباً، أود الاستفسار عن العقار: ${property?.title}`);
        break;
    }
  };

  const handlePriceRequest = () => {
    toast({
      title: "تم إرسال طلب العرض",
      description: "سيتم التواصل معك خلال 24 ساعة",
    });
    setShowPriceDialog(false);
    setPriceRequestForm({
      fullName: '',
      phone: '',
      email: '',
      offerType: '',
      additionalDetails: ''
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const nextImage = () => {
    if (property) {
      const images = getPropertyImages(property.property_type);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      const images = getPropertyImages(property.property_type);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل تفاصيل العقار...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">عقار غير موجود</h2>
          <p className="text-muted-foreground mb-4">لم يتم العثور على العقار المطلوب</p>
          <Button onClick={() => navigate('/properties')}>
            العودة إلى قائمة العقارات
          </Button>
        </div>
      </div>
    );
  }

  const images = getPropertyImages(property.property_type);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90" dir="rtl"
           style={{ direction: 'rtl', textAlign: 'right' }}>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/properties')}
                  className="gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة
                </Button>
                <div>
                  <h1 className="text-xl font-bold">{property.title}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Property Code - أعلى اليمين */}
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono">
                  {generateAdNumber(property.id)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? 'text-red-500 border-red-200' : ''}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                {/* Edit Property Button - Only for authenticated users with permissions */}
                {user && (hasPermission('properties:update') || property.created_by === user.id) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/dashboard/properties/edit/${property.id}`)}
                    className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل العقار
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  مشاركة
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <Card className="overflow-hidden">
                <div className="relative h-96 group">
                  <img
                    src={images[currentImageIndex]}
                    alt={`صورة العقار ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Navigation arrows */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>

                  {/* Property info overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Badge className={`text-white font-medium ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </Badge>
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {getPropertyTypeLabel(property.property_type)}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={image} alt={`صورة ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Property Details Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    تفاصيل العقار
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="specifications" className="w-full" dir="rtl">
                    <TabsList className="grid w-full grid-cols-2" dir="rtl">
                      <TabsTrigger value="specifications">مواصفات العقار</TabsTrigger>
                      <TabsTrigger value="neighborhood">مواصفات الحي</TabsTrigger>
                    </TabsList>

                    <TabsContent value="specifications" className="space-y-6 mt-6">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                      </div>

                      <Separator />

                      {/* Property specifications grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-muted/10 rounded-lg">
                          <Home className="w-6 h-6 text-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">نوع العقار</p>
                          <p className="font-semibold">{getPropertyTypeLabel(property.property_type)}</p>
                        </div>
                        
                        {property.area && (
                          <div className="text-center p-4 bg-muted/10 rounded-lg">
                            <Maximize className="w-6 h-6 text-secondary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">المساحة</p>
                            <p className="font-semibold">{Number(property.area).toLocaleString('en-US')} م²</p>
                          </div>
                        )}

                        {property.bedrooms > 0 && (
                          <div className="text-center p-4 bg-muted/10 rounded-lg">
                            <Bed className="w-6 h-6 text-accent mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">غرف النوم</p>
                            <p className="font-semibold">{property.bedrooms}</p>
                          </div>
                        )}

                        {property.bathrooms > 0 && (
                          <div className="text-center p-4 bg-muted/10 rounded-lg">
                            <Bath className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">دورات المياه</p>
                            <p className="font-semibold">{property.bathrooms}</p>
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      {property.amenities && property.amenities.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <Star className="w-5 h-5 text-primary" />
                              مميزات العقار
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {property.amenities.map((amenity, index) => {
                                const IconComponent = getAmenityIcon(amenity);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                                  >
                                    <IconComponent className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="text-sm font-medium text-green-800">{amenity}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="neighborhood" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">الخدمات القريبة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <Building className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-800">مراكز تسوق</p>
                              <p className="text-sm text-blue-600">على بُعد 5 دقائق</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <Settings className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="font-medium text-red-800">مستشفيات</p>
                              <p className="text-sm text-red-600">على بُعد 10 دقائق</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <Users className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="font-medium text-orange-800">مدارس</p>
                              <p className="text-sm text-orange-600">على بُعد 3 دقائق</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Fake Map */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">الموقع على الخريطة</h3>
                        <div className="w-full h-64 rounded-lg border bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <svg viewBox="0 0 400 300" className="w-full h-full">
                              {/* Grid pattern */}
                              <defs>
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" strokeWidth="0.5"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid)" />
                              {/* Roads */}
                              <path d="M0,150 Q200,100 400,150" stroke="#999" strokeWidth="3" fill="none"/>
                              <path d="M200,0 L200,300" stroke="#999" strokeWidth="2" fill="none"/>
                              <path d="M100,0 L100,300" stroke="#ccc" strokeWidth="1" fill="none"/>
                              <path d="M300,0 L300,300" stroke="#ccc" strokeWidth="1" fill="none"/>
                            </svg>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6 bg-white/90 rounded-lg shadow-lg">
                              <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                              <h4 className="font-semibold text-lg mb-2">موقع العقار</h4>
                              <p className="text-muted-foreground text-sm">{property.location}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                إحداثيات وهمية: 24.7136° N, 46.6753° E
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      SAR {formatPrice(Number(property.price))}
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">تواصل معنا</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">هاتف</p>
                    <p className="font-mono text-lg">+966 4567 123 50 966</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="text-sm">info@avaz.sa</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={() => handleContact('phone')}
                    >
                      <Phone className="w-4 h-4 ml-2" />
                      استفسر عن العقار
                    </Button>
                    
                    <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <DollarSign className="w-4 h-4 ml-2" />
                          طلب عرض سعر
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-center flex items-center justify-between">
                            <span>طلب عرض سعر</span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setShowPriceDialog(false)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">الاسم الكامل *</Label>
                            <Input
                              id="fullName"
                              placeholder="أدخل اسمك الكامل"
                              value={priceRequestForm.fullName}
                              onChange={(e) => setPriceRequestForm(prev => ({...prev, fullName: e.target.value}))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">رقم الهاتف *</Label>
                            <Input
                              id="phone"
                              placeholder="رقم الهاتف"
                              value={priceRequestForm.phone}
                              onChange={(e) => setPriceRequestForm(prev => ({...prev, phone: e.target.value}))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="البريد الإلكتروني"
                              value={priceRequestForm.email}
                              onChange={(e) => setPriceRequestForm(prev => ({...prev, email: e.target.value}))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="offerType">نوع العرض المطلوب *</Label>
                            <Select 
                              value={priceRequestForm.offerType} 
                              onValueChange={(value) => setPriceRequestForm(prev => ({...prev, offerType: value}))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع العرض" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="buy">شراء</SelectItem>
                                <SelectItem value="rent">إيجار</SelectItem>
                                <SelectItem value="investment">استثمار</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="details">تفاصيل إضافية</Label>
                            <Textarea
                              id="details"
                              placeholder="أضف أي تفاصيل أو متطلبات خاصة... (حد أقصى 500 حرف)"
                              value={priceRequestForm.additionalDetails}
                              onChange={(e) => setPriceRequestForm(prev => ({...prev, additionalDetails: e.target.value}))}
                              maxLength={500}
                            />
                          </div>

                          <Button 
                            className="w-full bg-orange-600 hover:bg-orange-700" 
                            onClick={handlePriceRequest}
                          >
                            إرسال طلب العرض
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleContact('whatsapp')}
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      واتساب
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* REGA License Card */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="/lovable-uploads/598ec773-1b31-47fd-8cb4-0664b0ecbf77.png"
                      alt="شعار الهيئة العامة للعقار" 
                      className="w-8 h-8 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">الهيئة العامة للعقار</p>
                      <p className="text-xs text-green-600">ترخيص إعلان رقم: {generateAdNumber(property.id)}</p>
                    </div>
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-green-700">معتمد من الهيئة العامة للعقار</p>
                </CardContent>
              </Card>

              {/* Property Share Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-sm">مشاركة العقار</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="w-4 h-4 ml-2" />
                    مشاركة العقار
                  </Button>
                </CardContent>
              </Card>

              {/* Date Added - English Date */}
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">تاريخ الإضافة</p>
                  <p className="text-sm font-medium">
                    {new Date(property.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Internal Linking and Related Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InternalLinkingSystem currentPage="/property-detail" />
            <ContextualLinks context="property-detail" entityId={property.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
}