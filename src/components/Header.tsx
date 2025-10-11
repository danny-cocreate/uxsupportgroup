import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import uxsgLogo from "@/assets/uxsg-logo.svg";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={uxsgLogo} alt="UXSG" className="h-8 w-auto" />
          <span className="text-lg font-semibold">AIxUX Virtual Summit</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/summit" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Events
          </Link>
          <Link to="/membership" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Membership
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">Login</Button>
          <Button size="sm">Join Now</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
