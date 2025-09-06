-- Fix critical security vulnerability: Implement proper RBAC for system tables
-- Drop existing overly permissive policies and create secure role-based policies

-- ========================================
-- LEADS TABLE - Secure Access Control
-- ========================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Users can create leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update leads" ON public.leads;

-- Create secure role-based policies for leads
CREATE POLICY "leads_select_policy" ON public.leads
FOR SELECT USING (
  -- Admins and managers can see all leads
  has_permission(auth.uid(), 'clients:read'::permission) OR
  -- Users can see leads they created or are assigned to
  auth.uid() = created_by OR
  auth.uid() = assigned_to
);

CREATE POLICY "leads_insert_policy" ON public.leads
FOR INSERT WITH CHECK (
  -- Only users with permission can create leads
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Must set themselves as creator
  auth.uid() = created_by
);

CREATE POLICY "leads_update_policy" ON public.leads
FOR UPDATE USING (
  -- Admins can update any lead
  has_permission(auth.uid(), 'clients:update'::permission) OR
  -- Users can update leads they own or are assigned to
  auth.uid() = created_by OR
  auth.uid() = assigned_to
);

CREATE POLICY "leads_delete_policy" ON public.leads
FOR DELETE USING (
  -- Only admins or managers can delete leads
  has_permission(auth.uid(), 'clients:delete'::permission)
);

-- ========================================
-- CLIENTS TABLE - Secure Access Control
-- ========================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;

-- Create secure role-based policies for clients
CREATE POLICY "clients_select_policy" ON public.clients
FOR SELECT USING (
  -- Users with clients:read permission can see all clients
  has_permission(auth.uid(), 'clients:read'::permission) OR
  -- Users can see clients they created
  auth.uid() = created_by
);

CREATE POLICY "clients_insert_policy" ON public.clients
FOR INSERT WITH CHECK (
  -- Only users with permission can create clients
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Must set themselves as creator
  auth.uid() = created_by
);

CREATE POLICY "clients_update_policy" ON public.clients
FOR UPDATE USING (
  -- Users with permission can update clients
  has_permission(auth.uid(), 'clients:update'::permission) OR
  -- Users can update clients they created
  auth.uid() = created_by
);

CREATE POLICY "clients_delete_policy" ON public.clients
FOR DELETE USING (
  -- Only users with delete permission can delete clients
  has_permission(auth.uid(), 'clients:delete'::permission)
);

-- ========================================
-- CRM TASKS TABLE - Secure Access Control
-- ========================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can manage tasks" ON public.crm_tasks;
DROP POLICY IF EXISTS "Users can view tasks" ON public.crm_tasks;

-- Create secure role-based policies for crm_tasks
CREATE POLICY "crm_tasks_select_policy" ON public.crm_tasks
FOR SELECT USING (
  -- Managers and admins can see all tasks
  has_permission(auth.uid(), 'clients:read'::permission) OR
  -- Users can see tasks assigned to them or created by them
  auth.uid() = assigned_to OR
  auth.uid() = created_by
);

CREATE POLICY "crm_tasks_insert_policy" ON public.crm_tasks
FOR INSERT WITH CHECK (
  -- Users with permission can create tasks
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Must set themselves as creator
  auth.uid() = created_by
);

CREATE POLICY "crm_tasks_update_policy" ON public.crm_tasks
FOR UPDATE USING (
  -- Admins can update any task
  has_permission(auth.uid(), 'clients:update'::permission) OR
  -- Users can update tasks assigned to them or created by them
  auth.uid() = assigned_to OR
  auth.uid() = created_by
);

CREATE POLICY "crm_tasks_delete_policy" ON public.crm_tasks
FOR DELETE USING (
  -- Only users with delete permission can delete tasks
  has_permission(auth.uid(), 'clients:delete'::permission) OR
  -- Users can delete tasks they created
  auth.uid() = created_by
);

-- ========================================
-- LEAD ACTIVITIES TABLE - Secure Access Control
-- ========================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can manage activities" ON public.lead_activities;
DROP POLICY IF EXISTS "Users can view activities" ON public.lead_activities;

-- Create secure role-based policies for lead_activities
CREATE POLICY "lead_activities_select_policy" ON public.lead_activities
FOR SELECT USING (
  -- Managers and admins can see all activities
  has_permission(auth.uid(), 'clients:read'::permission) OR
  -- Users can see activities they created
  auth.uid() = created_by OR
  -- Users can see activities for leads they own/are assigned to
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = lead_activities.lead_id 
    AND (l.created_by = auth.uid() OR l.assigned_to = auth.uid())
  )
);

CREATE POLICY "lead_activities_insert_policy" ON public.lead_activities
FOR INSERT WITH CHECK (
  -- Users with permission can create activities
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Must set themselves as creator
  auth.uid() = created_by AND
  -- Can only create activities for leads they have access to
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = lead_activities.lead_id 
    AND (
      has_permission(auth.uid(), 'clients:read'::permission) OR
      l.created_by = auth.uid() OR 
      l.assigned_to = auth.uid()
    )
  )
);

CREATE POLICY "lead_activities_update_policy" ON public.lead_activities
FOR UPDATE USING (
  -- Admins can update any activity
  has_permission(auth.uid(), 'clients:update'::permission) OR
  -- Users can update activities they created
  auth.uid() = created_by
);

CREATE POLICY "lead_activities_delete_policy" ON public.lead_activities
FOR DELETE USING (
  -- Only users with delete permission can delete activities
  has_permission(auth.uid(), 'clients:delete'::permission) OR
  -- Users can delete activities they created
  auth.uid() = created_by
);

-- ========================================
-- SALES PIPELINE TABLE - Secure Access Control
-- ========================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view pipeline" ON public.sales_pipeline;
DROP POLICY IF EXISTS "Users can manage pipeline" ON public.sales_pipeline;

-- Create secure role-based policies for sales_pipeline
CREATE POLICY "sales_pipeline_select_policy" ON public.sales_pipeline
FOR SELECT USING (
  -- Managers and admins can see all pipeline entries
  has_permission(auth.uid(), 'analytics:read'::permission) OR
  -- Agents can see their assigned deals
  auth.uid() = assigned_agent OR
  -- Users can see pipeline entries for leads they own
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = sales_pipeline.lead_id 
    AND (l.created_by = auth.uid() OR l.assigned_to = auth.uid())
  )
);

CREATE POLICY "sales_pipeline_insert_policy" ON public.sales_pipeline
FOR INSERT WITH CHECK (
  -- Only users with permission can create pipeline entries
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Can only create entries for leads they have access to
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = sales_pipeline.lead_id 
    AND (
      has_permission(auth.uid(), 'clients:read'::permission) OR
      l.created_by = auth.uid() OR 
      l.assigned_to = auth.uid()
    )
  )
);

CREATE POLICY "sales_pipeline_update_policy" ON public.sales_pipeline
FOR UPDATE USING (
  -- Managers and admins can update any pipeline entry
  has_permission(auth.uid(), 'clients:update'::permission) OR
  -- Agents can update their assigned deals
  auth.uid() = assigned_agent OR
  -- Users can update pipeline entries for leads they own
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = sales_pipeline.lead_id 
    AND (l.created_by = auth.uid() OR l.assigned_to = auth.uid())
  )
);

CREATE POLICY "sales_pipeline_delete_policy" ON public.sales_pipeline
FOR DELETE USING (
  -- Only users with delete permission can delete pipeline entries
  has_permission(auth.uid(), 'clients:delete'::permission)
);

-- Log this security improvement
SELECT public.log_security_event(
  'security_hardening',
  auth.uid(),
  NULL,
  NULL,
  jsonb_build_object(
    'action', 'rbac_policies_implemented',
    'tables', jsonb_build_array('leads', 'clients', 'crm_tasks', 'lead_activities', 'sales_pipeline'),
    'description', 'Replaced overly permissive policies with role-based access control'
  ),
  'info'
);