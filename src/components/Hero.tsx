import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <img 
        src={heroBg} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
      />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-white/90 text-sm font-medium">October 2025 · NYC · Just 60 Seats</p>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight mb-6">
            AIxUX Summit
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white/95 mb-8 leading-tight">
            Unlock Your Profile,<br />
            Build the Future of<br />
            Design & AI
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
            Be part of the founding cohort. Network with leading designers, engineers, 
            and visionaries shaping the intersection of AI and UX.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-foreground hover:bg-white/90 shadow-lg hover:shadow-xl transition-all group"
            >
              Claim Your Ticket
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20">
              <p className="text-white/80 text-sm mb-1">Early Bird Special</p>
              <p className="text-white font-bold text-lg">Only 40 tickets at $99</p>
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-white/40 to-white/20 border-2 border-white/50 backdrop-blur-sm"
                />
              ))}
            </div>
            <p className="text-white/80 text-sm">
              <span className="font-bold text-white">30+</span> industry leaders confirmed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
