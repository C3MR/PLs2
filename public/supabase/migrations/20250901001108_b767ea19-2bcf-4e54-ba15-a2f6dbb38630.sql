-- Security hardening: Add search_path protection to notification functions

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