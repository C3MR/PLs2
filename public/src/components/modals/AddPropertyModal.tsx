import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  Building, 
  MapPin, 
  Banknote, 
  Home,
  Car,
  Wifi,
  Tv,
  UtensilsCrossed,
  Dumbbell,
  Trees,
  Shield,
  Zap,
  Droplets,
  Snowflake,
  Camera,
  Users,
  Bed,
  Bath,
  CheckCircle,
  FileText,
  Hash
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: () => void;
}

const AddPropertyModal = ({ isOpen, onClose, onPropertyAdded }: AddPropertyModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    property_usage: 'residential',
    property_type: '',
    status: 'available',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    license_number: '',
    ad_license_number: '',
    // حقول خاصة بالعمارات
    total_units: '',
    showrooms_count: '',
    offices_count: '',
    apartments_count: '',
    occupied_percentage: '',
    amenities: [] as string[]
  });

  // Property type options based on usage
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

  // Check if current selection is a building
  const isBuilding = formData.property_type === 'commercial_building' || formData.property_type === 'residential_building';
  const isCommercialBuilding = formData.property_type === 'commercial_building';
  const isResidentialBuilding = formData.property_type === 'residential_building';

  // Amenities based on property type and usage
  const getAmenitiesForType = (usage: string) => {
    const baseAmenities = [
      { name: 'موقف سيارات', icon: Car, key: 'parking' },
      { name: 'أمن وحراسة', icon: Shield, key: 'security' },
      { name: 'مولد كهرباء', icon: Zap, key: 'generator' },
      { name: 'نظام مراقبة', icon: Camera, key: 'surveillance' }
    ];

    if (usage === 'residential') {
      return [
        ...baseAmenities,
        { name: 'مسبح', icon: Droplets, key: 'pool' },
        { name: 'إنترنت واي فاي', icon: Wifi, key: 'wifi' },
        { name: 'مطبخ مجهز', icon: UtensilsCrossed, key: 'kitchen' },
        { name: 'جيم', icon: Dumbbell, key: 'gym' },
        { name: 'حديقة', icon: Trees, key: 'garden' },
        { name: 'تكييف مركزي', icon: Snowflake, key: 'ac' },
        { name: 'صالة ألعاب', icon: Users, key: 'playroom' }
      ];
    } else if (usage === 'commercial') {
      return [
        ...baseAmenities,
        { name: 'إنترنت واي فاي', icon: Wifi, key: 'wifi' },
        { name: 'تكييف مركزي', icon: Snowflake, key: 'ac' },
        { name: 'مصعد', icon: Building, key: 'elevator' },
        { name: 'كافتيريا', icon: UtensilsCrossed, key: 'cafeteria' },
        { name: 'قاعة اجتماعات', icon: Users, key: 'meeting_room' },
        { name: 'مخزن', icon: Building, key: 'storage' }
      ];
    }
    
    return baseAmenities;
  };

  const currentAmenities = getAmenitiesForType(formData.property_usage);

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear property type when usage changes
    if (field === 'property_usage') {
      setFormData(prev => ({
        ...prev,
        property_type: '',
        amenities: [] // Clear amenities when usage changes
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const insertData: any = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        property_usage: formData.property_usage,
        property_type: formData.property_type,
        status: formData.status,
        price: parseFloat(formData.price),
        area: formData.area ? parseFloat(formData.area) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        license_number: formData.license_number || null,
        ad_license_number: formData.ad_license_number || null,
        amenities: formData.amenities,
        images: [],
        created_by: (await supabase.auth.getUser()).data.user?.id || null
      };

      // إضافة الحقول الخاصة بالعمارات
      if (isBuilding) {
        insertData.total_units = formData.total_units ? parseInt(formData.total_units) : null;
        insertData.occupied_percentage = formData.occupied_percentage ? parseFloat(formData.occupied_percentage) : 0;
        
        if (isCommercialBuilding) {
          insertData.showrooms_count = formData.showrooms_count ? parseInt(formData.showrooms_count) : 0;
          insertData.offices_count = formData.offices_count ? parseInt(formData.offices_count) : 0;
        } else if (isResidentialBuilding) {
          insertData.apartments_count = formData.apartments_count ? parseInt(formData.apartments_count) : 0;
        }
      }

      const { error } = await supabase
        .from('properties')
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "تم إضافة العقار بنجاح",
        description: "تم إضافة العقار الجديد إلى قاعدة البيانات",
      });

      onPropertyAdded();
      onClose();
      setFormData({
        title: '',
        description: '',
        location: '',
        property_usage: 'residential',
        property_type: '',
        status: 'available',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        license_number: '',
        ad_license_number: '',
        total_units: '',
        showrooms_count: '',
        offices_count: '',
        apartments_count: '',
        occupied_percentage: '',
        amenities: []
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "خطأ في إضافة العقار",
        description: "حدث خطأ أثناء إضافة العقار. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenityName: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter(a => a !== amenityName)
        : [...prev.amenities, amenityName]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="pb-8">
          <DialogTitle className="text-3xl font-bold text-center text-foreground">
            إضافة عقار جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Title */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                عنوان العقار <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="أدخل عنوان العقار"
                  className="h-12 pr-10"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                الموقع <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="المدينة، الحي"
                  className="h-12 pr-10"
                  required
                />
              </div>
            </div>

            {/* Property Usage */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                استخدام العقار <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.property_usage} onValueChange={(value) => handleInputChange('property_usage', value)}>
                <SelectTrigger className="h-12 text-right">
                  <SelectValue placeholder="اختر استخدام العقار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">سكني</SelectItem>
                  <SelectItem value="commercial">تجاري</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type - Dynamic based on usage */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                نوع العقار <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.property_type} 
                onValueChange={(value) => handleInputChange('property_type', value)}
                disabled={!formData.property_usage}
              >
                <SelectTrigger className="h-12 text-right">
                  <SelectValue placeholder="اختر نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  {formData.property_usage && propertyTypeOptions[formData.property_usage as keyof typeof propertyTypeOptions]?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                حالة العقار
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="h-12 text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">متاح</SelectItem>
                  <SelectItem value="sold">مباع</SelectItem>
                  <SelectItem value="rented">مؤجر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                السعر (ر.س) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Banknote className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="000000"
                  className="h-12 pr-10"
                  required
                />
              </div>
            </div>

            {/* Area */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                المساحة (م²)
              </Label>
              <div className="relative">
                <Home className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="000"
                  className="h-12 pr-10"
                />
              </div>
            </div>

            {/* Bedrooms - Only for residential */}
            {formData.property_usage === 'residential' && (
              <div>
                <Label className="text-lg font-semibold mb-3 block">
                  عدد غرف النوم
                </Label>
                <div className="relative">
                  <Bed className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="0"
                    className="h-12 pr-10"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Bathrooms - Only for residential */}
            {formData.property_usage === 'residential' && (
              <div>
                <Label className="text-lg font-semibold mb-3 block">
                  عدد دورات المياه
                </Label>
                <div className="relative">
                  <Bath className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="0"
                    className="h-12 pr-10"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* License Number */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                رقم ترخيص العقار
              </Label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={formData.license_number}
                  onChange={(e) => handleInputChange('license_number', e.target.value)}
                  placeholder="أدخل رقم ترخيص العقار"
                  className="h-12 pr-10"
                />
              </div>
            </div>

            {/* Ad License Number */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">
                رقم ترخيص الإعلان <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={formData.ad_license_number}
                  onChange={(e) => handleInputChange('ad_license_number', e.target.value)}
                  placeholder="أدخل رقم ترخيص الإعلان"
                  className="h-12 pr-10"
                  required
                />
              </div>
            </div>

            {/* Building-specific fields */}
            {isBuilding && (
              <>
                {/* Total Units */}
                <div className="md:col-span-2">
                  <Label className="text-lg font-semibold mb-3 block text-primary">
                    🏢 معلومات العمارة
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        عدد الوحدات الكلي <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          value={formData.total_units}
                          onChange={(e) => handleInputChange('total_units', e.target.value)}
                          placeholder="العدد الإجمالي للوحدات"
                          className="h-10 pr-10"
                          min="1"
                          required={isBuilding}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        نسبة الإشغال (%)
                      </Label>
                      <div className="relative">
                        <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          value={formData.occupied_percentage}
                          onChange={(e) => handleInputChange('occupied_percentage', e.target.value)}
                          placeholder="0-100"
                          className="h-10 pr-10"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit types for commercial building */}
                {isCommercialBuilding && (
                  <div className="md:col-span-2">
                    <Label className="text-base font-medium mb-3 block">
                      توزيع الوحدات التجارية
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          عدد المعارض
                        </Label>
                        <Input
                          type="number"
                          value={formData.showrooms_count}
                          onChange={(e) => handleInputChange('showrooms_count', e.target.value)}
                          placeholder="0"
                          className="h-10"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          عدد المكاتب
                        </Label>
                        <Input
                          type="number"
                          value={formData.offices_count}
                          onChange={(e) => handleInputChange('offices_count', e.target.value)}
                          placeholder="0"
                          className="h-10"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Unit types for residential building */}
                {isResidentialBuilding && (
                  <div className="md:col-span-2">
                    <Label className="text-base font-medium mb-3 block">
                      نوع الوحدات السكنية
                    </Label>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        عدد الشقق
                      </Label>
                      <Input
                        type="number"
                        value={formData.apartments_count}
                        onChange={(e) => handleInputChange('apartments_count', e.target.value)}
                        placeholder="العدد الإجمالي للشقق"
                        className="h-10"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                {/* Vacancy calculation display */}
                {formData.total_units && formData.occupied_percentage && (
                  <div className="md:col-span-2">
                    <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground mb-2">📊 ملخص الإشغال</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{formData.total_units}</p>
                          <p className="text-sm text-muted-foreground">إجمالي الوحدات</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {Math.round((parseInt(formData.total_units) * parseFloat(formData.occupied_percentage || '0')) / 100)}
                          </p>
                          <p className="text-sm text-muted-foreground">وحدات مؤجرة</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            {parseInt(formData.total_units) - Math.round((parseInt(formData.total_units) * parseFloat(formData.occupied_percentage || '0')) / 100)}
                          </p>
                          <p className="text-sm text-muted-foreground">وحدات شاغرة</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className="text-lg font-semibold mb-3 block">
              وصف العقار
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="أضف وصف تفصيلي للعقار..."
              rows={4}
              className="min-h-[100px]"
            />
          </div>

          {/* Dynamic Amenities Selection */}
          <div>
            <Label className="text-lg font-semibold mb-6 block">
              المميزات والخدمات 
              <span className="text-sm text-muted-foreground font-normal mr-2">
                (حسب نوع الاستخدام: {formData.property_usage === 'residential' ? 'سكني' : 'تجاري'})
              </span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentAmenities.map((amenity) => {
                const IconComponent = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.name);
                
                return (
                  <Card 
                    key={amenity.key}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleAmenity(amenity.name)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-full ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}>
                          {amenity.name}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Selected Amenities Display */}
            {formData.amenities.length > 0 && (
              <div className="mt-6">
                <Label className="text-base font-medium mb-3 block">
                  المميزات المحددة:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                      {amenity}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => toggleAmenity(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="px-8">
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? 'جاري الإضافة...' : 'إضافة العقار'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;