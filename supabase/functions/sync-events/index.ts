import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvxwLtsvCCw8mP4Qdz3M9B6XF5pCxpzw1idCNrwa9ETxnQ-EMzQJ3uaOrWvjfV1wqIzeK4CpyWDNjp/pub?output=csv';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[SYNC-EVENTS] Starting sync...');

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch CSV from Google Sheets
    console.log('[SYNC-EVENTS] Fetching CSV from Google Sheets...');
    const csvResponse = await fetch(GOOGLE_SHEETS_CSV_URL);
    
    if (!csvResponse.ok) {
      throw new Error(`Failed to fetch CSV: ${csvResponse.statusText}`);
    }

    const csvText = await csvResponse.text();
    console.log('[SYNC-EVENTS] CSV fetched successfully');

    // Parse CSV
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log('[SYNC-EVENTS] CSV headers:', headers);

    const events = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Parse CSV line (handle quoted values)
      const values: string[] = [];
      let currentValue = '';
      let insideQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      // Create event object
      const event: any = {};
      headers.forEach((header, index) => {
        event[header] = values[index] || null;
      });

      // Determine event type based on date
      const eventDate = new Date(event.date);
      event.event_type = eventDate >= today ? 'upcoming' : 'past';

      console.log('[SYNC-EVENTS] Processing event:', {
        title: event.title,
        date: event.date,
        event_type: event.event_type
      });

      events.push({
        title: event.title,
        date: event.date,
        start_time: event.start_time,
        location: event.location,
        description: event.description,
        meetup_link: event.meetup_link,
        event_type: event.event_type
      });
    }

    console.log(`[SYNC-EVENTS] Parsed ${events.length} events`);

    // Delete existing events
    console.log('[SYNC-EVENTS] Clearing existing events...');
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('[SYNC-EVENTS] Error deleting events:', deleteError);
      throw deleteError;
    }

    // Insert new events
    console.log('[SYNC-EVENTS] Inserting new events...');
    const { data, error: insertError } = await supabase
      .from('events')
      .insert(events)
      .select();

    if (insertError) {
      console.error('[SYNC-EVENTS] Error inserting events:', insertError);
      throw insertError;
    }

    console.log(`[SYNC-EVENTS] Successfully synced ${data?.length || 0} events`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${data?.length || 0} events`,
        events: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('[SYNC-EVENTS] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
