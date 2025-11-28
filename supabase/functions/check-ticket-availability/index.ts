import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EARLY_BIRD_PRICE_ID = "price_1SGlggEt4aAP5ylPfhAvGpJW";
const EARLY_BIRD_CUTOFF_DATE = new Date("2025-12-01T00:00:00Z");
const EARLY_BIRD_CAPACITY = 20;

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-AVAILABILITY] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if we're past the cutoff date
    const now = new Date();
    const isPastCutoff = now >= EARLY_BIRD_CUTOFF_DATE;
    logStep("Date check", { now: now.toISOString(), cutoff: EARLY_BIRD_CUTOFF_DATE.toISOString(), isPastCutoff });

    // Count successful early bird payments by retrieving completed sessions
    // List all completed checkout sessions (limited to last 100)
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    logStep("Sessions retrieved", { count: sessions.data.length });

    let earlyBirdSold = 0;
    
    // For each completed session, retrieve full details with line_items expanded
    for (const session of sessions.data) {
      if (session.payment_status === "paid") {
        try {
          // Retrieve individual session with line_items expanded
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
          });
          
          const hasEarlyBird = fullSession.line_items?.data?.some(
            (item: any) => item.price?.id === EARLY_BIRD_PRICE_ID
          );
          
          if (hasEarlyBird) {
            earlyBirdSold++;
            logStep("Early bird session found", { sessionId: session.id });
          }
        } catch (retrieveError) {
          logStep("Error retrieving session", { 
            sessionId: session.id, 
            error: retrieveError instanceof Error ? retrieveError.message : String(retrieveError)
          });
        }
      }
    }

    logStep("Early bird tickets sold", { count: earlyBirdSold });

    const isEarlyBirdAvailable = !isPastCutoff && earlyBirdSold < EARLY_BIRD_CAPACITY;
    const earlyBirdRemaining = Math.max(0, EARLY_BIRD_CAPACITY - earlyBirdSold);

    return new Response(JSON.stringify({
      isEarlyBird: isEarlyBirdAvailable,
      earlyBirdSold,
      earlyBirdRemaining,
      isPastCutoff,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-availability", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
