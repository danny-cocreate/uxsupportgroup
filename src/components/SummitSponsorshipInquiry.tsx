import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hubbleLogo from "@/assets/hubble-logo.png";
import cocreateLogo from "@/assets/cocreate-logo.png";

const SummitSponsorshipInquiry = () => {
  const navigate = useNavigate();

  const handleBecomeASponsor = () => {
    navigate('/sponsor');
    setTimeout(() => {
      document.querySelector('#summit')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-muted">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Current Sponsors
          </h3>
          <div className="flex items-center justify-center gap-12 mb-12">
            <img 
              src={hubbleLogo} 
              alt="Hubble" 
              className="h-12 object-contain grayscale hover:grayscale-0 transition-all"
            />
            <img 
              src={cocreateLogo} 
              alt="CoCreate" 
              className="h-20 object-contain grayscale hover:grayscale-0 transition-all"
            />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Interested in <span className="text-gradient">Sponsoring?</span>
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Connect with senior UX professionals and decision-makers at our virtual summit. Showcase your brand, products, and services to a highly engaged audience.
          </p>
          <Button
            onClick={handleBecomeASponsor}
            className="h-14 px-8 text-lg font-bold shadow-lg hover:shadow-xl transition-all group uppercase"
          >
            Become a Sponsor
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SummitSponsorshipInquiry;
