import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const AVAILABILITY_POLL_MS = 30000;

export const SummitAnnouncementBar = () => {
  const [regularRemaining, setRegularRemaining] = useState<number | null>(null);
  const [isRegularTier, setIsRegularTier] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAvailability = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "check-ticket-availability"
        );
        if (error || cancelled || !data) return;
        setIsRegularTier(data.activeTier === "regular");
        setRegularRemaining(
          typeof data.regularRemaining === "number" ? data.regularRemaining : null
        );
      } catch {
        // Keep the static fallback message on failure.
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, AVAILABILITY_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const showRegularCount =
    isRegularTier && regularRemaining !== null && regularRemaining > 0;

  return (
    <div
      role="region"
      aria-label="AIxUX Summit 2026 announcement"
      className="w-full border-b border-white/15 bg-uxsg-ink text-white"
    >
      <div className="container mx-auto px-4 py-1.5 sm:py-2">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-body text-[0.7rem] leading-snug sm:text-xs md:gap-x-3">
          <span className="text-white/95">
            AIxUX Summit 2026 <span aria-hidden>—</span> June 18–19{" "}
            <span aria-hidden>|</span>{" "}
            {showRegularCount ? (
              <>
                Only {regularRemaining} ticket{regularRemaining === 1 ? "" : "s"}{" "}
                left at $29
              </>
            ) : (
              <>
                Regular $29 <span aria-hidden>·</span> Spots are limited
              </>
            )}
          </span>
          <Link
            to="/summit"
            className={cn(
              "inline-flex shrink-0 items-center gap-1 font-medium text-uxsg-yellow underline-offset-4",
              "transition-colors hover:text-white hover:underline focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-uxsg-ink rounded-sm"
            )}
          >
            Get My Ticket <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </div>
  );
};
