import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Image as ImageIcon, Save, ArrowRight, Loader2 } from 'lucide-react';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useSecureValidation } from '@/hooks/useSecureValidation';

interface PropertyFormData {
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
  images: string[];
}

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkRateLimit } = useRateLimit();
  const { validateSecureText, sanitizeText } = useSecureValidation();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    location: '',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    property_type: 'apartment',
    status: 'available',
    amenities: [],
    images: []
  });
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/employee-login');
      return;
    }
    
    if (id) {
      fetchProperty();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "خطأ",
          description: "العقار غير موجود",
          variant: "destructive",
        });
        navigate('/dashboard/properties');
        return;
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        location: data.location || '',
        area: data.area || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        property_type: data.property_type || 'apartment',
        status: data.status || 'available',
        amenities: data.amenities || [],
        images: data.images || []
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات العقار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    if (field === 'title' || field === 'description') {
      // Validate and sanitize text inputs
      if (!validateSecureText(value, 500)) {
        toast({
          title: "خطأ في الإدخال",
          description: "النص يحتوي على محتوى غير مسموح",
          variant: "destructive",
        });
        return;
      }
      value = sanitizeText(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check rate limit
    const canUpload = await checkRateLimit('image_upload', 10, 60);
    if (!canUpload) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('يُسمح بالصور فقط');
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `property-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({
        title: "تم رفع الصور",
        description: `تم رفع ${uploadedUrls.length} صورة بنجاح`,
      });
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "خطأ في رفع الصور",
        description: error.message || "فشل في رفع الصور",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    
    if (!validateSecureText(newAmenity, 50)) {
      toast({
        title: "خطأ في الإدخال",
        description: "المرفق يحتوي على محتوى غير مسموح",
        variant: "destructive",
      });
      return;
    }

    const sanitizedAmenity = sanitizeText(newAmenity.trim());
    
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, sanitizedAmenity]
    }));
    setNewAmenity('');
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title.trim() || !formData.location.trim() || !formData.price) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    // Check rate limit
    const canSave = await checkRateLimit('property_update', 5, 300);
    if (!canSave) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price,
          location: formData.location.trim(),
          area: formData.area,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          property_type: formData.property_type,
          status: formData.status,
          amenities: formData.amenities,
          images: formData.images,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم الحفظ",
        description: "تم تحديث العقار بنجاح",
      });

      navigate(`/property/${id}`);
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "فشل في تحديث العقار",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات العقار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/property/${id}`)}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Button>
            <div>
              <h1 className="text-2xl font-bold">تعديل العقار</h1>
              <p className="text-muted-foreground">تحديث بيانات العقار والصور</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات العقار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="أدخل عنوان العقار"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="أدخل وصف العقار"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ريال) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">المساحة (م²)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">الموقع *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="أدخل موقع العقار"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">غرف النوم</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">دورات المياه</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">نوع العقار</Label>
                  <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">شقة</SelectItem>
                      <SelectItem value="villa">فيلا</SelectItem>
                      <SelectItem value="commercial">محل تجاري</SelectItem>
                      <SelectItem value="land">أرض</SelectItem>
                      <SelectItem value="office">مكتب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">متاح للبيع</SelectItem>
                    <SelectItem value="sold">مباع</SelectItem>
                    <SelectItem value="rented">مؤجر</SelectItem>
                    <SelectItem value="for_rent">للإيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Images and Amenities */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  صور العقار
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploading ? 'جاري رفع الصور...' : 'اختر الصور أو اسحبها هنا'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP حتى 5MB
                    </p>
                  </label>
                </div>

                {/* Display uploaded images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>المرافق والخدمات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="أضف مرفق جديد"
                    onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                  />
                  <Button onClick={addAmenity} size="sm">
                    إضافة
                  </Button>
                </div>

                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {amenity}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeAmenity(index)}
                        >
                          <X className="w-2 h-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyEdit;