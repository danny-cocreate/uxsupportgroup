import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Find an empty position in the grid (exact copy from client-side logic)
const findEmptyPosition = (existingProfiles: any[]) => {
  const cardWidth = 200;
  const cardHeight = 250;
  const spacingX = 240;
  const spacingY = 300;
  const startX = 50;
  const startY = 50;
  const cardsPerRow = 5;
  
  // Generate all possible grid positions (up to 45 rows = 225 cards)
  const gridPositions: {x: number, y: number}[] = [];
  for (let row = 0; row < 45; row++) {
    for (let col = 0; col < cardsPerRow; col++) {
      gridPositions.push({
        x: startX + col * spacingX,
        y: startY + row * spacingY
      });
    }
  }
  
  // Find first position without collision
  for (const pos of gridPositions) {
    let hasCollision = false;
    
    for (const profile of existingProfiles) {
      const px = profile.wall_position_x || 0;
      const py = profile.wall_position_y || 0;
      
      if (Math.abs(pos.x - px) < cardWidth && 
          Math.abs(pos.y - py) < cardHeight) {
        hasCollision = true;
        break;
      }
    }
    
    if (!hasCollision) {
      return pos;
    }
  }
  
  // Fallback: place at the end
  const maxY = existingProfiles.reduce((max, p) => 
    Math.max(max, (p.wall_position_y || 0)), 0);
  return { x: startX, y: maxY + spacingY };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, job_title, company_name, linkedin_url } = await req.json();
    
    console.log('[CREATE-PROFILE] Request received:', { email, name, job_title });
    
    // Validate required fields
    if (!email || !name || !job_title) {
      return new Response(
        JSON.stringify({ error: 'email, name, and job_title are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check for duplicate email
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('[CREATE-PROFILE] Error checking for duplicate:', checkError);
      throw checkError;
    }

    if (existingProfile) {
      console.log('[CREATE-PROFILE] Duplicate email found:', email);
      return new Response(
        JSON.stringify({ error: 'A profile with this email already exists' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get ALL current profiles with their positions (fresh data!)
    const { data: existingProfiles, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, wall_position_x, wall_position_y');

    if (fetchError) {
      console.error('[CREATE-PROFILE] Error fetching profiles:', fetchError);
      throw fetchError;
    }

    console.log('[CREATE-PROFILE] Found', existingProfiles?.length || 0, 'existing profiles');

    // Calculate empty position with fresh data
    const position = findEmptyPosition(existingProfiles || []);
    console.log('[CREATE-PROFILE] Calculated position:', position);

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    // Insert new profile with calculated position
    const { data: profile, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        email,
        name,
        job_title,
        company_name: company_name || null,
        linkedin_url: linkedin_url || null,
        slug,
        wall_position_x: position.x,
        wall_position_y: position.y
      })
      .select()
      .single();

    if (insertError) {
      console.error('[CREATE-PROFILE] Error inserting profile:', insertError);
      throw insertError;
    }

    console.log('[CREATE-PROFILE] Profile created successfully:', profile.id);

    return new Response(
      JSON.stringify({ 
        profile,
        position // Return the position for client-side scrolling
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[CREATE-PROFILE] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
