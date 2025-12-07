import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_FROM = Deno.env.get("EMAIL_FROM") || "UX Support Group <info@uxsupportgroup.com>";
const PUBLIC_SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "https://uxsupportgroup.com";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate secure random token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // Store magic link token
    await supabase.from("magic_link_tokens").insert({
      token,
      email,
      user_id: existingProfile?.id || null,
      expires_at: expiresAt.toISOString(),
    });

    // Send email via Resend
    const magicLink = `${PUBLIC_SITE_URL}/summit-profiles/verify?token=${token}`;

    console.log("[SEND-MAGIC-LINK] Preparing to send email", {
      to: email,
      from: EMAIL_FROM,
      magicLink,
    });

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [email],
        subject: "Your Magic Link to Create/Edit Your Profile Card - UXSG",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Magic Link - UX Support Group</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #E8E5F0; line-height: 1.6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #E8E5F0; padding: 20px 0;">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header - Matching Modal Profile Card Style -->
                    <tr>
                      <td style="padding: 40px 40px 0; background-color: #FFFFFF; border-radius: 8px 8px 0 0;">
                        <!-- Logo and Title Row - Matching Modal Style -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 0 0 40px 0;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="padding: 0; vertical-align: middle;">
                                    <table role="presentation" style="border-collapse: collapse;">
                                      <tr>
                                        <td style="padding: 0; vertical-align: middle;">
                                          <img src="${PUBLIC_SITE_URL}/uxsg-logo.svg" alt="UXSG" style="height: 31px; width: auto; display: block; margin-right: -11px;" />
                                        </td>
                                        <td style="padding: 0; padding-left: 11px; padding-right: 0; width: 1px; vertical-align: middle;">
                                          <table role="presentation" style="width: 1px; height: 34px; border-collapse: collapse;">
                                            <tr><td style="width: 1px; height: 34px; border-left: 1px solid #E0E0E0; line-height: 0; font-size: 0;">&nbsp;</td></tr>
                                          </table>
                                        </td>
                                        <td style="padding: 0; padding-left: 7px; vertical-align: middle;">
                                          <h3 style="margin: 0; font-size: 21px; font-weight: 600; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1;">
                                            AI<span style="color: #995AF2;">x</span>UX Summit 2025
                                          </h3>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!-- Separator Line -->
                          <tr>
                            <td style="padding: 0; border-bottom: 1px solid #E0E0E0;"></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 24px; color: #1A1A1A; font-size: 40px; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Welcome! 👋</h2>
                        <p style="margin: 0 0 20px; color: #4A4A4A; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
                          You've requested a magic link to access your profile card for the AI<span style="color: #995AF2;">x</span>UX Virtual Summit 2025.
                        </p>
                        <p style="margin: 0 0 30px; color: #4A4A4A; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
                          Click the button below to ${existingProfile ? "view or edit your profile card" : "create your profile card"}:
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="width: 100%; margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${magicLink}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${existingProfile ? "Edit My Profile Card" : "Create My Profile Card"}
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Alternative Link -->
                        <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #8B5CF6;">
                          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; font-weight: 600;">Can't click the button?</p>
                          <p style="margin: 0; color: #4b5563; font-size: 14px; word-break: break-all;">
                            Copy and paste this link into your browser:<br>
                            <a href="${magicLink}" style="color: #8B5CF6; text-decoration: underline;">${magicLink}</a>
                          </p>
                        </div>
                        
                        <!-- Important Info -->
                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                            <strong style="color: #374151;">⏰ This link expires in 24 hours</strong>
                          </p>
                          <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            For security reasons, this magic link can only be used once and will expire after 24 hours. If you need a new link, simply request another one.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                          <strong style="color: #374151;">Didn't request this?</strong>
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                          You can safely ignore this email. No changes will be made to your account.
                        </p>
                        <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} UX Support Group. All rights reserved.<br>
                          <a href="${PUBLIC_SITE_URL}" style="color: #8B5CF6; text-decoration: none;">${PUBLIC_SITE_URL}</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      if (emailError) {
        console.error("[SEND-MAGIC-LINK] Resend API error:", emailError);
        throw emailError;
      }

      console.log("[SEND-MAGIC-LINK] Email sent successfully", {
        id: emailData?.id,
        to: email,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Magic link sent! Check your email to log in.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(JSON.stringify({ error: "Failed to send email. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error sending magic link:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
