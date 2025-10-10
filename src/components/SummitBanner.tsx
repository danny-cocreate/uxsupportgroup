import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SummitBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-3">
      <div className="container mx-auto px-4">
        <Link to="/summit" className="flex items-center justify-center gap-4 text-primary-foreground hover:opacity-90 transition-opacity">
          <span className="font-semibold">Virtual Summit - December 10, 2025</span>
          <span className="hidden sm:inline text-sm">Join UX professionals from around the world. Early bird tickets available now!</span>
          <span className="flex items-center gap-1 font-medium">
            Get Tickets
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SummitBanner;
