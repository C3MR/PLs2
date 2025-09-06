-- Add RLS policies for CRM tables

-- RLS Policies for Leads
CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Assigned users can update leads" ON public.leads
  FOR UPDATE USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'leads:update'::permission)
  );

CREATE POLICY "Assigned users can delete leads" ON public.leads
  FOR DELETE USING (
    auth.uid() = created_by OR 
    has_permission(auth.uid(), 'leads:delete'::permission)
  );

-- RLS Policies for Sales Pipeline
CREATE POLICY "Authenticated users can view pipeline" ON public.sales_pipeline
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create pipeline entries" ON public.sales_pipeline
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Assigned agents can update pipeline" ON public.sales_pipeline
  FOR UPDATE USING (
    auth.uid() = assigned_agent OR 
    has_permission(auth.uid(), 'sales:manage'::permission)
  );

CREATE POLICY "Assigned agents can delete pipeline" ON public.sales_pipeline
  FOR DELETE USING (
    auth.uid() = assigned_agent OR 
    has_permission(auth.uid(), 'sales:manage'::permission)
  );

-- RLS Policies for CRM Tasks
CREATE POLICY "Users can view relevant tasks" ON public.crm_tasks
  FOR SELECT USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR
    has_permission(auth.uid(), 'tasks:read'::permission)
  );

CREATE POLICY "Users can create tasks" ON public.crm_tasks
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their tasks" ON public.crm_tasks
  FOR UPDATE USING (
    auth.uid() = assigned_to OR 
    auth.uid() = created_by OR
    has_permission(auth.uid(), 'tasks:update'::permission)
  );

CREATE POLICY "Users can delete their tasks" ON public.crm_tasks
  FOR DELETE USING (
    auth.uid() = created_by OR
    has_permission(auth.uid(), 'tasks:delete'::permission)
  );

-- RLS Policies for Lead Activities
CREATE POLICY "Users can view lead activities" ON public.lead_activities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create activities" ON public.lead_activities
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their activities" ON public.lead_activities
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their activities" ON public.lead_activities
  FOR DELETE USING (auth.uid() = created_by);