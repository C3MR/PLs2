-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log role changes and prevent unauthorized changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Block role changes for users without permission
    IF NOT public.has_permission(auth.uid(), 'users:update'::permission) AND auth.uid() = NEW.user_id THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';