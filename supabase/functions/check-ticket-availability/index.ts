import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import {
  countPaidEarlyBirdSales,
  EARLY_BIRD_CAPACITY,
} from "../_shared/summitEarlyBird.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
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

    const { earlyBirdSold, truncated, sessionsExamined, sessionsCreatedGteUnix } =
      await countPaidEarlyBirdSales(stripe, (step, d) => logStep(step, d));

    logStep("Early bird count complete", {
      earlyBirdSold,
      sessionsExamined,
      truncated,
      sessionsCreatedGteUnix,
    });

    const isEarlyBirdAvailable = earlyBirdSold < EARLY_BIRD_CAPACITY;
    const earlyBirdRemaining = Math.max(0, EARLY_BIRD_CAPACITY - earlyBirdSold);

    return new Response(
      JSON.stringify({
        isEarlyBird: isEarlyBirdAvailable,
        earlyBirdSold,
        earlyBirdRemaining,
        truncated,
        sessionsExamined,
        sessionsCreatedGteUnix,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-availability", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
