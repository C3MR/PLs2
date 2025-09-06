import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import { useMapboxToken } from '@/hooks/useMapboxToken';

interface SimpleMapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  style?: string;
  showControls?: boolean;
}

const SimpleMap: React.FC<SimpleMapProps> = ({
  className = '',
  center = [46.6753, 24.7136], // Riyadh coordinates
  zoom = 11,
  style = 'mapbox://styles/mapbox/light-v11',
  showControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
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

    // Add controls if requested
    if (showControls) {
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-left'
      );

      // Add attribution control
      map.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true
        }),
        'bottom-right'
      );
    }

    // Add a marker at center
    new mapboxgl.Marker({
      color: '#22c55e'
    }).setLngLat(center).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, style, showControls]);

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
    </div>
  );
};

export default SimpleMap;