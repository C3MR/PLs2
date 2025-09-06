-- Create notification types enum
CREATE TYPE notification_type AS ENUM (
  'info',
  'warning', 
  'success',
  'error',
  'system',
  'property_update',
  'client_message',
  'task_reminder',
  'appointment',
  'document_upload'
);

-- Create notification priority enum  
CREATE TYPE notification_priority AS ENUM (
  'low',
  'medium', 
  'high',
  'urgent'
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  priority notification_priority NOT NULL DEFAULT 'medium',
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_global BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  system_notifications BOOLEAN NOT NULL DEFAULT true,
  property_notifications BOOLEAN NOT NULL DEFAULT true,
  client_notifications BOOLEAN NOT NULL DEFAULT true,
  task_notifications BOOLEAN NOT NULL DEFAULT true,
  appointment_notifications BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id OR is_global = true);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for notification preferences
CREATE POLICY "Users can view their own preferences" 
ON public.notification_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.notification_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.notification_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_priority ON public.notifications(priority);
CREATE INDEX idx_notifications_expires_at ON public.notifications(expires_at);

-- Create function to create notification
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
) RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read() 
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications 
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid() AND is_read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up expired notifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications 
  WHERE expires_at IS NOT NULL AND expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get notification statistics
CREATE OR REPLACE FUNCTION public.get_notification_stats(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE(
  total_count BIGINT,
  unread_count BIGINT,
  urgent_count BIGINT,
  recent_count BIGINT
) AS $$
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create trigger for updated_at on notification_preferences
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create initial notification preferences for existing profiles
INSERT INTO public.notification_preferences (user_id)
SELECT p.user_id FROM public.profiles p
WHERE p.user_id IS NOT NULL
  AND p.user_id NOT IN (SELECT user_id FROM public.notification_preferences WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;