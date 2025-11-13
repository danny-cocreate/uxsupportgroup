import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hubbleLogo from "@/assets/hubble-logo.png";
import cocreateLogo from "@/assets/cocreate-logo.png";
import kommodoLogo from "@/assets/kommodo-logo.png";
import subframeLogo from "@/assets/subframe-logo.png";

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
          
          {/* Logos - Full Width */}
          <div className="flex items-center justify-center gap-12 flex-wrap mb-16">
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
            <img 
              src={subframeLogo} 
              alt="Subframe" 
              className="h-14 object-contain grayscale hover:grayscale-0 transition-all"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border/20 mb-12"></div>

          {/* Interested in Sponsoring Section */}
          <div className="bg-gray-900/20 border border-border rounded-xl p-6 md:p-8 shadow-md">
            <div className="grid md:grid-cols-[70%_30%] gap-6 md:gap-8 items-center">
              {/* Left - Heading and Copy */}
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
                  Interested in Sponsoring?
                </h3>
                <p className="text-base text-foreground/70">
                  Connect with senior UX professionals and decision-makers at our virtual summit.
                </p>
              </div>
              
              {/* Right - CTA */}
              <div className="w-full">
                <Button
                  onClick={handleBecomeASponsor}
                  className="h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all group w-full md:w-auto"
                >
                  Become a Sponsor
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummitSponsorshipInquiry;
