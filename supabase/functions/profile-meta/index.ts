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
  // Handle HEAD requests (some crawlers send HEAD first)
  if (req.method === 'HEAD') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    console.log(`[PROFILE-META] Processing request for slug: ${slug}`);

    // Detect crawlers - simplified and more reliable regex
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
    const isCrawler = 
      userAgent.includes('bot') ||
      userAgent.includes('crawler') ||
      userAgent.includes('spider') ||
      userAgent.includes('facebook') ||
      userAgent.includes('linkedin') ||
      userAgent.includes('twitter') ||
      userAgent.includes('slack') ||
      userAgent.includes('whatsapp') ||
      userAgent.includes('discord') ||
      userAgent.includes('pinterest');

    console.log(`[PROFILE-META] Request for ${slug}: ${isCrawler ? 'CRAWLER' : 'USER'} - UA: ${userAgent}`);

    // If not a crawler, redirect to SPA
    if (!isCrawler) {
      console.log(`[PROFILE-META] Redirecting user to SPA`);
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `https://uxsupportgroup.com/summit-profiles?profile=${slug}`
        }
      });
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`[PROFILE-META] Fetching profile with slug: ${slug}`);

    // Fetch profile data - try by slug first, then by ID if slug doesn't work
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    // If not found by slug and slug looks like a UUID, try by ID
    if (!profile && !error && slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log(`[PROFILE-META] Slug looks like UUID, trying ID lookup`);
      const result = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', slug)
        .maybeSingle();
      profile = result.data;
      error = result.error;
    }

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
    const profileParam = profile.slug || profile.id;
    const profileUrl = `https://uxsupportgroup.com/summit-profiles/${profileParam}`;
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
          <meta property="og:image:secure_url" content="${ogImage}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:image:type" content="image/png">
          <meta property="og:site_name" content="AIxUX Summit">
          <link rel="canonical" href="${profileUrl}">
          <meta name="description" content="${description}">
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:url" content="${profileUrl}">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${ogImage}">
        </head>
        <body>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800',
        'Vary': 'User-Agent',
        'X-Profile-Meta': 'generated',
        'X-Slug': slug,
        'X-Is-Crawler': 'true'
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
