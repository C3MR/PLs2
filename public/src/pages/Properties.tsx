import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building, MapPin, Bed, Bath, Maximize, Home, Building2, Store, TreePine, Shield, Zap, Car, Wifi, Droplets, Wrench, Camera, Wind, Users, Settings, Eye, Heart, Share2, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
}

const getPropertyTypeIcon = (type: string) => {
  switch (type) {
    case 'apartment':
      return <Building className="w-4 h-4" />;
    case 'villa':
      return <Home className="w-4 h-4" />;
    case 'commercial':
      return <Store className="w-4 h-4" />;
    case 'land':
    case 'residential_land':
    case 'commercial_land':
      return <TreePine className="w-4 h-4" />;
    case 'rest_house':
    case 'traditional_house':
      return <Building2 className="w-4 h-4" />;
    case 'duplex':
    case 'residential_building':
    case 'commercial_building':
      return <Building2 className="w-4 h-4" />;
    case 'showroom':
    case 'warehouse':
      return <Store className="w-4 h-4" />;
    case 'office':
      return <Building className="w-4 h-4" />;
    case 'hall':
    case 'drive_thru':
      return <Store className="w-4 h-4" />;
    default:
      return <Building className="w-4 h-4" />;
  }
};

const getPropertyTypeLabel = (type: string) => {
  switch (type) {
    case 'apartment':
      return 'شقة';
    case 'villa':
      return 'فيلا';
    case 'commercial':
      return 'محل تجاري';
    case 'land':
      return 'أرض';
    case 'residential_land':
      return 'أرض سكنية';
    case 'commercial_land':
      return 'أرض تجارية';
    case 'rest_house':
      return 'استراحة';
    case 'duplex':
      return 'دوبلكس';
    case 'traditional_house':
      return 'بيت شعبي';
    case 'residential_building':
      return 'عمارة سكنية';
    case 'commercial_building':
      return 'عمارة تجارية';
    case 'showroom':
      return 'معرض';
    case 'office':
      return 'مكتب';
    case 'hall':
      return 'صالة';
    case 'warehouse':
      return 'مستودع';
    case 'drive_thru':
      return 'درايف ثرو';
    default:
      return type;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available':
      return 'متاح';
    case 'sold':
      return 'مباع';
    case 'rented':
      return 'مؤجر';
    case 'for_rent':
      return 'للإيجار';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'sold':
      return 'bg-red-500';
    case 'rented':
      return 'bg-blue-500';
    case 'for_rent':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

// دالة لتوليد رقم إعلان عقاري فريد لكل عقار
const generateAdNumber = (propertyId: string) => {
  // استخدام أول 8 أحرف من معرف العقار لضمان الثبات
  const hash = propertyId.slice(0, 8).toUpperCase();
  return `REGA-${hash}`;
};

// دالة لاختيار الصورة المناسبة حسب نوع العقار
const getPropertyImage = (propertyType: string) => {
  switch (propertyType) {
    case 'villa':
    case 'duplex':
    case 'traditional_house':
      return propertyVilla;
    case 'apartment':
    case 'residential_building':
      return propertyApartment;
    case 'commercial':
    case 'showroom':
    case 'office':
    case 'hall':
    case 'warehouse':
    case 'drive_thru':
    case 'commercial_building':
      return propertyCommercial;
    case 'land':
    case 'residential_land':
    case 'commercial_land':
      return propertyLand;
    default:
      return propertyApartment;
  }
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
  return Settings; // default icon
};

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all"); // سكني أو تجاري
  const [filterSubType, setFilterSubType] = useState("all"); // الأنواع الفرعية
  const [favorites, setFavorites] = useState<string[]>([]); // المفضلة
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, filterCategory, filterSubType]);

  // إعادة تعيين النوع الفرعي عند تغيير الفئة
  useEffect(() => {
    setFilterSubType("all");
  }, [filterCategory]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل العقارات",
          variant: "destructive",
        });
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل العقارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // البحث النصي
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // فلترة حسب الفئة (سكني أو تجاري) - مطابقة لنموذج طلب العقار
    if (filterCategory !== "all") {
      if (filterCategory === "residential") {
        // العقارات السكنية - شامل جميع الأنواع من نموذج طلب العقار
        filtered = filtered.filter(property => 
          ['apartment', 'villa', 'rest_house', 'land', 'residential_land', 'duplex', 'traditional_house', 'residential_building'].includes(property.property_type)
        );
      } else if (filterCategory === "commercial") {
        // العقارات التجارية - شامل جميع الأنواع من نموذج طلب العقار
        filtered = filtered.filter(property => 
          ['commercial', 'commercial_land', 'showroom', 'office', 'hall', 'warehouse', 'drive_thru', 'commercial_building'].includes(property.property_type)
        );
      }
    }

    // فلترة حسب النوع الفرعي
    if (filterSubType !== "all") {
      filtered = filtered.filter(property => property.property_type === filterSubType);
    }

    setFilteredProperties(filtered);
  };

  // الحصول على خيارات النوع الفرعي حسب الفئة المختارة - مطابقة لنموذج طلب العقار
  const getSubTypeOptions = () => {
    if (filterCategory === "residential") {
      return [
        { value: "all", label: "جميع العقارات السكنية" },
        { value: "residential_land", label: "أرض سكنية" },
        { value: "apartment", label: "شقة" },
        { value: "villa", label: "فيلا" },
        { value: "duplex", label: "دوبلكس" },
        { value: "traditional_house", label: "بيت شعبي" },
        { value: "residential_building", label: "عمارة سكنية" }
      ];
    } else if (filterCategory === "commercial") {
      return [
        { value: "all", label: "جميع العقارات التجارية" },
        { value: "commercial_land", label: "أرض تجارية" },
        { value: "showroom", label: "معرض" },
        { value: "office", label: "مكتب" },
        { value: "hall", label: "صالة" },
        { value: "warehouse", label: "مستودع" },
        { value: "drive_thru", label: "درايف ثرو" },
        { value: "commercial_building", label: "عمارة تجارية" }
      ];
    }
    return [{ value: "all", label: "اختر فئة أولاً" }];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const copyPropertyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "تم النسخ",
      description: "تم نسخ معرف العقار إلى الحافظة",
    });
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
    
    const isFavorited = !favorites.includes(propertyId);
    toast({
      title: isFavorited ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة",
      description: isFavorited ? "تم حفظ العقار في قائمة المفضلة" : "تم إزالة العقار من المفضلة",
    });
  };

  const shareProperty = (property: Property) => {
    const shareUrl = `${window.location.origin}/property/${property.id}`;
    const shareText = `شاهد هذا العقار المميز: ${property.title} - ${property.location}`;
    
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط العقار إلى الحافظة",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جارٍ تحميل العقارات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background via-background/95 to-background/90">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6">
                معرض العقارات المميز
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                اكتشف مجموعة مختارة من أفضل العقارات مع تجربة بصرية استثنائية وتقنيات عرض متطورة
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">{properties.length} عقار متاح</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-sm font-medium">تحديث مباشر</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
        {/* أدوات البحث والفلترة المحسنة */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="w-6 h-6 text-primary" />
              </div>
              أدوات البحث والاستكشاف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="البحث في العقارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-background/80 border-2 border-border/50 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-12 bg-background/80 border-2 border-border/50 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="فئة العقار" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="all" className="rounded-lg">جميع الفئات</SelectItem>
                  <SelectItem value="residential" className="rounded-lg">سكني</SelectItem>
                  <SelectItem value="commercial" className="rounded-lg">تجاري</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSubType} onValueChange={setFilterSubType}>
                <SelectTrigger className="h-12 bg-background/80 border-2 border-border/50 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="نوع العقار" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {getSubTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value} className="rounded-lg">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* إحصائيات النتائج */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-medium">عرض {filteredProperties.length} من أصل {properties.length} عقار</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>الأرقام باللغة الإنجليزية</span>
                <span className="px-2 py-1 bg-muted/50 rounded-md">EN</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* قائمة العقارات المحسنة */}
        {filteredProperties.length === 0 ? (
          <Card className="bg-card/30 border-dashed border-2 border-border/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Building className="w-20 h-20 text-muted-foreground/50 mb-6" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-muted-foreground">لا توجد عقارات متطابقة</h3>
              <p className="text-muted-foreground text-center max-w-md leading-relaxed">
                {properties.length === 0 
                  ? "لم يتم إضافة أي عقارات بعد إلى النظام" 
                  : "جرب تعديل معايير البحث للعثور على العقارات المناسبة"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => {
              // تحديد العقار الأكثر رواجًا (الأول في القائمة)
              const isPopular = index === 0;
              const price = Number(property.price);
              
              return (
                <Card 
                  key={property.id} 
                  className={`group relative overflow-hidden bg-card/80 backdrop-blur-sm border-0 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 h-[800px] flex flex-col ${
                    isPopular 
                      ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:pointer-events-none' 
                      : 'hover:ring-1 hover:ring-primary/20'
                  }`}
                >
                  {/* شريط العقار الأكثر رواجًا */}
                  {isPopular && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      الأكثر رواجًا ⭐
                    </div>
                  )}

                  {/* صورة العقار الحقيقية - 50% من البطاقة */}
                  <div className="relative h-1/2 flex-shrink-0 overflow-hidden">
                    <img 
                      src={getPropertyImage(property.property_type)} 
                      alt={`صورة ${getPropertyTypeLabel(property.property_type)}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                    
                     {/* بطاقة السعر فوق الصورة */}
                     <div className="absolute bottom-4 left-4 right-4">
                       <div className={`p-4 rounded-xl backdrop-blur-md border border-white/20 ${
                         isPopular 
                           ? 'bg-primary/20 shadow-lg' 
                           : 'bg-background/30 shadow-md'
                       }`}>
                         <div className="flex items-center justify-between">
                           <div className="space-y-1">
                             <p className="text-xs text-blue-900 font-semibold">السعر</p>
                             <div className="text-xl font-bold text-blue-900">
                               {price.toLocaleString('en-US')} 
                               <span className="text-sm font-normal text-blue-800 mr-1">ريال</span>
                             </div>
                           </div>
                           {isPopular && (
                             <div className="flex flex-col items-center">
                               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                 <span className="text-white font-bold text-sm">🔥</span>
                               </div>
                               <span className="text-xs text-white/90 font-medium mt-1">عرض حصري</span>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <Badge 
                        className={`text-white font-medium shadow-lg ${getStatusColor(property.status)}`}
                      >
                        {getStatusLabel(property.status)}
                      </Badge>
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        <div className="flex items-center gap-1">
                          {getPropertyTypeIcon(property.property_type)}
                          {getPropertyTypeLabel(property.property_type)}
                        </div>
                      </Badge>
                    </div>
                    {/* أيقونة نوع العقار الكبيرة */}
                    <div className="absolute top-4 right-4 p-3 bg-background/10 backdrop-blur-md rounded-full border border-border/20">
                      <div className="text-2xl text-primary">
                        {getPropertyTypeIcon(property.property_type)}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>
                  </CardHeader>

                   <CardContent className="space-y-4 flex-grow p-4">
                     {/* مربع المواصفات الأساسية */}
                     <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-xl border border-primary/20">
                       <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                         <Building className="w-4 h-4" />
                         المواصفات الأساسية
                       </h4>
                       <div className="grid grid-cols-2 gap-3">
                         <div className="flex items-center gap-2 text-sm">
                           <MapPin className="w-4 h-4 text-primary shrink-0" />
                           <span className="font-medium truncate">{property.location}</span>
                         </div>
                         
                         {property.area && (
                           <div className="flex items-center gap-2 text-sm">
                             <Maximize className="w-4 h-4 text-primary shrink-0" />
                             <span className="font-medium">{Number(property.area).toLocaleString('en-US')} م²</span>
                           </div>
                         )}

                         {property.bedrooms > 0 && (
                           <div className="flex items-center gap-2 text-sm">
                             <Bed className="w-4 h-4 text-primary shrink-0" />
                             <span className="font-medium">{property.bedrooms} غرف</span>
                           </div>
                         )}

                         {property.bathrooms > 0 && (
                           <div className="flex items-center gap-2 text-sm">
                             <Bath className="w-4 h-4 text-primary shrink-0" />
                             <span className="font-medium">{property.bathrooms} حمام</span>
                           </div>
                         )}
                       </div>
                     </div>

                     {/* الأزرار التفاعلية */}
                     <div className="flex gap-3">
                       <Button 
                         variant="default"
                         className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
                         onClick={() => navigate(`/property/${property.id}`)}
                       >
                         <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                         عرض
                       </Button>
                       
                       <Button 
                         variant="outline"
                         className={`p-3 border-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                           favorites.includes(property.id)
                             ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                             : 'bg-white hover:bg-pink-50 border-pink-200 text-pink-600 hover:border-pink-300'
                         }`}
                         onClick={() => toggleFavorite(property.id)}
                       >
                         <Heart 
                           className={`w-4 h-4 transition-all duration-300 ${
                             favorites.includes(property.id) ? 'fill-current scale-110' : 'hover:scale-110'
                           }`} 
                         />
                       </Button>
                       
                       <Button 
                         variant="outline"
                         className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-600 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-300 rounded-xl transition-all duration-300 hover:scale-105 group"
                         onClick={() => shareProperty(property)}
                       >
                         <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                       </Button>
                     </div>

                     {/* التفاصيل الإضافية - المرافق */}
                     {property.amenities && property.amenities.length > 0 && (
                       <div className="space-y-3">
                         <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                           <Settings className="w-4 h-4" />
                           المرافق والمميزات
                         </h4>
                         <div className="grid grid-cols-2 gap-2">
                           {property.amenities.slice(0, 4).map((amenity, index) => {
                             const IconComponent = getAmenityIcon(amenity);
                             return (
                               <div 
                                 key={index}
                                 className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg text-xs"
                               >
                                 <IconComponent className="w-3 h-3 text-primary shrink-0" />
                                 <span className="truncate">{amenity}</span>
                               </div>
                             );
                           })}
                           {property.amenities.length > 4 && (
                             <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg text-xs">
                               <MoreHorizontal className="w-3 h-3 text-secondary shrink-0" />
                               <span>+{property.amenities.length - 4} مرفق</span>
                             </div>
                           )}
                         </div>
                       </div>
                     )}

                    {/* رقم الإعلان العقاري مع شعار الهيئة */}
                    <div className="p-4 bg-muted/10 rounded-xl border border-border/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src="/lovable-uploads/598ec773-1b31-47fd-8cb4-0664b0ecbf77.png"
                            alt="شعار الهيئة العامة للعقار" 
                            className="w-8 h-8 object-contain"
                          />
                          <span className="text-xs text-muted-foreground font-medium">الهيئة العامة للعقار</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          معتمد
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">رقم الإعلان العقاري</span>
                          <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded text-primary">
                            {generateAdNumber(property.id)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Property ID</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPropertyId(property.id)}
                            className="text-xs font-mono p-0 h-auto hover:text-primary transition-colors"
                          >
                            #{property.id.slice(0, 8)}...
                          </Button>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      {/* Internal Linking System */}
      <div className="mt-12">
        <InternalLinkingSystem currentPage="/properties" />
      </div>

      {/* Contextual Links */}
      <div className="mt-8">
        <ContextualLinks context="property-detail" />
      </div>
        </div>
      </div>
    </Layout>
  );
}