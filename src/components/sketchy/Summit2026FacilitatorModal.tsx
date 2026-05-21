import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HandDrawnPill } from "./HandDrawnPill";
import { SketchyBadge } from "./SketchyBadge";

export type SummitFacilitatorSession = {
  day: string;
  time: string;
  title: string;
};

export type SummitFacilitatorModalSpeaker = {
  name: string;
  /** Tagline shown under the name (uppercase, orange). */
  tagline: string;
  /** Bio paragraphs. */
  bio: string[];
  /** Photo URL. */
  photo?: string;
  /** Optional LinkedIn profile URL. */
  linkedinUrl?: string;
  /** Sessions this facilitator is leading. */
  sessions: SummitFacilitatorSession[];
  /** Pills under "Fav AI tools:" */
  favAITools: string[];
  /** Pills under "Try Next:" */
  tryNextTools: string[];
  /** If true, render a "Keynote Speaker" callout near the name. */
  keynote?: boolean;
};

type Summit2026FacilitatorModalProps = {
  speaker: SummitFacilitatorModalSpeaker | null;
  onClose: () => void;
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function ToolPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2 py-0.5">
      <HandDrawnPill fill="#faf9f6" stroke="#090907" />
      <span className="relative z-10 font-mono text-[11px] font-normal text-uxsg-ink whitespace-nowrap">
        {children}
      </span>
    </span>
  );
}

/** Thin, hand-drawn modal frame. Uses non-scaling-stroke so the line stays ~1.25px regardless of size. */
function ThinHandDrawnFrame() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 200"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M3,4 C20,2 50,5 70,3 C85,4 95,3 97,5
           C99,20 97,50 98,80 C97,110 99,140 98,170 C97,185 99,195 97,197
           C80,199 50,196 30,198 C15,197 5,199 3,197
           C1,180 3,150 2,120 C3,90 1,60 2,30 C3,15 1,8 3,4 Z"
        fill="#ffffff"
        stroke="#090907"
        strokeWidth={1.25}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Visual push-pin (same DOM shape as the facilitator card pushpin so CSS classes apply). */
function PushPin() {
  return (
    <>
      <div className="summit-pushpin-head" />
      <div className="summit-pushpin-base" />
      <div className="summit-pushpin-shaft" />
      <span className="summit-pushpin-point" />
    </>
  );
}

/** Distance (in CSS pixels) the user must drag the pin before the modal "falls off the wall". */
const PIN_DROP_THRESHOLD_PX = 28;
/** Duration of the drop-out animation. */
const DROP_ANIMATION_MS = 650;

export function Summit2026FacilitatorModal({
  speaker,
  onClose,
}: Summit2026FacilitatorModalProps) {
  const titleId = useId();
  const open = speaker !== null;

  const contentRef = useRef<HTMLDivElement>(null);
  const pinDragStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const [pinOffset, setPinOffset] = useState<{ x: number; y: number } | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Reset transient drag/drop state whenever the modal opens or closes.
  useEffect(() => {
    if (!open) {
      setPinOffset(null);
      setIsDropping(false);
      setHasInteracted(false);
      pinDragStartRef.current = null;
    }
  }, [open]);

  const startDrop = () => {
    if (isDropping) return;
    setIsDropping(true);
    window.setTimeout(() => {
      onClose();
    }, DROP_ANIMATION_MS);
  };

  const handlePinPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (isDropping) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pinDragStartRef.current = { x: e.clientX, y: e.clientY, pointerId: e.pointerId };
    setPinOffset({ x: 0, y: 0 });
    setHasInteracted(true);
  };

  const handlePinPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const start = pinDragStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    setPinOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const finishPinDrag = (e: React.PointerEvent<HTMLElement>) => {
    const start = pinDragStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    pinDragStartRef.current = null;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* no-op: pointer may already be released */
    }
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance >= PIN_DROP_THRESHOLD_PX) {
      startDrop();
    } else {
      setPinOffset(null);
    }
  };

  // Inline transform that overrides `.summit-pushpin--tilt` (which is just rotate(9deg)).
  // While dragging, compose the same 9° tilt with the user's drag offset.
  const pinDragTransform = pinOffset
    ? `rotate(9deg) translate(${pinOffset.x}px, ${pinOffset.y}px)`
    : undefined;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[60] bg-black/65 backdrop-blur-[2px]",
            // Only fade-in on open. We manage exit ourselves (drop animation + immediate unmount)
            // so Radix's data-[state=closed] animation doesn't flash the overlay back in.
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            isDropping && "opacity-0 transition-opacity duration-500",
          )}
        />
        <DialogPrimitive.Content
          ref={contentRef}
          aria-labelledby={titleId}
          className={cn(
            "fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)]",
            "max-w-[640px] lg:max-w-[860px] xl:max-w-[980px]",
            "max-h-[calc(100vh-2rem)] overflow-y-auto",
            // Only fade-in on open. The drop interaction owns the exit; no Radix close animation
            // (otherwise it briefly resets transform/opacity and we see a flash before unmount).
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "focus:outline-none",
          )}
          style={(() => {
            // Drag-tilt: rotate paper toward the drag direction. Clamped so it stays believable.
            const tiltDeg = pinOffset
              ? Math.max(-7, Math.min(7, pinOffset.x * 0.08))
              : 0;
            const baseTransform = isDropping
              ? "translate(-50%, calc(-50% + 120vh)) rotate(14deg)"
              : `translate(-50%, -50%) rotate(${tiltDeg}deg)`;
            return {
              transform: baseTransform,
              transition: isDropping
                ? `transform ${DROP_ANIMATION_MS}ms cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity ${DROP_ANIMATION_MS}ms ease-in`
                : pinOffset
                  ? "none"
                  : "transform 220ms ease-out",
              opacity: isDropping ? 0 : undefined,
              transformOrigin: "50% 0%",
            };
          })()}
        >
          <div className="relative p-16 sm:p-20">
            {/* Push pin (also the close affordance — drag down to drop modal). */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Close — drag the pushpin to drop this modal off the wall"
              onPointerDown={handlePinPointerDown}
              onPointerMove={handlePinPointerMove}
              onPointerUp={finishPinDrag}
              onPointerCancel={finishPinDrag}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  startDrop();
                }
              }}
              className={cn(
                "absolute left-1/2 top-2 z-30 -translate-x-1/2 cursor-grab touch-none",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink focus-visible:ring-offset-2",
                pinOffset && "cursor-grabbing",
                // Hint nudge runs on open and stops once the user grabs the pin.
                !hasInteracted && !pinOffset && "motion-safe:animate-summit-pin-hint",
              )}
            >
              {/* Match facilitator card pushpin exactly (same classes, same DOM). */}
              <div
                className="summit-pushpin summit-pushpin--tilt"
                style={{
                  margin: 0,
                  transform: pinDragTransform,
                  transition: pinOffset ? "none" : "transform 200ms ease-out",
                }}
              >
                <PushPin />
              </div>
            </div>

            {/* "Drag to close" tooltip — pulses while the user hasn't engaged the pin yet. */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute left-[calc(50%+18px)] top-4 z-30",
                "flex items-center gap-1",
                "transition-opacity duration-300",
                hasInteracted || pinOffset ? "opacity-0" : "motion-safe:animate-summit-pin-tooltip-pulse",
              )}
            >
              <svg
                className="text-uxsg-ink"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                aria-hidden
              >
                <path d="M8 0 L8 14 L0 7 Z" fill="currentColor" />
              </svg>
              <span className="font-hand whitespace-nowrap rounded-md bg-uxsg-ink px-2.5 py-1 text-[13px] leading-none text-uxsg-paper shadow-sm">
                drag to close
              </span>
            </div>

            <ThinHandDrawnFrame />

            <div className="relative z-10">
              {/* Body grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[35%_1fr] sm:gap-7">
                {/* Left column */}
                <div className="flex flex-col items-center gap-5 sm:items-start">
                  <div
                    className={cn(
                      "h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-uxsg-rsvp p-1",
                      "bg-muted flex items-center justify-center",
                    )}
                    role={speaker?.photo ? undefined : "img"}
                    aria-label={
                      speaker?.photo
                        ? undefined
                        : speaker
                          ? `${speaker.name} — placeholder avatar`
                          : undefined
                    }
                  >
                    {speaker?.photo ? (
                      <img
                        src={speaker.photo}
                        alt={speaker.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : speaker ? (
                      <span
                        className="font-body text-2xl font-semibold text-muted-foreground"
                        aria-hidden
                      >
                        {speaker.name
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    ) : null}
                  </div>

                  {speaker && speaker.sessions.length > 0 ? (
                    <div className="w-full">
                      <p className="font-body text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Session{speaker.sessions.length > 1 ? "s" : ""}
                      </p>
                      <ul className="space-y-3">
                        {speaker.sessions.map((s, i) => (
                          <li key={`${s.day}-${s.time}-${i}`} className="font-body">
                            <p className="font-hand text-base text-neutral-700 leading-tight">
                              {s.day} · {s.time}
                            </p>
                            <p className="text-sm font-semibold text-uxsg-ink leading-snug mt-0.5">
                              {s.title}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {speaker &&
                  (speaker.favAITools.length > 0 || speaker.tryNextTools.length > 0) ? (
                    <div className="w-full space-y-4">
                      {speaker.favAITools.length > 0 ? (
                        <div>
                          <p className="font-body text-[12px] font-bold uppercase tracking-wider text-uxsg-ink mb-2">
                            Fav AI tools
                          </p>
                          <div className="flex flex-wrap gap-x-1 gap-y-1 leading-tight">
                            {speaker.favAITools.map((t) => (
                              <ToolPill key={`fav-${t}`}>{t}</ToolPill>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {speaker.tryNextTools.length > 0 ? (
                        <div>
                          <p className="font-body text-[12px] font-bold uppercase tracking-wider text-uxsg-ink mb-2">
                            Try Next
                          </p>
                          <div className="flex flex-wrap gap-x-1 gap-y-1 leading-tight">
                            {speaker.tryNextTools.map((t) => (
                              <ToolPill key={`next-${t}`}>{t}</ToolPill>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {/* Right column */}
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
                      <DialogPrimitive.Title asChild>
                        <h2
                          id={titleId}
                          className="font-headline text-[36px] leading-[1.05] text-uxsg-ink"
                        >
                          {speaker?.name}
                        </h2>
                      </DialogPrimitive.Title>
                      {speaker?.keynote ? (
                        <SketchyBadge
                          variant="white"
                          rotation="subtle"
                          className="shadow-sm whitespace-nowrap"
                        >
                          ★ Keynote Speaker
                        </SketchyBadge>
                      ) : null}
                    </div>
                    {speaker?.linkedinUrl ? (
                      <a
                        href={speaker.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${speaker.name}'s LinkedIn profile`}
                        className="mt-1 inline-flex shrink-0 text-[#0A66C2] transition-transform hover:scale-110"
                      >
                        <LinkedInIcon className="h-6 w-6 fill-current" />
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-1 font-body text-[14px] font-semibold uppercase tracking-wider text-uxsg-rsvp">
                    {speaker?.tagline}
                  </p>

                  <hr className="my-4 border-0 border-t border-dashed border-uxsg-ink/25" />

                  <div className="space-y-3">
                    {speaker?.bio.map((para, i) => (
                      <p
                        key={i}
                        className="font-body text-[15px] leading-relaxed text-foreground/85"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
