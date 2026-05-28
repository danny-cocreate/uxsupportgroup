export const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
export const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";
export const LATE_PRICE_ID = "price_1TSLGrEt4aAP5ylP9oTB0tFg";
export const EARLY_BIRD_CAPACITY = 20;
export const REGULAR_CAPACITY = 50;
export const EARLY_BIRD_SOLD_FLOOR = 20;
/** Regular tickets sold before Stripe metadata tracking; added to live Stripe counts. */
export const REGULAR_SOLD_OFFSET = 7;
/** Legacy minimum; prefer REGULAR_SOLD_OFFSET. Used only when offset env is unset/0. */
export const REGULAR_SOLD_FLOOR = 0;

export type SummitTicketType = "early_bird" | "regular" | "late";
export type SummitTicketPhase = SummitTicketType;

export const SUMMIT_PRICE_IDS: Record<SummitTicketType, string> = {
  early_bird: EARLY_BIRD_PRICE_ID,
  regular: REGULAR_PRICE_ID,
  late: LATE_PRICE_ID,
};

type SessionLineItems = {
  data?: Array<{ price?: unknown }>;
  has_more?: boolean;
};

type SessionListItem = {
  id: string;
  payment_status: string;
  status?: string;
  metadata?: Record<string, string> | null;
  /** Present when listing with `expand: ["data.line_items"]`. */
  line_items?: SessionLineItems;
};

type StripeForSummitTickets = {
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

function ticketTypeFromMetadata(
  meta: Record<string, string> | null | undefined
): SummitTicketType | undefined {
  if (!meta) return undefined;
  if (meta.ticket_type === "early_bird" || meta.ticket_type === "regular" || meta.ticket_type === "late") {
    return meta.ticket_type;
  }
  return Object.entries(SUMMIT_PRICE_IDS).find(([, priceId]) => meta.price_id === priceId)?.[0] as
    | SummitTicketType
    | undefined;
}

/**
 * Uses expanded `line_items` from list when possible (one round-trip per page).
 * Returns null when expanded data is missing or truncated (`has_more`), so callers
 * can fall back to `listLineItems`.
 */
function ticketTypeFromExpandedLineItems(
  lineItems: SessionLineItems | undefined
): SummitTicketType | null | undefined {
  if (!lineItems?.data) return null;
  for (const item of lineItems.data) {
    const priceId = lineItemPriceId(item);
    const type = Object.entries(SUMMIT_PRICE_IDS).find(([, id]) => id === priceId)?.[0] as
      | SummitTicketType
      | undefined;
    if (type) return type;
  }
  if (lineItems.has_more) return null;
  return undefined;
}

async function sessionTicketTypeFromLineItems(
  stripe: StripeForSummitTickets,
  sessionId: string,
  log?: (step: string, details?: Record<string, unknown>) => void
): Promise<SummitTicketType | undefined> {
  try {
    const lines = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 24 });
    for (const item of lines.data) {
      const priceId = lineItemPriceId(item);
      const type = Object.entries(SUMMIT_PRICE_IDS).find(([, id]) => id === priceId)?.[0] as
        | SummitTicketType
        | undefined;
      if (type) return type;
    }
    return undefined;
  } catch (e) {
    log?.("listLineItems failed", {
      sessionId,
      error: e instanceof Error ? e.message : String(e),
    });
    return undefined;
  }
}

export type SummitTicketCountResult = {
  earlyBirdSold: number;
  earlyBirdSoldFromStripe: number;
  earlyBirdSoldFloor: number;
  regularSold: number;
  regularSoldFromStripe: number;
  regularSoldOffset: number;
  regularSoldFloor: number;
  lateSold: number;
  truncated: boolean;
  sessionsExamined: number;
};

export type SummitTicketAvailability = SummitTicketCountResult & {
  activeTier: SummitTicketPhase;
  isEarlyBird: boolean;
  earlyBirdRemaining: number;
  regularRemaining: number;
  regularCapacity: number;
};

function envInt(name: string, fallback: number, log?: (step: string, details?: Record<string, unknown>) => void): number {
  const raw = Deno.env.get(name);
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    log?.(`Invalid ${name} ignored`, { raw });
    return fallback;
  }
  return parsed;
}

export function activeSummitTicketPhase(earlyBirdSold: number, regularSold: number): SummitTicketPhase {
  if (earlyBirdSold < EARLY_BIRD_CAPACITY) return "early_bird";
  if (regularSold < REGULAR_CAPACITY) return "regular";
  return "late";
}

/**
 * Count paid Checkout sessions for summit tickets.
 * Prefer session metadata (set by create-checkout); otherwise use line items expanded on each list page
 * (avoids one Stripe round-trip per session). Falls back to listLineItems when expansion is incomplete.
 */
export async function countPaidSummitTicketSales(
  stripe: StripeForSummitTickets,
  log?: (step: string, details?: Record<string, unknown>) => void
): Promise<SummitTicketCountResult> {
  const createdGte = envInt("SUMMIT_CHECKOUT_CREATED_GTE_UNIX", NaN, log);
  const earlyBirdSoldFloor = Math.max(
    0,
    envInt("SUMMIT_EARLY_BIRD_SOLD_FLOOR", EARLY_BIRD_SOLD_FLOOR, log)
  );
  const regularSoldOffset = Math.max(
    0,
    envInt("SUMMIT_REGULAR_SOLD_OFFSET", REGULAR_SOLD_OFFSET, log)
  );
  const regularSoldFloor = Math.max(
    0,
    envInt("SUMMIT_REGULAR_SOLD_FLOOR", REGULAR_SOLD_FLOOR, log)
  );

  const maxSessions = Math.min(
    50_000,
    Math.max(100, envInt("SUMMIT_TICKET_MAX_SESSIONS_SCAN", 10000, log) || 10000)
  );

  let earlyBirdSoldFromStripe = 0;
  let regularSoldFromStripe = 0;
  let lateSold = 0;
  let sessionsExamined = 0;
  let startingAfter: string | undefined;
  let truncated = false;

  while (sessionsExamined < maxSessions) {
    const params: Record<string, unknown> = {
      limit: 100,
      status: "complete",
      expand: ["data.line_items"],
    };
    if (startingAfter) params.starting_after = startingAfter;
    if (!Number.isNaN(createdGte)) {
      params.created = { gte: createdGte };
    }

    const page = await stripe.checkout.sessions.list(params);
    if (page.data.length === 0) break;

    for (const session of page.data) {
      sessionsExamined++;
      if (session.payment_status !== "paid") continue;

      const fromMeta = ticketTypeFromMetadata(session.metadata ?? undefined);
      let type = fromMeta;
      let lineItemSource: "expanded" | "fetched" | undefined;

      if (!type) {
        const fromExpand = ticketTypeFromExpandedLineItems(session.line_items);
        if (fromExpand === null) {
          type = await sessionTicketTypeFromLineItems(stripe, session.id, log);
          lineItemSource = "fetched";
        } else {
          type = fromExpand;
          lineItemSource = "expanded";
        }
      }

      if (type === "early_bird") {
        earlyBirdSoldFromStripe++;
      } else if (type === "regular") {
        regularSoldFromStripe++;
      } else if (type === "late") {
        lateSold++;
      }

      if (type) {
        log?.("Summit ticket sale counted", {
          sessionId: session.id,
          ticketType: type,
          source: fromMeta ? "metadata" : lineItemSource === "fetched" ? "line_items" : "line_items_expanded",
        });
      }
    }

    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) break;
  }

  if (sessionsExamined >= maxSessions) {
    truncated = true;
    log?.("Summit ticket count scan stopped at maxSessions", {
      maxSessions,
      earlyBirdSoldFromStripe,
      regularSoldFromStripe,
    });
  }

  // Offset/floor is a baseline for pre-tracking sales; Stripe counts new purchases on top.
  // Legacy deployments may still set SUMMIT_REGULAR_SOLD_FLOOR with offset=0 — treat floor as baseline then.
  const regularSoldBaseline = regularSoldOffset > 0 ? regularSoldOffset : regularSoldFloor;
  const regularSold = regularSoldFromStripe + regularSoldBaseline;

  return {
    earlyBirdSold: Math.max(earlyBirdSoldFromStripe, earlyBirdSoldFloor),
    earlyBirdSoldFromStripe,
    earlyBirdSoldFloor,
    regularSold,
    regularSoldFromStripe,
    regularSoldOffset,
    regularSoldFloor,
    lateSold,
    truncated,
    sessionsExamined,
  };
}

export async function getSummitTicketAvailability(
  stripe: StripeForSummitTickets,
  log?: (step: string, details?: Record<string, unknown>) => void
): Promise<SummitTicketAvailability> {
  const counts = await countPaidSummitTicketSales(stripe, log);
  const activeTier = activeSummitTicketPhase(counts.earlyBirdSold, counts.regularSold);
  return {
    ...counts,
    activeTier,
    isEarlyBird: activeTier === "early_bird",
    earlyBirdRemaining: Math.max(0, EARLY_BIRD_CAPACITY - counts.earlyBirdSold),
    regularRemaining: Math.max(0, REGULAR_CAPACITY - counts.regularSold),
    regularCapacity: REGULAR_CAPACITY,
  };
}
