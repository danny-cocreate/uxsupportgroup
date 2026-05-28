import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { MembershipAccordionItem, MembershipAccordionTrigger } from "@/components/MembershipAccordion";
import { HandDrawnHighlight, HandDrawnHighlightSVG } from "@/components/sketchy/HandDrawnHighlight";
import { SketchyRectButton } from "@/components/sketchy/SketchyCTA";
import { RoughWavyUnderline } from "@/components/sketchy/RoughWavyUnderline";
import { SketchyBadge } from "@/components/sketchy/SketchyBadge";
import { SketchySectionTitle } from "@/components/sketchy/SketchySectionTitle";
import { Summit2026PointerGlow } from "@/components/sketchy/Summit2026PointerGlow";
import { SketchyTallCard } from "@/components/sketchy/SketchyTallCard";
import { SketchyTape } from "@/components/sketchy/SketchyTape";
import { SketchyTestimonialNote } from "@/components/sketchy/SketchyTestimonialNote";
import { Summit2026FacilitatorCard } from "@/components/sketchy/Summit2026FacilitatorCard";
import {
  Summit2026FacilitatorModal,
  type SummitFacilitatorModalSpeaker,
} from "@/components/sketchy/Summit2026FacilitatorModal";
import {
  formatSummitFacilitatorRoleLine,
  SUMMIT_2026_FACILITATORS,
  buildSummitFacilitatorModalSpeaker,
} from "@/data/summit2026Facilitators";
import {
  AGENDA_DAY1,
  AGENDA_DAY2,
  agendaRowKey,
  hasAgendaDetails,
} from "@/data/summit2026Agenda";
import EstherJ from "@/assets/EstherJ.jpg";
import FarooqK from "@/assets/FarooqK-3.jpg";
import JolieC from "@/assets/JolieC.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, HandHeart, MessagesSquare, PencilLine, Star, Users, XCircle } from "lucide-react";

const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";
const LATE_PRICE_ID = "price_1TSLGrEt4aAP5ylP9oTB0tFg";
const EARLY_BIRD_SEATS = 20;
const REGULAR_SEATS = 50;
const KNOWN_EARLY_BIRD_SOLD = 20;
const KNOWN_REGULAR_SOLD = 7;
const DEFAULT_REGULAR_REMAINING = REGULAR_SEATS - KNOWN_REGULAR_SOLD;

type TicketTier = "early_bird" | "regular" | "late";
type CheckoutSlot = "early" | "regular" | "late";

type NormalizedTicketAvailability = {
  activeTier: TicketTier;
  earlyBirdRemaining: number;
  regularRemaining: number;
};

const SUMMIT_HERO_IMAGE = "/summit-2026-hero-no-text.webp";

/** Sticky header height on `/summit` (no announcement bar) — `SketchyHeader` uses `h-16`. */
const SUMMIT_STICKY_HEADER_OFFSET_PX = 24;

/** Wait after scroll-into-view before the first highlight sweep (Summit 2026 hero subcopy). */
const SUMMIT_TAGLINE_HIGHLIGHT_INITIAL_DELAY_MS = 1000;

/** Delay between each tagline highlight sweep start (Summit 2026 hero subcopy). */
const SUMMIT_TAGLINE_HIGHLIGHT_STAGGER_MS = 650;

function scrollPricingBelowStickyHeader() {
  const el = document.getElementById("pricing");
  if (!el) return;
  const y =
    el.getBoundingClientRect().top + window.scrollY - SUMMIT_STICKY_HEADER_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

function describeInvokeError(err: unknown): string {
  if (!err || typeof err !== "object") return "Something went wrong.";
  const e = err as { name?: string; message?: string };
  const msg = e.message ?? "";
  if (e.name === "FunctionsFetchError" || msg.includes("Failed to send a request to the Edge Function")) {
    return "Checkout could not reach the server. If this keeps happening, email info@uxsupportgroup.com.";
  }
  return msg.trim() || "Something went wrong.";
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeTicketAvailability(data: unknown): NormalizedTicketAvailability {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const serverTier = record.activeTier;

  const earlyBirdRemainingFromServer = finiteNumber(record.earlyBirdRemaining);
  const earlyBirdSoldFromServer =
    finiteNumber(record.earlyBirdSold) ??
    (earlyBirdRemainingFromServer === undefined
      ? undefined
      : EARLY_BIRD_SEATS - earlyBirdRemainingFromServer);
  const earlyBirdSold = Math.max(KNOWN_EARLY_BIRD_SOLD, earlyBirdSoldFromServer ?? 0);
  const earlyBirdRemaining = Math.max(0, EARLY_BIRD_SEATS - earlyBirdSold);

  const regularRemainingFromServer = finiteNumber(record.regularRemaining);
  const regularSoldFromServer =
    finiteNumber(record.regularSold) ??
    (regularRemainingFromServer === undefined
      ? undefined
      : REGULAR_SEATS - regularRemainingFromServer);
  const regularTierSoldFloor = serverTier === "late" ? REGULAR_SEATS : KNOWN_REGULAR_SOLD;
  const regularSold = Math.max(regularTierSoldFloor, regularSoldFromServer ?? 0);
  const regularRemaining = Math.max(0, REGULAR_SEATS - regularSold);

  const activeTier =
    earlyBirdSold < EARLY_BIRD_SEATS
      ? "early_bird"
      : regularSold < REGULAR_SEATS
        ? "regular"
        : "late";

  return {
    activeTier,
    earlyBirdRemaining,
    regularRemaining,
  };
}

const SUMMIT_TESTIMONIALS = [
  {
    quote:
      "I think today I learned more about humans than AI…I can't wait to keep our connection going 🙏",
    name: "Farooq Khayyat",
    role: "Product Designer | Gaming & Creative Tools",
    avatarSrc: FarooqK,
  },
  {
    quote:
      "A truly great day of learning, getting to know incredible people, and giving deep into AI.",
    name: "Esther Greenfield-Jakar",
    role: "Product Design Lead | AI Generalist",
    avatarSrc: EstherJ,
  },
  {
    quote:
      "…the amazing presentations and demonstrations reframed [the] fear into a roadmap where uncertainty becomes an opportunity for growth….As a researcher, this was validating.",
    name: "Jolie Chen",
    role: "UX Researcher | Data Analyst",
    avatarSrc: JolieC,
  },
] as const;

const TESTIMONIAL_WALL_WRAPPERS = [
  "relative z-10 w-full max-w-[min(100%,22rem)] lg:max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem] shrink-0 rotate-2 -translate-x-1 sm:translate-x-0 lg:rotate-[-2deg] lg:translate-x-0 lg:translate-y-0 lg:-ml-4 -mt-6",
  "relative z-20 w-full max-w-[min(100%,22rem)] lg:max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem] shrink-0 -rotate-3 translate-x-2 sm:translate-x-3 lg:translate-x-0 lg:rotate-[2.5deg] lg:translate-y-1 lg:-ml-4 -mt-6",
  "relative z-30 w-full max-w-[min(100%,22rem)] lg:max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem] shrink-0 rotate-1 -translate-x-2 sm:-translate-x-1 lg:translate-x-0 lg:-rotate-1 lg:-translate-y-0.5 lg:-ml-4 -mt-6",
] as const;

/** Scroll-driven settle-in modifiers (see `index.css` — keyframe holds stagger a shared view timeline). */
const TESTIMONIAL_SETTLE_IN = [
  "summit-testimonial-settle-in summit-testimonial-settle-in--0",
  "summit-testimonial-settle-in summit-testimonial-settle-in--1",
  "summit-testimonial-settle-in summit-testimonial-settle-in--2",
] as const;

const CARD_FILL = "hsl(var(--card))";

const FEATURE_ROWS: { icon: typeof PencilLine; text: string }[] = [
  { icon: PencilLine, text: "Hands-on labs where you build real AI x UX artifacts." },
  { icon: Users, text: "Opportunities to make great connections with peers and experts." },
  { icon: MessagesSquare, text: "Facilitated sessions led by experienced practitioners." },
  { icon: Star, text: "A curated group of designers, product builders, and leaders." },
  { icon: HandHeart, text: "Space to reflect on ethics, craft, and long-term impact." },
];

const FOR_YOU = [
  "You're a UX/Product designer looking to evolve your craft.",
  "You learn best by doing, not just watching presentations.",
  "You're actively figuring out your role in an AI-driven future.",
  "You value meaningful connections over mass networking.",
];

const NOT_FOR_YOU = [
  'You\'re looking for a "What is AI?" 101 basic introduction.',
  'You prefer a passive, "watch and listen" webinar format.',
  "You're only here for high-profile celebrity keynotes.",
  "You want purely theoretical academic discussions.",
];

const SUMMIT_TEAM: { name: string; role: string }[] = [
  { name: "Danny S", role: "Agenda, Sponsorship, Partnership, Email Marketing, Speaker Recruitment, Web Site(s), Ticketing" },
  { name: "Suyen S", role: "Main Producer, Technical Implementation" },
  { name: "Hayley D", role: "Audience Engagement, Sponsorship & Partnership" },
  { name: "Sylvia B", role: "Marketing Assets" },
  { name: "Yatong W", role: "Web Site(s), Sponsorship & Partnership" },
  { name: "Esther J G", role: "Sponsorship & Partnership" },
  { name: "Renata R", role: "Agenda, Session Flow" },
  { name: "MT R", role: "Sponsorship & Partnership" },
  { name: "Jerry", role: "Tech Support, Video Production" },
  { name: "Tim Bot (OpenClaw)", role: "Execution & Tech Support" },
];

const TEAM_CARD_ROTATIONS = [
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-2",
  "-rotate-[1.5deg]",
  "rotate-[1.5deg]",
  "-rotate-[0.5deg]",
  "rotate-[0.5deg]",
] as const;

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Will the sessions be recorded?",
    a: "Yes! Every attendee will get full access to the high-quality recordings.",
  },
  {
    q: "What time zone are the sessions in?",
    a: "All sessions run in Eastern Daylight Time (EDT, UTC−4). Day 1 and Day 2 both start at 9:00 AM EDT. Each day includes one scheduled break plus a few hours of programming; Day 1 ends around 1:30 PM and Day 2 around 1:45 PM (times are approximate until the final run-of-show is locked).",
  },
  {
    q: "Which platform will be used?",
    a: "The summit will be hosted on Zoom. Attendees will receive their unique Zoom link and a quick-start guide via email before the event.",
  },
  {
    q: "Do I need prior AI experience?",
    a: "You should have a working familiarity with AI tools, but you don't need to be an expert. This summit is designed for UX and product designers who are actively exploring how AI fits into their practice — not a beginner-level introduction.",
  },
  {
    q: "Who are the speakers?",
    a: "Our sessions are led by 6-8 practitioners who are actively shipping AI-powered products — not professional keynote speakers. Check the agenda section above for confirmed facilitators and session topics.",
  },
  {
    q: "Will there be networking opportunities?",
    a: "Absolutely. Day 2 includes a hands-on session to design your AI networking agent—teams refine their agents and collaborate with others—so you leave with something practical and new connections with fellow designers and product builders.",
  },
  {
    q: "What is the refund policy?",
    a: "We offer a 100% refund if you cancel up to 14 days before the event. After that, your ticket can be transferred to someone else. Contact us at info@uxsupportgroup.com for any changes.",
  },
  {
    q: "Is this event virtual or in-person?",
    a: "The summit is fully virtual — attend from anywhere in the world. The two half-day format is designed to minimize screen fatigue while maximizing engagement and interaction.",
  },
  {
    q: "Can I bring my team?",
    a: "Yes! If you're interested in group tickets, reach out to us at info@uxsupportgroup.com and we'll work out the details.",
  },
];

const Summit2026V1 = () => {
  const [activeTicketTier, setActiveTicketTier] = useState<TicketTier>("regular");
  const [earlyBirdRemaining, setEarlyBirdRemaining] = useState(0);
  const [regularRemaining, setRegularRemaining] = useState(DEFAULT_REGULAR_REMAINING);
  const [checkoutLoading, setCheckoutLoading] = useState<CheckoutSlot | null>(null);
  const [taglineHighlightStep, setTaglineHighlightStep] = useState(0);
  const [flippedRowByDay, setFlippedRowByDay] = useState<Record<string, string | null>>({});
  const [activeSpeaker, setActiveSpeaker] = useState<SummitFacilitatorModalSpeaker | null>(null);
  const taglineParagraphRef = useRef<HTMLParagraphElement>(null);
  const taglineHighlightHasPlayedRef = useRef(false);
  const taglineHighlightTimeoutsRef = useRef<number[]>([]);

  const fetchAvailability = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-ticket-availability");
      if (error || !data) {
        console.error("[TICKETS] Availability error", error, data);
        setActiveTicketTier("regular");
        setEarlyBirdRemaining(0);
        setRegularRemaining(DEFAULT_REGULAR_REMAINING);
        return;
      }
      if (import.meta.env.DEV && data && typeof data === "object") {
        console.info("[TICKETS] Availability", {
          activeTier: (data as { activeTier?: TicketTier }).activeTier,
          earlyBirdSold: (data as { earlyBirdSold?: number }).earlyBirdSold,
          earlyBirdRemaining: (data as { earlyBirdRemaining?: number }).earlyBirdRemaining,
          regularSold: (data as { regularSold?: number }).regularSold,
          regularRemaining: (data as { regularRemaining?: number }).regularRemaining,
          truncated: (data as { truncated?: boolean }).truncated,
          sessionsExamined: (data as { sessionsExamined?: number }).sessionsExamined,
        });
      }
      const availability = normalizeTicketAvailability(data);
      setActiveTicketTier(availability.activeTier);
      setEarlyBirdRemaining(availability.earlyBirdRemaining);
      setRegularRemaining(availability.regularRemaining);
    } catch (e) {
      console.error("[TICKETS] Availability fetch failed", e);
      setActiveTicketTier("regular");
      setEarlyBirdRemaining(0);
      setRegularRemaining(DEFAULT_REGULAR_REMAINING);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
    const id = window.setInterval(fetchAvailability, 30_000);
    return () => window.clearInterval(id);
  }, [fetchAvailability]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "success") {
      toast({
        title: "You're in!",
        description:
          "Thanks for your purchase. Check your email for your Stripe receipt and event details.",
      });
      window.history.replaceState({}, "", "/summit");
      fetchAvailability();
    } else if (checkout === "canceled") {
      toast({
        title: "Checkout canceled",
        description: "No payment was completed. You can try again whenever you're ready.",
      });
      window.history.replaceState({}, "", "/summit");
    }
  }, [fetchAvailability]);

  useEffect(() => {
    const el = taglineParagraphRef.current;
    if (!el) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearHighlightTimeouts = () => {
      for (const id of taglineHighlightTimeoutsRef.current) {
        window.clearTimeout(id);
      }
      taglineHighlightTimeoutsRef.current = [];
    };

    const runTaglineHighlightSequence = () => {
      if (taglineHighlightHasPlayedRef.current) return;
      taglineHighlightHasPlayedRef.current = true;

      if (reduceMq.matches) {
        setTaglineHighlightStep(4);
        return;
      }

      clearHighlightTimeouts();
      for (let i = 1; i <= 4; i += 1) {
        const delay =
          SUMMIT_TAGLINE_HIGHLIGHT_INITIAL_DELAY_MS + SUMMIT_TAGLINE_HIGHLIGHT_STAGGER_MS * (i - 1);
        taglineHighlightTimeoutsRef.current.push(
          window.setTimeout(() => setTaglineHighlightStep(i), delay)
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        runTaglineHighlightSequence();
        observer.disconnect();
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearHighlightTimeouts();
    };
  }, []);

  const startCheckout = async (priceId: string, slot: CheckoutSlot) => {
    setCheckoutLoading(slot);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) {
        console.error("[TICKETS] create-checkout invoke error", error);
        throw new Error(describeInvokeError(error));
      }
      const url =
        data && typeof data === "object" && "url" in data
          ? (data as { url?: string }).url
          : undefined;
      const errMsg =
        data && typeof data === "object" && "error" in data
          ? String((data as { error?: string }).error)
          : undefined;
      if (errMsg || !url) {
        throw new Error(errMsg || "Checkout is unavailable. Please try again.");
      }
      window.location.href = url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast({
        title: "Checkout failed",
        description: message,
        variant: "destructive",
      });
      setCheckoutLoading(null);
      fetchAvailability();
    }
  };

  const earlyBirdProgressPct = (earlyBirdRemaining / EARLY_BIRD_SEATS) * 100;
  const regularProgressPct = (regularRemaining / REGULAR_SEATS) * 100;
  const isEarlyBird = activeTicketTier === "early_bird";
  const isRegular = activeTicketTier === "regular";
  const isLate = activeTicketTier === "late";

  return (
    <main id="main" className="pb-20">
      <Summit2026PointerGlow />
      {/* Full-viewport-width hero — art: public/summit-2026-hero-no-text.webp */}
      <section
        className="relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2"
        aria-label="AIxUX Summit 2026"
      >
        <div className="relative w-full overflow-hidden bg-black border-y border-uxsg-ink/25 shadow-[0_4px_0_0_var(--uxsg-ink)] min-h-[min(50vw,300px)] sm:min-h-[min(40vw,320px)] md:min-h-[min(32vw,400px)] lg:min-h-[min(28vw,480px)]">
          <img
            src={SUMMIT_HERO_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            width={1920}
            height={640}
            fetchPriority="high"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 pointer-events-none"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-16 md:py-20 text-center">
            <div className="mb-6 inline-flex items-center gap-3 border border-white/20 bg-white/10 px-4 py-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm sm:text-xs">
              June 18-19, 2026 (EDT)
              <span className="h-1 w-1 shrink-0 rounded-full bg-[#facc15]" />
              Online / Global
            </div>
            <h1 className="font-heading font-black leading-[0.95] tracking-tight text-white">
              <span className="block text-[clamp(2.25rem,11vw,4.5rem)]">
                <span className="text-white">AI</span>
                <span className="relative mx-0.5 inline-block text-[#facc15] drop-shadow-[0_0_24px_rgba(250,204,21,0.8)] sm:mx-1">
                  X
                  <span
                    className="pointer-events-none absolute inset-0 -z-10 origin-center rounded-full bg-[#facc15]/55 blur-sm motion-safe:animate-summit-hero-x-glow-pulse motion-reduce:scale-[1.2] motion-reduce:opacity-50 motion-reduce:animate-none"
                    aria-hidden
                  />
                </span>
                <span className="text-white">UX SUMMIT </span>
                <span className="text-transparent [-webkit-text-stroke:2px_rgb(255_255_255)] sm:[-webkit-text-stroke-width:2.5px] md:[-webkit-text-stroke-width:3px]">
                  2026
                </span>
              </span>
            </h1>
            <p className="font-headline relative mt-4 inline-block text-2xl text-amber-100/95 sm:mt-5 sm:text-3xl md:text-4xl lg:text-4xl">
              Agentic Designer
              <span className="pointer-events-none absolute -bottom-1 left-0 right-0 block w-full text-amber-400/90">
                <RoughWavyUnderline
                  animated
                  className="h-3 w-full sm:h-3.5 md:h-4"
                  strokeW={6}
                  expandToBounds
                />
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-24 md:space-y-32">
      <section className="px-6 py-8 text-center lg:py-10">
        <div className="mx-auto max-w-3xl space-y-8">
            <p className="font-body text-xl leading-relaxed text-foreground/90 md:text-2xl">
              2 half days. Real builds. <br />
              For future-forward designers navigating the AI shift.
            </p>
            <p
              ref={taglineParagraphRef}
              className="font-body text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              Get{" "}
              <HandDrawnHighlight markVisible={taglineHighlightStep >= 1}>real practice</HandDrawnHighlight>{" "}
              facilitated by a{" "}
              <HandDrawnHighlight markVisible={taglineHighlightStep >= 2}>community</HandDrawnHighlight> of
              builders who care about both{" "}
              <HandDrawnHighlight markVisible={taglineHighlightStep >= 3}>AI</HandDrawnHighlight> and{" "}
              <HandDrawnHighlight markVisible={taglineHighlightStep >= 4}>
                human experience
              </HandDrawnHighlight>
              .
            </p>
            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="relative inline-flex shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95">
                <button
                  type="button"
                  onClick={scrollPricingBelowStickyHeader}
                  aria-describedby="hero-limited-seats-badge"
                  className="relative inline-flex origin-center items-center justify-center rounded-full border-[1.5px] border-uxsg-ink bg-[#e67e22] px-10 py-5 font-heading text-xl font-extrabold text-white shadow-[1px_1px_0_0_var(--uxsg-ink),-1px_2px_0_0_var(--uxsg-ink)] transition-colors motion-safe:hover:animate-summit-ticket-wiggle"
                >
                  Get My Ticket
                </button>
                <SketchyBadge
                  id="hero-limited-seats-badge"
                  variant="white"
                  rotation="subtle"
                  className="pointer-events-none absolute -right-2 -top-2.5 z-20 shadow-sm"
                >
                  Limited seats
                </SketchyBadge>
              </div>
              <div className="font-hand inline-flex max-w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-xl text-muted-foreground sm:flex-nowrap">
                <span className="shrink-0 text-3xl leading-none" aria-hidden>
                  ✨
                </span>
                <span>10+ tools covered. Attendees from 3 continents.</span>
                <Link
                  to="/summit-2025"
                  className="summit-see-last-year font-hand text-xl text-muted-foreground underline decoration-uxsg-ink/40 underline-offset-6 transition-colors"
                >
                  <HandDrawnHighlightSVG className="summit-button-highlight" />
                  <span className="relative z-[1]">See last year →</span>
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* Testimonials — sticky note wall */}
      <section className="max-w-7xl mx-auto px-6 pb-4 overflow-visible">
        <div className="flex flex-col items-center lg:flex-row lg:flex-nowrap lg:justify-center lg:items-start gap-8 lg:gap-5 xl:gap-7 2xl:gap-8 w-full min-w-0">
          {SUMMIT_TESTIMONIALS.map((item, i) => (
            <div key={`${item.name}-${item.role}`} className={TESTIMONIAL_WALL_WRAPPERS[i]}>
              <div className={`${TESTIMONIAL_SETTLE_IN[i]} w-full min-w-0`}>
                <SketchyTestimonialNote
                  quote={item.quote}
                  name={item.name}
                  role={item.role}
                  avatarSrc={item.avatarSrc}
                  className="p-6 sm:p-8 lg:p-10 xl:p-12 w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* This year's features */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
        <div className="md:col-span-1 lg:col-span-1 min-w-0">
          <h3 className="font-headline text-3xl lg:text-4xl text-uxsg-ink mb-4 md:mb-0 lg:ml-16">
            Laptops open, tools in hand.
            <br />
            <br />
            Leave with something you can actually use.
          </h3>
        </div>
        <div className="md:col-span-1 lg:col-span-2 flex flex-col items-start justify-self-start w-fit max-w-full min-w-0">
          <ul className="space-y-4 lg:space-y-6 font-body text-lg w-full min-w-0">
            {FEATURE_ROWS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4 items-start">
                <Icon className="w-7 h-7 shrink-0 text-uxsg-rsvp" strokeWidth={2} aria-hidden />
                <span className="text-foreground/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="max-w-7xl mx-auto px-6 scroll-mt-16">
        <SketchySectionTitle
          className="mb-4"
          badge={<SketchyBadge rotation="subtle">Tentative</SketchyBadge>}
        >
          The Agenda
        </SketchySectionTitle>
        <p className="font-body text-lg text-center text-foreground/90 mb-16 max-w-2xl mx-auto">
          Day 1 —{" "}
          <HandDrawnHighlight className="-rotate-[0.35deg]">The Shift</HandDrawnHighlight>
          <span aria-hidden> · </span>
          Day 2 — <HandDrawnHighlight className="rotate-[0.25deg]">The Practice</HandDrawnHighlight>
        </p>
        <p className="mt-0 mb-4 text-left font-hand text-xl text-muted-foreground">
          *All times are in UTC-4 (Eastern Daylight Time). All sessions are subject to change.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {(
            [
              { day: "Day 1 - June 18 (Thursday)", theme: "The Shift", rows: AGENDA_DAY1 },
              { day: "Day 2 -June 19 (Friday)", theme: "The Practice", rows: AGENDA_DAY2 },
            ] as const
          ).map(({ day, theme, rows }) => {
            const flippedKey = flippedRowByDay[day] ?? null;
            const flippedRow = flippedKey
              ? rows.find((r) => agendaRowKey(r) === flippedKey)
              : null;
            const isFlipped = Boolean(flippedRow);
            return (
              <div
                key={day}
                className={`summit-flip-card h-full ${isFlipped ? "is-flipped" : ""}`}
              >
                <div className="summit-flip-inner h-full">
                  <div
                    className="summit-flip-face summit-flip-front summit-notebook-sheet p-8 pl-14 relative h-full"
                    aria-hidden={isFlipped}
                  >
                    <div className="summit-notebook-margin-rail" aria-hidden />
                    <h3 className="font-headline text-3xl mb-2 text-uxsg-ink relative z-10">{day}</h3>
                    <p className="font-body text-uxsg-rsvp font-bold mb-8 italic relative z-10">
                      Theme: &ldquo;{theme}&rdquo;
                    </p>
                    <div className="relative z-10">
                      {rows.map((row) => {
                        const key = agendaRowKey(row);
                        const clickable = hasAgendaDetails(row);
                        const rowContent = (
                          <>
                            <span className="font-hand shrink-0 text-neutral-700">{row.time}</span>
                            <div className="text-left min-w-0 sm:max-w-[min(100%,22rem)]">
                              <span className="block font-bold">{row.title}</span>
                              {row.facilitator ? (
                                <span className="block font-body text-sm text-muted-foreground mt-0.5">
                                  {row.facilitator}
                                </span>
                              ) : null}
                            </div>
                          </>
                        );
                        return clickable ? (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              setFlippedRowByDay((prev) => ({ ...prev, [day]: key }))
                            }
                            className="summit-notebook-row summit-notebook-row--clickable w-full flex flex-col sm:flex-row gap-1 sm:gap-4 font-mono text-[0.95rem] text-neutral-600 text-left"
                          >
                            {rowContent}
                            <span
                              aria-hidden
                              className="summit-detail-pill font-hand sm:ml-auto self-start mt-1 sm:mt-0 shrink-0"
                            >
                              <HandDrawnHighlightSVG className="summit-button-highlight" />
                              <span className="relative z-[1]">detail →</span>
                            </span>
                            <span className="sr-only">View session details</span>
                          </button>
                        ) : (
                          <div
                            key={key}
                            className="summit-notebook-row flex flex-col sm:flex-row gap-1 sm:gap-4 font-mono text-[0.95rem] text-neutral-600"
                          >
                            {rowContent}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    className="summit-flip-face summit-flip-back summit-notebook-sheet p-8 pl-14 relative"
                    aria-hidden={!isFlipped}
                  >
                    <div className="summit-notebook-margin-rail" aria-hidden />
                    <button
                      type="button"
                      onClick={() =>
                        setFlippedRowByDay((prev) => ({ ...prev, [day]: null }))
                      }
                      className="summit-back-to-agenda font-hand text-base mb-8 relative z-10"
                    >
                      <HandDrawnHighlightSVG className="summit-button-highlight" />
                      <span className="relative z-[1]">← Back to agenda</span>
                    </button>
                    {flippedRow ? (
                      <div className="relative z-10">
                        <p className="font-hand text-lg text-neutral-700 mb-1">
                          {flippedRow.time}
                        </p>
                        <h3 className="font-headline text-2xl mb-2 text-uxsg-ink">
                          {flippedRow.title}
                        </h3>
                        {flippedRow.facilitator ? (
                          <p className="font-body text-sm text-muted-foreground mb-4 italic">
                            with {flippedRow.facilitator}
                          </p>
                        ) : null}
                        {flippedRow.details?.description ? (
                          <p className="font-body text-base text-foreground/90 mb-4 whitespace-pre-line">
                            {flippedRow.details.description}
                          </p>
                        ) : null}
                        {flippedRow.details?.outcomes && flippedRow.details.outcomes.length > 0 ? (
                          <>
                            <p className="font-body font-bold text-sm uppercase tracking-wide text-uxsg-ink mb-2">
                              You&rsquo;ll leave with
                            </p>
                            <ul className="font-body text-base text-foreground/90 list-disc pl-5 space-y-1">
                              {flippedRow.details.outcomes.map((o) => (
                                <li key={o}>{o}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facilitators */}
      <section id="facilitators" className="max-w-7xl mx-auto px-6 scroll-mt-16 overflow-visible">
        <SketchySectionTitle className="mb-6">Meet the Facilitators</SketchySectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-x-6 lg:gap-y-6 relative overflow-visible items-stretch">
          {SUMMIT_2026_FACILITATORS.map((facilitator) => (
            <Summit2026FacilitatorCard
              key={facilitator.name}
              name={facilitator.name}
              roleLine={formatSummitFacilitatorRoleLine(facilitator.title, facilitator.company)}
              imageSrc={facilitator.image}
              linkedinUrl={facilitator.linkedin}
              bio={facilitator.bioParagraphs.join(" ")}
              keynote={facilitator.keynote}
              onOpen={() =>
                setActiveSpeaker(buildSummitFacilitatorModalSpeaker(facilitator))
              }
            />
          ))}
        </div>
      </section>

      <Summit2026FacilitatorModal
        speaker={activeSpeaker}
        onClose={() => setActiveSpeaker(null)}
      />

      {/* Pricing — tickets (waitlist UI lives in `Summit2026WaitlistSection` if needed) */}
      <section
        id="pricing"
        className="relative w-full scroll-mt-16 overflow-hidden pt-8 pb-16 md:pt-10"
      >
        <div className="absolute inset-0 gradient-hero opacity-10" aria-hidden />
        <div className="relative z-10 max-w-4xl md:max-w-6xl mx-auto px-6">
          <SketchySectionTitle className="mb-6">Get Your Ticket</SketchySectionTitle>

          <div className="flex justify-center mb-10">
            <div className="inline-block p-4 bg-[#ffe24a] border-2 border-uxsg-ink -rotate-1 font-hand text-lg max-w-md text-center">
              {isEarlyBird
                ? `⚡ Early bird: only ${earlyBirdRemaining} of ${EARLY_BIRD_SEATS} left at $2.90 — then $29.`
                : isRegular
                  ? `⚡ Regular tickets: ${regularRemaining} of ${REGULAR_SEATS} left at $29 — then late tickets are $299.`
                  : "⚡ Regular tickets are sold out — late tickets are now $299."}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SketchyTallCard
              variant="light"
              fill="#ffe24a"
              strokeWidth={1.5}
              paddingClassName="p-8"
              tapes={[
                { position: "topLeft", size: "sm" },
                { position: "bottomRight", size: "sm" },
              ]}
              className="h-full"
              innerClassName="flex flex-col justify-between min-h-[300px] relative"
            >
              <div>
                <h3 className="font-headline text-2xl mb-4 text-uxsg-ink">Early Bird</h3>
                <div className="text-4xl font-black mb-2 text-uxsg-ink">$2.90</div>
                <p className="font-body text-sm mb-4 opacity-80">
                  Yeah, you read that right. Cheaper than your morning coffee.
                  <br />
                  <br />
                  Limited to the first {EARLY_BIRD_SEATS} tickets.
                </p>
                {isEarlyBird && (
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-xs font-body opacity-90">
                      <span>Early bird left</span>
                      <span className="font-bold">
                        {earlyBirdRemaining}/{EARLY_BIRD_SEATS}
                      </span>
                    </div>
                    <Progress value={earlyBirdProgressPct} className="h-2" />
                  </div>
                )}
              </div>
              <SketchyRectButton
                type="button"
                variant="dark-bg"
                fullWidth
                disabled={!isEarlyBird || checkoutLoading !== null}
                onClick={() => startCheckout(EARLY_BIRD_PRICE_ID, "early")}
              >
                {checkoutLoading === "early"
                  ? "Opening checkout…"
                  : isEarlyBird
                    ? "Get Early Bird"
                    : "Sold Out"}
              </SketchyRectButton>
            </SketchyTallCard>
            <SketchyTallCard
              variant="light"
              fill={CARD_FILL}
              strokeWidth={1.5}
              paddingClassName="p-8"
              tapes={[
                { position: "topLeft", size: "sm" },
                { position: "bottomRight", size: "sm" },
              ]}
              className="h-full"
              innerClassName="flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <h3 className="font-headline text-2xl mb-4 text-uxsg-ink">Regular</h3>
                <div className="text-4xl font-black mb-2 text-uxsg-ink">$29</div>
                <p className="font-body text-sm mb-4 opacity-80">
                  Standard access once early bird ({EARLY_BIRD_SEATS} tickets) is gone.
                  <br />
                  <br />
                  Limited to {REGULAR_SEATS} regular tickets before late pricing begins.
                </p>
                {(isRegular || isLate) && (
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-xs font-body opacity-90">
                      <span>Regular tickets left</span>
                      <span className="font-bold">
                        {regularRemaining}/{REGULAR_SEATS}
                      </span>
                    </div>
                    <Progress value={regularProgressPct} className="h-2" />
                  </div>
                )}
              </div>
              <SketchyRectButton
                type="button"
                variant="dark-bg"
                fullWidth
                disabled={!isRegular || checkoutLoading !== null}
                onClick={() => startCheckout(REGULAR_PRICE_ID, "regular")}
              >
                {checkoutLoading === "regular"
                  ? "Opening checkout…"
                  : isEarlyBird
                    ? "Available after early bird"
                    : isLate
                      ? "Sold Out"
                      : "Get Regular Ticket"}
              </SketchyRectButton>
            </SketchyTallCard>
            <SketchyTallCard
              variant="light"
              fill="#f97316"
              strokeWidth={1.5}
              paddingClassName="p-8"
              tapes={[
                { position: "topLeft", size: "sm" },
                { position: "bottomRight", size: "sm" },
              ]}
              className="h-full"
              innerClassName="flex flex-col justify-between min-h-[300px]"
            >
              <div>
                <h3 className="font-headline text-2xl mb-4 text-white">Late Ticket</h3>
                <div className="text-4xl font-black mb-2 text-white">$299</div>
                <p className="font-body text-sm mb-8 text-white/90">
                  Final ticket tier after the limited regular tickets sell out.
                  <br />
                  <br />
                  Secure your spot while summit access is still available.
                </p>
              </div>
              <SketchyRectButton
                type="button"
                variant="dark-bg"
                fullWidth
                disabled={!isLate || checkoutLoading !== null}
                onClick={() => startCheckout(LATE_PRICE_ID, "late")}
              >
                {checkoutLoading === "late"
                  ? "Opening checkout…"
                  : isLate
                    ? "Get Late Ticket"
                    : "Available after regular"}
              </SketchyRectButton>
            </SketchyTallCard>
          </div>
        </div>
      </section>

      {/* Is this for you */}
      <div className="w-full px-4 min-[420px]:px-5 sm:px-6 md:px-8 lg:px-10">
        <section className="max-w-5xl mx-auto scroll-mt-24 rounded-3xl border border-uxsg-ink/10 bg-muted/50 px-7 py-10 sm:px-9 sm:py-11 md:px-11 md:py-12 lg:px-12 lg:py-14">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl mb-10 sm:mb-12 md:mb-16 text-uxsg-ink">
            Is This For You?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 sm:gap-14 md:gap-16 lg:gap-20">
            <div>
              <h3 className="font-headline text-2xl md:text-3xl mb-8 flex items-center gap-3 text-uxsg-ink">
                <CheckCircle2 className="w-9 h-9 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
                This is for you if...
              </h3>
              <ul className="space-y-4 font-body text-md">
                {FOR_YOU.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-2xl md:text-3xl mb-8 flex items-center gap-3 text-uxsg-ink">
                <XCircle className="w-9 h-9 shrink-0 text-destructive" strokeWidth={1.75} aria-hidden />
                This is NOT for you if...
              </h3>
              <ul className="space-y-4 font-body text-md opacity-60">
                {NOT_FOR_YOU.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 pb-12">
        <SketchySectionTitle className="mb-16">Got Questions?</SketchySectionTitle>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <MembershipAccordionItem key={item.q} value={`faq-${i}`}>
              <MembershipAccordionTrigger>
                <span className="font-bold text-lg">{item.q}</span>
              </MembershipAccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </MembershipAccordionItem>
          ))}
        </Accordion>
      </section>

      {/* The team */}
      <section className="w-full px-6 pb-8">
        <SketchySectionTitle
          className="mb-10"
          titleClassName="text-2xl md:text-3xl font-black text-uxsg-ink text-center whitespace-nowrap font-headline"
          underlineStrokeW={2}
        >
          The team who made this happen
        </SketchySectionTitle>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6 pt-2">
          {SUMMIT_TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`relative w-[9.5rem] sm:w-[10.5rem] bg-white border border-uxsg-ink/80 shadow-[1px_1px_0_0_var(--uxsg-ink)] px-3 pt-4 pb-3 text-center ${TEAM_CARD_ROTATIONS[i % TEAM_CARD_ROTATIONS.length]}`}
            >
              <SketchyTape
                position={i % 2 === 0 ? "topLeft" : "topRight"}
                size="sm"
                className="!bg-[#ffe24a]/70"
              />
              <div className="font-body min-w-0">
                <p className="font-bold text-xs md:text-sm text-uxsg-ink leading-tight">
                  {member.name}
                </p>
                <p className="mt-1 text-xs opacity-70 leading-snug">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
};

export default Summit2026V1;
