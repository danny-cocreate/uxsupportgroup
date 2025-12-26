import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/liquid-data-bust.png";

const Hero = () => {
  const navigate = useNavigate();

  const handleViewSummitWall = () => {
    navigate('/summit-wall');
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 pt-6 pb-20">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold text-foreground leading-tight mb-6 md:text-7xl">
            AI<span className="text-gradient">x</span>UX Virtual Summit
          </h1>
          
          <h2 className="text-3xl text-foreground mb-8 leading-tight md:text-3xl font-semibold">
            Unlock your UX super powers with AI
          </h2>
          
          <div className="mb-10">
            <p className="text-lg text-foreground font-normal">
              December 10, 2025 — Thank you for joining!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" 
              onClick={handleViewSummitWall}
            >
              View Summit Wall
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;