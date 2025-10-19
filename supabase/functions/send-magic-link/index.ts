import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate secure random token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    // Store magic link token
    await supabase.from('magic_link_tokens').insert({
      token,
      email,
      user_id: existingProfile?.id || null,
      expires_at: expiresAt.toISOString(),
    });

    // Send email via Resend
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://uxsupportgroup.com';
    const magicLink = `${origin}/summit-profiles/verify?token=${token}`;
    
    console.log('Magic link generated:', magicLink);

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    try {
      await resend.emails.send({
        from: 'UX Support Group <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Magic Link to Access Admin Panel',
        html: `
          <h2>Access Your Admin Panel</h2>
          <p>Click the link below to securely log in:</p>
          <p><a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Log In</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${magicLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Magic link sent! Check your email to log in.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send email. Please try again.' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error sending magic link:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
