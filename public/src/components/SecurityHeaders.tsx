import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Set up Content Security Policy for production
    const isDevelopment = import.meta.env.DEV;
    
    if (!isDevelopment) {
      // Add security headers via meta tags for production
      const addMetaTag = (name: string, content: string) => {
        const existing = document.querySelector(`meta[name="${name}"]`);
        if (existing) {
          existing.setAttribute('content', content);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      // Content Security Policy - Hardened
      addMetaTag('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' https://api.mapbox.com https://cdn.jsdelivr.net; " +
        "style-src 'self' https://fonts.googleapis.com https://api.mapbox.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob: https://api.mapbox.com https://*.tiles.mapbox.com; " +
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com; " +
        "worker-src 'self' blob:; " +
        "child-src 'self'; " +
        "frame-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';"
      );

      // Additional security headers
      addMetaTag('X-Content-Type-Options', 'nosniff');
      addMetaTag('X-Frame-Options', 'SAMEORIGIN'); // Changed from DENY to allow Lovable iframe
      addMetaTag('X-XSS-Protection', '1; mode=block');
      addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
      addMetaTag('Permissions-Policy', 
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
      );
    }
  }, []);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;