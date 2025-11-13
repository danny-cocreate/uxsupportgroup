import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hubbleLogo from "@/assets/hubble-logo.png";
import cocreateLogo from "@/assets/cocreate-logo.png";
import kommodoLogo from "@/assets/kommodo-logo.png";

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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground text-center">
            Sponsors
          </h2>
          <div className="grid md:grid-cols-[70%_30%] gap-8 items-center">
            {/* Left column - Logos */}
            <div className="flex items-center justify-center gap-12 flex-wrap">
              <img 
                src={hubbleLogo} 
                alt="Hubble" 
                className="h-14 object-contain grayscale hover:grayscale-0 transition-all"
              />
              <img 
                src={cocreateLogo} 
                alt="CoCreate" 
                className="h-32 object-contain grayscale hover:grayscale-0 transition-all"
              />
              <img 
                src={kommodoLogo} 
                alt="Kommodo" 
                className="h-14 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
            
            {/* Right column - Text and CTA */}
            <div className="text-left">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                Interested in Sponsoring?
              </h3>
              <p className="text-base text-foreground/70 mb-6">
                Connect with senior UX professionals and decision-makers at our virtual summit.
              </p>
              <Button
                onClick={handleBecomeASponsor}
                className="h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all group"
              >
                Become a Sponsor
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummitSponsorshipInquiry;
