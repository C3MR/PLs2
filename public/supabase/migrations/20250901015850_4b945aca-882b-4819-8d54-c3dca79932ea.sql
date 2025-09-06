-- إنشاء حساب أدمين جديد في auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role,
    email_change_sent_at,
    last_sign_in_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    phone
) 
SELECT 
    '45282a19-52d5-4fcb-9770-95117d9540bc'::uuid as id,
    '00000000-0000-0000-0000-000000000000'::uuid as instance_id,
    'omar@avaz.sa' as email,
    crypt('Admin123!', gen_salt('bf', 10)) as encrypted_password,
    now() as email_confirmed_at,
    now() as created_at,
    now() as updated_at,
    'authenticated' as aud,
    'authenticated' as role,
    null as email_change_sent_at,
    null as last_sign_in_at,
    null as confirmation_sent_at,
    '' as confirmation_token,
    null as recovery_sent_at,
    '' as email_change_token_new,
    '' as email_change,
    '{"provider": "email", "providers": ["email"]}' as raw_app_meta_data,
    '{"full_name": "عمر الحيدري", "role": "admin"}' as raw_user_meta_data,
    false as is_super_admin,
    '+966501234568' as phone
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'omar@avaz.sa'
);

-- تحديث بيانات المستخدم في حالة وجوده
UPDATE auth.users 
SET 
    encrypted_password = crypt('Admin123!', gen_salt('bf', 10)),
    email_confirmed_at = now(),
    updated_at = now(),
    raw_user_meta_data = '{"full_name": "عمر الحيدري", "role": "admin"}'
WHERE email = 'omar@avaz.sa';