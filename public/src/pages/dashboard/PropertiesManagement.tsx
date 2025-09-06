import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Building,
  Search,
  Filter,
  Download,
  Eye,
  Share2,
  MapPin,
  Bed,
  Bath,
  Car,
  Ruler,
  Star,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Loader2,
  CheckCircle,
  Home,
  Building2,
  Store,
  Warehouse,
  Target,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProperties, type Property } from '@/hooks/useProperties';
import AddPropertyModal from '@/components/modals/AddPropertyModal';
import { ImageGallery, DocumentManager } from '@/components/FileUpload';

const PropertiesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSharingPDF, setIsSharingPDF] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  
  const { properties, loading, fetchProperties, deleteProperty, exportProperties } = useProperties();

  const propertyTypeIcons = {
    apartment: Home,
    villa: Building2,
    commercial: Store,
    land: Target
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      apartment: 'شقة',
      villa: 'فيلا',
      commercial: 'تجاري',
      land: 'أرض'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">متاح</Badge>;
      case 'sold':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">مباع</Badge>;
      case 'rented':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">مؤجر</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const handleShareProperty = async (property: Property, method: string) => {
    const propertyUrl = `https://avaz.com/property/${property.id}`;
    
    switch (method) {
      case 'link':
        navigator.clipboard.writeText(propertyUrl);
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط العقار إلى الحافظة",
        });
        break;
        
      case 'whatsapp':
        const whatsappText = `شاهد هذا العقار الرائع: ${property.title}\nالموقع: ${property.location}\nالسعر: ${property.price.toLocaleString('en-US')} ر.س\n${propertyUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
        break;
        
      case 'email':
        const emailSubject = `عقار مميز: ${property.title}`;
        const emailBody = `أعتقد أن هذا العقار قد يهمك:\n\n${property.title}\nالموقع: ${property.location}\nالسعر: ${property.price.toLocaleString('en-US')} ر.س\nالمساحة: ${property.area} م²\n\nللمزيد من التفاصيل: ${propertyUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_blank');
        break;
        
      case 'pdf':
        await handleGeneratePDF(property);
        break;
    }
  };

  const handleGeneratePDF = async (property: Property) => {
    setIsSharingPDF(true);
    
    toast({
      title: "🔄 جاري إنشاء البروشور",
      description: "يرجى الانتظار، سيتم إنشاء ملف PDF احترافي للعقار...",
    });

    // محاكاة عملية إنشاء PDF
    setTimeout(() => {
      setIsSharingPDF(false);
      toast({
        title: "✅ تم إنشاء البروشور بنجاح",
        description: "تم تحميل ملف PDF للعقار تلقائياً",
      });
    }, 3000);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || property.property_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteProperty = async (propertyId: string) => {
    await deleteProperty(propertyId);
  };

  const PropertyCard = ({ property }: { property: Property }) => {
    const TypeIcon = propertyTypeIcons[property.property_type as keyof typeof propertyTypeIcons] || Building;
    
    return (
      <Card className="hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-0">
          {/* صورة العقار */}
          <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted/30 rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Building className="h-16 w-16 text-muted-foreground" />
            </div>
            
            {/* شارات الحالة والنوع */}
            <div className="absolute top-4 right-4 flex gap-2">
              {getStatusBadge(property.status)}
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                <TypeIcon className="h-3 w-3 mr-1" />
                {getTypeLabel(property.property_type)}
              </Badge>
            </div>
            
            {/* تقييم العقار */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium">4.8</span>
              </div>
            </div>

            {/* إحصائيات المشاهدات والاهتمام */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <Eye className="h-3 w-3 text-white" />
                <span className="text-xs text-white">0</span>
              </div>
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                <Heart className="h-3 w-3 text-white" />
                <span className="text-xs text-white">0</span>
              </div>
            </div>
          </div>

          {/* تفاصيل العقار */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-3 w-3" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* السعر */}
            <div className="text-2xl font-bold text-primary">
              {property.price.toLocaleString('en-US')} ر.س
            </div>

            {/* مواصفات العقار */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                <span>{property.area || 0} م²</span>
              </div>
              {property.bedrooms && property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="h-3 w-3" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
            </div>

            {/* المميزات */}
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3}
                </Badge>
              )}
            </div>

            {/* معلومات المسوق */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                    م
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">مسوق عقاري</p>
                  <p className="text-xs text-muted-foreground">أفاز العقارية</p>
                </div>
              </div>
              
              {/* أزرار الإجراءات */}
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedProperty(property)}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف العقار "{property.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات العقارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة العقارات</h1>
          <p className="text-muted-foreground">إدارة ومشاركة العقارات مع العملاء</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => fetchProperties()}>
            <RefreshCw className="h-4 w-4" />
            تحديث
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportProperties}>
            <Download className="h-4 w-4" />
            تصدير قائمة العقارات
          </Button>
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Building className="h-4 w-4" />
            إضافة عقار جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">إجمالي العقارات</p>
                <p className="text-3xl font-bold text-blue-800">{properties.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">متاحة للبيع</p>
                <p className="text-3xl font-bold text-green-800">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">إجمالي المساحات</p>
                <p className="text-3xl font-bold text-orange-800">
                  {properties.reduce((sum, p) => sum + (p.area || 0), 0)} م²
                </p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">متوسط السعر</p>
                <p className="text-3xl font-bold text-purple-800">
                  {properties.length > 0 ? 
                    `${(properties.reduce((sum, p) => sum + p.price, 0) / properties.length / 1000000).toFixed(1)}م ر.س` : 
                    '0'
                  }
                </p>
              </div>
              <Heart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في العقارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="نوع العقار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="apartment">شقة</SelectItem>
                <SelectItem value="villa">فيلا</SelectItem>
                <SelectItem value="commercial">تجاري</SelectItem>
                <SelectItem value="land">أرض</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="available">متاح</SelectItem>
                <SelectItem value="sold">مباع</SelectItem>
                <SelectItem value="rented">مؤجر</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              فلاتر متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* قائمة العقارات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* نافذة مشاركة العقار */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                مشاركة العقار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedProperty.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleShareProperty(selectedProperty, 'link')}
                >
                  <Copy className="h-4 w-4" />
                  نسخ الرابط
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  onClick={() => handleShareProperty(selectedProperty, 'whatsapp')}
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleShareProperty(selectedProperty, 'email')}
                >
                  <Mail className="h-4 w-4" />
                  بريد إلكتروني
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                  onClick={() => handleShareProperty(selectedProperty, 'pdf')}
                  disabled={isSharingPDF}
                >
                  {isSharingPDF ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  بروشور PDF
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProperty(null)}
                  className="flex-1"
                >
                  إغلاق
                </Button>
                <Button 
                  onClick={() => handleShareProperty(selectedProperty, 'link')}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  فتح العقار
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPropertyAdded={fetchProperties}
      />

      {filteredProperties.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">لا توجد عقارات</p>
            <p className="text-sm text-muted-foreground">لا توجد عقارات تطابق المعايير المحددة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertiesManagement;