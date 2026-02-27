import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("BREVO_API_KEY");

    if (!apiKey) {
      console.error("[WAITLIST] Missing Brevo API key");
      return new Response(
        JSON.stringify({ error: "Server not configured for waitlist" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Hardcoded Brevo list ID for AIxUX Summit 2026 waitlist
    const listId = 8;

    const body = await req.json();
    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim().toLowerCase();

    const errors: string[] = [];
    if (!name || name.length > 100) {
      errors.push("Name must be between 1 and 100 characters");
    }
    if (!email || email.length > 255 || !emailRegex.test(email)) {
      errors.push("Valid email address required (max 255 characters)");
    }

    if (errors.length > 0) {
      console.error("[WAITLIST] Validation failed:", errors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: errors }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const payload = {
      email,
      attributes: {
        FIRSTNAME: name,
        SOURCE: "AIxUX Summit 2026 Waitlist",
      },
      listIds: [listId],
      updateEnabled: true,
    };

    console.log("[WAITLIST] Adding contact to Brevo list", {
      email,
      listId,
    });

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const brevoText = await brevoRes.text();
    let brevoJson: any = null;
    try {
      brevoJson = brevoText ? JSON.parse(brevoText) : null;
    } catch {
      // keep raw text for logging
    }

    if (!brevoRes.ok) {
      console.error("[WAITLIST] Brevo error", {
        status: brevoRes.status,
        body: brevoJson ?? brevoText,
      });
      return new Response(
        JSON.stringify({
          error: "Failed to subscribe to waitlist",
          details: brevoJson ?? brevoText,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("[WAITLIST] Successfully added contact", { email, listId });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("[WAITLIST] Unexpected error", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unexpected error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

