import { Button } from "@/components/ui/button";
import heroBg from "@/assets/liquid-data-bust.png";

const HomeHero = () => {
  const stats = [
    { value: "9,000+", label: "Members" },
    { value: "250+", label: "Events Per Year" },
    { value: "8+ Years", label: "Strong" },
  ];

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <img src={heroBg} alt="Diverse group of UX professionals networking at community event" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />
      
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground leading-tight mb-6 md:text-7xl">
            The Future of UX is Human.<br />
            <span className="text-gradient">We're Here to Prove It.</span>
          </h1>
          
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Don't let AI define you. Define it. Join <strong>9,000+ designers</strong> building the future—together.
          </p>

          {/* Stats integrated into hero */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-10 py-8 px-4 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-foreground/60 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Traffic routing buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg py-6 px-8 border-2 hover:bg-background/80"
              asChild
            >
              <a href="https://www.meetup.com/ux-support-group/" target="_blank" rel="noopener noreferrer">
                Browse Events
              </a>
            </Button>
            
            <Button 
              size="lg" 
              className="text-lg py-6 px-8 bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <a href="https://www.skool.com/ux-support-group-6932/about" target="_blank" rel="noopener noreferrer">
                Join Accelerator
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
