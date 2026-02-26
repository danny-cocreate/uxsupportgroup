import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import uxsgLogo from "@/assets/uxsg-logo.svg";
const Header = () => {
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={uxsgLogo} alt="UXSG" className="h-12 w-auto" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/summit-2026" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Summit 2026
          </Link>
          
          <Link to="/membership" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Membership
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" asChild>
            <a href="/membership">Join Accelerator</a>
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;