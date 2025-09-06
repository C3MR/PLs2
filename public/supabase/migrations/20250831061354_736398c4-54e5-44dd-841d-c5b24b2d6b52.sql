-- Clean up and update profiles data with correct information
-- First, delete any duplicate or incorrect entries
DELETE FROM public.profiles WHERE employee_id IN ('EMP-001');

-- Update existing profiles with correct information and new default password
UPDATE public.profiles 
SET 
  full_name = CASE 
    WHEN employee_id = 'Em-001' THEN 'منصور الغامزي'
    WHEN employee_id = 'Em-002' THEN 'عمر الحيدري'
    WHEN employee_id = 'Em-003' THEN 'عبد الرحمن الحميدان'
    WHEN employee_id = 'Em-004' THEN 'علي الزبيدي'
    WHEN employee_id = 'Em-005' THEN 'عبد العزيز العتيبي'
    ELSE full_name
  END,
  email = CASE 
    WHEN employee_id = 'Em-001' THEN 'mansour@avaz.sa'
    WHEN employee_id = 'Em-002' THEN 'omar@avaz.sa'
    WHEN employee_id = 'Em-003' THEN 'abdulrahman@avaz.sa'
    WHEN employee_id = 'Em-004' THEN 'ali@avaz.sa'
    WHEN employee_id = 'Em-005' THEN 'abdulaziz@avaz.sa'
    ELSE email
  END,
  role = CASE 
    WHEN employee_id = 'Em-001' THEN 'super_admin'::app_role
    WHEN employee_id = 'Em-002' THEN 'admin'::app_role
    WHEN employee_id = 'Em-003' THEN 'manager'::app_role
    WHEN employee_id = 'Em-004' THEN 'agent'::app_role
    WHEN employee_id = 'Em-005' THEN 'employee'::app_role
    ELSE role
  END,
  phone = CASE 
    WHEN employee_id = 'Em-001' THEN '+966501234567'
    WHEN employee_id = 'Em-002' THEN '+966501234568'
    WHEN employee_id = 'Em-003' THEN '+966501234569'
    WHEN employee_id = 'Em-004' THEN '+966501234570'
    WHEN employee_id = 'Em-005' THEN '+966501234571'
    ELSE phone
  END,
  updated_at = now()
WHERE employee_id IN ('Em-001', 'Em-002', 'Em-003', 'Em-004', 'Em-005');

-- Note: Passwords will need to be updated in Supabase Auth manually:
-- Default password: Avaz@2030 (for Em-001, Em-003, Em-004, Em-005)
-- Omar Al-Haidari (Em-002): Keep existing password Ma@010203