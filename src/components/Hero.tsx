import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/liquid-data-bust.png";
import uxsgLogo from "@/assets/uxsg-logo.svg";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 pt-6 pb-20">
        <div className="max-w-4xl">
          <div className="mb-8">
            <p className="text-foreground/70 font-medium mb-3 text-xs">Organized by</p>
            <img src={uxsgLogo} alt="UXSG" className="h-12 w-auto" />
          </div>
          
          <h1 className="text-6xl font-bold text-foreground leading-tight mb-6 md:text-7xl">AI<span className="text-gradient">x</span>UX Virtual Summit</h1>
          
          <h2 className="text-3xl font-bold text-foreground mb-8 leading-tight md:text-4xl">
            Unlock your UX super powers with AI
          </h2>
          
          <div className="inline-block mb-10 px-6 py-2 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm rounded-full border border-foreground/20">
            <p className="text-sm font-medium text-foreground">10 Dec 2025  |  limited to  100 Seats</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button size="lg" className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group">
              Claim Your Ticket
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div>
              <p className="text-foreground/70 text-sm mb-1">Early Bird Special</p>
              <p className="text-foreground font-bold text-lg">Only 40 tickets at $99</p>
            </div>
          </div>
          
          
        </div>
      </div>
    </section>;
};
export default Hero;