-- SECURITY FIXES: Phase 2 - Fix remaining function search paths

-- Fix remaining functions without proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'employee');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_client_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_id TEXT;
  counter INTEGER;
BEGIN
  -- Get the count of existing clients
  SELECT COUNT(*) + 1 INTO counter FROM public.clients;
  
  -- Generate ID with format CLI-XXX
  new_id := 'CLI-' || LPAD(counter::TEXT, 3, '0');
  
  -- Make sure it's unique
  WHILE EXISTS (SELECT 1 FROM public.clients WHERE client_id = new_id) LOOP
    counter := counter + 1;
    new_id := 'CLI-' || LPAD(counter::TEXT, 3, '0');
  END LOOP;
  
  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_client_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.client_id IS NULL OR NEW.client_id = '' THEN
    NEW.client_id := public.generate_client_id();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_notification_stats(p_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(total_count bigint, unread_count bigint, urgent_count bigint, recent_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_read = false) as unread_count,
    COUNT(*) FILTER (WHERE priority = 'urgent' AND is_read = false) as urgent_count,
    COUNT(*) FILTER (WHERE created_at >= now() - interval '24 hours') as recent_count
  FROM public.notifications 
  WHERE (user_id = p_user_id OR is_global = true)
    AND (expires_at IS NULL OR expires_at > now());
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_log_profile_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Log role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
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
  
  -- Log profile updates
  IF OLD.full_name IS DISTINCT FROM NEW.full_name 
     OR OLD.email IS DISTINCT FROM NEW.email 
     OR OLD.phone IS DISTINCT FROM NEW.phone THEN
    PERFORM public.log_activity(
      NEW.user_id,
      'user:profile_update'::activity_type,
      'user',
      NEW.user_id,
      jsonb_build_object(
        'updated_fields', jsonb_build_array(
          CASE WHEN OLD.full_name IS DISTINCT FROM NEW.full_name THEN 'full_name' END,
          CASE WHEN OLD.email IS DISTINCT FROM NEW.email THEN 'email' END,
          CASE WHEN OLD.phone IS DISTINCT FROM NEW.phone THEN 'phone' END
        ) - NULL
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trigger_log_property_activities()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_activity(
      NEW.created_by,
      'property:create'::activity_type,
      'property',
      NEW.id,
      jsonb_build_object(
        'title', NEW.title,
        'property_type', NEW.property_type,
        'price', NEW.price
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_activity(
      auth.uid(),
      'property:update'::activity_type,
      'property',
      NEW.id,
      jsonb_build_object(
        'updated_fields', jsonb_build_array(
          CASE WHEN OLD.title IS DISTINCT FROM NEW.title THEN 'title' END,
          CASE WHEN OLD.price IS DISTINCT FROM NEW.price THEN 'price' END,
          CASE WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'status' END
        ) - NULL
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_activity(
      auth.uid(),
      'property:delete'::activity_type,
      'property',
      OLD.id,
      jsonb_build_object(
        'title', OLD.title,
        'property_type', OLD.property_type
      )
    );
    RETURN OLD;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_activity_summary(p_days integer DEFAULT 30)
 RETURNS TABLE(activity_type activity_type, count bigint, last_occurrence timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    al.activity_type,
    COUNT(*) as count,
    MAX(al.created_at) as last_occurrence
  FROM public.activity_logs al
  WHERE al.created_at >= (now() - (p_days || ' days')::interval)
  GROUP BY al.activity_type
  ORDER BY count DESC;
$function$;

CREATE OR REPLACE FUNCTION public.create_notification(p_user_id uuid, p_title text, p_message text, p_type notification_type DEFAULT 'info'::notification_type, p_priority notification_priority DEFAULT 'medium'::notification_priority, p_is_global boolean DEFAULT false, p_action_url text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb, p_expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    priority,
    is_global,
    action_url,
    metadata,
    expires_at
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_priority,
    p_is_global,
    p_action_url,
    p_metadata,
    p_expires_at
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid() AND is_read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications 
  WHERE expires_at IS NOT NULL AND expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;