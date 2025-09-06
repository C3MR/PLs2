import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import { useMapboxToken } from '@/hooks/useMapboxToken';

const RiyadhMapBackground = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationFrame = useRef<number>();
  const { token, loading, error } = useMapboxToken();

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [46.6753, 24.7136], // Riyadh coordinates
      zoom: 11,
      pitch: 45,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.current.on('load', () => {
      // Add animated search lines
      map.current?.addSource('search-lines', {
        type: 'geojson',
        lineMetrics: true,
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.current?.addLayer({
        id: 'search-lines',
        type: 'line',
        source: 'search-lines',
        paint: {
          'line-width': 3,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0, 'rgba(59, 130, 246, 0)',
            0.1, 'rgba(59, 130, 246, 0.8)',
            0.9, 'rgba(59, 130, 246, 0.8)',
            1, 'rgba(59, 130, 246, 0)'
          ]
        }
      });

      // Add pulsing search points
      map.current?.addSource('search-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.current?.addLayer({
        id: 'search-points',
        type: 'circle',
        source: 'search-points',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 4,
            15, 8
          ],
          'circle-color': 'rgba(59, 130, 246, 0.6)',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(59, 130, 246, 1)',
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'pulse'],
            0, 0.3,
            1, 1
          ]
        }
      });

      startSearchAnimation();
    });
  };

  const generateSearchPath = () => {
    const center = [46.6753, 24.7136];
    const paths = [];
    
    // Generate multiple search paths
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * (Math.PI / 180);
      const distance = 0.05 + Math.random() * 0.1;
      
      const path = [];
      const steps = 20 + Math.random() * 30;
      
      for (let j = 0; j <= steps; j++) {
        const progress = j / steps;
        const currentDistance = distance * progress;
        
        // Add some randomness to make it look like searching
        const randomOffset = (Math.random() - 0.5) * 0.02;
        const randomAngle = angle + randomOffset;
        
        const lng = center[0] + Math.cos(randomAngle) * currentDistance;
        const lat = center[1] + Math.sin(randomAngle) * currentDistance;
        
        path.push([lng, lat]);
      }
      
      paths.push({
        type: 'Feature',
        properties: {
          id: i,
          delay: Math.random() * 5000
        },
        geometry: {
          type: 'LineString',
          coordinates: path
        }
      });
    }
    
    return paths;
  };

  const generateSearchPoints = () => {
    const points = [];
    const center = [46.6753, 24.7136];
    
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 0.08;
      
      const lng = center[0] + Math.cos(angle) * distance;
      const lat = center[1] + Math.sin(angle) * distance;
      
      points.push({
        type: 'Feature',
        properties: {
          id: i,
          pulse: Math.random()
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      });
    }
    
    return points;
  };

  const startSearchAnimation = () => {
    let startTime = Date.now();
    const searchPaths = generateSearchPath();
    const searchPoints = generateSearchPoints();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Update search lines with animation
      const animatedPaths = searchPaths.map(path => {
        const delay = path.properties.delay;
        const pathElapsed = Math.max(0, elapsed - delay);
        const duration = 3000 + Math.random() * 2000;
        const progress = (pathElapsed % (duration + 1000)) / duration;
        
        if (progress <= 1) {
          const coordinates = path.geometry.coordinates;
          const currentIndex = Math.floor(progress * (coordinates.length - 1));
          const visibleCoords = coordinates.slice(0, currentIndex + 1);
          
          return {
            ...path,
            geometry: {
              type: 'LineString',
              coordinates: visibleCoords
            }
          };
        }
        
        return null;
      }).filter(Boolean);

      // Update pulsing points
      const animatedPoints = searchPoints.map(point => {
        const pulseSpeed = 1000 + Math.random() * 1000;
        const pulse = (Math.sin(elapsed / pulseSpeed) + 1) / 2;
        
        return {
          ...point,
          properties: {
            ...point.properties,
            pulse
          }
        };
      });

      if (map.current?.getSource('search-lines')) {
        (map.current.getSource('search-lines') as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: animatedPaths
        });
      }

      if (map.current?.getSource('search-points')) {
        (map.current.getSource('search-points') as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: animatedPoints
        });
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    if (token) {
      initializeMap();
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      map.current?.remove();
    };
  }, [token]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-400" />
          <p className="text-sm text-gray-300">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 text-white">
          <h3 className="text-lg font-semibold mb-3">خطأ في تحميل الخريطة</h3>
          <p className="text-sm text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full opacity-75" 
        style={{
          filter: 'contrast(1.5) brightness(0.6) saturate(1.1)',
        }}
      />
      
      {/* Dark overlay for extra darkness */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Additional animated search overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scanning lines */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" 
             style={{
               animation: 'scan-vertical 8s infinite linear',
               transformOrigin: 'left center'
             }} />
        <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-transparent via-blue-400/60 to-transparent animate-pulse" 
             style={{
               animation: 'scan-horizontal 6s infinite linear',
               transformOrigin: 'center top'
             }} />
        
        {/* Search radar effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 border-2 border-blue-400/30 rounded-full animate-ping" style={{animationDuration: '3s'}} />
          <div className="absolute inset-0 w-32 h-32 border-2 border-blue-400/40 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}} />
          <div className="absolute inset-0 w-32 h-32 border-2 border-blue-400/20 rounded-full animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}} />
        </div>
        
        {/* Property search indicators */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RiyadhMapBackground;