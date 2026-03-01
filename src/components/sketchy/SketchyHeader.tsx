import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import uxsgLogo from "@/assets/uxsg-logo.svg";
import { HandDrawnRect } from "./HandDrawnRect";

const navLinks = [
  { to: "/summit", label: "AI Summit 2026" },
  { to: "/membership", label: "Membership" },
  { to: "/about", label: "About" },
];

export const SketchyHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="w-full paper-bg border-b border-uxsg-ink/10 font-body">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={uxsgLogo} alt="UXSG" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="text-sm text-uxsg-ink/70 hover:text-uxsg-ink transition-colors">
              {label}
            </Link>
          ))}
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
                {navLinks.map(({ to, label }) => (
                  <Link key={to} to={to} className="text-base py-2" onClick={() => setMobileOpen(false)}>
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/membership" className="hidden md:inline-flex relative items-center justify-center text-uxsg-ink text-sm px-5 h-9">
            <HandDrawnRect fill="var(--uxsg-paper)" strokeWidth={1.5} />
            <span className="relative z-10">Join Accelerator</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SketchyHeader;
