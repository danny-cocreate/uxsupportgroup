import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import uxsgLogo from "@/assets/uxsg-logo.svg";

const navLinks = [
  { to: "/summit", label: "AI Summit 2026" },
  { to: "/membership", label: "Membership" },
  { to: "/about", label: "About" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={uxsgLogo} alt="UXSG" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-11 w-11"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-4 pt-6" aria-label="Main">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-base font-medium text-foreground hover:text-foreground/80 transition-colors py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  to="/membership"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-foreground text-background h-10 px-4 mt-4"
                  onClick={() => setMobileOpen(false)}
                >
                  Join Accelerator
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 hidden md:inline-flex" asChild>
            <Link to="/membership">Join Accelerator</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Header;