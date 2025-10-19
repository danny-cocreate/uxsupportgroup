import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get token from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'invalid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ valid: false, reason: 'expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark token as used
    await supabase
      .from('magic_link_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    // Check if user exists
    let { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', tokenData.email)
      .maybeSingle();

    // If no profile exists, create one
    if (!existingProfile) {
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          email: tokenData.email,
          name: tokenData.email.split('@')[0] // Default name from email
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        existingProfile = newProfile;
        
        // Grant admin role to specified emails
        const adminEmails = ['your-email@example.com']; // Replace with actual admin emails
        if (adminEmails.includes(tokenData.email)) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: newProfile.id,
              role: 'admin'
            });
          
          if (roleError) {
            console.error('Error assigning admin role:', roleError);
          } else {
            console.log('Admin role assigned to:', tokenData.email);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        email: tokenData.email,
        userId: existingProfile?.id || null,
        hasProfile: !!existingProfile,
        profile: existingProfile
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
