import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Bed, Bath, Square, Heart, Share2, Filter, Grid3X3, List, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
const PropertyListings = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('الكل');
  const { user } = useAuth();
  const properties = [{
    id: 1,
    title: 'فيلا فاخرة في الرياض',
    price: '2,500,000',
    location: 'حي العليا، الرياض',
    type: 'فيلا',
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    image: '/src/assets/property-villa.jpg',
    featured: true,
    status: 'متاح'
  }, {
    id: 2,
    title: 'شقة حديثة في جدة',
    price: '850,000',
    location: 'حي الصفا، جدة',
    type: 'شقة',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: '/src/assets/property-apartment.jpg',
    featured: false,
    status: 'متاح'
  }, {
    id: 3,
    title: 'مكتب تجاري راقي',
    price: '1,200,000',
    location: 'برج المملكة، الرياض',
    type: 'مكتب',
    bedrooms: 0,
    bathrooms: 2,
    area: 250,
    image: '/src/assets/property-commercial.jpg',
    featured: true,
    status: 'محجوز'
  }, {
    id: 4,
    title: 'دبلكس عائلي مميز',
    price: '1,800,000',
    location: 'حي النرجس، الرياض',
    type: 'دبلكس',
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: '/src/assets/property-villa.jpg',
    featured: false,
    status: 'متاح'
  }, {
    id: 5,
    title: 'معرض تجاري استراتيجي',
    price: '950,000',
    location: 'شارع التحلية، جدة',
    type: 'معرض',
    bedrooms: 0,
    bathrooms: 1,
    area: 200,
    image: '/src/assets/property-commercial.jpg',
    featured: false,
    status: 'متاح'
  }, {
    id: 6,
    title: 'قطعة أرض استثمارية',
    price: '450,000',
    location: 'شمال الرياض',
    type: 'أرض',
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    image: '/src/assets/property-land.jpg',
    featured: true,
    status: 'متاح'
  }];
  const filters = ['الكل', 'فيلا', 'شقة', 'مكتب', 'دبلكس', 'معرض', 'استراحة'];
  const filteredProperties = selectedFilter === 'الكل' ? properties : properties.filter(property => property.type === selectedFilter);
  const PropertyCard = ({
    property
  }: {
    property: any;
  }) => <Card className="group overflow-hidden hover:shadow-strong transition-all duration-300 hover:scale-[1.02] bg-card/90 backdrop-blur-sm border-border/50">
      <div className="relative">
        <img src={property.image} alt={property.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 right-4 flex gap-2">
          {property.featured && <Badge className="bg-accent text-accent-foreground shadow-medium">
              مميز
            </Badge>}
          <Badge variant={property.status === 'متاح' ? 'default' : 'secondary'} className={property.status === 'متاح' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
            {property.status}
          </Badge>
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Button size="sm" variant="ghost" className="bg-card/80 backdrop-blur-sm hover:bg-card">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="bg-card/80 backdrop-blur-sm hover:bg-card">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 ml-1" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {property.price} 
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary">
            {property.type}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-muted-foreground text-sm">
          {property.bedrooms > 0 && <div className="flex items-center">
              <Bed className="h-4 w-4 ml-1" />
              <span>{property.bedrooms}</span>
            </div>}
          <div className="flex items-center">
            <Bath className="h-4 w-4 ml-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 ml-1" />
            <span>{property.area}م²</span>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium group-hover:shadow-strong transition-all duration-300">
          عرض التفاصيل
        </Button>
      </CardContent>
    </Card>;
  // Show authentication notice for unauthenticated users
  if (!user) {
    return (
      <section className="py-20 bg-muted/30" id="properties">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              العقارات المتاحة
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع
            </p>
          </div>
          
          <Alert className="max-w-md mx-auto">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              يرجى تسجيل الدخول لعرض قائمة العقارات المتاحة
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30" id="properties">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            العقارات المتاحة
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              فلترة
            </Button>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={selectedFilter === filter ? "bg-primary text-primary-foreground" : ""}
              >
                {filter}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 lg:mr-auto">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default PropertyListings;