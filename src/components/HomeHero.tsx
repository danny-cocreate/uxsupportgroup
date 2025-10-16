import { Button } from "@/components/ui/button";
import heroBg from "@/assets/liquid-data-bust.png";

const HomeHero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <img src={heroBg} alt="Diverse group of UX professionals networking at community event" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />
      
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold text-foreground leading-tight mb-6 md:text-7xl">
            The Best UX Community to <span className="text-gradient">Stay Relevant</span> in AI Age
          </h1>
          
          <p className="text-2xl text-foreground/70 mb-10 max-w-2xl">
            Connect, learn, and grow with fellow UX practitioners through events, networking, and career support
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90">
              Become a Member
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Explore Events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
