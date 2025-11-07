import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/liquid-data-bust.png";
const SponsorHero = () => {
  const scrollToPackages = () => {
    document.querySelector('#community')?.scrollIntoView({
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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-foreground leading-tight mb-6 md:text-7xl">
            Sponsor UXSG
          </h1>
          
          <h2 className="text-3xl text-foreground mb-8 leading-tight md:text-3xl font-semibold">
            Reach high-intent UX professionals actively seeking AI solutions
          </h2>
          
          {/* Hero Stats */}
          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8 my-12">
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-foreground/10">
              <div className="text-5xl font-bold text-foreground mb-2">8,900+</div>
              <p className="text-foreground/70 text-sm uppercase tracking-wide">Members</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-foreground/10">
              <div className="text-5xl font-bold text-foreground mb-2">1000+</div>
              <p className="text-foreground/70 text-sm uppercase tracking-wide">Events to date</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-foreground/10">
              <div className="text-5xl font-bold text-foreground mb-2">2017</div>
              <p className="text-foreground/70 text-sm uppercase tracking-wide">YEAR WE STARTED</p>
            </div>
          </div>
          
          <Button size="lg" className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group" onClick={scrollToPackages}>
            View Packages
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>;
};
export default SponsorHero;