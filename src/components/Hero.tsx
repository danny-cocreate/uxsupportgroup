// @ts-nocheck
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/liquid-data-bust.png";
import uxsgLogo from "@/assets/uxsg-logo.svg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Hero = () => {
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  const [earlyBirdRemaining, setEarlyBirdRemaining] = useState(40);
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const {
          data
        } = await supabase.functions.invoke('check-ticket-availability');
        if (data) {
          const earlyBirdActive = data.earlyBirdRemaining > 0 && !data.isPastCutoff;
          setIsEarlyBird(earlyBirdActive);
          setEarlyBirdRemaining(data.earlyBirdRemaining);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      }
    };
    checkAvailability();
  }, []);
  const scrollToTicketing = () => {
    document.querySelector('#ticketing')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 pt-6 pb-20">
        <div className="max-w-4xl">
          
          
          <h1 className="text-6xl font-bold text-foreground leading-tight mb-6 md:text-7xl">AI<span className="text-gradient">x</span>UX Virtual Summit</h1>
          
          <h2 className="text-3xl text-foreground mb-8 leading-tight md:text-3xl font-semibold">
            Unlock your UX super powers with AI
          </h2>
          
          <div className="mb-10">
            <p className="text-lg text-foreground font-normal">10 Dec 2025  |  limited to  100 Seats</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button size="lg" className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" onClick={scrollToTicketing}>
              Claim Your Ticket
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div>
              {isEarlyBird ? <>
                  <p className="text-foreground/70 text-sm mb-1">Early Bird Special</p>
                  <p className="text-foreground font-bold text-base">Only {earlyBirdRemaining} tickets left at $99</p>
                </> : <>
                  <p className="text-foreground/70 text-sm mb-1">Regular Pricing</p>
                  <p className="text-foreground font-bold text-base">Tickets at $199</p>
                </>}
            </div>
          </div>
          
          
        </div>
      </div>
    </section>;
};
export default Hero;