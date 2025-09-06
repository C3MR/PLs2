-- Add new permissions for CRM system to existing enum
ALTER TYPE permission ADD VALUE 'leads:create';
ALTER TYPE permission ADD VALUE 'leads:read';
ALTER TYPE permission ADD VALUE 'leads:update';
ALTER TYPE permission ADD VALUE 'leads:delete';
ALTER TYPE permission ADD VALUE 'sales:create';
ALTER TYPE permission ADD VALUE 'sales:read';
ALTER TYPE permission ADD VALUE 'sales:update';
ALTER TYPE permission ADD VALUE 'sales:delete';
ALTER TYPE permission ADD VALUE 'sales:manage';
ALTER TYPE permission ADD VALUE 'tasks:create';
ALTER TYPE permission ADD VALUE 'tasks:read';
ALTER TYPE permission ADD VALUE 'tasks:update';
ALTER TYPE permission ADD VALUE 'tasks:delete';
ALTER TYPE permission ADD VALUE 'crm:admin';

-- Add simple RLS policies for CRM tables without custom permissions first
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Users can create leads" ON public.leads;

CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update leads" ON public.leads
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete leads" ON public.leads
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Sales Pipeline policies
CREATE POLICY "Authenticated users can view pipeline" ON public.sales_pipeline
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage pipeline" ON public.sales_pipeline
  FOR ALL USING (auth.uid() IS NOT NULL);

-- CRM Tasks policies
CREATE POLICY "Users can view tasks" ON public.crm_tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage tasks" ON public.crm_tasks
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Lead Activities policies
CREATE POLICY "Users can view activities" ON public.lead_activities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage activities" ON public.lead_activities
  FOR ALL USING (auth.uid() IS NOT NULL);