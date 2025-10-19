import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, profileId } = await req.json();

    if (!userId || !profileId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing userId or profileId" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("[DELETE-PROFILE] Request received", { userId, profileId });

    // Verify admin privileges
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("[DELETE-PROFILE] Error checking admin role:", roleError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to verify admin status" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!roleData) {
      console.warn("[DELETE-PROFILE] Forbidden: user is not admin", { userId });
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden: admin only" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Perform deletion (enrichments will cascade)
    const { error: deleteError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", profileId);

    if (deleteError) {
      console.error("[DELETE-PROFILE] Error deleting profile:", deleteError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete profile" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("[DELETE-PROFILE] Profile deleted", { profileId });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[DELETE-PROFILE] Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err instanceof Error ? err.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});