import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import {
  countPaidEarlyBirdSales,
  EARLY_BIRD_CAPACITY,
  EARLY_BIRD_PRICE_ID,
  REGULAR_PRICE_ID,
  SUMMIT_PRODUCT_SLUG,
} from "../_shared/summitEarlyBird.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

function checkoutBaseUrl(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const u = new URL(referer);
      return `${u.protocol}//${u.host}`;
    } catch {
      /* fall through */
    }
  }

  return "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { priceId } = await req.json();

    const allowed = new Set([EARLY_BIRD_PRICE_ID, REGULAR_PRICE_ID]);
    if (!priceId || !allowed.has(priceId)) {
      throw new Error("Invalid or missing price ID");
    }

    logStep("Creating checkout session", { priceId });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const { earlyBirdSold, truncated } = await countPaidEarlyBirdSales(stripe, (step, d) =>
      logStep(step, d)
    );

    if (truncated) {
      logStep("WARNING early bird count may be incomplete", { earlyBirdSold });
    }

    if (priceId === EARLY_BIRD_PRICE_ID) {
      if (earlyBirdSold >= EARLY_BIRD_CAPACITY) {
        throw new Error("Early bird tickets are sold out");
      }
    }

    if (priceId === REGULAR_PRICE_ID) {
      if (earlyBirdSold < EARLY_BIRD_CAPACITY) {
        throw new Error("Regular tickets are available after early bird sells out");
      }
    }

    const base = checkoutBaseUrl(req);
    if (!base) {
      throw new Error("Could not determine site URL for checkout redirect");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        price_id: priceId,
        ticket_type: priceId === EARLY_BIRD_PRICE_ID ? "early_bird" : "regular",
        product: SUMMIT_PRODUCT_SLUG,
      },
      success_url: `${base}/summit?checkout=success`,
      cancel_url: `${base}/summit?checkout=canceled`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
