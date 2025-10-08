import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import uxsgLogo from "@/assets/uxsg-logo.svg";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <div className="mb-8">
            <p className="font-medium mb-3 text-xs text-gray-500">Organized by</p>
            <img src={uxsgLogo} alt="UXSG" className="h-12 w-auto" />
          </div>
          
          <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-sm font-medium text-zinc-50">10 Dec 2025  |  limited to  100 Seats</p>
          </div>
          
          <h1 className="text-6xl font-bold text-white leading-tight mb-6 md:text-7xl">AIxUX Virtual Summit</h1>
          
          <h2 className="text-3xl font-bold text-white/95 mb-8 leading-tight md:text-4xl">
            Unlock your UX super powers with AI
          </h2>
          
          
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-foreground hover:bg-white/90 shadow-lg hover:shadow-xl transition-all group">
              Claim Your Ticket
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div>
              <p className="text-white/80 text-sm mb-1">Early Bird Special</p>
              <p className="text-white font-bold text-lg">Only 40 tickets at $99</p>
            </div>
          </div>
          
          
        </div>
      </div>
    </section>;
};
export default Hero;