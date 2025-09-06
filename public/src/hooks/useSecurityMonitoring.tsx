import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSecurityMonitoring = () => {
  const logSecurityEvent = useCallback(async (
    eventType: string,
    metadata?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    try {
      // Get client IP and user agent if available
      const userAgent = navigator.userAgent;
      
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_user_agent: userAgent,
        p_metadata: metadata || {},
        p_severity: severity
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  // Log failed login attempts
  const logFailedLogin = useCallback((email: string, error: string) => {
    logSecurityEvent('failed_login', { email, error }, 'medium');
  }, [logSecurityEvent]);

  // Log successful logins
  const logSuccessfulLogin = useCallback((userId: string) => {
    logSecurityEvent('successful_login', { userId }, 'low');
  }, [logSecurityEvent]);

  // Log suspicious activities
  const logSuspiciousActivity = useCallback((activity: string, details: Record<string, any>) => {
    logSecurityEvent('suspicious_activity', { activity, ...details }, 'high');
  }, [logSecurityEvent]);

  // Log unauthorized access attempts
  const logUnauthorizedAccess = useCallback((resource: string, requiredPermission?: string) => {
    logSecurityEvent('unauthorized_access', { resource, requiredPermission }, 'medium');
  }, [logSecurityEvent]);

  // Log data access
  const logDataAccess = useCallback((table: string, operation: string, recordCount?: number) => {
    logSecurityEvent('data_access', { table, operation, recordCount }, 'low');
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logFailedLogin,
    logSuccessfulLogin,
    logSuspiciousActivity,
    logUnauthorizedAccess,
    logDataAccess
  };
};

export default useSecurityMonitoring;