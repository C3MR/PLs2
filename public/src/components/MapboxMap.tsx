import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Navigation, Layers, Plus, Minus, MapPin, Loader2 } from 'lucide-react';
import { useMapboxToken } from '@/hooks/useMapboxToken';

interface MapboxMapProps {
  className?: string;
  properties?: Array<{
    id: string;
    coordinates: [number, number];
    type: string;
    title: string;
    price: string;
    color?: string;
  }>;
  center?: [number, number];
  zoom?: number;
  style?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  className = '',
  properties = [],
  center = [46.6753, 24.7136], // Riyadh coordinates
  zoom = 11,
  style = 'mapbox://styles/mapbox/light-v11'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const { token, loading, error } = useMapboxToken();

  useEffect(() => {
    if (!mapContainer.current || map.current || !token) return;

    // Initialize Mapbox with secure token
    mapboxgl.accessToken = token;

    // Create map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style,
      center: center,
      zoom: zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-left'
    );

    // Add attribution control to bottom right
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true
      }),
      'bottom-right'
    );

    // Update zoom level on change
    map.current.on('zoom', () => {
      if (map.current) {
        setCurrentZoom(map.current.getZoom());
      }
    });

    // Add properties as markers when map loads
    map.current.on('load', () => {
      addPropertyMarkers();
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add property markers to the map
  const addPropertyMarkers = () => {
    if (!map.current) return;

    properties.forEach((property) => {
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'property-marker';
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${getPropertyColor(property.type)};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
        transition: transform 0.2s;
      `;
      markerEl.innerHTML = getPropertyIcon(property.type);
      
      // Add hover effect
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.2)';
      });
      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'property-popup'
      }).setHTML(`
        <div dir="rtl" class="p-3 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
          <p class="text-primary font-bold text-lg">${property.price} ر.س</p>
          <p class="text-xs text-muted-foreground">${property.type}</p>
        </div>
      `);

      // Create marker and add to map
      new mapboxgl.Marker(markerEl)
        .setLngLat(property.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  // Get color based on property type
  const getPropertyColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'villa': '#22c55e', // green
      'apartment': '#8b5cf6', // purple  
      'commercial': '#f97316', // orange
      'land': '#ef4444', // red
      'office': '#3b82f6', // blue
    };
    return colors[type] || '#6b7280'; // gray as default
  };

  // Get icon based on property type
  const getPropertyIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'villa': '🏠',
      'apartment': '🏢',
      'commercial': '🏪',
      'land': '🏞️',
      'office': '🏢',
    };
    return icons[type] || '📍';
  };

  // Manual zoom controls
  const zoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  // Fly to user location
  const flyToLocation = () => {
    if (navigator.geolocation && map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current!.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Riyadh center
          map.current!.flyTo({
            center: center,
            zoom: zoom
          });
        }
      );
    }
  };

  if (loading) {
    return (
      <div className={`relative w-full h-full ${className} flex items-center justify-center bg-muted/50`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative w-full h-full ${className} flex items-center justify-center bg-muted/50`}>
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {/* Custom Control Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-background/90 hover:bg-background"
          onClick={zoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-background/90 hover:bg-background"
          onClick={zoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Location Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-background/90 hover:bg-background"
          onClick={flyToLocation}
        >
          <Navigation className="h-4 w-4" />
          <span className="hidden md:inline">موقعي</span>
        </Button>
      </div>

      {/* Map Stats */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-lg z-10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">{properties.length}</span>
          <span className="text-muted-foreground">عقار</span>
        </div>
      </div>
    </div>
  );
};

export default MapboxMap;