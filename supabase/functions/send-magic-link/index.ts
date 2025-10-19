import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from 'https://esm.sh/resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'UX Support Group <info@uxsupportgroup.com>';
const PUBLIC_SITE_URL = Deno.env.get('PUBLIC_SITE_URL') || 'https://uxsupportgroup.com';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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
    const magicLink = `${PUBLIC_SITE_URL}/summit-profiles/verify?token=${token}`;
    
    console.log('[SEND-MAGIC-LINK] Preparing to send email', { 
      to: email, 
      from: EMAIL_FROM,
      magicLink 
    });
    
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [email],
        subject: 'Magic Link to Create/Edit your profile',
        html: `
          <h2>Create or Edit Your Profile</h2>
          <p>Click the link below to create or edit your profile:</p>
          <p><a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Create/Edit Profile</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p>${magicLink}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      if (emailError) {
        console.error('[SEND-MAGIC-LINK] Resend API error:', emailError);
        throw emailError;
      }

      console.log('[SEND-MAGIC-LINK] Email sent successfully', { 
        id: emailData?.id,
        to: email 
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
