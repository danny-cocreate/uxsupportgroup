// trigger rebuild: no-op change
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    console.log(`[PROFILE-META] Processing request for slug: ${slug}`);

    // Detect crawlers
    const userAgent = req.headers.get('user-agent') || '';
    const isCrawler = /linkedinbot|facebookexternalhit|twitterbot|slackbot|whatsapp|bot|crawler|spider/i.test(userAgent);

    console.log(`[PROFILE-META] User-Agent: ${userAgent}, isCrawler: ${isCrawler}`);

    // If not a crawler, return empty response (let React app handle it)
    if (!isCrawler) {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`[PROFILE-META] Fetching profile with slug: ${slug}`);

    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[PROFILE-META] Database error:', error);
      return new Response('Database error', { status: 500 });
    }

    if (!profile) {
      console.error('[PROFILE-META] Profile not found:', slug);
      return new Response('Profile not found', { status: 404 });
    }

    console.log(`[PROFILE-META] Profile found: ${profile.name}`);

    // Determine the best image to use (prioritize card screenshot)
    const ogImage = profile.card_screenshot_url || profile.profile_photo_url || 'https://uxsupportgroup.com/uxsg-logo.png';
    const profileUrl = `https://uxsupportgroup.com/summit-profiles/${slug}`;
    const title = `${profile.name || 'Profile'} | AIxUX Summit 2025`;
    const description = profile.job_title && profile.company_name 
      ? `${profile.job_title} at ${profile.company_name} | Join us at the AIxUX Summit`
      : profile.job_title || profile.company_name || 'AIxUX Summit Profile';

    console.log(`[PROFILE-META] Generating meta tags with image: ${ogImage}`);

    // Generate HTML with meta tags
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          
          <!-- Open Graph / Facebook / LinkedIn -->
          <meta property="og:type" content="profile">
          <meta property="og:url" content="${profileUrl}">
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${ogImage}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:image:type" content="image/png">
          <meta property="og:site_name" content="AIxUX Summit">
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:url" content="${profileUrl}">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${ogImage}">
          
          <!-- Redirect to actual page after crawlers read meta tags -->
          <meta http-equiv="refresh" content="0;url=${profileUrl}">
        </head>
        <body>
          <script>window.location.href = "${profileUrl}";</script>
          <noscript>
            <p>Redirecting to <a href="${profileUrl}">${profile.name}'s profile</a>...</p>
          </noscript>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('[PROFILE-META] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
