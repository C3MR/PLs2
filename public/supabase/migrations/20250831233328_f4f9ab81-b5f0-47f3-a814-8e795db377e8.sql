-- Fix security issue: Implement role-based access controls for system tables
-- This addresses the critical security vulnerability where any authenticated user
-- can access all customer data and business-critical information

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can manage activities" ON lead_activities;
DROP POLICY IF EXISTS "Users can view activities" ON lead_activities;
DROP POLICY IF EXISTS "Users can create leads" ON leads;
DROP POLICY IF EXISTS "Users can delete leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can view all clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON clients;
DROP POLICY IF EXISTS "Users can manage tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Users can view tasks" ON crm_tasks;
DROP POLICY IF EXISTS "Users can manage pipeline" ON sales_pipeline;
DROP POLICY IF EXISTS "Authenticated users can view pipeline" ON sales_pipeline;

-- LEADS TABLE: Implement role-based and ownership-based access
CREATE POLICY "lead_select_policy" ON leads FOR SELECT USING (
  -- Super admins and admins can see all leads
  has_permission(auth.uid(), 'clients:read'::permission) OR
  -- Users can see leads assigned to them
  assigned_to = auth.uid() OR
  -- Users can see leads they created
  created_by = auth.uid()
);

CREATE POLICY "lead_insert_policy" ON leads FOR INSERT WITH CHECK (
  -- Must have permission to create leads
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Can only assign to themselves initially or if they have management permissions
  (assigned_to = auth.uid() OR has_permission(auth.uid(), 'clients:update'::permission))
);

CREATE POLICY "lead_update_policy" ON leads FOR UPDATE USING (
  -- Can update if they have general permission and own/assigned the lead
  (has_permission(auth.uid(), 'clients:update'::permission) AND 
   (assigned_to = auth.uid() OR created_by = auth.uid())) OR
  -- Or if they're admin/manager with broader permissions
  has_permission(auth.uid(), 'clients:read'::permission)
);

CREATE POLICY "lead_delete_policy" ON leads FOR DELETE USING (
  -- Only users with delete permission can delete
  has_permission(auth.uid(), 'clients:delete'::permission) AND
  -- Must own or be assigned the lead, or be admin
  (assigned_to = auth.uid() OR created_by = auth.uid() OR 
   has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
);

-- CLIENTS TABLE: Implement role-based access
CREATE POLICY "client_select_policy" ON clients FOR SELECT USING (
  -- Must have permission to read client data
  has_permission(auth.uid(), 'clients:read'::permission)
);

CREATE POLICY "client_insert_policy" ON clients FOR INSERT WITH CHECK (
  -- Must have permission to create clients
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Set the creator
  created_by = auth.uid()
);

CREATE POLICY "client_update_policy" ON clients FOR UPDATE USING (
  -- Must have permission to update clients
  has_permission(auth.uid(), 'clients:update'::permission)
);

CREATE POLICY "client_delete_policy" ON clients FOR DELETE USING (
  -- Must have permission to delete clients
  has_permission(auth.uid(), 'clients:delete'::permission)
);

-- CRM_TASKS TABLE: Implement assignment-based and role-based access
CREATE POLICY "task_select_policy" ON crm_tasks FOR SELECT USING (
  -- Can see tasks assigned to them
  assigned_to = auth.uid() OR
  -- Can see tasks they created
  created_by = auth.uid() OR
  -- Managers and above can see all tasks
  has_permission(auth.uid(), 'analytics:read'::permission)
);

CREATE POLICY "task_insert_policy" ON crm_tasks FOR INSERT WITH CHECK (
  -- Must be authenticated and either assigning to themselves or have management permissions
  auth.uid() IS NOT NULL AND
  (assigned_to = auth.uid() OR has_permission(auth.uid(), 'clients:update'::permission))
);

CREATE POLICY "task_update_policy" ON crm_tasks FOR UPDATE USING (
  -- Can update tasks assigned to them or they created
  assigned_to = auth.uid() OR 
  created_by = auth.uid() OR
  -- Or if they have management permissions
  has_permission(auth.uid(), 'clients:update'::permission)
);

CREATE POLICY "task_delete_policy" ON crm_tasks FOR DELETE USING (
  -- Can delete tasks they created or are assigned to
  assigned_to = auth.uid() OR 
  created_by = auth.uid() OR
  -- Or if they have management permissions
  has_permission(auth.uid(), 'clients:delete'::permission)
);

-- LEAD_ACTIVITIES TABLE: Implement role-based and ownership access
CREATE POLICY "activity_select_policy" ON lead_activities FOR SELECT USING (
  -- Can see activities they created
  created_by = auth.uid() OR
  -- Managers and above can see all activities
  has_permission(auth.uid(), 'analytics:read'::permission) OR
  -- Can see activities for leads assigned to them
  EXISTS (
    SELECT 1 FROM leads l 
    WHERE l.id = lead_activities.lead_id 
    AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
  )
);

CREATE POLICY "activity_insert_policy" ON lead_activities FOR INSERT WITH CHECK (
  -- Must be authenticated and have permission to work with clients
  auth.uid() IS NOT NULL AND
  has_permission(auth.uid(), 'clients:create'::permission)
);

CREATE POLICY "activity_update_policy" ON lead_activities FOR UPDATE USING (
  -- Can update activities they created
  created_by = auth.uid() OR
  -- Or if they have management permissions
  has_permission(auth.uid(), 'clients:update'::permission)
);

CREATE POLICY "activity_delete_policy" ON lead_activities FOR DELETE USING (
  -- Can delete activities they created
  created_by = auth.uid() OR
  -- Or if they have management permissions
  has_permission(auth.uid(), 'clients:delete'::permission)
);

-- SALES_PIPELINE TABLE: Implement role-based and assignment access
CREATE POLICY "pipeline_select_policy" ON sales_pipeline FOR SELECT USING (
  -- Can see pipeline entries assigned to them
  assigned_agent = auth.uid() OR
  -- Managers and above can see all pipeline data
  has_permission(auth.uid(), 'analytics:read'::permission) OR
  -- Can see pipeline for leads assigned to them
  EXISTS (
    SELECT 1 FROM leads l 
    WHERE l.id = sales_pipeline.lead_id 
    AND (l.assigned_to = auth.uid() OR l.created_by = auth.uid())
  )
);

CREATE POLICY "pipeline_insert_policy" ON sales_pipeline FOR INSERT WITH CHECK (
  -- Must have permission to create pipeline entries
  has_permission(auth.uid(), 'clients:create'::permission) AND
  -- Can only assign to themselves or if they have management permissions
  (assigned_agent = auth.uid() OR has_permission(auth.uid(), 'clients:update'::permission))
);

CREATE POLICY "pipeline_update_policy" ON sales_pipeline FOR UPDATE USING (
  -- Can update pipeline entries assigned to them
  assigned_agent = auth.uid() OR
  -- Or if they have management permissions
  has_permission(auth.uid(), 'clients:update'::permission)
);

CREATE POLICY "pipeline_delete_policy" ON sales_pipeline FOR DELETE USING (
  -- Can delete pipeline entries assigned to them
  assigned_agent = auth.uid() OR
  -- Or if they have management permissions
  has_permission(auth.uid(), 'clients:delete'::permission)
);