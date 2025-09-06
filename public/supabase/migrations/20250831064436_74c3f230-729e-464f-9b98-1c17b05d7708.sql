-- Phase 1: Critical Role Escalation Fix - Fixed Version
-- Drop existing conflicting policies first
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "Prevent self role updates" ON public.profiles;

-- Create secure policy that prevents role self-updates
CREATE POLICY "Users can update profile but not role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  (profiles.role = profiles.role OR has_permission(auth.uid(), 'users:update'::permission))
);

-- Add audit logging for role changes with proper syntax
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Only allow role changes if user has permission or is admin changing someone else
    IF auth.uid() = NEW.user_id AND NOT has_permission(auth.uid(), 'users:update'::permission) THEN
      RAISE EXCEPTION 'Users cannot change their own role';
    END IF;
    
    PERFORM public.log_activity(
      NEW.user_id,
      'user:role_change'::activity_type,
      'user',
      NEW.user_id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_role_changes_trigger ON public.profiles;
CREATE TRIGGER audit_role_changes_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_changes();

-- Secure properties table - require authentication to view
DROP POLICY IF EXISTS "Everyone can view properties" ON public.properties;
CREATE POLICY "Authenticated users can view properties" 
ON public.properties 
FOR SELECT 
USING (auth.uid() IS NOT NULL);