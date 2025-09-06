import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface RiyadhMapBackgroundProps {
  className?: string;
}

const RiyadhMapBackground: React.FC<RiyadhMapBackgroundProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [46.6753, 24.7136], // Riyadh coordinates
      zoom: 10,
      interactive: false,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add search lines source
      map.current.addSource('search-lines', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [46.6753, 24.7136],
                  [46.7753, 24.8136],
                  [46.8753, 24.9136]
                ]
              },
              properties: {}
            }
          ]
        }
      });

      // Add search lines layer
      map.current.addLayer({
        id: 'search-lines',
        type: 'line',
        source: 'search-lines',
        paint: {
          'line-width': 3,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            'rgba(59, 130, 246, 0.8)',
            1,
            'rgba(59, 130, 246, 0.2)'
          ]
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className={`absolute inset-0 ${className || ''}`}
      style={{ filter: 'opacity(0.3)' }}
    />
  );
};

export default RiyadhMapBackground;