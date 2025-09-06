import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, full_name } = await req.json()

    console.log('Creating user for email:', email)

    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Profile check error:', profileCheckError)
      return new Response(
        JSON.stringify({ error: 'Database error checking profile', details: profileCheckError.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If profile exists but already has user_id
    if (existingProfile && existingProfile.user_id) {
      return new Response(
        JSON.stringify({ 
          error: 'user_already_exists', 
          details: 'المستخدم موجود بالفعل في النظام',
          suggestion: 'يرجى استخدام تسجيل الدخول بدلاً من إنشاء حساب جديد'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      
      // If profile exists but no auth user, suggest manual creation
      if (existingProfile && authError.message.includes('duplicate')) {
        return new Response(
          JSON.stringify({ 
            error: 'profile_exists_no_auth',
            details: 'الملف الشخصي موجود لكن حساب المصادقة مفقود',
            suggestion: 'يرجى إنشاء المستخدم يدوياً في Auth Dashboard',
            manual_creation_needed: true,
            email: email,
            password: password
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to create auth user', details: authError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Auth user created:', authData.user?.id)

    // Link to existing profile or create new one
    if (existingProfile) {
      // Update existing profile with new user_id
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ user_id: authData.user!.id, updated_at: new Date().toISOString() })
        .eq('email', email)
        .select()
        .single()

      if (profileError) {
        console.error('Profile update error:', profileError)
        // Clean up auth user
        await supabaseAdmin.auth.admin.deleteUser(authData.user!.id)
        return new Response(
          JSON.stringify({ error: 'Failed to link profile', details: profileError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Profile linked successfully:', profileData)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: authData.user,
          profile: profileData,
          message: 'تم ربط الحساب بالملف الشخصي بنجاح'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      // Create new profile
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: authData.user!.id,
          email: email,
          full_name: full_name,
          role: 'employee'
        })
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Clean up auth user
        await supabaseAdmin.auth.admin.deleteUser(authData.user!.id)
        return new Response(
          JSON.stringify({ error: 'Failed to create profile', details: profileError.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Profile created successfully:', profileData)

      return new Response(
        JSON.stringify({ 
          success: true, 
          user: authData.user,
          profile: profileData,
          message: 'تم إنشاء الحساب والملف الشخصي بنجاح'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})