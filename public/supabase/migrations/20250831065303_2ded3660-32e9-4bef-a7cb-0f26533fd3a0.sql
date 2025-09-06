-- Fix foreign key references and create CRM system

-- Lead Sources Enum
CREATE TYPE lead_source AS ENUM (
  'website', 'phone_call', 'referral', 'social_media', 
  'advertisement', 'walk_in', 'event', 'other'
);

-- Lead Status Enum  
CREATE TYPE lead_status AS ENUM (
  'new', 'contacted', 'qualified', 'proposal_sent', 
  'negotiation', 'won', 'lost', 'on_hold'
);

-- Task Priority Enum
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Task Status Enum
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Leads Table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT UNIQUE NOT NULL DEFAULT ('LEAD-' || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 999999)::TEXT, 6, '0')),
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  secondary_phone TEXT,
  
  -- Lead Details
  source lead_source NOT NULL DEFAULT 'website',
  status lead_status NOT NULL DEFAULT 'new',
  priority task_priority DEFAULT 'medium',
  
  -- Property Interest
  interested_property_type TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  preferred_location TEXT,
  requirements TEXT,
  
  -- Assignment and Tracking
  assigned_to UUID,
  created_by UUID,
  
  -- Lead Scoring
  score INTEGER DEFAULT 0,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sales Pipeline Table
CREATE TABLE public.sales_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id),
  
  -- Deal Information
  deal_value NUMERIC NOT NULL,
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  
  -- Commission and Fees
  commission_rate NUMERIC DEFAULT 2.5,
  commission_amount NUMERIC,
  
  -- Status Tracking
  stage lead_status NOT NULL DEFAULT 'new',
  stage_changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Assignment
  assigned_agent UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRM Tasks Table
CREATE TABLE public.crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Task Details
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'follow_up',
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  
  -- Scheduling
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Relations
  lead_id UUID REFERENCES public.leads(id),
  property_id UUID REFERENCES public.properties(id),
  client_id UUID REFERENCES public.clients(id),
  
  -- Assignment
  assigned_to UUID NOT NULL,
  created_by UUID,
  
  -- Metadata
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lead Activities Log
CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  
  -- Contact Details
  contact_method TEXT,
  duration_minutes INTEGER,
  outcome TEXT,
  
  -- Follow-up
  requires_follow_up BOOLEAN DEFAULT FALSE,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- User tracking
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);

CREATE INDEX idx_pipeline_stage ON public.sales_pipeline(stage);
CREATE INDEX idx_tasks_assigned_to ON public.crm_tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON public.crm_tasks(due_date);

-- Triggers for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pipeline_updated_at
  BEFORE UPDATE ON public.sales_pipeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.crm_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();