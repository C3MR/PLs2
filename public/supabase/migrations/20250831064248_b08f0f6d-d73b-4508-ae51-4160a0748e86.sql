-- Phase 1: Critical Role Escalation Fix
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "Prevent self role updates" ON public.profiles;

-- Create secure policy that prevents role escalation
CREATE POLICY "Users can update own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  (
    -- Allow role changes only if user has permission OR role stays the same
    has_permission(auth.uid(), 'users:update'::permission) OR 
    (
      SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
    ) = role
  )
);

-- Add audit logging for role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log role changes and prevent unauthorized changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Block role changes for users without permission
    IF NOT has_permission(auth.uid(), 'users:update'::permission) AND auth.uid() = NEW.user_id THEN
      RAISE EXCEPTION 'Unauthorized: Cannot change your own role';
    END IF;
    
    -- Log the role change
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