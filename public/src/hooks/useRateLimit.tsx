import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useRateLimit = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkRateLimit = async (
    formType: string, 
    maxRequests: number = 5, 
    timeWindowMinutes: number = 60
  ): Promise<boolean> => {
    setIsChecking(true);
    
    try {
      // Get client IP (simplified approach)
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_ip_address: ip,
        p_form_type: formType,
        p_max_requests: maxRequests,
        p_time_window_minutes: timeWindowMinutes
      });

      if (error) {
        console.error('Rate limit check error:', error);
        return true; // Allow on error to avoid blocking legitimate users
      }

      if (!data) {
        toast({
          title: "طلبات كثيرة",
          description: `لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة بعد ${timeWindowMinutes} دقيقة.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkRateLimit,
    isChecking
  };
};