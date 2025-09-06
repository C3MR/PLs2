-- Fix security definer functions by setting search_path
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type notification_type DEFAULT 'info',
  p_priority notification_priority DEFAULT 'medium',
  p_is_global BOOLEAN DEFAULT false,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix mark_notification_read function
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Fix mark_all_notifications_read function
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read() 
RETURNS INTEGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid() AND is_read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Fix cleanup_expired_notifications function
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS INTEGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications 
  WHERE expires_at IS NOT NULL AND expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Fix get_notification_stats function
CREATE OR REPLACE FUNCTION public.get_notification_stats(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE(
  total_count BIGINT,
  unread_count BIGINT,
  urgent_count BIGINT,
  recent_count BIGINT
) 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;