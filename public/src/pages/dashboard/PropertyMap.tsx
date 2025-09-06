import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MapboxMap from '@/components/MapboxMap';
import {
  MapPin,
  Search,
  Filter,
  Layers,
  Navigation,
  Home,
  Building,
  Store,
  Warehouse,
  Target,
  Zap,
  Eye,
  Phone,
  Mail,
  Star,
  Ruler,
  Calendar,
  TrendingUp
} from 'lucide-react';

const PropertyMap = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data للعقارات على الخريطة - with coordinates for Riyadh
  const mockProperties = [
    {
      id: '1',
      coordinates: [46.6753, 24.7136] as [number, number], // Riyadh center
      type: 'villa',
      title: 'فيلا فاخرة في العليا',
      price: '2,500,000'
    },
    {
      id: '2', 
      coordinates: [46.6555, 24.7305] as [number, number], // North Riyadh
      type: 'apartment',
      title: 'شقة في الملقا',
      price: '800,000'
    },
    {
      id: '3',
      coordinates: [46.7213, 24.6877] as [number, number], // East Riyadh
      type: 'commercial',
      title: 'مكتب تجاري في الورود',
      price: '1,200,000'
    },
    {
      id: '4',
      coordinates: [46.6324, 24.7421] as [number, number], // West Riyadh
      type: 'land',
      title: 'أرض في حي النخيل',
      price: '3,500,000'
    },
    {
      id: '5',
      coordinates: [46.6891, 24.7026] as [number, number], // Central Riyadh
      type: 'villa',
      title: 'فيلا في الربوة',
      price: '1,800,000'
    },
    {
      id: '6',
      coordinates: [46.7156, 24.7198] as [number, number], // East Central
      type: 'apartment',
      title: 'شقة فندقية في الحمراء',
      price: '950,000'
    }
  ];

  // Mock data للعقارات على الخريطة
  const propertyTypes = [
    { id: 'all', label: 'جميع العقارات', count: 456, color: 'bg-blue-500' },
    { id: 'villa', label: 'فيلا', count: 123, color: 'bg-green-500' },
    { id: 'apartment', label: 'شقة', count: 187, color: 'bg-purple-500' },
    { id: 'commercial', label: 'تجاري', count: 89, color: 'bg-orange-500' },
    { id: 'land', label: 'أرض', count: 57, color: 'bg-red-500' }
  ];

  const mapStats = {
    totalListings: 456,
    availableNow: 342,
    underContract: 78,
    recentlyAdded: 36,
    averagePrice: 1850000,
    hotAreas: 5
  };

  const recentActivity = [
    {
      id: 1,
      type: 'new_listing',
      property: 'فيلا في حي العليا',
      location: 'العليا، الرياض',
      price: '2,500,000',
      time: 'منذ 30 دقيقة'
    },
    {
      id: 2,
      type: 'price_update',
      property: 'شقة في الملقا',
      location: 'الملقا، الرياض',
      price: '800,000',
      time: 'منذ ساعة'
    },
    {
      id: 3,
      type: 'viewing',
      property: 'أرض تجارية في الورود',
      location: 'الورود، الرياض',
      price: '5,000,000',
      time: 'منذ ساعتين'
    }
  ];

  return (
    <div className="p-6 space-y-6 ml-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="mr-8">
          <h1 className="text-3xl font-bold text-foreground text-right ml-12">خريطة العقارات</h1>
          <p className="text-muted-foreground">عرض جغرافي تفاعلي لجميع العقارات في الرياض</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Layers className="h-4 w-4" />
            طبقات الخريطة
          </Button>
          <Button className="gap-2">
            <Navigation className="h-4 w-4" />
            موقعي الحالي
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">{mapStats.totalListings}</p>
            <p className="text-xs text-blue-600">إجمالي العقارات</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <Home className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">{mapStats.availableNow}</p>
            <p className="text-xs text-green-600">متاح الآن</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-800">{mapStats.underContract}</p>
            <p className="text-xs text-orange-600">تحت التعاقد</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">{mapStats.recentlyAdded}</p>
            <p className="text-xs text-purple-600">جديد هذا الأسبوع</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-800">{(mapStats.averagePrice / 1000000).toFixed(1)}م</p>
            <p className="text-xs text-red-600">متوسط السعر</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-800">{mapStats.hotAreas}</p>
            <p className="text-xs text-yellow-600">مناطق ساخنة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Filters */}
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث بالحي أو نوع العقار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium">نوع العقار</p>
                {propertyTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      selectedFilter === type.id ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedFilter(type.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button className="w-full gap-2">
                <Filter className="h-4 w-4" />
                تطبيق المرشحات
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">النشاط الأخير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.property}</p>
                        <p className="text-xs text-muted-foreground">{activity.location}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.price} ر.س
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  خريطة العقارات التفاعلية
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-2">
              <MapboxMap 
                className="w-full h-full rounded-lg"
                properties={mockProperties}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;