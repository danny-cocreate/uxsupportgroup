import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import uxsgLogo from "@/assets/uxsg-logo.svg";
import { cn } from "@/lib/utils";
import {
  isPlaceholderPagePath,
  PLACEHOLDER_PAGE_HINT,
  PLACEHOLDER_PAGE_SR_ONLY,
} from "@/navigation/placeholderPages";
import { HandDrawnHighlight } from "./HandDrawnHighlight";
import { SketchyComingSoonChip } from "./SketchyComingSoonChip";
import { RoughWavyUnderline } from "./RoughWavyUnderline";
import { SketchyCTA } from "./SketchyCTA";

type NavItem = { to: string; label: string; promoWavyUnderline?: boolean };

const navLinks: NavItem[] = [
  { to: "/summit", label: "AI Summit 2026", promoWavyUnderline: true },
  { to: "/membership", label: "Membership" },
  { to: "/sponsor", label: "Sponsor" },
  { to: "/replay", label: "Replay" },
  { to: "/about", label: "About" },
];

const navLinkClassDesktop = ({
  isActive,
  promoWavyUnderline,
}: {
  isActive: boolean;
  promoWavyUnderline?: boolean;
}) =>
  cn(
    "text-sm rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink/30 focus-visible:ring-offset-2",
    isActive
      ? "text-uxsg-ink"
      : cn(
          "text-uxsg-ink hover:text-muted-foreground duration-200",
          !promoWavyUnderline && "underline-offset-4 decoration-uxsg-ink/30 hover:underline"
        )
  );

const navLinkClassMobile = ({
  isActive,
  promoWavyUnderline,
}: {
  isActive: boolean;
  promoWavyUnderline?: boolean;
}) =>
  cn(
    "text-base py-2 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink/30 focus-visible:ring-offset-2",
    isActive
      ? "text-uxsg-ink"
      : cn(
          "text-uxsg-ink hover:text-muted-foreground duration-200",
          !promoWavyUnderline && "underline-offset-4 decoration-uxsg-ink/30 hover:underline"
        )
  );

export const SketchyHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="w-full paper-bg border-b border-uxsg-ink/10 font-body">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink/30 focus-visible:ring-offset-2"
        >
          <img src={uxsgLogo} alt="UXSG" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-baseline gap-8" aria-label="Main">
          {navLinks.map(({ to, label, promoWavyUnderline }) => {
            if (isPlaceholderPagePath(to)) {
              return (
                <Tooltip key={to} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        navLinkClassDesktop({ isActive: false, promoWavyUnderline }),
                        "inline-flex max-w-full cursor-not-allowed items-center gap-1.5 opacity-60",
                        "hover:!no-underline hover:!text-muted-foreground"
                      )}
                      role="link"
                      aria-disabled="true"
                      tabIndex={0}
                      title={PLACEHOLDER_PAGE_HINT}
                    >
                      {label}
                      <SketchyComingSoonChip />
                      <span className="sr-only">{PLACEHOLDER_PAGE_SR_ONLY}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6} className="max-w-xs text-center">
                    {PLACEHOLDER_PAGE_HINT}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    navLinkClassDesktop({ isActive, promoWavyUnderline }),
                    !isActive && promoWavyUnderline && "group"
                  )
                }
              >
                {({ isActive }) =>
                  isActive ? (
                    <HandDrawnHighlight className="-rotate-[0.35deg]">{label}</HandDrawnHighlight>
                  ) : promoWavyUnderline ? (
                    <span className="relative inline-block">
                      {label}
                      {/* top-full: underline does not add height — keeps label aligned with other nav links */}
                      <span className="pointer-events-none absolute inset-x-0 top-full mt-0.5 block h-2 w-full min-w-[6.5rem] text-uxsg-ink/55 transition-colors duration-200 group-hover:text-muted-foreground">
                        <RoughWavyUnderline
                          animated
                          expandToBounds
                          className="h-full w-full"
                          strokeW={1.35}
                        />
                      </span>
                    </span>
                  ) : (
                    label
                  )
                }
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-11 w-11" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-4 pt-6 font-body" aria-label="Main">
                {navLinks.map(({ to, label, promoWavyUnderline }) => {
                  if (isPlaceholderPagePath(to)) {
                    return (
                      <Tooltip key={to} delayDuration={200}>
                        <TooltipTrigger asChild>
                          <span
                            className={cn(
                              navLinkClassMobile({ isActive: false, promoWavyUnderline }),
                              "inline-flex max-w-full cursor-not-allowed items-center gap-1.5 opacity-60",
                              "hover:!no-underline hover:!text-muted-foreground"
                            )}
                            role="link"
                            aria-disabled="true"
                            tabIndex={0}
                            title={PLACEHOLDER_PAGE_HINT}
                          >
                            {label}
                            <SketchyComingSoonChip />
                            <span className="sr-only">{PLACEHOLDER_PAGE_SR_ONLY}</span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs text-center">
                          {PLACEHOLDER_PAGE_HINT}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          navLinkClassMobile({ isActive, promoWavyUnderline }),
                          !isActive && promoWavyUnderline && "group"
                        )
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {({ isActive }) =>
                        isActive ? (
                          <HandDrawnHighlight className="-rotate-[0.35deg]">{label}</HandDrawnHighlight>
                        ) : promoWavyUnderline ? (
                          <span className="relative inline-block">
                            {label}
                            <span className="pointer-events-none absolute inset-x-0 top-full mt-0.5 block h-2.5 w-full min-w-[6.5rem] text-uxsg-ink/55 transition-colors duration-200 group-hover:text-muted-foreground">
                              <RoughWavyUnderline
                                animated
                                expandToBounds
                                className="h-full w-full"
                                strokeW={1.35}
                              />
                            </span>
                          </span>
                        ) : (
                          label
                        )
                      }
                    </NavLink>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <SketchyCTA
            href="https://www.skool.com/ux-support-group-6932/about"
            variant="light-bg"
            className="hidden md:inline-flex h-9 min-h-0 px-5 py-0 text-sm items-center"
          >
            Join Accelerator
          </SketchyCTA>
        </div>
      </div>
    </header>
  );
};

export default SketchyHeader;
