export const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
export const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";
export const EARLY_BIRD_CAPACITY = 20;

/** Only count checkouts from 2026 onward unless SUMMIT_CHECKOUT_CREATED_GTE_UNIX overrides (excludes 2025 summit). */
const DEFAULT_COUNT_CREATED_GTE_UNIX = Math.floor(Date.UTC(2026, 0, 1) / 1000);

export const SUMMIT_PRODUCT_SLUG = "aixux_summit_2026";

type SessionListItem = {
  id: string;
  payment_status: string;
  metadata?: Record<string, string> | null;
};

type StripeForEarlyBird = {
  checkout: {
    sessions: {
      list: (params: Record<string, unknown>) => Promise<{
        data: SessionListItem[];
        has_more: boolean;
      }>;
      listLineItems: (
        sessionId: string,
        params: { limit?: number }
      ) => Promise<{ data: Array<{ price?: unknown }> }>;
    };
  };
};

/** Stripe returns `price` as either a string id or an expanded Price object. */
export function lineItemPriceId(item: { price?: unknown }): string | undefined {
  const p = item.price;
  if (typeof p === "string") return p;
  if (p && typeof p === "object" && p !== null && "id" in p) {
    const id = (p as { id?: unknown }).id;
    return typeof id === "string" ? id : undefined;
  }
  return undefined;
}

/**
 * True only for AIxUX Summit 2026 early bird — not legacy sessions that only had ticket_type=early_bird.
 */
function isEarlyBirdFromMetadata(meta: Record<string, string> | null | undefined): boolean {
  if (!meta) return false;
  if (meta.price_id === EARLY_BIRD_PRICE_ID) return true;
  if (meta.product === SUMMIT_PRODUCT_SLUG && meta.ticket_type === "early_bird") return true;
  return false;
}

async function sessionHasEarlyBirdPrice(
  stripe: StripeForEarlyBird,
  sessionId: string,
  log?: (step: string, details?: Record<string, unknown>) => void
): Promise<boolean> {
  try {
    const lines = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 24 });
    return lines.data.some((item) => lineItemPriceId(item) === EARLY_BIRD_PRICE_ID);
  } catch (e) {
    log?.("listLineItems failed", {
      sessionId,
      error: e instanceof Error ? e.message : String(e),
    });
    return false;
  }
}

export type EarlyBirdCountResult = {
  earlyBirdSold: number;
  truncated: boolean;
  sessionsExamined: number;
  /** Unix seconds: only sessions created at or after this are scanned (null = no filter). */
  sessionsCreatedGteUnix: number | null;
};

/**
 * Count paid Checkout sessions for 2026 early-bird only.
 * - Lists sessions with created >= 2026-01-01 UTC by default (strips 2025 sales).
 * - Metadata: price_id must match 2026 early bird, OR product=aixux_summit_2026 + early_bird.
 * - Fallback: line items include the 2026 early-bird price id.
 */
export async function countPaidEarlyBirdSales(
  stripe: StripeForEarlyBird,
  log?: (step: string, details?: Record<string, unknown>) => void
): Promise<EarlyBirdCountResult> {
  const createdGteRaw = Deno.env.get("SUMMIT_CHECKOUT_CREATED_GTE_UNIX");
  let createdGte: number | undefined;
  if (createdGteRaw != null && createdGteRaw !== "") {
    const parsed = parseInt(createdGteRaw, 10);
    if (Number.isNaN(parsed)) {
      log?.("Invalid SUMMIT_CHECKOUT_CREATED_GTE_UNIX ignored", { raw: createdGteRaw });
      createdGte = DEFAULT_COUNT_CREATED_GTE_UNIX;
    } else if (parsed === 0) {
      createdGte = undefined;
    } else {
      createdGte = parsed;
    }
  } else {
    createdGte = DEFAULT_COUNT_CREATED_GTE_UNIX;
  }

  const maxSessions = Math.min(
    50_000,
    Math.max(100, parseInt(Deno.env.get("SUMMIT_EARLY_BIRD_MAX_SESSIONS_SCAN") ?? "10000", 10) || 10000)
  );

  let earlyBirdSold = 0;
  let sessionsExamined = 0;
  let startingAfter: string | undefined;
  let truncated = false;
  let done = false;

  while (sessionsExamined < maxSessions && !done) {
    const params: Record<string, unknown> = { limit: 100 };
    if (startingAfter) params.starting_after = startingAfter;
    if (createdGte != null && !Number.isNaN(createdGte)) {
      params.created = { gte: createdGte };
    }

    const page = await stripe.checkout.sessions.list(params);
    if (page.data.length === 0) break;

    for (const session of page.data) {
      sessionsExamined++;
      if (session.payment_status !== "paid") continue;

      let isEarly = isEarlyBirdFromMetadata(session.metadata ?? undefined);

      if (!isEarly) {
        isEarly = await sessionHasEarlyBirdPrice(stripe, session.id, log);
      }

      if (isEarly) {
        earlyBirdSold++;
        log?.("Early bird sale counted", {
          sessionId: session.id,
          source: isEarlyBirdFromMetadata(session.metadata ?? undefined) ? "metadata" : "line_items",
        });
        if (earlyBirdSold >= EARLY_BIRD_CAPACITY) {
          done = true;
          break;
        }
      }
    }

    if (done) break;

    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) break;
  }

  if (sessionsExamined >= maxSessions) {
    truncated = true;
    log?.("Early bird count scan stopped at maxSessions", { maxSessions, earlyBirdSold });
  }

  return {
    earlyBirdSold,
    truncated,
    sessionsExamined,
    sessionsCreatedGteUnix: createdGte ?? null,
  };
}
