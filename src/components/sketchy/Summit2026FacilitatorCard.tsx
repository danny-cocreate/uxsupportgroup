import { cn } from "@/lib/utils";
import { SketchyBadge } from "./SketchyBadge";
import { HandDrawnHighlightSVG } from "@/components/sketchy/HandDrawnHighlight";

export type Summit2026FacilitatorCardProps = {
  name: string;
  /** Shown below the name, uppercase (e.g. title @ company). */
  roleLine: string;
  /** Avatar URL; omit for placeholder initials. */
  imageSrc?: string;
  imageAlt?: string;
  linkedinUrl: string;
  /** Short bio preview shown on the card; truncated to a few lines. */
  bio?: string;
  /** If true, render a "Keynote Speaker" callout above the name. */
  keynote?: boolean;
  /** Fires when the card is clicked (anywhere except the LinkedIn icon). */
  onOpen?: () => void;
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function avatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Summit2026FacilitatorCard({
  name,
  roleLine,
  imageSrc,
  imageAlt,
  linkedinUrl,
  bio,
  keynote,
  onOpen,
}: Summit2026FacilitatorCardProps) {
  const showLinkedin = linkedinUrl !== "#" && linkedinUrl.trim() !== "";
  const isClickable = typeof onOpen === "function";

  const handleClick = () => {
    if (onOpen) onOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onOpen) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      className={cn(
        "summit-facilitator-card-frame relative group transform transition-transform h-full",
        isClickable &&
          "cursor-pointer hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-rsvp focus-visible:ring-offset-2 rounded",
      )}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-haspopup={isClickable ? "dialog" : undefined}
      aria-label={isClickable ? `Open details for ${name}` : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
    >
      <div
        className="summit-pushpin summit-pushpin--tilt pointer-events-none"
        aria-hidden
      >
        <div className="summit-pushpin-head" />
        <div className="summit-pushpin-base" />
        <div className="summit-pushpin-shaft" />
        <span className="summit-pushpin-point" />
      </div>

      <div className="relative z-0 bg-card p-8 pb-8 summit-facilitator-paper flex flex-col gap-5 h-full">
        {/* Top row: photo + LinkedIn */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-20 h-20 rounded-full border-2 border-uxsg-rsvp p-1 shrink-0 overflow-hidden bg-muted flex items-center justify-center"
            role={imageSrc ? undefined : "img"}
            aria-label={imageSrc ? undefined : `${name} — placeholder avatar`}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt ?? name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="font-body text-lg font-semibold text-muted-foreground" aria-hidden>
                {avatarInitials(name)}
              </span>
            )}
          </div>
          {showLinkedin ? (
            <a
              className="inline-flex shrink-0 text-[#0A66C2] transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 rounded"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${name}'s LinkedIn profile`}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <LinkedInIcon className="h-6 w-6 fill-current" />
            </a>
          ) : null}
        </div>

        {/* Identity */}
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <h3 className="font-headline text-2xl text-foreground leading-tight">
              {name}
            </h3>
            {keynote ? (
              <SketchyBadge
                variant="ink"
                rotation="subtle"
                className="shadow-sm whitespace-nowrap"
              >
                ★ Keynote Speaker
              </SketchyBadge>
            ) : null}
          </div>
          <p className="font-body font-semibold text-sm text-uxsg-rsvp uppercase tracking-wider">
            {roleLine}
          </p>
        </div>

        {/* Bio preview */}
        {bio ? (
          <>
            <hr className="border-0 border-t border-dashed border-uxsg-ink/25" />
            <div className="flex-1">
              <p className="font-body text-[15px] text-uxsg-ink leading-snug line-clamp-3">
                {bio}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1" />
        )}

        {isClickable ? (
          <span
            aria-hidden
            className="summit-detail-pill font-hand self-end mt-1 shrink-0"
          >
            <HandDrawnHighlightSVG className="summit-button-highlight" />
            <span className="relative z-[1]">bio →</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
