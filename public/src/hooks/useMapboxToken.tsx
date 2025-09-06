import { useState, useEffect } from 'react';

export const useMapboxToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fallbackToken = import.meta.env.VITE_MAPBOX_TOKEN;
        
        if (fallbackToken) {
          setToken(fallbackToken);
          setError(null);
        } else {
          setError('مفتاح Mapbox غير مُعرَّف في متغيرات البيئة');
        }
      } catch (err) {
        console.error('Error loading map configuration:', err);
        setError('خطأ في تحميل إعدادات الخريطة');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, loading, error };
};

export default useMapboxToken;