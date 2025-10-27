import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Button
        size="lg"
        className="text-base px-6 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-2xl hover:shadow-xl transition-all group"
        onClick={scrollToContact}
      >
        Get Started
        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default FloatingCTA;

