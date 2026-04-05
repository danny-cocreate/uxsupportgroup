import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import summitHeroBg from "@/assets/summit-2026-hero.png";
import { MembershipAccordionItem, MembershipAccordionTrigger } from "@/components/MembershipAccordion";
import { HandDrawnHighlight } from "@/components/sketchy/HandDrawnHighlight";
import { HandDrawnRect } from "@/components/sketchy/HandDrawnRect";
import { SketchyHandDrawnInput } from "@/components/sketchy/SketchyHandDrawnInput";
import { SketchyRectButton } from "@/components/sketchy/SketchyCTA";
import { SketchyIconButton } from "@/components/sketchy/SketchyIconButton";
import { RoughWavyUnderline } from "@/components/sketchy/RoughWavyUnderline";
import { SketchyBadge } from "@/components/sketchy/SketchyBadge";
import { SketchySectionTitle } from "@/components/sketchy/SketchySectionTitle";
import { SketchyTallCard } from "@/components/sketchy/SketchyTallCard";
import { SketchyTestimonialNote } from "@/components/sketchy/SketchyTestimonialNote";
import EstherJ from "@/assets/EstherJ.jpg";
import FarooqK from "@/assets/FarooqK-3.jpg";
import JolieC from "@/assets/JolieC.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, HandHeart, Loader2, Mail, MessagesSquare, PencilLine, Star, Users, XCircle } from "lucide-react";

const EARLY_BIRD_PRICE_ID = "price_1TIEduEt4aAP5ylPU5RJtO6s";
const REGULAR_PRICE_ID = "price_1TIEdyEt4aAP5ylPN6ffwF5U";
const EARLY_BIRD_SEATS = 20;

/** Sticky header height on `/summit` (no announcement bar) — `SketchyHeader` uses `h-16`. */
const SUMMIT_STICKY_HEADER_OFFSET_PX = 64;

function scrollPricingBelowStickyHeader() {
  const el = document.getElementById("pricing");
  if (!el) return;
  const y =
    el.getBoundingClientRect().top + window.scrollY - SUMMIT_STICKY_HEADER_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
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
    name: "Esther Greenfield Jakar",
    role: "Product Designer | Product Manager",
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

const CARD_FILL = "hsl(var(--card))";

type AgendaRow = { time: string; title: string; facilitator?: string };

const AGENDA_DAY1: AgendaRow[] = [
  {
    time: "09:00 AM",
    title: "Welcome & Framing: What is Agentic UX?",
    facilitator: "Suyen Stevenson",
  },
  {
    time: "09:15 AM",
    title: "Keynote: The Agentic UX Era",
    facilitator: "Danny Setiawan",
  },
  {
    time: "10:00 AM",
    title: "Express Yourself with AI",
    facilitator: "Silvia Balu",
  },
  { time: "10:45 AM", title: "Break (15 min)" },
  {
    time: "11:00 AM",
    title: "Why Executives Don't Care About Your Design Work (And How to Fix It)",
    facilitator: "Alexis Brochu",
  },
  {
    time: "12:00 PM",
    title: "Community AMA — Day 1 Themes",
    facilitator: "Suyen Stevenson",
  },
  {
    time: "12:30 PM",
    title: "Closing Day 1 & Preview of Day 2",
    facilitator: "Danny Setiawan",
  },
];

const AGENDA_DAY2: AgendaRow[] = [
  {
    time: "09:00 AM",
    title: "Welcome Back & Day 2 Framing",
    facilitator: "Suyen Stevenson",
  },
  {
    time: "09:15 AM",
    title: "Live Design Challenge: Agentic UX in Action",
    facilitator: "3–5 Designers",
  },
  { time: "10:15 AM", title: "Break (15 min)" },
  {
    time: "10:30 AM",
    title: "Learning to Learn with AI Agents",
    facilitator: "Volkan Unsal",
  },
  {
    time: "11:30 AM",
    title: "AI Learning & Development Roadmap",
    facilitator: "Renata Rocha",
  },
  { time: "12:05 PM", title: "Break (15 min)" },
  {
    time: "12:20 PM",
    title: "AI-Powered Networking",
    facilitator: "Caitlyn Brady",
  },
  {
    time: "12:50 PM",
    title: "Break the AI — Chaos Challenge",
    facilitator: "Carissa Sinclair",
  },
  {
    time: "01:35 PM",
    title: "Closing, Next Steps & Community CTA",
    facilitator: "Suyen Stevenson + Danny Setiawan",
  },
];

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

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Will the sessions be recorded?",
    a: "Yes! Every attendee will get full access to the high-quality recordings.",
  },
  {
    q: "What time zone are the sessions in?",
    a: "All sessions run in Eastern Daylight Time (EDT, UTC−4). Day 1 and Day 2 both start at 9:00 AM EDT and will run for 3.5-5 hours, with multiple 15-minute breaks in between.",
  },
  {
    q: "Which platform will be used?",
    a: "The summit will be hosted on Zoom. Attendees will receive their unique Zoom link and a quick-start guide via email before the event.",
  },
];

const Summit2026V1 = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  const [earlyBirdRemaining, setEarlyBirdRemaining] = useState(EARLY_BIRD_SEATS);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<"early" | "regular" | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-ticket-availability");
      if (error || !data) {
        console.error("[TICKETS] Availability error", error, data);
        setIsEarlyBird(true);
        setEarlyBirdRemaining(EARLY_BIRD_SEATS);
        return;
      }
      if (import.meta.env.DEV && data && typeof data === "object") {
        console.info("[TICKETS] Availability", {
          earlyBirdSold: (data as { earlyBirdSold?: number }).earlyBirdSold,
          earlyBirdRemaining: (data as { earlyBirdRemaining?: number }).earlyBirdRemaining,
          truncated: (data as { truncated?: boolean }).truncated,
          sessionsExamined: (data as { sessionsExamined?: number }).sessionsExamined,
        });
      }
      setIsEarlyBird(Boolean(data.isEarlyBird));
      setEarlyBirdRemaining(
        typeof data.earlyBirdRemaining === "number"
          ? data.earlyBirdRemaining
          : EARLY_BIRD_SEATS
      );
    } catch (e) {
      console.error("[TICKETS] Availability fetch failed", e);
      setIsEarlyBird(true);
      setEarlyBirdRemaining(EARLY_BIRD_SEATS);
    } finally {
      setIsCheckingAvailability(false);
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

  const startCheckout = async (priceId: string, slot: "early" | "regular") => {
    setCheckoutLoading(slot);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) {
        console.error("[TICKETS] create-checkout invoke error", error);
        throw new Error(error.message || "Could not start checkout.");
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
      if (priceId === EARLY_BIRD_PRICE_ID) {
        fetchAvailability();
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || trimmedName.length > 100) {
      toast({
        title: "Name required",
        description: "Please enter your name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length > 255 || !emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("join-summit-waitlist", {
        body: {
          name: trimmedName,
          email: trimmedEmail,
        },
      });

      if (error || !data?.success) {
        console.error("[WAITLIST] Error response", error || data);
        let apiError = "";
        if (data && typeof data === "object" && "error" in data) {
          const raw = (data as { error: unknown }).error;
          if (raw != null && raw !== "") {
            apiError = typeof raw === "string" ? raw.trim() : String(raw);
          }
        }
        throw new Error(apiError || "Failed to join waitlist. Please try again.");
      }

      toast({
        title: "You're on the waitlist!",
        description:
          "Thank you. We'll email you as soon as AIxUX Summit 2026 dates and tickets are announced.",
      });

      setFormData({ name: "", email: "" });
    } catch (err: unknown) {
      console.error("[WAITLIST] Submission error", err);
      const fallback = "Something went wrong. Please try again or email us directly.";
      const message = err instanceof Error ? err.message.trim() || fallback : fallback;
      toast({
        title: "Submission failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const earlyBirdProgressPct = (earlyBirdRemaining / EARLY_BIRD_SEATS) * 100;

  return (
    <main id="main" className="space-y-24 md:space-y-32 pb-20">
      {/* Hero — cyber summit graphic + sketchy body */}
      <section className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 md:pt-10 py-6 lg:py-8">
        <div className="flex flex-col items-center gap-10 lg:gap-12">
          <div className="w-full max-w-5xl mx-auto">
            <div className="relative w-full overflow-hidden rounded-2xl border-2 border-uxsg-ink/30 bg-black shadow-[4px_4px_0_0_var(--uxsg-ink)] min-h-[min(52vh,420px)] md:min-h-[min(48vh,480px)]">
              <img
                src={summitHeroBg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center opacity-95"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20 pointer-events-none"
                aria-hidden
              />
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8 py-14 md:py-20 lg:py-24 min-h-[min(52vh,420px)] md:min-h-[min(48vh,480px)]">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 font-body text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/90">
                  June 18-19, 2026 (EDT)
                  <span className="w-1 h-1 bg-amber-400 rounded-full shrink-0" />
                  Online / Global
                </div>
                <h1 className="font-black font-heading text-white leading-[0.95] tracking-tight">
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                    AI
                    <span className="relative inline-block mx-0.5 sm:mx-1 text-amber-400 drop-shadow-[0_0_28px_rgba(251,191,36,0.95)]">
                      X
                      <span
                        className="absolute inset-0 -z-10 blur-md bg-amber-400/60 rounded-full scale-150"
                        aria-hidden
                      />
                    </span>
                    UX SUMMIT{" "}
                    <span className="text-transparent [-webkit-text-stroke:2px_rgb(255_255_255)] sm:[-webkit-text-stroke-width:2.5px] md:[-webkit-text-stroke-width:3px]">
                      2026
                    </span>
                  </span>
                </h1>
                <p className="mt-6 font-headline text-2xl sm:text-3xl md:text-4xl text-amber-100/95 relative inline-block">
                  Becoming AI Designer
                  <span className="absolute -bottom-1 left-0 right-0 block w-full text-amber-400/90 pointer-events-none">
                    <RoughWavyUnderline className="w-full h-2.5 sm:h-3 md:h-3.5" strokeW={6} expandToBounds />
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-center w-full max-w-3xl mx-auto">
            <p className="font-body text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              2 half days. Real builds. <br />
              For future-forward designers navigating the AI shift.
            </p>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get <HandDrawnHighlight>real practice</HandDrawnHighlight> facilitated by a{" "}
              <HandDrawnHighlight>community</HandDrawnHighlight> of builders who care about both{" "}
              <HandDrawnHighlight>AI</HandDrawnHighlight> and{" "}
              <HandDrawnHighlight>human experience</HandDrawnHighlight>.
            </p>
            <div className="flex flex-col items-center gap-4 pt-2">
              <div className="relative inline-flex shrink-0">
                <button
                  type="button"
                  onClick={scrollPricingBelowStickyHeader}
                  aria-describedby="hero-limited-seats-badge"
                  className="inline-flex items-center justify-center relative bg-[#e67e22] text-white px-10 py-5 rounded-full text-xl font-extrabold font-heading border-[1.5px] border-uxsg-ink shadow-[1px_1px_0_0_var(--uxsg-ink),-1px_2px_0_0_var(--uxsg-ink)] hover:scale-105 active:scale-95 transition-all"
                >
                  Save My Spot
                </button>
                <SketchyBadge
                  id="hero-limited-seats-badge"
                  variant="white"
                  rotation="subtle"
                  className="pointer-events-none absolute -top-2.5 -right-2 z-20 shadow-sm"
                >
                  Limited seats
                </SketchyBadge>
              </div>
              <div className="font-hand text-xl text-muted-foreground inline-flex max-w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center sm:flex-nowrap">
                <span className="text-3xl shrink-0 leading-none" aria-hidden>
                  ✨
                </span>
                <span>10+ tools covered. Attendees from 3 continents.</span>
                <Link
                  to="/summit-2025"
                  className="font-hand text-xl text-muted-foreground underline underline-offset-6 decoration-uxsg-ink/40 hover:text-foreground hover:decoration-uxsg-ink transition-colors"
                >
                  See last year →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — sticky note wall */}
      <section className="max-w-7xl mx-auto px-6 pb-4 overflow-visible">
        <div className="flex flex-col items-center lg:flex-row lg:flex-nowrap lg:justify-center lg:items-start gap-8 lg:gap-5 xl:gap-7 2xl:gap-8 w-full min-w-0">
          {SUMMIT_TESTIMONIALS.map((item, i) => (
            <div key={`${item.name}-${item.role}`} className={TESTIMONIAL_WALL_WRAPPERS[i]}>
              <SketchyTestimonialNote
                quote={item.quote}
                name={item.name}
                role={item.role}
                avatarSrc={item.avatarSrc}
                className="p-6 sm:p-8 lg:p-10 xl:p-12 w-full"
              />
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
          Theme:{" "}
          <HandDrawnHighlight className="-rotate-[0.35deg]">Agentic UX</HandDrawnHighlight>
        </p>
        <p className="mt-0 mb-4 text-left font-hand text-xl text-muted-foreground">
          *All times are in UTC-4 (Eastern Daylight Time).
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {(
            [
              { day: "Day 1 - June 18 (Thursday)", theme: "The Agentic Shift", rows: AGENDA_DAY1 },
              { day: "Day 2 -June 19 (Friday)", theme: "Build & Ship", rows: AGENDA_DAY2 },
            ] as const
          ).map(({ day, theme, rows }) => (
            <div key={day} className="summit-notebook-sheet p-8 pl-14 relative">
              <div className="summit-notebook-margin-rail" aria-hidden />
              <h3 className="font-headline text-3xl mb-2 text-uxsg-ink relative z-10">{day}</h3>
              <p className="font-body text-uxsg-rsvp font-bold mb-8 italic relative z-10">
                Theme: &ldquo;{theme}&rdquo;
              </p>
              <div className="space-y-4 relative z-10">
                {rows.map((row) => (
                  <div
                    key={`${row.time}-${row.title}`}
                    className="summit-notebook-row flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 font-mono text-[0.95rem] text-neutral-600"
                  >
                    <span className="font-hand shrink-0 text-neutral-700">{row.time}</span>
                    <div className="text-right min-w-0 sm:max-w-[min(100%,22rem)]">
                      <span className="block font-bold">{row.title}</span>
                      {row.facilitator ? (
                        <span className="block font-body text-sm text-muted-foreground mt-0.5">
                          {row.facilitator}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilitators */}
      <section id="facilitators" className="max-w-7xl mx-auto px-6">
        <SketchySectionTitle className="mb-6">Meet the Facilitators</SketchySectionTitle>
        <p className="font-body text-lg text-center text-foreground/90 mt-8 mb-16 max-w-2xl mx-auto">
          Coming soon...hold tight!
        </p>
      </section>

      {/* Pricing — waitlist + tickets */}
      <section
        id="pricing"
        className="relative w-full scroll-mt-16 overflow-hidden pt-8 pb-16 md:pt-10"
      >
        <div className="absolute inset-0 gradient-hero opacity-10" aria-hidden />
        <div className="relative z-10 max-w-2xl md:max-w-4xl mx-auto px-6">
          <SketchySectionTitle className="mb-6">Get Your Ticket</SketchySectionTitle>

          <div className="w-full mb-10 md:mb-12">
            <section className="w-full rounded-3xl border border-uxsg-ink/10 bg-muted/50 px-6 py-6 sm:px-7 sm:py-7 md:px-8 md:py-8 lg:px-9 lg:py-9">
              <p className="text-sm font-body text-uxsg-ink mb-2">
                Join the waitlist to be in the loop for speaker announcements, agenda updates, and reminders.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex-1 min-w-0 sm:max-w-xl">
                  <label htmlFor="waitlist-name" className="sr-only">
                    Your name
                  </label>
                  <SketchyHandDrawnInput
                    id="waitlist-name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="waitlist-email" className="sr-only">
                    Your email
                  </label>
                  <SketchyHandDrawnInput
                    id="waitlist-email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
                <SketchyIconButton
                  type="submit"
                  aria-label={isSubmitting ? "Joining waitlist" : "Join waitlist"}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Mail className="h-4 w-4" aria-hidden />
                  )}
                </SketchyIconButton>
              </form>
            </section>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-block p-4 bg-[#ffe24a] border-2 border-uxsg-ink -rotate-1 font-hand text-lg max-w-md text-center">
              {isCheckingAvailability
                ? "⚡ Checking early bird availability…"
                : isEarlyBird
                  ? `⚡ Early bird: only ${earlyBirdRemaining} of ${EARLY_BIRD_SEATS} left at $2.90 — then $29.`
                  : "⚡ Early bird is sold out — regular tickets are $29."}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                disabled={!isEarlyBird || isCheckingAvailability || checkoutLoading !== null}
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
                <p className="font-body text-sm mb-8 opacity-80">
                  Standard access once early bird ({EARLY_BIRD_SEATS} tickets) is gone.
                  <br />
                  <br />
                  Ticket sales help us cover subscription costs and keep the event accessible.
                </p>
              </div>
              <SketchyRectButton
                type="button"
                variant="dark-bg"
                fullWidth
                disabled={
                  isCheckingAvailability ||
                  checkoutLoading !== null ||
                  (isEarlyBird && earlyBirdRemaining > 0)
                }
                onClick={() => startCheckout(REGULAR_PRICE_ID, "regular")}
              >
                {checkoutLoading === "regular"
                  ? "Opening checkout…"
                  : isEarlyBird && earlyBirdRemaining > 0
                    ? "Available after early bird"
                    : "Get Regular Ticket"}
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
              className="h-full md:col-span-2"
              innerClassName="flex flex-col justify-between min-h-[300px] md:flex-row md:items-center md:gap-8"
            >
              <div className="md:flex-1">
                <h3 className="font-headline text-2xl mb-4 text-uxsg-ink">UXSG Members</h3>
                <div className="text-4xl font-black mb-2 text-uxsg-ink">Free</div>
                <p className="font-body text-sm mb-0 md:mb-0 opacity-80">
                  Included in your Skool membership.
                </p>
              </div>
              <a
                href="https://www.skool.com/ux-support-group-5388/about"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-full md:w-auto md:min-w-[200px] py-3 px-4 text-base font-body mt-4 md:mt-0"
              >
                <HandDrawnRect fill="#090907" stroke="#090907" strokeWidth={2} />
                <span className="relative z-10 text-white">Redeem via Skool</span>
              </a>
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
    </main>
  );
};

export default Summit2026V1;
